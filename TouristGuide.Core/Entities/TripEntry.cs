using System;
using TouristGuide.Core.Enums;

namespace TouristGuide.Core.Entities;

public class TripEntry
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int PlaceId { get; set; }
    public Place Place { get; set; } = null!;

    public TripStatus Status { get; set; } = TripStatus.Planned;
    public DateTime? VisitDate { get; set; }
    public string? Notes { get; set; }
    public int? UserRating { get; set; } // 1 - 5 stars
    public decimal? ActualCostUSD { get; set; }
    public string? TravelMode { get; set; } = "Flight"; // Flight, Train, Metro, Car, Cruise
    public string? TravelBuddy { get; set; } = "Solo"; // Solo, Partner, Family, Friends
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
