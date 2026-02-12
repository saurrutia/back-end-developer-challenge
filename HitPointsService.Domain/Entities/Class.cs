namespace HitPointsService.Domain.Entities;
public class Class : Entity
{
    public string Name { get; set; } = string.Empty;
    public int HitDiceValue { get; set; }
    public int ClassLevel { get; set; }
    public List<Character> Characters { get; set; } = [];
}