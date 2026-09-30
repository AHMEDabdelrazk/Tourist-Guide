using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TouristGuide.Core.DTOs;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Interfaces;

namespace TouristGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CountriesController : ControllerBase
{
    private readonly ICountryRepository _countryRepository;

    public CountriesController(ICountryRepository countryRepository)
    {
        _countryRepository = countryRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CountrySummaryDto>>> GetAllCountries()
    {
        var countries = await _countryRepository.GetAllWithPlacesAsync();
        var dtos = countries.Select(c => new CountrySummaryDto
        {
            Id = c.Id,
            Name = c.Name,
            Code = c.Code,
            Continent = c.Continent,
            Capital = c.Capital,
            Currency = c.Currency,
            Language = c.Language,
            FlagEmoji = c.FlagEmoji,
            FlagImageUrl = c.FlagImageUrl,
            HeroImageUrl = c.HeroImageUrl,
            Description = c.Description,
            BestTimeToVisit = c.BestTimeToVisit,
            AverageDailyBudgetUSD = c.AverageDailyBudgetUSD,
            PlacesCount = c.Places.Count
        });

        return Ok(dtos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CountryDetailDto>> GetCountryById(int id)
    {
        var country = await _countryRepository.GetWithPlacesByIdAsync(id);
        if (country == null)
        {
            return NotFound(new { message = $"Country with ID {id} not found." });
        }

        return Ok(MapToCountryDetailDto(country));
    }

    [HttpGet("code/{code}")]
    public async Task<ActionResult<CountryDetailDto>> GetCountryByCode(string code)
    {
        var country = await _countryRepository.GetByCodeAsync(code);
        if (country == null)
        {
            return NotFound(new { message = $"Country with code '{code}' not found." });
        }

        return Ok(MapToCountryDetailDto(country));
    }

    [HttpPost]
    public async Task<ActionResult<CountrySummaryDto>> CreateCountry([FromBody] CreateCountryDto dto)
    {
        var existing = await _countryRepository.GetByCodeAsync(dto.Code);
        if (existing != null)
        {
            return BadRequest(new { message = $"Country with code '{dto.Code}' already exists." });
        }

        var country = new Country
        {
            Name = dto.Name.Trim(),
            Code = dto.Code.Trim().ToUpper(),
            Continent = dto.Continent.Trim(),
            Capital = dto.Capital.Trim(),
            Currency = dto.Currency.Trim(),
            Language = dto.Language.Trim(),
            TimeZone = dto.TimeZone.Trim(),
            FlagEmoji = dto.FlagEmoji.Trim(),
            FlagImageUrl = dto.FlagImageUrl.Trim(),
            HeroImageUrl = dto.HeroImageUrl.Trim(),
            Description = dto.Description.Trim(),
            BestTimeToVisit = dto.BestTimeToVisit.Trim(),
            EmergencyContact = dto.EmergencyContact.Trim(),
            AverageDailyBudgetUSD = dto.AverageDailyBudgetUSD
        };

        var created = await _countryRepository.AddAsync(country);
        return CreatedAtAction(nameof(GetCountryById), new { id = created.Id }, new CountrySummaryDto
        {
            Id = created.Id,
            Name = created.Name,
            Code = created.Code,
            Continent = created.Continent,
            Capital = created.Capital,
            Currency = created.Currency,
            Language = created.Language,
            FlagEmoji = created.FlagEmoji,
            FlagImageUrl = created.FlagImageUrl,
            HeroImageUrl = created.HeroImageUrl,
            Description = created.Description,
            BestTimeToVisit = created.BestTimeToVisit,
            AverageDailyBudgetUSD = created.AverageDailyBudgetUSD,
            PlacesCount = 0
        });
    }

    private static CountryDetailDto MapToCountryDetailDto(Country country)
    {
        return new CountryDetailDto
        {
            Id = country.Id,
            Name = country.Name,
            Code = country.Code,
            Continent = country.Continent,
            Capital = country.Capital,
            Currency = country.Currency,
            Language = country.Language,
            TimeZone = country.TimeZone,
            FlagEmoji = country.FlagEmoji,
            FlagImageUrl = country.FlagImageUrl,
            HeroImageUrl = country.HeroImageUrl,
            Description = country.Description,
            BestTimeToVisit = country.BestTimeToVisit,
            EmergencyContact = country.EmergencyContact,
            AverageDailyBudgetUSD = country.AverageDailyBudgetUSD,
            PlacesCount = country.Places.Count,
            Places = country.Places.Select(p => new PlaceSummaryDto
            {
                Id = p.Id,
                CountryId = p.CountryId,
                CountryName = country.Name,
                CountryCode = country.Code,
                FlagEmoji = country.FlagEmoji,
                Name = p.Name,
                City = p.City,
                Category = p.Category,
                Summary = p.Summary,
                HowToGoThere = p.HowToGoThere,
                TicketPriceUSD = p.TicketPriceUSD,
                Rating = p.Rating,
                ReviewCount = p.ReviewCount,
                ImageUrl = p.ImageUrl,
                BestTimeToVisit = p.BestTimeToVisit,
                RecommendedDuration = p.RecommendedDuration
            }).ToList()
        };
    }
}
