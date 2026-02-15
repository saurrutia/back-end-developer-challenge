namespace HitPointsService.Application.DTOs;

public class CharacterDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Level { get; set; }
    public int HitPoints { get; set; }
    public int CurrentHitPoints { get; set; }
    public int TemporaryHitPoints { get; set; }
    public List<string> Classes { get; set; } = [];
    public StatsDto Stats { get; set; } = new();
    public List<ItemDto> ItemsAffectingStats { get; set; } = [];
    public List<DefenseDto> Defenses { get; set; } = [];
}
