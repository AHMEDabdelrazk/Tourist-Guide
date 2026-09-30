using Microsoft.EntityFrameworkCore;
using TouristGuide.Core.Entities;

namespace TouristGuide.Infrastructure.Data;

public class TouristGuideDbContext : DbContext
{
    public TouristGuideDbContext(DbContextOptions<TouristGuideDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Country> Countries => Set<Country>();
    public DbSet<Place> Places => Set<Place>();
    public DbSet<TripEntry> TripEntries => Set<TripEntry>();
    public DbSet<PlaceReview> PlaceReviews => Set<PlaceReview>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User indexes & constraints
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
            entity.Property(u => u.FullName).HasMaxLength(100);
        });

        // Country indexes & constraints
        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.HasIndex(c => c.Code).IsUnique();
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Code).IsRequired().HasMaxLength(10);
            entity.Property(c => c.AverageDailyBudgetUSD).HasPrecision(10, 2);
        });

        // Place configuration
        modelBuilder.Entity<Place>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(150);
            entity.Property(p => p.TicketPriceUSD).HasPrecision(10, 2);

            entity.HasOne(p => p.Country)
                .WithMany(c => c.Places)
                .HasForeignKey(p => p.CountryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // TripEntry configuration
        modelBuilder.Entity<TripEntry>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.ActualCostUSD).HasPrecision(10, 2);

            entity.HasOne(t => t.User)
                .WithMany(u => u.Trips)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(t => t.Place)
                .WithMany(p => p.TripEntries)
                .HasForeignKey(t => t.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // PlaceReview configuration
        modelBuilder.Entity<PlaceReview>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.HasOne(r => r.Place)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
