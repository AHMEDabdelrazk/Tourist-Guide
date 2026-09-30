using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Interfaces;
using TouristGuide.Infrastructure.Data;

namespace TouristGuide.Infrastructure.Repositories;

public class CountryRepository : BaseRepository<Country>, ICountryRepository
{
    public CountryRepository(TouristGuideDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Country>> GetAllWithPlacesAsync()
    {
        return await _context.Countries
            .Include(c => c.Places)
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Country?> GetWithPlacesByIdAsync(int id)
    {
        return await _context.Countries
            .Include(c => c.Places)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Country?> GetByCodeAsync(string code)
    {
        var normalized = code.Trim().ToUpper();
        return await _context.Countries
            .Include(c => c.Places)
            .FirstOrDefaultAsync(c => c.Code.ToUpper() == normalized);
    }
}
