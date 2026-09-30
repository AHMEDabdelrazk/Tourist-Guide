using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace TouristGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TravelUtilitiesController : ControllerBase
{
    [HttpGet("currencies")]
    public ActionResult<object> GetCurrencyRates()
    {
        // Reference base: USD
        var rates = new Dictionary<string, decimal>
        {
            ["USD"] = 1.00m,
            ["EUR"] = 0.92m,
            ["EGP"] = 49.50m,
            ["CHF"] = 0.88m,
            ["AED"] = 3.67m,
            ["GBP"] = 0.79m,
            ["JPY"] = 152.40m
        };

        return Ok(new
        {
            baseCurrency = "USD",
            updatedAt = DateTime.UtcNow,
            rates
        });
    }

    [HttpGet("weather/{city}")]
    public ActionResult<object> GetWeatherForecast(string city)
    {
        var normalized = city.ToLower().Trim();
        var weatherData = normalized switch
        {
            "paris" => new { city = "Paris", country = "France", tempC = 21, condition = "Partly Cloudy", humidity = 58, windKmh = 14, icon = "cloud-sun" },
            "cairo" => new { city = "Cairo", country = "Egypt", tempC = 29, condition = "Sunny & Clear", humidity = 35, windKmh = 18, icon = "sun" },
            "giza" => new { city = "Giza", country = "Egypt", tempC = 30, condition = "Sunny", humidity = 32, windKmh = 16, icon = "sun" },
            "berlin" => new { city = "Berlin", country = "Germany", tempC = 19, condition = "Breezy & Mild", humidity = 62, windKmh = 22, icon = "wind" },
            "bern" => new { city = "Bern", country = "Switzerland", tempC = 17, condition = "Alpine Fresh", humidity = 65, windKmh = 10, icon = "mountain" },
            "zermatt" => new { city = "Zermatt", country = "Switzerland", tempC = 12, condition = "Clear Mountain Air", humidity = 50, windKmh = 8, icon = "cloud" },
            "abu dhabi" => new { city = "Abu Dhabi", country = "UAE", tempC = 33, condition = "Clear & Warm", humidity = 42, windKmh = 12, icon = "sun" },
            "dubai" => new { city = "Dubai", country = "UAE", tempC = 34, condition = "Sunny & Coastal Breeze", humidity = 48, windKmh = 15, icon = "sun" },
            "new york" => new { city = "New York", country = "USA", tempC = 22, condition = "Pleasant", humidity = 54, windKmh = 16, icon = "sun" },
            _ => new { city = city, country = "Global", tempC = 23, condition = "Fair", humidity = 50, windKmh = 15, icon = "sun" }
        };

        return Ok(weatherData);
    }
}
