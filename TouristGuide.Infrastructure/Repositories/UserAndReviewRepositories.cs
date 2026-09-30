using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Interfaces;
using TouristGuide.Infrastructure.Data;

namespace TouristGuide.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(TouristGuideDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        var normalized = username.Trim().ToLower();
        return await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == normalized);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var normalized = email.Trim().ToLower();
        return await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalized);
    }

    public async Task<User?> GetByUsernameOrEmailAsync(string identifier)
    {
        var normalized = identifier.Trim().ToLower();
        return await _context.Users.FirstOrDefaultAsync(u =>
            u.Username.ToLower() == normalized || u.Email.ToLower() == normalized);
    }
}

public class ReviewRepository : BaseRepository<PlaceReview>, IReviewRepository
{
    public ReviewRepository(TouristGuideDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<PlaceReview>> GetReviewsByPlaceIdAsync(int placeId)
    {
        return await _context.PlaceReviews
            .Include(r => r.User)
            .Where(r => r.PlaceId == placeId)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }
}
