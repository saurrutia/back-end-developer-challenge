using HitPointsService.Infrastructure;
using HitPointsService.Application;
using HitPointsService.Application.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using HitPointsService.API.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddDbContext<DnDDbContext>(options =>
    options.UseInMemoryDatabase("DnDDatabase"));

builder.Services.AddInfrastructure();
builder.Services.AddApplication();
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
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(opt => opt.SwaggerEndpoint("/openapi/v1.json", "v1"));
}

app.UseCors();
app.UseHttpsRedirection();
using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<DnDDbContext>();
DataSeeder.Seed(dbContext);

app.MapGroup("/characters").MapCharacterEndpoints();
app.Run();

