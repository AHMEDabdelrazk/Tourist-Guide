using System.Collections.Generic;

namespace TouristGuide.Core.DTOs;

public class CountrySummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Continent { get; set; } = string.Empty;
    public string Capital { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string FlagEmoji { get; set; } = string.Empty;
    public string FlagImageUrl { get; set; } = string.Empty;
    public string HeroImageUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BestTimeToVisit { get; set; } = string.Empty;
    public decimal AverageDailyBudgetUSD { get; set; }
    public int PlacesCount { get; set; }
}

public class CountryDetailDto : CountrySummaryDto
{
    public string TimeZone { get; set; } = string.Empty;
    public string EmergencyContact { get; set; } = string.Empty;
    public List<PlaceSummaryDto> Places { get; set; } = new();
}

public class CreateCountryDto
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Continent { get; set; } = string.Empty;
    public string Capital { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string TimeZone { get; set; } = string.Empty;
    public string FlagEmoji { get; set; } = string.Empty;
    public string FlagImageUrl { get; set; } = string.Empty;
    public string HeroImageUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BestTimeToVisit { get; set; } = string.Empty;
    public string EmergencyContact { get; set; } = string.Empty;
    public decimal AverageDailyBudgetUSD { get; set; }
}
