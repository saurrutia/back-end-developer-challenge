using HitPointsService.Infrastructure;
using HitPointsService.Application;
using HitPointsService.Application.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using HitPointsService.API.Endpoints;
using HitPointsService.API.Hubs;
using HitPointsService.API.Services;
using FluentValidation;
using HitPointsService.API.Middleware;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddDbContext<DnDDbContext>(options =>
    options.UseInMemoryDatabase("DnDDatabase"));

builder.Services.AddInfrastructure();
builder.Services.AddApplication();
builder.Services.AddScoped<ICharacterNotificationService, SignalRCharacterNotificationService>();

// Register FluentValidation validators
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddSignalR();

var app = builder.Build();

// Add exception middleware FIRST
app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors();
app.UseHttpsRedirection();
using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<DnDDbContext>();
DataSeeder.Seed(dbContext);

app.MapGroup("/characters").MapCharacterEndpoints();
app.MapHub<CharacterHub>("/hubs/character");
app.Run();

