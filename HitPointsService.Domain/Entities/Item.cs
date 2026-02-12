using HitPointsService.Domain.ValueObjects;

namespace HitPointsService.Domain.Entities;
public class Item : Entity
{
    public string Name { get; set; } = string.Empty;
    public Modifier Modifier { get; set; } = new Modifier();
    public List<Character> Characters { get; set; } = [];
}