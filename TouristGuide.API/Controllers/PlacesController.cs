using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TouristGuide.Core.DTOs;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Interfaces;

namespace TouristGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlacesController : ControllerBase
{
    private readonly IPlaceRepository _placeRepository;
    private readonly IReviewRepository _reviewRepository;
    private readonly ICountryRepository _countryRepository;

    public PlacesController(
        IPlaceRepository placeRepository,
        IReviewRepository reviewRepository,
        ICountryRepository countryRepository)
    {
        _placeRepository = placeRepository;
        _reviewRepository = reviewRepository;
        _countryRepository = countryRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlaceSummaryDto>>> GetPlaces([FromQuery] PlaceFilterDto filter)
    {
        var places = await _placeRepository.GetFilteredPlacesAsync(filter);
        var dtos = places.Select(p => new PlaceSummaryDto
        {
            Id = p.Id,
            CountryId = p.CountryId,
            CountryName = p.Country?.Name ?? string.Empty,
            CountryCode = p.Country?.Code ?? string.Empty,
            FlagEmoji = p.Country?.FlagEmoji ?? string.Empty,
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
        });

        return Ok(dtos);
    }

    [HttpGet("top-rated")]
    public async Task<ActionResult<IEnumerable<PlaceSummaryDto>>> GetTopRated([FromQuery] int count = 6)
    {
        var places = await _placeRepository.GetTopRatedPlacesAsync(count);
        var dtos = places.Select(p => new PlaceSummaryDto
        {
            Id = p.Id,
            CountryId = p.CountryId,
            CountryName = p.Country?.Name ?? string.Empty,
            CountryCode = p.Country?.Code ?? string.Empty,
            FlagEmoji = p.Country?.FlagEmoji ?? string.Empty,
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
        });

        return Ok(dtos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PlaceDetailDto>> GetPlaceById(int id)
    {
        var place = await _placeRepository.GetPlaceDetailsByIdAsync(id);
        if (place == null)
        {
            return NotFound(new { message = $"Place with ID {id} not found." });
        }

        List<string> gallery = new();
        List<string> highlights = new();

        try
        {
            if (!string.IsNullOrEmpty(place.GalleryJson))
                gallery = JsonSerializer.Deserialize<List<string>>(place.GalleryJson) ?? new();
            if (!string.IsNullOrEmpty(place.HighlightsJson))
                highlights = JsonSerializer.Deserialize<List<string>>(place.HighlightsJson) ?? new();
        }
        catch
        {
            // fallback
        }

        var dto = new PlaceDetailDto
        {
            Id = place.Id,
            CountryId = place.CountryId,
            CountryName = place.Country.Name,
            CountryCode = place.Country.Code,
            FlagEmoji = place.Country.FlagEmoji,
            Name = place.Name,
            City = place.City,
            Category = place.Category,
            Summary = place.Summary,
            Description = place.Description,
            HowToGoThere = place.HowToGoThere,
            OpeningHours = place.OpeningHours,
            BestTimeToVisit = place.BestTimeToVisit,
            RecommendedDuration = place.RecommendedDuration,
            TicketPriceUSD = place.TicketPriceUSD,
            Latitude = place.Latitude,
            Longitude = place.Longitude,
            Rating = place.Rating,
            ReviewCount = place.ReviewCount,
            ImageUrl = place.ImageUrl,
            GalleryImages = gallery,
            Highlights = highlights,
            TravelTips = place.TravelTips,
            Reviews = place.Reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                PlaceId = r.PlaceId,
                UserId = r.UserId,
                Username = r.User.Username,
                UserAvatarUrl = r.User.AvatarUrl,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList()
        };

        return Ok(dto);
    }

    [HttpPost("{id:int}/reviews")]
    [Authorize]
    public async Task<ActionResult<ReviewDto>> AddReview(int id, [FromBody] CreateReviewDto dto)
    {
        var place = await _placeRepository.GetByIdAsync(id);
        if (place == null)
        {
            return NotFound(new { message = $"Place with ID {id} not found." });
        }

        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        if (dto.Rating < 1 || dto.Rating > 5)
        {
            return BadRequest(new { message = "Rating must be between 1 and 5." });
        }

        var review = new PlaceReview
        {
            PlaceId = id,
            UserId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        var created = await _reviewRepository.AddAsync(review);

        // Update place average rating
        var allReviews = await _reviewRepository.GetReviewsByPlaceIdAsync(id);
        var reviewList = allReviews.ToList();
        place.ReviewCount = reviewList.Count;
        place.Rating = Math.Round(reviewList.Average(r => r.Rating), 1);
        await _placeRepository.UpdateAsync(place);

        return Ok(new ReviewDto
        {
            Id = created.Id,
            PlaceId = created.PlaceId,
            UserId = created.UserId,
            Username = User.Identity?.Name ?? "Explorer",
            UserAvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            Rating = created.Rating,
            Comment = created.Comment,
            CreatedAt = created.CreatedAt
        });
    }
}
