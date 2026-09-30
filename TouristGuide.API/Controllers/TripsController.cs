using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TouristGuide.Core.DTOs;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Enums;
using TouristGuide.Core.Interfaces;

namespace TouristGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TripsController : ControllerBase
{
    private readonly ITripEntryRepository _tripRepository;
    private readonly IPlaceRepository _placeRepository;

    public TripsController(ITripEntryRepository tripRepository, IPlaceRepository placeRepository)
    {
        _tripRepository = tripRepository;
        _placeRepository = placeRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripEntryDto>>> GetUserTrips()
    {
        var userId = GetCurrentUserId();
        var trips = await _tripRepository.GetUserTripsAsync(userId);

        var dtos = trips.Select(t => new TripEntryDto
        {
            Id = t.Id,
            UserId = t.UserId,
            PlaceId = t.PlaceId,
            PlaceName = t.Place?.Name ?? string.Empty,
            City = t.Place?.City ?? string.Empty,
            CountryId = t.Place?.CountryId ?? 0,
            CountryName = t.Place?.Country?.Name ?? string.Empty,
            CountryCode = t.Place?.Country?.Code ?? string.Empty,
            FlagEmoji = t.Place?.Country?.FlagEmoji ?? string.Empty,
            ImageUrl = t.Place?.ImageUrl ?? string.Empty,
            CategoryName = t.Place?.Category.ToString() ?? string.Empty,
            Status = t.Status,
            VisitDate = t.VisitDate,
            Notes = t.Notes,
            UserRating = t.UserRating,
            ActualCostUSD = t.ActualCostUSD,
            TravelMode = t.TravelMode,
            TravelBuddy = t.TravelBuddy,
            CreatedAt = t.CreatedAt
        });

        return Ok(dtos);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<TripStatsDto>> GetUserTripStats()
    {
        var userId = GetCurrentUserId();
        var stats = await _tripRepository.GetUserTripStatsAsync(userId);
        return Ok(stats);
    }

    [HttpPost]
    public async Task<ActionResult<TripEntryDto>> AddToTrips([FromBody] CreateTripEntryDto dto)
    {
        var userId = GetCurrentUserId();

        var place = await _placeRepository.GetPlaceDetailsByIdAsync(dto.PlaceId);
        if (place == null)
        {
            return NotFound(new { message = $"Place with ID {dto.PlaceId} not found." });
        }

        // Allow multiple entries if visited on different dates or check existing
        var trip = new TripEntry
        {
            UserId = userId,
            PlaceId = dto.PlaceId,
            Status = dto.Status,
            VisitDate = dto.VisitDate ?? (dto.Status == TripStatus.Visited ? DateTime.UtcNow : null),
            Notes = dto.Notes?.Trim(),
            UserRating = dto.UserRating,
            ActualCostUSD = dto.ActualCostUSD ?? place.TicketPriceUSD,
            TravelMode = dto.TravelMode ?? "Flight",
            TravelBuddy = dto.TravelBuddy ?? "Solo",
            CreatedAt = DateTime.UtcNow
        };

        var created = await _tripRepository.AddAsync(trip);

        return Ok(new TripEntryDto
        {
            Id = created.Id,
            UserId = created.UserId,
            PlaceId = place.Id,
            PlaceName = place.Name,
            City = place.City,
            CountryId = place.CountryId,
            CountryName = place.Country.Name,
            CountryCode = place.Country.Code,
            FlagEmoji = place.Country.FlagEmoji,
            ImageUrl = place.ImageUrl,
            CategoryName = place.Category.ToString(),
            Status = created.Status,
            VisitDate = created.VisitDate,
            Notes = created.Notes,
            UserRating = created.UserRating,
            ActualCostUSD = created.ActualCostUSD,
            TravelMode = created.TravelMode,
            TravelBuddy = created.TravelBuddy,
            CreatedAt = created.CreatedAt
        });
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TripEntryDto>> UpdateTrip(int id, [FromBody] UpdateTripEntryDto dto)
    {
        var userId = GetCurrentUserId();
        var trip = await _tripRepository.GetUserTripByIdAsync(id, userId);
        if (trip == null)
        {
            return NotFound(new { message = $"Trip record with ID {id} not found." });
        }

        trip.Status = dto.Status;
        trip.VisitDate = dto.VisitDate;
        trip.Notes = dto.Notes?.Trim();
        trip.UserRating = dto.UserRating;
        trip.ActualCostUSD = dto.ActualCostUSD;
        trip.TravelMode = dto.TravelMode ?? trip.TravelMode;
        trip.TravelBuddy = dto.TravelBuddy ?? trip.TravelBuddy;

        await _tripRepository.UpdateAsync(trip);

        return Ok(new TripEntryDto
        {
            Id = trip.Id,
            UserId = trip.UserId,
            PlaceId = trip.PlaceId,
            PlaceName = trip.Place.Name,
            City = trip.Place.City,
            CountryId = trip.Place.CountryId,
            CountryName = trip.Place.Country.Name,
            CountryCode = trip.Place.Country.Code,
            FlagEmoji = trip.Place.Country.FlagEmoji,
            ImageUrl = trip.Place.ImageUrl,
            CategoryName = trip.Place.Category.ToString(),
            Status = trip.Status,
            VisitDate = trip.VisitDate,
            Notes = trip.Notes,
            UserRating = trip.UserRating,
            ActualCostUSD = trip.ActualCostUSD,
            TravelMode = trip.TravelMode,
            TravelBuddy = trip.TravelBuddy,
            CreatedAt = trip.CreatedAt
        });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTrip(int id)
    {
        var userId = GetCurrentUserId();
        var trip = await _tripRepository.GetUserTripByIdAsync(id, userId);
        if (trip == null)
        {
            return NotFound(new { message = $"Trip entry with ID {id} not found." });
        }

        await _tripRepository.DeleteAsync(trip);
        return NoContent();
    }

    private int GetCurrentUserId()
    {
        var val = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(val) || !int.TryParse(val, out var id))
        {
            throw new UnauthorizedAccessException("User identification token is missing or invalid.");
        }
        return id;
    }
}
