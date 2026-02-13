using HitPointsService.Application.Services;
using HitPointsService.Domain.Entities;
using HitPointsService.Domain.Interfaces;
using Moq;
using Xunit;

namespace HitPointsService.Application.Tests.Services;

public class CharacterServiceTests
{
    private readonly Mock<ICharacterRepository> _mockCharacterRepository;
    private readonly Mock<ICharacterNotificationService> _mockNotificationService = new Mock<ICharacterNotificationService>();
    private readonly CharacterService _characterService;

    public CharacterServiceTests()
    {
        _mockCharacterRepository = new Mock<ICharacterRepository>();
        _characterService = new CharacterService(_mockCharacterRepository.Object, _mockNotificationService.Object);
    }

    [Fact]
    public async Task GetAllCharactersAsync_ShouldReturnAllCharacters()
    {
        // Arrange
        var characters = new List<Character>
        {
            new Character { Id = 1, Name = "Briv", Level = 5, HitPoints = 25 },
            new Character { Id = 2, Name = "Thorin", Level = 8, HitPoints = 40 }
        };
        _mockCharacterRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(characters);

        // Act
        var result = await _characterService.GetAllCharactersAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
        Assert.Equal("Briv", result.First().Name);
        _mockCharacterRepository.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Fact]
    public async Task GetAllCharactersAsync_ShouldReturnEmptyList_WhenNoCharactersExist()
    {
        // Arrange
        _mockCharacterRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Character>());

        // Act
        var result = await _characterService.GetAllCharactersAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
        _mockCharacterRepository.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Fact]
    public async Task GetAllCharactersAsync_ShouldCallRepositoryOnce()
    {
        // Arrange
        _mockCharacterRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Character>());

        // Act
        await _characterService.GetAllCharactersAsync();

        // Assert
        _mockCharacterRepository.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Fact]
    public async Task DealDamageAsync_ShouldReturnTrue_WhenCharacterExists()
    {
        // Arrange
        var character = new Character 
        { 
            Id = 1, 
            Identifier = "briv",
            Name = "Briv", 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        _mockCharacterRepository
            .Setup(r => r.GetTrackedWithDefensesByIdentifierAsync("briv"))
            .ReturnsAsync(character);
        _mockCharacterRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Character>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _characterService.DealDamageAsync("briv", Domain.Enums.DamageType.Piercing, 10);

        // Assert
        Assert.True(result);
        _mockCharacterRepository.Verify(r => r.GetTrackedWithDefensesByIdentifierAsync("briv"), Times.Once);
        _mockCharacterRepository.Verify(r => r.UpdateAsync(It.IsAny<Character>()), Times.Once);
    }

    [Fact]
    public async Task DealDamageAsync_ShouldReturnFalse_WhenCharacterDoesNotExist()
    {
        // Arrange
        _mockCharacterRepository
            .Setup(r => r.GetTrackedWithDefensesByIdentifierAsync("nonexistent"))
            .ReturnsAsync((Character?)null);

        // Act
        var result = await _characterService.DealDamageAsync("nonexistent", Domain.Enums.DamageType.Piercing, 10);

        // Assert
        Assert.False(result);
        _mockCharacterRepository.Verify(r => r.GetTrackedWithDefensesByIdentifierAsync("nonexistent"), Times.Once);
        _mockCharacterRepository.Verify(r => r.UpdateAsync(It.IsAny<Character>()), Times.Never);
    }

    [Fact]
    public async Task DealDamageAsync_ShouldApplyDamageToCharacter()
    {
        // Arrange
        var character = new Character 
        { 
            Id = 1, 
            Identifier = "briv",
            Name = "Briv", 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        _mockCharacterRepository
            .Setup(r => r.GetTrackedWithDefensesByIdentifierAsync("briv"))
            .ReturnsAsync(character);
        _mockCharacterRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Character>()))
            .Returns(Task.CompletedTask);

        // Act
        await _characterService.DealDamageAsync("briv", Domain.Enums.DamageType.Piercing, 10);

        // Assert
        Assert.Equal(15, character.CurrentHitPoints);
    }

    [Fact]
    public async Task HealAsync_ShouldReturnTrue_WhenCharacterExists()
    {
        // Arrange
        var character = new Character 
        { 
            Id = 1, 
            Identifier = "briv",
            Name = "Briv", 
            HitPoints = 25, 
            CurrentHitPoints = 10 
        };
        _mockCharacterRepository
            .Setup(r => r.GetTrackedByIdentifierAsync("briv"))
            .ReturnsAsync(character);
        _mockCharacterRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Character>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _characterService.HealAsync("briv", 5);

        // Assert
        Assert.True(result);
        _mockCharacterRepository.Verify(r => r.GetTrackedByIdentifierAsync("briv"), Times.Once);
        _mockCharacterRepository.Verify(r => r.UpdateAsync(It.IsAny<Character>()), Times.Once);
    }

    [Fact]
    public async Task HealAsync_ShouldReturnFalse_WhenCharacterDoesNotExist()
    {
        // Arrange
        _mockCharacterRepository
            .Setup(r => r.GetTrackedByIdentifierAsync("nonexistent"))
            .ReturnsAsync((Character?)null);

        // Act
        var result = await _characterService.HealAsync("nonexistent", 5);

        // Assert
        Assert.False(result);
        _mockCharacterRepository.Verify(r => r.GetTrackedByIdentifierAsync("nonexistent"), Times.Once);
        _mockCharacterRepository.Verify(r => r.UpdateAsync(It.IsAny<Character>()), Times.Never);
    }

    [Fact]
    public async Task HealAsync_ShouldHealCharacter()
    {
        // Arrange
        var character = new Character 
        { 
            Id = 1, 
            Identifier = "briv",
            Name = "Briv", 
            HitPoints = 25, 
            CurrentHitPoints = 10 
        };
        _mockCharacterRepository
            .Setup(r => r.GetTrackedByIdentifierAsync("briv"))
            .ReturnsAsync(character);
        _mockCharacterRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Character>()))
            .Returns(Task.CompletedTask);

        // Act
        await _characterService.HealAsync("briv", 5);

        // Assert
        Assert.Equal(15, character.CurrentHitPoints);
    }

    [Fact]
    public async Task AddTemporaryHitPointsAsync_ShouldReturnTrue_WhenCharacterExists()
    {
        // Arrange
        var character = new Character 
        { 
            Id = 1, 
            Identifier = "briv",
            Name = "Briv", 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        _mockCharacterRepository
            .Setup(r => r.GetTrackedByIdentifierAsync("briv"))
            .ReturnsAsync(character);
        _mockCharacterRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Character>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _characterService.AddTemporaryHitPointsAsync("briv", 10);

        // Assert
        Assert.True(result);
        _mockCharacterRepository.Verify(r => r.GetTrackedByIdentifierAsync("briv"), Times.Once);
        _mockCharacterRepository.Verify(r => r.UpdateAsync(It.IsAny<Character>()), Times.Once);
    }

    [Fact]
    public async Task AddTemporaryHitPointsAsync_ShouldReturnFalse_WhenCharacterDoesNotExist()
    {
        // Arrange
        _mockCharacterRepository
            .Setup(r => r.GetTrackedByIdentifierAsync("nonexistent"))
            .ReturnsAsync((Character?)null);

        // Act
        var result = await _characterService.AddTemporaryHitPointsAsync("nonexistent", 10);

        // Assert
        Assert.False(result);
        _mockCharacterRepository.Verify(r => r.GetTrackedByIdentifierAsync("nonexistent"), Times.Once);
        _mockCharacterRepository.Verify(r => r.UpdateAsync(It.IsAny<Character>()), Times.Never);
    }

    [Fact]
    public async Task AddTemporaryHitPointsAsync_ShouldAddTemporaryHitPointsToCharacter()
    {
        // Arrange
        var character = new Character 
        { 
            Id = 1, 
            Identifier = "briv",
            Name = "Briv", 
            HitPoints = 25, 
            CurrentHitPoints = 25 
        };
        _mockCharacterRepository
            .Setup(r => r.GetTrackedByIdentifierAsync("briv"))
            .ReturnsAsync(character);
        _mockCharacterRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Character>()))
            .Returns(Task.CompletedTask);

        // Act
        await _characterService.AddTemporaryHitPointsAsync("briv", 10);

        // Assert
        Assert.Equal(10, character.TemporaryHitPoints);
    }
}
