namespace HitPointsService.Infrastructure;

using System.Text.Json;
using HitPointsService.Domain.Entities;

public static class DataSeeder
{
    public static void Seed(DnDDbContext context)
    {
        context.Database.EnsureCreated();
        if (context.Characters.Any())
        {
            return;
        }
        
        SeedFromJsonFiles(context);
        context.SaveChanges();
    }

    private static void SeedFromJsonFiles(DnDDbContext context)
    {
        var rootPath = AppContext.BaseDirectory;
        var charactersPath = Path.Combine(rootPath, "Characters");
        var jsonFiles = Directory.GetFiles(charactersPath, "*.json", SearchOption.TopDirectoryOnly);

        foreach (var jsonFile in jsonFiles)
        {
            try
            {
                var json = File.ReadAllText(jsonFile);
                var character = JsonSerializer.Deserialize<Character>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (character != null)
                {
                    if (character.Classes != null && character.Classes.Count > 0)
                    {
                        foreach (var characterClass in character.Classes)
                        {
                            var existingClass = context.Classes.FirstOrDefault(c => c.Name == characterClass.Name);
                            if (existingClass == null)
                            {
                                context.Classes.Add(characterClass);
                            }
                            else
                            {
                                characterClass.Id = existingClass.Id;
                            }
                        }
                    }

                    if (character.Items != null && character.Items.Count > 0)
                    {
                        foreach (var item in character.Items)
                        {
                            var existingItem = context.Items.FirstOrDefault(i => i.Name == item.Name);
                            if (existingItem == null)
                            {
                                context.Items.Add(item);
                            }
                            else
                            {
                                item.Id = existingItem.Id;
                            }
                        }
                    }

                    if (character.Defenses != null && character.Defenses.Count > 0)
                    {
                        foreach (var defense in character.Defenses)
                        {
                            defense.CharacterId = character.Id;
                            context.CharacterDefenses.Add(defense);
                        }
                    }
                    character.Identifier = Path.GetFileNameWithoutExtension(jsonFile);
                    character.CurrentHitPoints = character.HitPoints;
                    context.Characters.Add(character);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading JSON file {jsonFile}: {ex.Message}");
            }
        }
    }
}