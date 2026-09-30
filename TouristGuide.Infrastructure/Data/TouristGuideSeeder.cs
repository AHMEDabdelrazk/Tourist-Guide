using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TouristGuide.Core.Entities;
using TouristGuide.Core.Enums;

namespace TouristGuide.Infrastructure.Data;

public static class TouristGuideSeeder
{
    public static async Task SeedAsync(TouristGuideDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Countries.AnyAsync())
        {
            return; // Already seeded
        }

        // 1. Seed Default Demo Users
        var demoUserPasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!");
        var user1 = new User
        {
            Username = "demo_traveler",
            Email = "demo@touristguide.com",
            PasswordHash = demoUserPasswordHash,
            FullName = "Alex Morgan",
            AvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            Role = "Explorer",
            Bio = "Passionate globetrotter on a mission to explore 50 countries. Cultural heritage & alpine hiking enthusiast.",
            HomeCountry = "United States",
            CreatedAt = DateTime.UtcNow.AddMonths(-3)
        };

        var user2 = new User
        {
            Username = "layla_wanderer",
            Email = "layla@touristguide.com",
            PasswordHash = demoUserPasswordHash,
            FullName = "Layla Al-Mansoor",
            AvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
            Role = "Local Guide",
            Bio = "Travel photographer & architecture lover based in the Middle East.",
            HomeCountry = "United Arab Emirates",
            CreatedAt = DateTime.UtcNow.AddMonths(-2)
        };

        await context.Users.AddRangeAsync(user1, user2);
        await context.SaveChangesAsync();

        // 2. Seed Countries & Places
        var countries = new List<Country>
        {
            new Country
            {
                Name = "France",
                Code = "FR",
                Continent = "Europe",
                Capital = "Paris",
                Currency = "EUR (€)",
                Language = "French",
                TimeZone = "UTC+1 (CET)",
                FlagEmoji = "🇫🇷",
                FlagImageUrl = "https://flagcdn.com/w160/fr.png",
                HeroImageUrl = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
                Description = "A timeless European jewel renowned for world-class gastronomy, haute couture, romantic riverways, architectural grandeur, and Mediterranean seaside charm.",
                BestTimeToVisit = "April to October (Spring and early Autumn offer pleasant weather and vibrant gardens)",
                EmergencyContact = "112 (European Emergency Number) / 15 (SAMU Medical)",
                AverageDailyBudgetUSD = 180m,
                Places = new List<Place>
                {
                    new Place
                    {
                        Name = "Eiffel Tower & Champ de Mars",
                        City = "Paris",
                        Category = PlaceCategory.Historical,
                        Summary = "The iconic iron lattice tower standing proudly over the Seine river, symbolizing the romance of Paris.",
                        Description = "Constructed by Gustave Eiffel for the 1889 Exposition Universelle, the Eiffel Tower rises 330 meters above Paris. Visitors can ascend to three accessible levels, enjoying panoramic views across the City of Light, dining at Michelin-starred Le Jules Verne, or relaxing on the Champ de Mars lawns during the glittering night illumination show.",
                        HowToGoThere = "Take Paris Metro Line 6 to Bir-Hakeim station or Line 9 to Trocadéro station for the best photographic viewpoint. RER C also stops directly at Champ de Mars-Tour Eiffel. From central Paris, it is a scenic 20-minute walk along the Seine river banks.",
                        BestTimeToVisit = "Late afternoon leading into sunset and evening hourly light displays",
                        RecommendedDuration = "2-3 hours",
                        OpeningHours = "09:30 - 23:45 daily",
                        TicketPriceUSD = 32.00m,
                        Latitude = 48.8584,
                        Longitude = 2.2945,
                        Rating = 4.9,
                        ReviewCount = 4280,
                        ImageUrl = "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Observation deck on 3rd level at 276m height",
                            "Hourly glittering night illumination light show",
                            "Glass floor experience on the first level",
                            "Panoramic champagne bar at the pinnacle summit"
                        }),
                        TravelTips = "Book skip-the-line elevator tickets online at least 3 weeks ahead. Trocadéro plaza across the river offers the absolute cleanest sunrise photos without crowds."
                    },
                    new Place
                    {
                        Name = "Louvre Museum",
                        City = "Paris",
                        Category = PlaceCategory.Cultural,
                        Summary = "The world's largest art museum and historic royal palace housing the Mona Lisa and Venus de Milo.",
                        Description = "Housed in a former 12th-century royal palace, the Musée du Louvre spans over 73,000 square meters containing more than 35,000 masterpieces from ancient Egyptian antiquities to Renaissance paintings, marked by I.M. Pei's famous glass pyramid centerpiece.",
                        HowToGoThere = "Directly accessible via Metro Lines 1 and 7 at Palais-Royal Musée du Louvre station. Alternatively, access via the Carrousel du Louvre underground entrance to bypass main outdoor queues.",
                        BestTimeToVisit = "Wednesday and Friday evenings when crowds disperse and lighting is magnificent",
                        RecommendedDuration = "3-5 hours",
                        OpeningHours = "09:00 - 18:00 (Closed Tuesdays, open until 21:45 Fridays)",
                        TicketPriceUSD = 24.00m,
                        Latitude = 48.8606,
                        Longitude = 2.3376,
                        Rating = 4.8,
                        ReviewCount = 3890,
                        ImageUrl = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1565099824688-e93eb20fe527?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Leonardo da Vinci's Mona Lisa in Salle des États",
                            "Winged Victory of Samothrace and Venus de Milo",
                            "Napoleon III ceremonial apartments",
                            "Iconic glass pyramid designed by I.M. Pei"
                        }),
                        TravelTips = "Timed entry reservation is mandatory even for museum pass holders. Enter through the Porte des Lions or Carrousel mall entrance to avoid the long pyramid line."
                    },
                    new Place
                    {
                        Name = "Mont-Saint-Michel Abbey",
                        City = "Normandy",
                        Category = PlaceCategory.Historical,
                        Summary = "A breathtaking medieval tidal island topped by a soaring Gothic Benedictine abbey.",
                        Description = "Perched on a rocky islet in Normandy, Mont-Saint-Michel rises majestically above swirling bay sands and tidal waters. One of France's most mesmerizing UNESCO World Heritage sites, its winding medieval alleys and soaring abbey halls evoke centuries of pilgrimage and folklore.",
                        HowToGoThere = "Take the TGV train from Paris Montparnasse to Rennes or Dol-de-Bretagne (2 hours), followed by a direct Keolis shuttle bus to Mont-Saint-Michel. Walk across the wooden bridge or catch the free Passeur shuttle from the visitor center.",
                        BestTimeToVisit = "Spring and Autumn during high tidal coefficient days (Equinoxes)",
                        RecommendedDuration = "Half day to full day",
                        OpeningHours = "09:00 - 19:00 (May to Aug), 09:30 - 18:00 (Sept to Apr)",
                        TicketPriceUSD = 16.00m,
                        Latitude = 48.6360,
                        Longitude = -1.5115,
                        Rating = 4.9,
                        ReviewCount = 2100,
                        ImageUrl = "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "The cloister hanging between sea and sky",
                            "Highest tides in continental Europe",
                            "Historic Grande Rue with quaint shops and crêperies",
                            "Nocturnal summer light and sound shows inside abbey"
                        }),
                        TravelTips = "Check tidal tables before crossing. Stay overnight on the island if budget permits to experience peaceful empty medieval streets after tour buses depart."
                    },
                    new Place
                    {
                        Name = "Palace of Versailles",
                        City = "Versailles",
                        Category = PlaceCategory.Historical,
                        Summary = "The dazzling royal residence of the Sun King Louis XIV with lavish Hall of Mirrors and vast formal gardens.",
                        Description = "The epitome of French royal splendor, Versailles showcases the pinnacle of 17th-century classical baroque art. Spanning over 800 hectares, the estate features the gilded Hall of Mirrors, the King's Grand Apartments, the Grand Trianon, and the idyllic Queen's Hamlet of Marie Antoinette.",
                        HowToGoThere = "Take RER C train from central Paris directly to Versailles Château Rive Gauche station (approx. 40 minutes). From the station, it is a direct 10-minute flat signposted walk to the palace gates.",
                        BestTimeToVisit = "May to October on Musical Gardens and Fountain Show days",
                        RecommendedDuration = "4-6 hours",
                        OpeningHours = "09:00 - 18:30 (Palace closed Mondays, Gardens open daily)",
                        TicketPriceUSD = 28.00m,
                        Latitude = 48.8049,
                        Longitude = 2.1204,
                        Rating = 4.7,
                        ReviewCount = 3120,
                        ImageUrl = "https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1582234057865-c3358056230f?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Hall of Mirrors (Galerie des Glaces) with 357 mirrors",
                            "Marie Antoinette's picturesque English-style Hamlet",
                            "Orangery and Grand Canal boating experience",
                            "Fountain Shows synchronised with Baroque classical music"
                        }),
                        TravelTips = "Rent an electric golf cart or bicycle to navigate the vast royal gardens comfortably. Palace passport ticket includes access to the Trianon palaces and Hamlet."
                    }
                }
            },
            new Country
            {
                Name = "Egypt",
                Code = "EG",
                Continent = "Africa",
                Capital = "Cairo",
                Currency = "EGP (E£)",
                Language = "Arabic",
                TimeZone = "UTC+2 / UTC+3 (EET)",
                FlagEmoji = "🇪🇬",
                FlagImageUrl = "https://flagcdn.com/w160/eg.png",
                HeroImageUrl = "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80",
                Description = "The cradle of ancient civilization, home to the awe-inspiring Pyramids, golden Pharaoh tombs along the eternal Nile river, and vibrant Red Sea coral reefs.",
                BestTimeToVisit = "October to April (Crisp winter sunshine and comfortable exploration temperatures)",
                EmergencyContact = "122 (Police) / 123 (Ambulance) / 126 (Tourist Police)",
                AverageDailyBudgetUSD = 75m,
                Places = new List<Place>
                {
                    new Place
                    {
                        Name = "Great Pyramids of Giza & Sphinx",
                        City = "Giza / Cairo",
                        Category = PlaceCategory.WonderOfTheWorld,
                        Summary = "The only surviving Wonder of the Ancient World, towering over the desert plateau for over 4,500 years.",
                        Description = "Built during the Fourth Dynasty of the Old Kingdom for Pharaohs Khufu, Khafre, and Menkaure, the Great Pyramids remain humanity's most astonishing architectural feat. Guarded by the monumental limestone Great Sphinx, the plateau offers an unforgettable glimpse into the dawn of recorded history.",
                        HowToGoThere = "Ride the Cairo Metro Line 2 to Giza or El-Mounib station, then take an authorized taxi or Uber directly to the Giza Plateau Pyramids entrance (approx. 20-30 min ride from downtown Cairo). Guided private tours with AC van transfer are widely available.",
                        BestTimeToVisit = "Early morning at 08:00 AM before heat and tour buses arrive, or late afternoon for sunset panorama",
                        RecommendedDuration = "3-4 hours",
                        OpeningHours = "07:00 - 17:00 daily (Summer until 18:00)",
                        TicketPriceUSD = 18.00m,
                        Latitude = 29.9792,
                        Longitude = 31.1342,
                        Rating = 4.9,
                        ReviewCount = 5120,
                        ImageUrl = "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Great Pyramid of Khufu (Cheops) ascending passage interior",
                            "Colossal enigmatic Great Sphinx of Giza",
                            "Panoramic desert lookout point with all 3 pyramids lined up",
                            "Solar Boat exhibit and evening Sound & Light spectacle"
                        }),
                        TravelTips = "Hire a licensed Egyptologist guide at the official ticket booth. Beware of unofficial camel touts outside; agree on fixed government-regulated rates beforehand."
                    },
                    new Place
                    {
                        Name = "Valley of the Kings",
                        City = "Luxor",
                        Category = PlaceCategory.Historical,
                        Summary = "The legendary royal necropolis carved deep into mountain valleys, holding the gold-gilded tombs of Tutankhamun and Ramesses.",
                        Description = "For a period of nearly 500 years from the 16th to 11th century BC, rock-cut tombs were excavated for the pharaohs and powerful nobles of the New Kingdom. The vivid wall paintings and astronomical ceiling frescoes look as fresh as if painted yesterday.",
                        HowToGoThere = "Fly directly into Luxor International Airport or take the Sleeper Train from Cairo. Cross the Nile River to the West Bank by ferry or bridge, then take a private taxi or organized West Bank minivan tour to the valley entrance.",
                        BestTimeToVisit = "Early morning at 06:00 AM to beat the intense midday desert heat",
                        RecommendedDuration = "3-4 hours",
                        OpeningHours = "06:00 - 17:00 daily",
                        TicketPriceUSD = 22.00m,
                        Latitude = 25.7402,
                        Longitude = 32.6014,
                        Rating = 4.9,
                        ReviewCount = 3450,
                        ImageUrl = "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Tomb of Tutankhamun (KV62) with original mummy",
                            "Tomb of Ramesses V and VI with radiant yellow astronomical ceiling",
                            "Tomb of Seti I with immaculate relief carvings",
                            "Electric tram ride through the rugged dry limestone gorge"
                        }),
                        TravelTips = "Standard general ticket covers entry to any 3 standard tombs. Tutankhamun and Seti I require separate supplementary tickets, highly worthwhile for serious history fans."
                    },
                    new Place
                    {
                        Name = "Karnak Temple Complex",
                        City = "Luxor",
                        Category = PlaceCategory.Historical,
                        Summary = "The largest religious sanctuary ever built in antiquity, dominated by the colossal Great Hypostyle Hall.",
                        Description = "Developed over 1,500 years by approximately thirty distinct pharaohs, Karnak Temple is a vast open-air complex dedicated to the Theban triad of Amun, Mut, and Khonsu. Its centerpiece is the mind-boggling Great Hypostyle Hall, featuring 134 towering sandstone columns shaped like lotus blossoms.",
                        HowToGoThere = "Located on the East Bank of Luxor, just 3 km north of downtown. Easily reachable via a 10-minute taxi ride, horse carriage, or scenic walk along the historic restored Avenue of Sphinxes.",
                        BestTimeToVisit = "Late afternoon as sunset illuminates the giant papyrus columns with golden amber light",
                        RecommendedDuration = "2-3 hours",
                        OpeningHours = "06:00 - 17:30 daily",
                        TicketPriceUSD = 16.00m,
                        Latitude = 25.7188,
                        Longitude = 32.6573,
                        Rating = 4.8,
                        ReviewCount = 2890,
                        ImageUrl = "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Great Hypostyle Hall with 134 massive columns up to 21m tall",
                            "Queen Hatshepsut's towering pink granite obelisk",
                            "Sacred Lake where ancient priests performed ritual purifications",
                            "Giant granite scarab beetle monument symbolizing regeneration"
                        }),
                        TravelTips = "Walk three times clockwise around the giant scarab statue near the sacred lake for good fortune according to ancient Egyptian superstition."
                    },
                    new Place
                    {
                        Name = "Abu Simbel Temples",
                        City = "Aswan / Lake Nasser",
                        Category = PlaceCategory.WonderOfTheWorld,
                        Summary = "Monolithic cliff temples of Ramesses II and Nefertari, miraculously saved from the rising waters of the Nile.",
                        Description = "Carved directly into mountain rock during the 13th century BC, the twin temples of Abu Simbel stand on the western bank of Lake Nasser. The facade features four colossal 20-meter seated statues of Ramesses II. In the 1960s, a UNESCO rescue mission dismantled and rebuilt the entire complex 65 meters higher onto an artificial cliff.",
                        HowToGoThere = "Take an early morning short 45-minute domestic flight from Aswan with EgyptAir, or join the organized morning road convoy/coach departing Aswan at 04:00 AM (approx. 3.5 hours drive through the Nubian desert).",
                        BestTimeToVisit = "February 22 or October 22 during the Sun Alignment phenomenon, or early mornings year-round",
                        RecommendedDuration = "2-3 hours",
                        OpeningHours = "06:00 - 17:00 daily",
                        TicketPriceUSD = 20.00m,
                        Latitude = 22.3372,
                        Longitude = 31.6258,
                        Rating = 4.9,
                        ReviewCount = 2650,
                        ImageUrl = "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Four gargantuan seated statues of Ramesses II guarding entrance",
                            "Temple of Hathor and Queen Nefertari",
                            "Sanctuary aligned so sunrise illuminates inner deities twice a year",
                            "Panoramic views over the vast blue waters of Lake Nasser"
                        }),
                        TravelTips = "Booking the round-trip flight from Aswan gives you 2 hours on site which is optimal and saves 7 hours of roundtrip desert bus driving."
                    }
                }
            },
            new Country
            {
                Name = "Germany",
                Code = "DE",
                Continent = "Europe",
                Capital = "Berlin",
                Currency = "EUR (€)",
                Language = "German",
                TimeZone = "UTC+1 (CET)",
                FlagEmoji = "🇩🇪",
                FlagImageUrl = "https://flagcdn.com/w160/de.png",
                HeroImageUrl = "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
                Description = "A powerhouse of innovative engineering, fairy-tale castles nestled in emerald alpine valleys, historic medieval towns, and dynamic cosmopolitan hubs.",
                BestTimeToVisit = "May to September for warm outdoor beer gardens & festivals, or December for magical Christmas markets",
                EmergencyContact = "112 (Fire / Ambulance) / 110 (Police)",
                AverageDailyBudgetUSD = 160m,
                Places = new List<Place>
                {
                    new Place
                    {
                        Name = "Neuschwanstein Castle",
                        City = "Füssen / Bavaria",
                        Category = PlaceCategory.Historical,
                        Summary = "The fairy-tale 19th-century Romanesque Revival castle that inspired Walt Disney's Cinderella castle.",
                        Description = "Commissioned by King Ludwig II of Bavaria as a solitary retreat and homage to composer Richard Wagner, Neuschwanstein stands atop a rugged alpine hill overlooking Hohenschwangau. Its soaring white limestone towers and theatrical interior frescoes bring medieval chivalric romance to life.",
                        HowToGoThere = "Take the regional DB train from Munich Hauptbahnhof to Füssen (approx. 2 hours), followed by bus 73 or 78 to Hohenschwangau village. From the ticket center, walk 30 minutes up the paved hill, ride a horse carriage, or take the shuttle bus up to Marienbrücke bridge.",
                        BestTimeToVisit = "Autumn when Bavarian Alpine forests turn vibrant copper and gold",
                        RecommendedDuration = "Half day (3-4 hours)",
                        OpeningHours = "09:00 - 18:00 (April to mid-October), 10:00 - 16:00 (Winter)",
                        TicketPriceUSD = 21.00m,
                        Latitude = 47.5576,
                        Longitude = 10.7498,
                        Rating = 4.8,
                        ReviewCount = 3890,
                        ImageUrl = "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "View from Marienbrücke (Mary's Bridge) spanning Pöllat Gorge",
                            "Singers' Hall and Byzantine-inspired Throne Room",
                            "Artificial Grotto complete with stalactites and subtle lighting",
                            "Dramatic views of the Alpsee lake and Bavarian Alps"
                        }),
                        TravelTips = "Timed entry tickets sell out weeks in advance. If visiting Marienbrücke, wear sturdy footwear as the wooden planks can be slippery in morning mist."
                    },
                    new Place
                    {
                        Name = "Brandenburg Gate & Reichstag",
                        City = "Berlin",
                        Category = PlaceCategory.Historical,
                        Summary = "The historic symbol of German unity and freedom, flanked by the glass-domed Reichstag parliament.",
                        Description = "Commissioned by Prussian King Frederick William II in 1791, the Brandenburg Gate has witnessed Napoleon's marches, Cold War division as part of the Berlin Wall buffer, and ecstatic celebrations during reunification in 1989. Just steps away, the restored Reichstag building features Norman Foster's famous public glass dome.",
                        HowToGoThere = "Take Berlin S-Bahn (S1, S2, S25, S26) or U-Bahn (U5) directly to Brandenburger Tor station. Accessible on foot from Unter den Linden or the Memorial to the Murdered Jews of Europe.",
                        BestTimeToVisit = "Evening when the neoclassical columns are dramatically illuminated",
                        RecommendedDuration = "2-3 hours",
                        OpeningHours = "Brandenburg Gate: 24/7 outdoors; Reichstag Dome: 08:00 - 24:00 (advance booking required)",
                        TicketPriceUSD = 0.00m,
                        Latitude = 52.5163,
                        Longitude = 13.3777,
                        Rating = 4.8,
                        ReviewCount = 4120,
                        ImageUrl = "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Quadriga sculpture of Goddess Victoria steering her four-horse chariot",
                            "Norman Foster's spiral glass dome offering 360-degree Berlin skyline views",
                            "Direct proximity to Tiergarten park and Holocaust Memorial",
                            "Historic Pariser Platz gathering square"
                        }),
                        TravelTips = "Reichstag glass dome entry is completely free of charge, but you MUST register your passport details online in advance on the official Bundestag portal."
                    },
                    new Place
                    {
                        Name = "Cologne Cathedral (Kölner Dom)",
                        City = "Cologne",
                        Category = PlaceCategory.Historical,
                        Summary = "A masterwork of High Gothic architecture boasting twin 157-meter spires and the Shrine of the Three Kings.",
                        Description = "Dominating the Cologne skyline right next to the Rhine River, this gargantuan cathedral took over 630 years to complete (from 1248 to 1880). Surviving 14 aerial bomb hits in WWII, it houses the legendary gold reliquary shrine containing the purported relics of the Biblical Three Wise Men.",
                        HowToGoThere = "Conveniently located literally directly outside the main exit doors of Köln Hauptbahnhof (Cologne Central Railway Station). ICE high-speed trains connect from Frankfurt or Düsseldorf in under an hour.",
                        BestTimeToVisit = "Midday when sunbeams filter through modern stained-glass windows by Gerhard Richter",
                        RecommendedDuration = "1.5 - 2.5 hours",
                        OpeningHours = "06:00 - 20:00 daily (Cathedral floor free; tower climb 09:00 - 17:00)",
                        TicketPriceUSD = 6.00m,
                        Latitude = 50.9413,
                        Longitude = 6.9583,
                        Rating = 4.9,
                        ReviewCount = 3780,
                        ImageUrl = "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Twin Gothic spires rising 157 meters into the sky",
                            "Golden Shrine of the Three Kings by Nicholas of Verdun",
                            "533-step tower climb rewarding climbers with Rhine River vistas",
                            "Gerhard Richter's 11,263 colored-square pixelated stained glass window"
                        }),
                        TravelTips = "Walk across the Hohenzollern Bridge covered in thousands of romantic love locks for the classic postcard photo of the cathedral framed by the river."
                    }
                }
            },
            new Country
            {
                Name = "Switzerland",
                Code = "CH",
                Continent = "Europe",
                Capital = "Bern",
                Currency = "CHF (Fr.)",
                Language = "German / French / Italian / Romansh",
                TimeZone = "UTC+1 (CET)",
                FlagEmoji = "🇨🇭",
                FlagImageUrl = "https://flagcdn.com/w160/ch.png",
                HeroImageUrl = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
                Description = "A paradise of dramatic snow-capped alpine peaks, crystal-clear turquoise lakes, world-class precision rail journeys, and charming chalet villages.",
                BestTimeToVisit = "June to September for alpine wildflowers & hiking; December to March for world-class skiing",
                EmergencyContact = "112 (General) / 144 (Ambulance) / 1414 (REGA Mountain Air Rescue)",
                AverageDailyBudgetUSD = 240m,
                Places = new List<Place>
                {
                    new Place
                    {
                        Name = "Matterhorn & Zermatt",
                        City = "Zermatt / Valais",
                        Category = PlaceCategory.Nature,
                        Summary = "The jewel of the Swiss Alps, an iconic pyramid-shaped mountain towering above the car-free village of Zermatt.",
                        Description = "Rising 4,478 meters, the Matterhorn is one of the world's most recognizable summits and the symbol of Toblerone chocolate. Nestled at its base, the car-free ski haven of Zermatt charms visitors with traditional wooden chalets, horse-drawn sleighs, and access to Europe's highest mountain railway.",
                        HowToGoThere = "Zermatt is strictly car-free. Drive to Täsch and board the shuttle train (running every 20 min, 12 min ride), or take the scenic SBB train from Zurich or Geneva via Visp. From Zermatt, ride the Gornergrat cogwheel train up to 3,089m.",
                        BestTimeToVisit = "July to September for crystal reflection hikes, or January to March for winter skiing",
                        RecommendedDuration = "1 to 2 days",
                        OpeningHours = "Gornergrat train runs 07:00 - 19:00 daily year-round",
                        TicketPriceUSD = 95.00m,
                        Latitude = 45.9763,
                        Longitude = 7.7491,
                        Rating = 5.0,
                        ReviewCount = 4780,
                        ImageUrl = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Riffelsee mirror reflection of the Matterhorn peak",
                            "Gornergrat Railway cogwheel ascent across alpine gorges",
                            "Matterhorn Glacier Paradise - Europe's highest cable car station at 3,883m",
                            "Traditional fondue dining in historic Hinterdorf street"
                        }),
                        TravelTips = "Get off at Rotenboden station on the Gornergrat train and take an easy 10-minute walk down to Lake Riffelsee on calm mornings for the legendary mirrored reflection photo."
                    },
                    new Place
                    {
                        Name = "Jungfraujoch - Top of Europe",
                        City = "Interlaken / Bernese Oberland",
                        Category = PlaceCategory.Adventure,
                        Summary = "Europe's highest-altitude railway station at 3,454m, perched amidst the Aletsch Glacier and ice palace.",
                        Description = "An extraordinary engineering marvel opened in 1912, the Jungfrau Railway tunnels through the Eiger and Mönch mountains before emerging onto the saddle of Jungfraujoch. Visitors walk inside an authentic Ice Palace carved inside the glacier and step onto the Sphinx Observatory viewing terrace overlooking the UNESCO-listed Great Aletsch Glacier.",
                        HowToGoThere = "Depart from Interlaken Ost train station to Grindelwald Terminal, board the ultra-modern Eiger Express tricable gondola to Eigergletscher station, then connect to the historic Jungfrau cogwheel train directly to the summit (total trip time under 90 minutes).",
                        BestTimeToVisit = "Year-round; clear sunny winter or summer days provide 100km visibility over the Black Forest and Vosges",
                        RecommendedDuration = "Full day (5-6 hours)",
                        OpeningHours = "First train departs ~07:30, last descent ~16:45",
                        TicketPriceUSD = 180.00m,
                        Latitude = 46.5475,
                        Longitude = 7.9822,
                        Rating = 4.9,
                        ReviewCount = 3890,
                        ImageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Sphinx Observation Terrace at 3,571m elevation",
                            "Great Aletsch Glacier - the longest glacier in the Alps (23 km)",
                            "Magical Ice Palace tunnel labyrinth carved into blue glacial ice",
                            "Lindt Swiss Chocolate Heaven experience store at altitude"
                        }),
                        TravelTips = "Swiss Travel Pass holders receive a 25% discount. Always check live webcams at Interlaken station before buying tickets to ensure zero cloud obstruction at the peak."
                    },
                    new Place
                    {
                        Name = "Lauterbrunnen Valley & Waterfalls",
                        City = "Lauterbrunnen",
                        Category = PlaceCategory.Nature,
                        Summary = "The valley of 72 waterfalls nestled between sheer 300-meter vertical limestone cliffs that inspired Tolkien's Rivendell.",
                        Description = "Lauterbrunnen is tucked into one of the most impressive U-shaped glacial valleys in the Alps. Staubbach Falls plunges almost 300 meters from an overhanging cliff right beside traditional chalet houses, while the subterranean Trümmelbach Falls churn up to 20,000 liters of glacial meltwater per second through cavernous rock chasms.",
                        HowToGoThere = "Take the Bernese Oberland Railway (BOB) train from Interlaken Ost directly to Lauterbrunnen station in just 20 minutes. Trains operate every 30 minutes.",
                        BestTimeToVisit = "May to June when snowmelt creates maximum cascading waterfall force",
                        RecommendedDuration = "3-5 hours",
                        OpeningHours = "Valley outdoors 24/7; Trümmelbach Falls: 09:00 - 17:00 (April to Nov)",
                        TicketPriceUSD = 15.00m,
                        Latitude = 46.5935,
                        Longitude = 7.9079,
                        Rating = 4.9,
                        ReviewCount = 4210,
                        ImageUrl = "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Staubbach Falls illuminated at night",
                            "Subterranean Trümmelbach Falls accessed via mountain elevator",
                            "Scenic cableway connection up to cliffside village of Mürren",
                            "Inspiration for J.R.R. Tolkien's elven haven of Rivendell"
                        }),
                        TravelTips = "Rent an e-bike at Lauterbrunnen station to effortlessly cruise the flat valley trail all the way to Stechelberg while gazing up at cascading waterfalls."
                    }
                }
            },
            new Country
            {
                Name = "United States",
                Code = "US",
                Continent = "North America",
                Capital = "Washington, D.C.",
                Currency = "USD ($)",
                Language = "English",
                TimeZone = "UTC-5 to UTC-8 (EST to PST)",
                FlagEmoji = "🇺🇸",
                FlagImageUrl = "https://flagcdn.com/w160/us.png",
                HeroImageUrl = "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80",
                Description = "A continent-spanning nation of awe-inspiring national parks, glittering metropolis skylines, coastal highways, and vibrant multicultural heritage.",
                BestTimeToVisit = "Spring (April-May) and Autumn (September-October) for pleasant national park and city travel",
                EmergencyContact = "911",
                AverageDailyBudgetUSD = 220m,
                Places = new List<Place>
                {
                    new Place
                    {
                        Name = "Grand Canyon National Park",
                        City = "Arizona",
                        Category = PlaceCategory.WonderOfTheWorld,
                        Summary = "An immense 277-mile geological canyon carved over billions of years by the Colorado River.",
                        Description = "One of the greatest natural wonders on Earth, the Grand Canyon reveals millions of years of Earth's geological history across exposed red rock strata. South Rim overlooks offer breathtaking vistas plunging over a mile straight down to the meandering Colorado River.",
                        HowToGoThere = "Fly into Phoenix Sky Harbor (PHX) or Las Vegas Harry Reid (LAS) and drive 3.5 to 4.5 hours. Scenic flights and tour bus coaches depart daily from Las Vegas directly to both South and West Rims.",
                        BestTimeToVisit = "September to November or March to May when temperatures are mild and crowds manageable",
                        RecommendedDuration = "1 to 2 days",
                        OpeningHours = "South Rim open 24 hours a day, 365 days a year",
                        TicketPriceUSD = 35.00m,
                        Latitude = 36.0544,
                        Longitude = -112.1401,
                        Rating = 5.0,
                        ReviewCount = 5900,
                        ImageUrl = "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Mather Point and Hopi Point sunrise/sunset panoramas",
                            "Bright Angel Trail day hike down toward Indian Garden",
                            "Free Hermit Road scenic shuttle bus route",
                            "Helicopter flight over Dragon Corridor"
                        }),
                        TravelTips = "Take the park's free shuttle bus system to avoid traffic. Bring at least 2 liters of water per person even for short rim walks due to low humidity."
                    },
                    new Place
                    {
                        Name = "Statue of Liberty & Manhattan Skyline",
                        City = "New York City",
                        Category = PlaceCategory.Historical,
                        Summary = "The universal beacon of freedom standing at New York Harbor with sweeping views of the Manhattan skyline.",
                        Description = "A gift of friendship from the people of France to the United States in 1886, Lady Liberty stands 93 meters tall on Liberty Island. The ferry voyage includes access to the Ellis Island National Museum of Immigration, where over 12 million newcomers entered the nation.",
                        HowToGoThere = "Take NYC Subway (1 to South Ferry, 4/5 to Bowling Green, or R/W to Whitehall St). Board the official Statue City Cruises ferry from Battery Park. (Do not buy tickets from street vendors outside).",
                        BestTimeToVisit = "Early morning on the first ferry departure at 09:00 AM",
                        RecommendedDuration = "3-5 hours",
                        OpeningHours = "09:00 - 17:00 daily (ferries run every 20-30 min)",
                        TicketPriceUSD = 25.50m,
                        Latitude = 40.6892,
                        Longitude = -74.0445,
                        Rating = 4.8,
                        ReviewCount = 5200,
                        ImageUrl = "https://images.unsplash.com/photo-1503572327579-b5c6afe5c5c5?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Statue of Liberty Museum and original torch gallery",
                            "Pedestal and Crown climb observation vistas",
                            "Ellis Island Great Hall and passenger search archives",
                            "Waterfront views of Lower Manhattan and One World Trade"
                        }),
                        TravelTips = "Crown access tickets must be reserved months in advance directly through Statue City Cruises. The Staten Island Ferry offers a free distant view if you're on a tight budget."
                    },
                    new Place
                    {
                        Name = "Golden Gate Bridge",
                        City = "San Francisco / California",
                        Category = PlaceCategory.Historical,
                        Summary = "The world-famous International Orange suspension bridge spanning the entrance to San Francisco Bay.",
                        Description = "Completed in 1937 against monumental tidal engineering challenges, the Golden Gate Bridge spans 1.7 miles across the Pacific strait. Framed by rolling coastal fog and the rugged Marin Headlands, it is celebrated as an Art Deco engineering masterpiece.",
                        HowToGoThere = "Ride the San Francisco Muni Bus 28 or Presidio GO Shuttle directly to the Golden Gate Bridge Welcome Center. Better yet, rent a bicycle at Fisherman's Wharf and pedal across the bridge to Sausalito, returning by scenic ferry.",
                        BestTimeToVisit = "Mid-afternoon when Karl the Fog often lifts to reveal crystal blue skies and orange towers",
                        RecommendedDuration = "2-3 hours",
                        OpeningHours = "Pedestrian walkway open daylight hours (approx. 05:00 - 18:30 / 21:00 Daylight Savings)",
                        TicketPriceUSD = 0.00m,
                        Latitude = 37.8199,
                        Longitude = -122.4783,
                        Rating = 4.9,
                        ReviewCount = 4870,
                        ImageUrl = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Walking or bicycling 1.7 miles suspended 220 feet above Pacific waters",
                            "Hawk Hill and Battery Spencer panoramic viewpoints in Marin Headlands",
                            "Fort Point Civil War brick bastion directly beneath southern arch",
                            "Welcome Center historical exhibits and original cable cross-sections"
                        }),
                        TravelTips = "Dress in layers! Pacific maritime winds can make the bridge very chilly even when downtown San Francisco feels warm and sunny."
                    }
                }
            },
            new Country
            {
                Name = "United Arab Emirates",
                Code = "AE",
                Continent = "Asia / Middle East",
                Capital = "Abu Dhabi",
                Currency = "AED (د.إ)",
                Language = "Arabic / English widely spoken",
                TimeZone = "UTC+4 (GST)",
                FlagEmoji = "🇦🇪",
                FlagImageUrl = "https://flagcdn.com/w160/ae.png",
                HeroImageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
                Description = "A futuristic oasis blending ultra-modern architecture, luxurious hospitality, ancient Arabian desert heritage, and gleaming Persian Gulf coastlines.",
                BestTimeToVisit = "November to March (Pleasant 24°C - 28°C sunny beach and desert weather)",
                EmergencyContact = "999 (Police) / 998 (Ambulance) / 997 (Fire)",
                AverageDailyBudgetUSD = 210m,
                Places = new List<Place>
                {
                    new Place
                    {
                        Name = "Burj Khalifa & Dubai Fountain",
                        City = "Dubai",
                        Category = PlaceCategory.WonderOfTheWorld,
                        Summary = "The tallest structure on the planet rising 828m into the sky, paired with dancing choreographed fountains.",
                        Description = "Piercing the desert sky at an astonishing 828 meters (2,716.5 feet), Burj Khalifa is humanity's highest triumph of skyscraper engineering. High-speed double-deck elevators whisk visitors to the At The Top observatory on levels 124, 125, and the 148th Sky level at 555m, overlooking the Dubai Fountain lake.",
                        HowToGoThere = "Ride the Dubai Metro Red Line directly to Burj Khalifa / Dubai Mall station. An air-conditioned covered travelator footbridge connects you directly into the Dubai Mall, where the Burj Khalifa ticket concourse is located on the Lower Ground level.",
                        BestTimeToVisit = "Sunset slots (16:30 - 18:30) to see both day, sunset glow, and night city lights",
                        RecommendedDuration = "2-3 hours",
                        OpeningHours = "08:30 - 23:00 daily",
                        TicketPriceUSD = 45.00m,
                        Latitude = 25.1972,
                        Longitude = 55.2744,
                        Rating = 4.9,
                        ReviewCount = 6100,
                        ImageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Observation decks on floors 124, 125 and luxury lounge at floor 148",
                            "World's fastest double-deck elevators traveling at 10m/second",
                            "Choreographed Dubai Fountain show shooting water 150m high every 30 minutes",
                            "Interactive high-tech multimedia presentation of Dubai's history"
                        }),
                        TravelTips = "Sunset observation tickets sell out days in advance. Watching the Dubai Fountain show from the Apple Store balcony in Dubai Mall provides an elevated prime viewpoint for free."
                    },
                    new Place
                    {
                        Name = "Sheikh Zayed Grand Mosque",
                        City = "Abu Dhabi",
                        Category = PlaceCategory.Cultural,
                        Summary = "One of the world's most magnificent mosques, crafted in pure Macedonian white marble with 82 domes and 24-carat gold chandeliers.",
                        Description = "Conceived by the UAE's founding father Sheikh Zayed bin Sultan Al Nahyan, this architectural masterpiece unites Islamic architectural styles from the Ottoman, Mamluk, and Fatimid eras. Its prayer hall accommodates over 40,000 worshippers, featuring the world's largest hand-knotted Iranian carpet and colossal Swarovski crystal chandeliers.",
                        HowToGoThere = "Located at the entrance to Abu Dhabi Island. From Dubai, take an authorized intercity coach (E100 or E101) to Abu Dhabi central station (90 min) and then a 15-minute taxi, or book a direct day tour from Dubai with hotel pickup.",
                        BestTimeToVisit = "Late afternoon around 17:00 to catch golden hour sunlight reflecting off the white marble and evening lunar illumination",
                        RecommendedDuration = "2-3 hours",
                        OpeningHours = "09:00 - 22:00 (Saturday - Thursday), 15:00 - 22:00 (Fridays)",
                        TicketPriceUSD = 0.00m,
                        Latitude = 24.4128,
                        Longitude = 54.4750,
                        Rating = 5.0,
                        ReviewCount = 5400,
                        ImageUrl = "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1512632570417-a60008d1c83d?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "World's largest hand-knotted wool carpet measuring 5,627 sq meters",
                            "Third-largest chandelier in the world adorned with millions of Swarovski crystals",
                            "Reflective water pools mirroring the iconic onion domes and arches",
                            "Unique lunar illumination system that changes color with the phases of the moon"
                        }),
                        TravelTips = "Entry is completely free, but online booking of a visitor access QR code is recommended. Modest dress code is strictly enforced (abayas and headscarves are provided or available)."
                    },
                    new Place
                    {
                        Name = "Louvre Abu Dhabi",
                        City = "Abu Dhabi / Saadiyat Island",
                        Category = PlaceCategory.Cultural,
                        Summary = "Jean Nouvel's floating museum city topped by a soaring geometric silver dome creating a Rain of Light.",
                        Description = "The first universal museum in the Arab world, Louvre Abu Dhabi is situated in the cultural district of Saadiyat Island. Pritzker Prize-winning architect Jean Nouvel designed a breathtaking 180-meter dome composed of 7,850 unique metal stars, filtering sunlight into a poetic 'Rain of Light' onto white seaside pavilions.",
                        HowToGoThere = "Take public Bus 94 from Abu Dhabi Central Bus Station directly to the museum entrance, or hail an Uber/Careem. From Dubai Marina, it is a comfortable 65-minute drive down the E11 highway.",
                        BestTimeToVisit = "Tuesdays to Thursdays in the afternoon, ending with kayak tour around the museum at sunset",
                        RecommendedDuration = "3-4 hours",
                        OpeningHours = "10:00 - midnight (galleries close at 18:30 weekdays, 20:30 weekends; closed Mondays)",
                        TicketPriceUSD = 17.50m,
                        Latitude = 24.5337,
                        Longitude = 54.3983,
                        Rating = 4.8,
                        ReviewCount = 3120,
                        ImageUrl = "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=900&q=80",
                        GalleryJson = JsonSerializer.Serialize(new[] {
                            "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80"
                        }),
                        HighlightsJson = JsonSerializer.Serialize(new[] {
                            "Futuristic 180-meter dome casting Jean Nouvel's famous 'Rain of Light'",
                            "Masterpieces spanning 12 chapters of human civilization across cultures",
                            "Sunset sea kayak tours paddling beneath the floating dome structure",
                            "Outdoor oceanfront café overlooking the Arabian Gulf"
                        }),
                        TravelTips = "Download the free Louvre Abu Dhabi app for multimedia audio tours in 7 languages before your visit. You can also book a guided night sea kayaking tour around the museum."
                    }
                }
            }
        };

        await context.Countries.AddRangeAsync(countries);
        await context.SaveChangesAsync();

        // 3. Seed Initial User Trip Entries & Reviews for demo user
        var eiffelTower = await context.Places.FirstOrDefaultAsync(p => p.Name.Contains("Eiffel"));
        var pyramids = await context.Places.FirstOrDefaultAsync(p => p.Name.Contains("Pyramids"));
        var matterhorn = await context.Places.FirstOrDefaultAsync(p => p.Name.Contains("Matterhorn"));
        var burj = await context.Places.FirstOrDefaultAsync(p => p.Name.Contains("Burj Khalifa"));
        var neuschwanstein = await context.Places.FirstOrDefaultAsync(p => p.Name.Contains("Neuschwanstein"));

        if (eiffelTower != null && pyramids != null && matterhorn != null && burj != null)
        {
            var tripEntries = new List<TripEntry>
            {
                new TripEntry
                {
                    UserId = user1.Id,
                    PlaceId = eiffelTower.Id,
                    Status = TripStatus.Visited,
                    VisitDate = DateTime.UtcNow.AddMonths(-1),
                    Notes = "Absolutely magical experience at sunset! We had champagne on the top floor and watched the twinkling lights over the Seine.",
                    UserRating = 5,
                    ActualCostUSD = 240m,
                    TravelMode = "Metro",
                    TravelBuddy = "Partner"
                },
                new TripEntry
                {
                    UserId = user1.Id,
                    PlaceId = pyramids.Id,
                    Status = TripStatus.Visited,
                    VisitDate = DateTime.UtcNow.AddMonths(-2),
                    Notes = "Standing in front of the Great Sphinx is humbling beyond words. Woke up at 6am to beat the crowd and had the plateau to ourselves.",
                    UserRating = 5,
                    ActualCostUSD = 180m,
                    TravelMode = "Private Van",
                    TravelBuddy = "Solo"
                },
                new TripEntry
                {
                    UserId = user1.Id,
                    PlaceId = matterhorn.Id,
                    Status = TripStatus.Planned,
                    VisitDate = DateTime.UtcNow.AddMonths(2),
                    Notes = "Gornergrat railway booked! Planning to hike down to Riffelsee lake for the iconic reflection photo.",
                    UserRating = null,
                    ActualCostUSD = 450m,
                    TravelMode = "Scenic Train",
                    TravelBuddy = "Friends"
                },
                new TripEntry
                {
                    UserId = user1.Id,
                    PlaceId = burj.Id,
                    Status = TripStatus.BucketList,
                    VisitDate = null,
                    Notes = "Want to visit Level 148 lounge and dine overlooking the dancing fountains.",
                    UserRating = null,
                    ActualCostUSD = 300m,
                    TravelMode = "Flight",
                    TravelBuddy = "Family"
                }
            };

            await context.TripEntries.AddRangeAsync(tripEntries);

            var reviews = new List<PlaceReview>
            {
                new PlaceReview
                {
                    PlaceId = eiffelTower.Id,
                    UserId = user1.Id,
                    Rating = 5,
                    Comment = "Breathtaking from every angle! Trocadero at sunrise is unbeatable for photographers.",
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                },
                new PlaceReview
                {
                    PlaceId = pyramids.Id,
                    UserId = user1.Id,
                    Rating = 5,
                    Comment = "Words cannot describe the sheer scale. A must-see before you die.",
                    CreatedAt = DateTime.UtcNow.AddMonths(-2)
                },
                new PlaceReview
                {
                    PlaceId = burj.Id,
                    UserId = user2.Id,
                    Rating = 5,
                    Comment = "A marvel of human engineering! Make sure to book sunset slots.",
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                }
            };

            await context.PlaceReviews.AddRangeAsync(reviews);
            await context.SaveChangesAsync();
        }
    }
}
