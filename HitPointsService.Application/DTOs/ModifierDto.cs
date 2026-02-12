namespace HitPointsService.Application.DTOs;

public class ModifierDto
{
    public string AffectedObject { get; set; } = string.Empty;
    public string AffectedValue { get; set; } = string.Empty;
    public int Value { get; set; }
}
