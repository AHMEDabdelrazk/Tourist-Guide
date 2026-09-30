using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using TouristGuide.Core.DTOs;
using TouristGuide.Core.Entities;

namespace TouristGuide.Core.Interfaces;

public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}

public interface ICountryRepository : IRepository<Country>
{
    Task<IEnumerable<Country>> GetAllWithPlacesAsync();
    Task<Country?> GetWithPlacesByIdAsync(int id);
    Task<Country?> GetByCodeAsync(string code);
}

public interface IPlaceRepository : IRepository<Place>
{
    Task<IEnumerable<Place>> GetFilteredPlacesAsync(PlaceFilterDto filter);
    Task<Place?> GetPlaceDetailsByIdAsync(int id);
    Task<IEnumerable<Place>> GetTopRatedPlacesAsync(int count);
}

public interface ITripEntryRepository : IRepository<TripEntry>
{
    Task<IEnumerable<TripEntry>> GetUserTripsAsync(int userId);
    Task<TripEntry?> GetUserTripByIdAsync(int id, int userId);
    Task<TripStatsDto> GetUserTripStatsAsync(int userId);
    Task<bool> ExistsForUserAndPlaceAsync(int userId, int placeId);
}

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameOrEmailAsync(string identifier);
}

public interface IReviewRepository : IRepository<PlaceReview>
{
    Task<IEnumerable<PlaceReview>> GetReviewsByPlaceIdAsync(int placeId);
}

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserDto?> GetUserProfileAsync(int userId);
    Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    string GenerateJwtToken(User user);
}
