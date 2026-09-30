using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TouristGuide.Core.DTOs;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Enums;
using TouristGuide.Core.Interfaces;
using TouristGuide.Infrastructure.Data;

namespace TouristGuide.Infrastructure.Repositories;

public class TripEntryRepository : BaseRepository<TripEntry>, ITripEntryRepository
{
    public TripEntryRepository(TouristGuideDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<TripEntry>> GetUserTripsAsync(int userId)
    {
        return await _context.TripEntries
            .Include(t => t.Place)
                .ThenInclude(p => p.Country)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.VisitDate ?? t.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<TripEntry?> GetUserTripByIdAsync(int id, int userId)
    {
        return await _context.TripEntries
            .Include(t => t.Place)
                .ThenInclude(p => p.Country)
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
    }

    public async Task<bool> ExistsForUserAndPlaceAsync(int userId, int placeId)
    {
        return await _context.TripEntries
            .AnyAsync(t => t.UserId == userId && t.PlaceId == placeId);
    }

    public async Task<TripStatsDto> GetUserTripStatsAsync(int userId)
    {
        var trips = await _context.TripEntries
            .Include(t => t.Place)
                .ThenInclude(p => p.Country)
            .Where(t => t.UserId == userId)
            .AsNoTracking()
            .ToListAsync();

        var visited = trips.Where(t => t.Status == TripStatus.Visited).ToList();
        var planned = trips.Where(t => t.Status == TripStatus.Planned).ToList();
        var bucketList = trips.Where(t => t.Status == TripStatus.BucketList).ToList();

        var ratedTrips = visited.Where(t => t.UserRating.HasValue).ToList();
        var avgRating = ratedTrips.Any() ? ratedTrips.Average(t => t.UserRating!.Value) : 0.0;

        var visitedCountryNames = visited
            .Select(t => t.Place.Country.Name)
            .Distinct()
            .ToList();

        return new TripStatsDto
        {
            TotalTrips = trips.Count,
            VisitedCount = visited.Count,
            PlannedCount = planned.Count,
            BucketListCount = bucketList.Count,
            CountriesExplored = visitedCountryNames.Count,
            TotalExpenditureUSD = visited.Sum(t => t.ActualCostUSD ?? 0m),
            AverageUserRating = Math.Round(avgRating, 1),
            CountriesVisitedList = visitedCountryNames
        };
    }
}
