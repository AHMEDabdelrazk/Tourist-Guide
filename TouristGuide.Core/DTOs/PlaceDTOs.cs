using System.Collections.Generic;
using TouristGuide.Core.Enums;

namespace TouristGuide.Core.DTOs;

public class PlaceSummaryDto
{
    public int Id { get; set; }
    public int CountryId { get; set; }
    public string CountryName { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string FlagEmoji { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public PlaceCategory Category { get; set; }
    public string CategoryName => Category.ToString();
    public string Summary { get; set; } = string.Empty;
    public string HowToGoThere { get; set; } = string.Empty;
    public decimal TicketPriceUSD { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string BestTimeToVisit { get; set; } = string.Empty;
    public string RecommendedDuration { get; set; } = string.Empty;
}

public class PlaceDetailDto : PlaceSummaryDto
{
    public string Description { get; set; } = string.Empty;
    public string OpeningHours { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public List<string> GalleryImages { get; set; } = new();
    public List<string> Highlights { get; set; } = new();
    public string TravelTips { get; set; } = string.Empty;
    public List<ReviewDto> Reviews { get; set; } = new();
}

public class PlaceFilterDto
{
    public int? CountryId { get; set; }
    public string? CountryCode { get; set; }
    public PlaceCategory? Category { get; set; }
    public string? SearchTerm { get; set; }
    public decimal? MaxTicketPrice { get; set; }
    public double? MinRating { get; set; }
    public string? SortBy { get; set; } // rating_desc, price_asc, price_desc, name_asc
}

public class CreatePlaceDto
{
    public int CountryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public PlaceCategory Category { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HowToGoThere { get; set; } = string.Empty;
    public string BestTimeToVisit { get; set; } = string.Empty;
    public string RecommendedDuration { get; set; } = "2-3 hours";
    public string OpeningHours { get; set; } = "09:00 - 18:00";
    public decimal TicketPriceUSD { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> GalleryImages { get; set; } = new();
    public List<string> Highlights { get; set; } = new();
    public string TravelTips { get; set; } = string.Empty;
}
