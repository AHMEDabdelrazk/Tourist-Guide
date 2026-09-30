using System.Collections.Generic;
using TouristGuide.Core.Enums;

namespace TouristGuide.Core.Entities;

public class Place
{
    public int Id { get; set; }
    public int CountryId { get; set; }
    public Country Country { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public PlaceCategory Category { get; set; } = PlaceCategory.Historical;
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // Rich transit and logistics guide
    public string HowToGoThere { get; set; } = string.Empty;
    public string BestTimeToVisit { get; set; } = string.Empty;
    public string RecommendedDuration { get; set; } = "2-3 hours";
    public string OpeningHours { get; set; } = "09:00 - 18:00";
    public decimal TicketPriceUSD { get; set; }
    
    // Geolocation
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public double Rating { get; set; } = 4.8;
    public int ReviewCount { get; set; } = 120;

    public string ImageUrl { get; set; } = string.Empty;
    public string GalleryJson { get; set; } = "[]"; // Serialized JSON array of image URLs
    public string HighlightsJson { get; set; } = "[]"; // Serialized JSON array of string bullet points
    public string TravelTips { get; set; } = string.Empty;

    public ICollection<TripEntry> TripEntries { get; set; } = new List<TripEntry>();
    public ICollection<PlaceReview> Reviews { get; set; } = new List<PlaceReview>();
}
