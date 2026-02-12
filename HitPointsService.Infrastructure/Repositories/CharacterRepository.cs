using HitPointsService.Domain.Entities;
using HitPointsService.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HitPointsService.Infrastructure.Repositories;

public class CharacterRepository : ICharacterRepository
{
    private readonly DnDDbContext _context;

    public CharacterRepository(DnDDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Character>> GetAllAsync()
    {
        return await _context.Characters
            .AsNoTracking()
            .Include(c => c.Classes)
            .Include(c => c.Items)
            .Include(c => c.Defenses)
            .ToListAsync();
    }

    public Task<Character?> GetByIdentifierAsync(string identifier)
    {
        return _context.Characters
            .AsNoTracking()
            .Include(c => c.Classes)
            .Include(c => c.Items)
            .Include(c => c.Defenses)
            .FirstOrDefaultAsync(c => c.Identifier == identifier);
    }

    public Task<Character?> GetTrackedByIdentifierAsync(string identifier)
    {
        return _context.Characters.FirstOrDefaultAsync(c => c.Identifier == identifier);
    }

    public Task<Character?> GetTrackedWithDefensesByIdentifierAsync(string identifier)
    {
        return _context.Characters
            .Include(c => c.Defenses)
            .FirstOrDefaultAsync(c => c.Identifier == identifier);
    }

    public async Task UpdateAsync(Character character)
    {
        _context.Characters.Update(character);
        await _context.SaveChangesAsync();
    }
}
