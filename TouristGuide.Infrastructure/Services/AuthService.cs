using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TouristGuide.Core.DTOs;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Interfaces;

namespace TouristGuide.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userRepository.GetByUsernameAsync(dto.Username);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Username already exists. Please choose another username.");
        }

        var existingEmail = await _userRepository.GetByEmailAsync(dto.Email);
        if (existingEmail != null)
        {
            throw new InvalidOperationException("Email address is already registered.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        var newUser = new User
        {
            Username = dto.Username.Trim(),
            Email = dto.Email.Trim().ToLower(),
            PasswordHash = passwordHash,
            FullName = string.IsNullOrWhiteSpace(dto.FullName) ? dto.Username : dto.FullName.Trim(),
            HomeCountry = dto.HomeCountry?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        var created = await _userRepository.AddAsync(newUser);
        var token = GenerateJwtToken(created);

        return new AuthResponseDto
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddDays(7),
            User = MapToUserDto(created)
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByUsernameOrEmailAsync(dto.UsernameOrEmail);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid username/email or password.");
        }

        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddDays(7),
            User = MapToUserDto(user)
        };
    }

    public async Task<UserDto?> GetUserProfileAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user == null ? null : MapToUserDto(user);
    }

    public async Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User profile not found.");
        }

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            user.FullName = dto.FullName.Trim();

        if (!string.IsNullOrWhiteSpace(dto.AvatarUrl))
            user.AvatarUrl = dto.AvatarUrl.Trim();

        if (dto.Bio != null)
            user.Bio = dto.Bio.Trim();

        if (dto.HomeCountry != null)
            user.HomeCountry = dto.HomeCountry.Trim();

        await _userRepository.UpdateAsync(user);
        return MapToUserDto(user);
    }

    public string GenerateJwtToken(User user)
    {
        var secret = _configuration["Jwt:Secret"] ?? "TouristGuideSuperSecretMasterKey2026!LongEnoughForHmacSha256Security";
        var issuer = _configuration["Jwt:Issuer"] ?? "TouristGuideAPI";
        var audience = _configuration["Jwt:Audience"] ?? "TouristGuideClient";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("FullName", user.FullName)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            Role = user.Role,
            Bio = user.Bio,
            HomeCountry = user.HomeCountry,
            CreatedAt = user.CreatedAt
        };
    }
}
