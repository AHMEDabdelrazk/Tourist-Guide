using System.Collections.Generic;

namespace TouristGuide.Core.Entities;

public class Country
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty; // e.g. FR, EG, DE, CH, US, AE
    public string Continent { get; set; } = string.Empty;
    public string Capital { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty; // e.g. EUR, EGP, USD, AED, CHF
    public string Language { get; set; } = string.Empty;
    public string TimeZone { get; set; } = string.Empty;
    public string FlagEmoji { get; set; } = string.Empty;
    public string FlagImageUrl { get; set; } = string.Empty;
    public string HeroImageUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BestTimeToVisit { get; set; } = string.Empty;
    public string EmergencyContact { get; set; } = string.Empty;
    public decimal AverageDailyBudgetUSD { get; set; }

    public ICollection<Place> Places { get; set; } = new List<Place>();
}
