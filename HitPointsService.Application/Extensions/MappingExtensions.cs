using HitPointsService.Application.DTOs;
using HitPointsService.Domain.Entities;
using HitPointsService.Domain.Enums;
using HitPointsService.Domain.ValueObjects;

namespace HitPointsService.Application.Extensions;

public static class MappingExtensions
{
    public static CharacterDto ToDto(this Character character)
    {
        return new CharacterDto
        {
            Id = character.Identifier,
            Name = character.Name,
            Level = character.Level,
            HitPoints = character.HitPoints,
            CurrentHitPoints = character.CurrentHitPoints,
            TemporaryHitPoints = character.TemporaryHitPoints,
            Stats = character.Stats.ToDto(),
            Classes = [.. character.Classes.Select(c => c.Name)],
            ItemsAffectingStats = [.. character.Items.Select(ToItemsAffectingStatsDto)],
            Defenses = [.. character.Defenses.Select(ToDefenseDto)]
        };
    }

    public static StatsDto ToDto(this Stats stats)
    {
        return new StatsDto
        {
            Strength = stats.Strength,
            Dexterity = stats.Dexterity,
            Constitution = stats.Constitution,
            Intelligence = stats.Intelligence,
            Wisdom = stats.Wisdom,
            Charisma = stats.Charisma
        };
    }

    public static ClassDto ToDto(this Class @class)
    {
        return new ClassDto
        {
            Id = @class.Id,
            Name = @class.Name,
            HitDiceValue = @class.HitDiceValue,
            ClassLevel = @class.ClassLevel
        };
    }

    public static ItemDto ToItemsAffectingStatsDto(this Item item)
    {
        if(item.Modifier.AffectedObject == ItemAffectedObject.Stats)
        {
            return new ItemDto
            {
                Name = item.Name,
                ModifierStat = item.Modifier.AffectedValue,
                ModifierValue = item.Modifier.Value
            };
        }
        return new ItemDto
        {
            Name = item.Name
        };
    }

    public static DefenseDto ToDefenseDto(this CharacterDefense defense)
    {
        return new DefenseDto
        {
            Type = defense.Type.ToString(),
            Defense = defense.Defense.ToString()
        };
    }
}
