using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TouristGuide.Core.DTOs;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Interfaces;
using TouristGuide.Infrastructure.Data;

namespace TouristGuide.Infrastructure.Repositories;

public class PlaceRepository : BaseRepository<Place>, IPlaceRepository
{
    public PlaceRepository(TouristGuideDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Place>> GetFilteredPlacesAsync(PlaceFilterDto filter)
    {
        var query = _context.Places
            .Include(p => p.Country)
            .AsNoTracking()
            .AsQueryable();

        if (filter.CountryId.HasValue)
        {
            query = query.Where(p => p.CountryId == filter.CountryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.CountryCode))
        {
            var code = filter.CountryCode.Trim().ToUpper();
            query = query.Where(p => p.Country.Code.ToUpper() == code);
        }

        if (filter.Category.HasValue)
        {
            query = query.Where(p => p.Category == filter.Category.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            var term = filter.SearchTerm.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(term) ||
                p.City.ToLower().Contains(term) ||
                p.Country.Name.ToLower().Contains(term) ||
                p.Summary.ToLower().Contains(term));
        }

        if (filter.MaxTicketPrice.HasValue)
        {
            query = query.Where(p => p.TicketPriceUSD <= filter.MaxTicketPrice.Value);
        }

        if (filter.MinRating.HasValue)
        {
            query = query.Where(p => p.Rating >= filter.MinRating.Value);
        }

        query = filter.SortBy?.ToLower() switch
        {
            "rating_desc" => query.OrderByDescending(p => p.Rating),
            "price_asc" => query.OrderBy(p => p.TicketPriceUSD),
            "price_desc" => query.OrderByDescending(p => p.TicketPriceUSD),
            "name_asc" => query.OrderBy(p => p.Name),
            _ => query.OrderByDescending(p => p.Rating)
        };

        return await query.ToListAsync();
    }

    public async Task<Place?> GetPlaceDetailsByIdAsync(int id)
    {
        return await _context.Places
            .Include(p => p.Country)
            .Include(p => p.Reviews)
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Place>> GetTopRatedPlacesAsync(int count)
    {
        return await _context.Places
            .Include(p => p.Country)
            .AsNoTracking()
            .OrderByDescending(p => p.Rating)
            .ThenByDescending(p => p.ReviewCount)
            .Take(count)
            .ToListAsync();
    }
}
