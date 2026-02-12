using HitPointsService.Domain.Enums;
using HitPointsService.Domain.ValueObjects;

namespace HitPointsService.Domain.Entities;
public class Character : Entity
{
    public string Identifier { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public int HitPoints { get; set; }
    public int CurrentHitPoints { get; set; }
    public int TemporaryHitPoints { get; set; }
    public List<Class> Classes { get; set; } = [];
    public Stats Stats { get; set; } = new Stats();
    public List<Item> Items { get; set; } = [];
    public List<CharacterDefense> Defenses { get; set; } = [];

    public void ApplyDamage(DamageType damageType, int damage)
    {
        if(HasImmunityTo(damageType))
        {
            return;
        }
        if(HasResistanceTo(damageType))
        {
            damage = (int)Math.Ceiling(damage / 2.0);
        }
        int totalDamage = damage - TemporaryHitPoints;
        TemporaryHitPoints = Math.Max(0, TemporaryHitPoints - damage);
        CurrentHitPoints = Math.Max(0, CurrentHitPoints - Math.Max(0, totalDamage));
    }

    public void Heal(int amount)
    {
        CurrentHitPoints = Math.Min(HitPoints, CurrentHitPoints + amount);
    }

    public void AddTemporaryHitPoints(int amount)
    {
        if (amount > TemporaryHitPoints)
        {
            TemporaryHitPoints = amount;
        }
    }

    public bool HasImmunityTo(DamageType damageType)
    {
        return Defenses.Any(d => d.Type == damageType && d.Defense == DefenseType.Immunity);
    }

    public bool HasResistanceTo(DamageType damageType)
    {
        return Defenses.Any(d => d.Type == damageType && d.Defense == DefenseType.Resistance);
    }
}