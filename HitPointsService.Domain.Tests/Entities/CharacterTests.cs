using HitPointsService.Domain.Entities;
using HitPointsService.Domain.ValueObjects;
using Xunit;

namespace HitPointsService.Domain.Tests.Entities;

public class CharacterTests
{
    [Fact]
    public void Character_ShouldBeCreatedWithDefaultValues()
    {
        // Arrange & Act
        var character = new Character();

        // Assert
        Assert.Equal(0, character.Id);
        Assert.Empty(character.Name);
        Assert.Equal(0, character.Level);
        Assert.Equal(0, character.HitPoints);
        Assert.Equal(0, character.CurrentHitPoints);
        Assert.Empty(character.Classes);
        Assert.NotNull(character.Stats);
        Assert.Empty(character.Items);
        Assert.Empty(character.Defenses);
    }

    [Fact]
    public void Character_ShouldInitializeWithValidData()
    {
        // Arrange & Act
        var character = new Character
        {
            Name = "Briv",
            Level = 5,
            HitPoints = 25,
            CurrentHitPoints = 25
        };

        // Assert
        Assert.Equal("Briv", character.Name);
        Assert.Equal(5, character.Level);
        Assert.Equal(25, character.HitPoints);
        Assert.Equal(25, character.CurrentHitPoints);
    }

    [Fact]
    public void Character_ShouldAllowAddingClasses()
    {
        // Arrange
        var character = new Character { Name = "Briv", Level = 5 };
        var fighterClass = new Class { Name = "Fighter", HitDiceValue = 10, ClassLevel = 5 };

        // Act
        character.Classes.Add(fighterClass);

        // Assert
        Assert.Single(character.Classes);
        Assert.Equal("Fighter", character.Classes.First().Name);
    }

    [Fact]
    public void Character_ShouldAllowAddingItems()
    {
        // Arrange
        var character = new Character { Name = "Briv" };
        var item = new Item { Name = "Ioun Stone of Fortitude" };

        // Act
        character.Items.Add(item);

        // Assert
        Assert.Single(character.Items);
        Assert.Equal("Ioun Stone of Fortitude", character.Items.First().Name);
    }

    [Fact]
    public void Character_ShouldAllowAddingDefenses()
    {
        // Arrange
        var character = new Character { Name = "Briv" };
        var defense = new CharacterDefense { Type = Enums.DamageType.Fire, Defense = Enums.DefenseType.Immunity };

        // Act
        character.Defenses.Add(defense);

        // Assert
        Assert.Single(character.Defenses);
        Assert.Equal(Enums.DefenseType.Immunity, character.Defenses.First().Defense);
    }

    [Fact]
    public void ApplyDamage_ShouldReduceCurrentHitPoints()
    {
        // Arrange
        var character = new Character { HitPoints = 25, CurrentHitPoints = 25 };

        // Act
        character.ApplyDamage(Enums.DamageType.Piercing, 10);

        // Assert
        Assert.Equal(15, character.CurrentHitPoints);
    }

    [Fact]
    public void ApplyDamage_ShouldNotReduceBelowZero()
    {
        // Arrange
        var character = new Character { HitPoints = 25, CurrentHitPoints = 10 };

        // Act
        character.ApplyDamage(Enums.DamageType.Piercing, 20);

        // Assert
        Assert.Equal(0, character.CurrentHitPoints);
    }

    [Fact]
    public void ApplyDamage_ShouldNotApplyDamage_WhenCharacterHasImmunity()
    {
        // Arrange
        var character = new Character 
        { 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            Defenses =
            [
                new CharacterDefense { Type = Enums.DamageType.Fire, Defense = Enums.DefenseType.Immunity }
            ]
        };

        // Act
        character.ApplyDamage(Enums.DamageType.Fire, 20);

        // Assert
        Assert.Equal(25, character.CurrentHitPoints);
    }

    [Fact]
    public void ApplyDamage_ShouldApplyHalfDamage_WhenCharacterHasResistance()
    {
        // Arrange
        var character = new Character 
        { 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            Defenses =
            [
                new CharacterDefense { Type = Enums.DamageType.Fire, Defense = Enums.DefenseType.Resistance }
            ]
        };

        // Act
        character.ApplyDamage(Enums.DamageType.Fire, 10);

        // Assert
        Assert.Equal(20, character.CurrentHitPoints);
    }

    [Fact]
    public void ApplyDamage_ShouldRoundUpHalfDamage_WhenCharacterHasResistance()
    {
        // Arrange
        var character = new Character 
        { 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            Defenses =
            [
                new CharacterDefense { Type = Enums.DamageType.Fire, Defense = Enums.DefenseType.Resistance }
            ]
        };

        // Act
        character.ApplyDamage(Enums.DamageType.Fire, 9);

        // Assert
        Assert.Equal(20, character.CurrentHitPoints);
    }

    [Fact]
    public void ApplyDamage_ShouldReduceTemporaryHitPointsFirst()
    {
        // Arrange
        var character = new Character 
        { 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            TemporaryHitPoints = 10
        };

        // Act
        character.ApplyDamage(Enums.DamageType.Piercing, 5);

        // Assert
        Assert.Equal(5, character.TemporaryHitPoints);
        Assert.Equal(25, character.CurrentHitPoints);
    }

    [Fact]
    public void ApplyDamage_ShouldReduceTemporaryHitPointsAndCurrentHitPoints()
    {
        // Arrange
        var character = new Character 
        { 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            TemporaryHitPoints = 10
        };

        // Act
        character.ApplyDamage(Enums.DamageType.Piercing, 19);

        // Assert
        Assert.Equal(0, character.TemporaryHitPoints);
        Assert.Equal(16, character.CurrentHitPoints);
    }

    [Fact]
    public void Heal_ShouldIncreaseCurrentHitPoints()
    {
        // Arrange
        var character = new Character { HitPoints = 25, CurrentHitPoints = 10 };

        // Act
        character.Heal(5);

        // Assert
        Assert.Equal(15, character.CurrentHitPoints);
    }

    [Fact]
    public void Heal_ShouldNotExceedMaxHitPoints()
    {
        // Arrange
        var character = new Character { HitPoints = 25, CurrentHitPoints = 20 };

        // Act
        character.Heal(10);

        // Assert
        Assert.Equal(25, character.CurrentHitPoints);
    }

    [Fact]
    public void Heal_ShouldNotAffectTemporaryHitPoints()
    {
        // Arrange
        var character = new Character 
        { 
            HitPoints = 25, 
            CurrentHitPoints = 20,
            TemporaryHitPoints = 5
        };

        // Act
        character.Heal(3);

        // Assert
        Assert.Equal(23, character.CurrentHitPoints);
        Assert.Equal(5, character.TemporaryHitPoints);
    }

    [Fact]
    public void AddTemporaryHitPoints_ShouldSetTemporaryHitPoints_WhenNoneExist()
    {
        // Arrange
        var character = new Character { HitPoints = 25, CurrentHitPoints = 25 };

        // Act
        character.AddTemporaryHitPoints(10);

        // Assert
        Assert.Equal(10, character.TemporaryHitPoints);
    }

    [Fact]
    public void AddTemporaryHitPoints_ShouldTakeHigherValue()
    {
        // Arrange
        var character = new Character 
        { 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            TemporaryHitPoints = 5
        };

        // Act
        character.AddTemporaryHitPoints(10);

        // Assert
        Assert.Equal(10, character.TemporaryHitPoints);
    }

    [Fact]
    public void AddTemporaryHitPoints_ShouldNotReplaceLowerValue()
    {
        // Arrange
        var character = new Character 
        { 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            TemporaryHitPoints = 10
        };

        // Act
        character.AddTemporaryHitPoints(5);

        // Assert
        Assert.Equal(10, character.TemporaryHitPoints);
    }

    [Fact]
    public void HasImmunityTo_ShouldReturnTrue_WhenCharacterHasImmunity()
    {
        // Arrange
        var character = new Character 
        { 
            Defenses =
            [
                new CharacterDefense { Type = Enums.DamageType.Fire, Defense = Enums.DefenseType.Immunity }
            ]
        };

        // Act
        var result = character.HasImmunityTo(Enums.DamageType.Fire);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void HasImmunityTo_ShouldReturnFalse_WhenCharacterDoesNotHaveImmunity()
    {
        // Arrange
        var character = new Character 
        { 
            Defenses =
            [
                new CharacterDefense { Type = Enums.DamageType.Fire, Defense = Enums.DefenseType.Resistance }
            ]
        };

        // Act
        var result = character.HasImmunityTo(Enums.DamageType.Fire);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void HasResistanceTo_ShouldReturnTrue_WhenCharacterHasResistance()
    {
        // Arrange
        var character = new Character 
        { 
            Defenses =
            [
                new CharacterDefense { Type = Enums.DamageType.Cold, Defense = Enums.DefenseType.Resistance }
            ]
        };

        // Act
        var result = character.HasResistanceTo(Enums.DamageType.Cold);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void HasResistanceTo_ShouldReturnFalse_WhenCharacterDoesNotHaveResistance()
    {
        // Arrange
        var character = new Character 
        { 
            Defenses =
            [
                new CharacterDefense { Type = Enums.DamageType.Cold, Defense = Enums.DefenseType.Immunity }
            ]
        };

        // Act
        var result = character.HasResistanceTo(Enums.DamageType.Cold);

        // Assert
        Assert.False(result);
    }
}
