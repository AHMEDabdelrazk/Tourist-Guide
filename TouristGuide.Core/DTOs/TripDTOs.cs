using System;
using System.Collections.Generic;
using TouristGuide.Core.Enums;

namespace TouristGuide.Core.DTOs;

public class TripEntryDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PlaceId { get; set; }
    public string PlaceName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public int CountryId { get; set; }
    public string CountryName { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string FlagEmoji { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public TripStatus Status { get; set; }
    public string StatusName => Status.ToString();
    public DateTime? VisitDate { get; set; }
    public string? Notes { get; set; }
    public int? UserRating { get; set; }
    public decimal? ActualCostUSD { get; set; }
    public string? TravelMode { get; set; }
    public string? TravelBuddy { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTripEntryDto
{
    public int PlaceId { get; set; }
    public TripStatus Status { get; set; } = TripStatus.Planned;
    public DateTime? VisitDate { get; set; }
    public string? Notes { get; set; }
    public int? UserRating { get; set; }
    public decimal? ActualCostUSD { get; set; }
    public string? TravelMode { get; set; } = "Flight";
    public string? TravelBuddy { get; set; } = "Solo";
}

public class UpdateTripEntryDto
{
    public TripStatus Status { get; set; }
    public DateTime? VisitDate { get; set; }
    public string? Notes { get; set; }
    public int? UserRating { get; set; }
    public decimal? ActualCostUSD { get; set; }
    public string? TravelMode { get; set; }
    public string? TravelBuddy { get; set; }
}

public class TripStatsDto
{
    public int TotalTrips { get; set; }
    public int VisitedCount { get; set; }
    public int PlannedCount { get; set; }
    public int BucketListCount { get; set; }
    public int CountriesExplored { get; set; }
    public decimal TotalExpenditureUSD { get; set; }
    public double AverageUserRating { get; set; }
    public List<string> CountriesVisitedList { get; set; } = new();
}

public class ReviewDto
{
    public int Id { get; set; }
    public int PlaceId { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string UserAvatarUrl { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewDto
{
    public int PlaceId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}
