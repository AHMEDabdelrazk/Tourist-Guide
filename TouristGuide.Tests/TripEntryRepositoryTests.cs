using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Enums;
using TouristGuide.Infrastructure.Data;
using TouristGuide.Infrastructure.Repositories;
using Xunit;

namespace TouristGuide.Tests;

public class TripEntryRepositoryTests
{
    private TouristGuideDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<TouristGuideDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new TouristGuideDbContext(options);
    }

    [Fact]
    public async Task GetUserTripStatsAsync_CalculatesCorrectAggregations()
    {
        // Arrange
        using var context = CreateInMemoryDbContext();
        var user = new User { Id = 1, Username = "traveler_sam", Email = "sam@test.com" };
        var countryFrance = new Country { Id = 1, Name = "France", Code = "FR", Capital = "Paris", Currency = "EUR", FlagEmoji = "🇫🇷" };
        var countryEgypt = new Country { Id = 2, Name = "Egypt", Code = "EG", Capital = "Cairo", Currency = "EGP", FlagEmoji = "🇪🇬" };

        var placeEiffel = new Place { Id = 1, CountryId = 1, Country = countryFrance, Name = "Eiffel Tower", City = "Paris", TicketPriceUSD = 32 };
        var placePyramids = new Place { Id = 2, CountryId = 2, Country = countryEgypt, Name = "Pyramids of Giza", City = "Giza", TicketPriceUSD = 18 };

        await context.Users.AddAsync(user);
        await context.Countries.AddRangeAsync(countryFrance, countryEgypt);
        await context.Places.AddRangeAsync(placeEiffel, placePyramids);
        await context.SaveChangesAsync();

        var tripRepo = new TripEntryRepository(context);

        // Add 1 visited trip and 1 planned trip
        await tripRepo.AddAsync(new TripEntry
        {
            UserId = user.Id,
            PlaceId = placeEiffel.Id,
            Status = TripStatus.Visited,
            ActualCostUSD = 250m,
            UserRating = 5,
            VisitDate = DateTime.UtcNow.AddMonths(-1)
        });

        await tripRepo.AddAsync(new TripEntry
        {
            UserId = user.Id,
            PlaceId = placePyramids.Id,
            Status = TripStatus.Planned,
            ActualCostUSD = 300m,
            UserRating = null,
            VisitDate = DateTime.UtcNow.AddMonths(1)
        });

        // Act
        var stats = await tripRepo.GetUserTripStatsAsync(user.Id);

        // Assert
        Assert.Equal(2, stats.TotalTrips);
        Assert.Equal(1, stats.VisitedCount);
        Assert.Equal(1, stats.PlannedCount);
        Assert.Equal(0, stats.BucketListCount);
        Assert.Equal(1, stats.CountriesExplored); // Only France is visited so far
        Assert.Equal(250m, stats.TotalExpenditureUSD);
        Assert.Equal(5.0, stats.AverageUserRating);
        Assert.Contains("France", stats.CountriesVisitedList);
    }
}
