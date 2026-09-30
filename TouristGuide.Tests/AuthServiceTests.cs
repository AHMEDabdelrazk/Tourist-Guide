using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using TouristGuide.Core.DTOs;
using TouristGuide.Infrastructure.Data;
using TouristGuide.Infrastructure.Repositories;
using TouristGuide.Infrastructure.Services;
using Xunit;

namespace TouristGuide.Tests;

public class AuthServiceTests
{
    private TouristGuideDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<TouristGuideDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new TouristGuideDbContext(options);
    }

    private IConfiguration CreateMockConfiguration()
    {
        var configMock = new Mock<IConfiguration>();
        configMock.Setup(c => c["Jwt:Secret"]).Returns("SuperSecureSecretTestKeyForOutlierEvaluation2026!");
        configMock.Setup(c => c["Jwt:Issuer"]).Returns("TouristGuideAPI");
        configMock.Setup(c => c["Jwt:Audience"]).Returns("TouristGuideClient");
        return configMock.Object;
    }

    [Fact]
    public async Task RegisterAsync_ValidDto_SuccessfullyCreatesUserAndReturnsToken()
    {
        // Arrange
        using var context = CreateInMemoryDbContext();
        var userRepo = new UserRepository(context);
        var authService = new AuthService(userRepo, CreateMockConfiguration());

        var registerDto = new RegisterDto
        {
            Username = "explorer_bob",
            Email = "bob@example.com",
            Password = "SecurePassword123!",
            FullName = "Bob Traveler",
            HomeCountry = "United States"
        };

        // Act
        var result = await authService.RegisterAsync(registerDto);

        // Assert
        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.Token));
        Assert.Equal("explorer_bob", result.User.Username);
        Assert.Equal("bob@example.com", result.User.Email);
        Assert.Equal("Bob Traveler", result.User.FullName);

        var savedUser = await userRepo.GetByUsernameAsync("explorer_bob");
        Assert.NotNull(savedUser);
        Assert.True(BCrypt.Net.BCrypt.Verify("SecurePassword123!", savedUser.PasswordHash));
    }

    [Fact]
    public async Task RegisterAsync_DuplicateUsername_ThrowsInvalidOperationException()
    {
        // Arrange
        using var context = CreateInMemoryDbContext();
        var userRepo = new UserRepository(context);
        var authService = new AuthService(userRepo, CreateMockConfiguration());

        var dto1 = new RegisterDto
        {
            Username = "traveler_one",
            Email = "one@test.com",
            Password = "Password123!",
            FullName = "User One"
        };
        await authService.RegisterAsync(dto1);

        var dto2 = new RegisterDto
        {
            Username = "traveler_one", // same username
            Email = "different@test.com",
            Password = "Password123!",
            FullName = "Another User"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => authService.RegisterAsync(dto2));
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsJwtTokenAndUserDto()
    {
        // Arrange
        using var context = CreateInMemoryDbContext();
        var userRepo = new UserRepository(context);
        var authService = new AuthService(userRepo, CreateMockConfiguration());

        var registerDto = new RegisterDto
        {
            Username = "alice_globetrotter",
            Email = "alice@example.com",
            Password = "MyPassword123!",
            FullName = "Alice Globetrotter"
        };
        await authService.RegisterAsync(registerDto);

        var loginDto = new LoginDto
        {
            UsernameOrEmail = "alice_globetrotter",
            Password = "MyPassword123!"
        };

        // Act
        var result = await authService.LoginAsync(loginDto);

        // Assert
        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.Token));
        Assert.Equal("alice_globetrotter", result.User.Username);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        using var context = CreateInMemoryDbContext();
        var userRepo = new UserRepository(context);
        var authService = new AuthService(userRepo, CreateMockConfiguration());

        var registerDto = new RegisterDto
        {
            Username = "john_doe",
            Email = "john@example.com",
            Password = "CorrectPassword123!"
        };
        await authService.RegisterAsync(registerDto);

        var loginDto = new LoginDto
        {
            UsernameOrEmail = "john_doe",
            Password = "WrongPassword999!"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => authService.LoginAsync(loginDto));
    }
}
