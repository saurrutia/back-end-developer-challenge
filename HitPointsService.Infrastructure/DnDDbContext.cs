
using HitPointsService.Domain.Entities;
using HitPointsService.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace HitPointsService.Infrastructure;

public class DnDDbContext : DbContext
{
    public DnDDbContext(DbContextOptions<DnDDbContext> options) : base(options)
    {
    }

    public DbSet<Character> Characters { get; set; }
    public DbSet<Class> Classes { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<CharacterDefense> CharacterDefenses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Character>()
            .OwnsOne(c => c.Stats, statsBuilder =>
            {
                statsBuilder.Property(s => s.Strength).HasColumnName("Strength");
                statsBuilder.Property(s => s.Dexterity).HasColumnName("Dexterity");
                statsBuilder.Property(s => s.Constitution).HasColumnName("Constitution");
                statsBuilder.Property(s => s.Intelligence).HasColumnName("Intelligence");
                statsBuilder.Property(s => s.Wisdom).HasColumnName("Wisdom");
                statsBuilder.Property(s => s.Charisma).HasColumnName("Charisma");
            });
        modelBuilder.Entity<Item>()
            .OwnsOne(i => i.Modifier, modifierBuilder =>
            {
                modifierBuilder.Property(m => m.AffectedObject).HasColumnName("AffectedObject");
                modifierBuilder.Property(m => m.AffectedValue).HasColumnName("AffectedValue");
                modifierBuilder.Property(m => m.Value).HasColumnName("Value");
            });

        modelBuilder.Entity<CharacterDefense>()
            .Property(cd => cd.Type)
            .HasConversion(
                v => v.ToString(),
                v => Enum.Parse<DamageType>(v, true));
    }
}