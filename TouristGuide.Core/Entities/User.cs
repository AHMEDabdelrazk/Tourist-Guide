using System;
using System.Collections.Generic;

namespace TouristGuide.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
    public string Role { get; set; } = "Traveler";
    public string? Bio { get; set; }
    public string? HomeCountry { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TripEntry> Trips { get; set; } = new List<TripEntry>();
    public ICollection<PlaceReview> Reviews { get; set; } = new List<PlaceReview>();
}
