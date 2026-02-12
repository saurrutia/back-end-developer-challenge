using HitPointsService.Domain.Entities;
using HitPointsService.Infrastructure;
using HitPointsService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace HitPointsService.Infrastructure.Tests.Repositories;

public class CharacterRepositoryTests
{
    private DnDDbContext CreateTestContext()
    {
        var options = new DbContextOptionsBuilder<DnDDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new DnDDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllCharacters()
    {
        // Arrange
        using var context = CreateTestContext();
        var character1 = new Character { Name = "Briv", Level = 5, HitPoints = 25, CurrentHitPoints = 25 };
        var character2 = new Character { Name = "Thorin", Level = 8, HitPoints = 40, CurrentHitPoints = 40 };
        
        context.Characters.AddRange(character1, character2);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
        Assert.Contains(result, c => c.Name == "Briv");
        Assert.Contains(result, c => c.Name == "Thorin");
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoCharactersExist()
    {
        // Arrange
        using var context = CreateTestContext();
        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetAllAsync_ShouldIncludeCharacterRelations()
    {
        // Arrange
        using var context = CreateTestContext();
        var characterClass = new Class { Name = "Fighter", HitDiceValue = 10, ClassLevel = 1 };
        var character = new Character 
        { 
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            Classes = new List<Class> { characterClass }
        };
        
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetAllAsync();

        // Assert
        Assert.NotNull(result);
        var retrievedCharacter = result.First();
        Assert.NotNull(retrievedCharacter.Classes);
        Assert.Single(retrievedCharacter.Classes);
        Assert.Equal("Fighter", retrievedCharacter.Classes.First().Name);
    }

    [Fact]
    public async Task GetAllAsync_ShouldUseAsNoTracking()
    {
        // Arrange
        using var context = CreateTestContext();
        var character = new Character { Name = "Briv", Level = 5, HitPoints = 25, CurrentHitPoints = 25 };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetAllAsync();
        var retrievedCharacter = result.First();

        // Modify the character object (not in the database)
        retrievedCharacter.Name = "Modified Name";

        // Assert - the change should not be automatically saved because AsNoTracking was used
        context.ChangeTracker.Clear();
        var characterFromDb = context.Characters.First();
        Assert.Equal("Briv", characterFromDb.Name);
    }

    [Fact]
    public async Task GetByIdentifierAsync_ShouldReturnCharacter_WhenExists()
    {
        // Arrange
        using var context = CreateTestContext();
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetByIdentifierAsync("briv");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("briv", result.Identifier);
        Assert.Equal("Briv", result.Name);
    }

    [Fact]
    public async Task GetByIdentifierAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        using var context = CreateTestContext();
        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetByIdentifierAsync("nonexistent");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdentifierAsync_ShouldIncludeRelations()
    {
        // Arrange
        using var context = CreateTestContext();
        var characterClass = new Class { Name = "Fighter", HitDiceValue = 10, ClassLevel = 1 };
        var item = new Item { Name = "Ioun Stone of Fortitude" };
        var defense = new CharacterDefense { Type = Domain.Enums.DamageType.Fire, Defense = Domain.Enums.DefenseType.Immunity };
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            Classes = new List<Class> { characterClass },
            Items = new List<Item> { item },
            Defenses = new List<CharacterDefense> { defense }
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetByIdentifierAsync("briv");

        // Assert
        Assert.NotNull(result);
        Assert.Single(result.Classes);
        Assert.Equal("Fighter", result.Classes.First().Name);
        Assert.Single(result.Items);
        Assert.Equal("Ioun Stone of Fortitude", result.Items.First().Name);
        Assert.Single(result.Defenses);
        Assert.Equal(Domain.Enums.DefenseType.Immunity, result.Defenses.First().Defense);
    }

    [Fact]
    public async Task GetByIdentifierAsync_ShouldUseAsNoTracking()
    {
        // Arrange
        using var context = CreateTestContext();
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetByIdentifierAsync("briv");
        result!.Name = "Modified Name";

        // Assert - the change should not be automatically saved because AsNoTracking was used
        context.ChangeTracker.Clear();
        var characterFromDb = context.Characters.First();
        Assert.Equal("Briv", characterFromDb.Name);
    }

    [Fact]
    public async Task GetTrackedByIdentifierAsync_ShouldReturnTrackedCharacter_WhenExists()
    {
        // Arrange
        using var context = CreateTestContext();
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetTrackedByIdentifierAsync("briv");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("briv", result.Identifier);
        Assert.Equal("Briv", result.Name);
    }

    [Fact]
    public async Task GetTrackedByIdentifierAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        using var context = CreateTestContext();
        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetTrackedByIdentifierAsync("nonexistent");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetTrackedByIdentifierAsync_ShouldTrackEntity()
    {
        // Arrange
        using var context = CreateTestContext();
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetTrackedByIdentifierAsync("briv");
        result!.Name = "Modified Name";
        context.SaveChanges();

        // Assert - the change should be saved because entity is tracked
        context.ChangeTracker.Clear();
        var characterFromDb = context.Characters.First();
        Assert.Equal("Modified Name", characterFromDb.Name);
    }

    [Fact]
    public async Task GetTrackedWithDefensesByIdentifierAsync_ShouldReturnCharacterWithDefenses_WhenExists()
    {
        // Arrange
        using var context = CreateTestContext();
        var defense = new CharacterDefense { Type = Domain.Enums.DamageType.Fire, Defense = Domain.Enums.DefenseType.Immunity };
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            Defenses = new List<CharacterDefense> { defense }
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetTrackedWithDefensesByIdentifierAsync("briv");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("briv", result.Identifier);
        Assert.Single(result.Defenses);
        Assert.Equal(Domain.Enums.DefenseType.Immunity, result.Defenses.First().Defense);
    }

    [Fact]
    public async Task GetTrackedWithDefensesByIdentifierAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        using var context = CreateTestContext();
        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetTrackedWithDefensesByIdentifierAsync("nonexistent");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetTrackedWithDefensesByIdentifierAsync_ShouldTrackEntity()
    {
        // Arrange
        using var context = CreateTestContext();
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        var result = await repository.GetTrackedWithDefensesByIdentifierAsync("briv");
        result!.Name = "Modified Name";
        context.SaveChanges();

        // Assert - the change should be saved because entity is tracked
        context.ChangeTracker.Clear();
        var characterFromDb = context.Characters.First();
        Assert.Equal("Modified Name", characterFromDb.Name);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateCharacter()
    {
        // Arrange
        using var context = CreateTestContext();
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        character.CurrentHitPoints = 20;
        await repository.UpdateAsync(character);

        // Assert
        context.ChangeTracker.Clear();
        var updatedCharacter = context.Characters.First();
        Assert.Equal(20, updatedCharacter.CurrentHitPoints);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateMultipleProperties()
    {
        // Arrange
        using var context = CreateTestContext();
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25,
            TemporaryHitPoints = 0
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        character.CurrentHitPoints = 20;
        character.TemporaryHitPoints = 5;
        await repository.UpdateAsync(character);

        // Assert
        context.ChangeTracker.Clear();
        var updatedCharacter = context.Characters.First();
        Assert.Equal(20, updatedCharacter.CurrentHitPoints);
        Assert.Equal(5, updatedCharacter.TemporaryHitPoints);
    }

    [Fact]
    public async Task UpdateAsync_ShouldPersistChanges()
    {
        // Arrange
        using var context = CreateTestContext();
        var character = new Character 
        { 
            Identifier = "briv",
            Name = "Briv", 
            Level = 5, 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        context.Characters.Add(character);
        context.SaveChanges();

        var repository = new CharacterRepository(context);

        // Act
        character.CurrentHitPoints = 15;
        await repository.UpdateAsync(character);

        // Assert - verify changes persist by clearing the tracker and reloading
        context.ChangeTracker.Clear();
        var persistedCharacter = context.Characters.FirstOrDefault(c => c.Identifier == "briv");
        Assert.NotNull(persistedCharacter);
        Assert.Equal(15, persistedCharacter.CurrentHitPoints);
    }
}
