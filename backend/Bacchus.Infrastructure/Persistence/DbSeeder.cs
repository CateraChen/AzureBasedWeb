using Bacchus.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Bacchus.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(BaccDbContext db)
    {
        if (await db.Products.AnyAsync())
            return;

        var products = new List<Product>
        {
            // ── Red ──────────────────────────────────────────────────────────
            Product.Create(
                name: "Penfolds Bin 389 Cabernet Shiraz 2021",
                wineType: "Red",
                varietal: "Cabernet Sauvignon / Shiraz",
                region: "South Australia",
                winery: "Penfolds",
                vintage: 2021,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 48,
                ratingScore: 95m),

            Product.Create(
                name: "Henschke Hill of Grace Shiraz 2018",
                wineType: "Red",
                varietal: "Shiraz",
                region: "Eden Valley",
                winery: "Henschke",
                vintage: 2018,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "LowStock",
                stockCases: 4,
                ratingScore: 98m),

            Product.Create(
                name: "Torbreck The Laird Shiraz 2019",
                wineType: "Red",
                varietal: "Shiraz",
                region: "Barossa Valley",
                winery: "Torbreck",
                vintage: 2019,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 12,
                ratingScore: 96m),

            Product.Create(
                name: "Mount Mary Quintet 2020",
                wineType: "Red",
                varietal: "Cabernet Blend",
                region: "Yarra Valley",
                winery: "Mount Mary",
                vintage: 2020,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 20,
                ratingScore: 94m),

            Product.Create(
                name: "Jim Barry The Armagh Shiraz 2020",
                wineType: "Red",
                varietal: "Shiraz",
                region: "Clare Valley",
                winery: "Jim Barry",
                vintage: 2020,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 30,
                ratingScore: 96m),

            Product.Create(
                name: "Elderton Command Shiraz 2019",
                wineType: "Red",
                varietal: "Shiraz",
                region: "Barossa Valley",
                winery: "Elderton",
                vintage: 2019,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 24,
                ratingScore: 93m),

            Product.Create(
                name: "Wynns John Riddoch Cabernet Sauvignon 2018",
                wineType: "Red",
                varietal: "Cabernet Sauvignon",
                region: "Coonawarra",
                winery: "Wynns",
                vintage: 2018,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "LowStock",
                stockCases: 6,
                ratingScore: 95m),

            Product.Create(
                name: "Yering Station MvR 2022",
                wineType: "Red",
                varietal: "Pinot Noir",
                region: "Yarra Valley",
                winery: "Yering Station",
                vintage: 2022,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 36,
                ratingScore: 91m),

            // ── White ─────────────────────────────────────────────────────────
            Product.Create(
                name: "Leeuwin Estate Art Series Chardonnay 2020",
                wineType: "White",
                varietal: "Chardonnay",
                region: "Margaret River",
                winery: "Leeuwin Estate",
                vintage: 2020,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 40,
                ratingScore: 97m),

            Product.Create(
                name: "Grosset Polish Hill Riesling 2022",
                wineType: "White",
                varietal: "Riesling",
                region: "Clare Valley",
                winery: "Grosset",
                vintage: 2022,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 28,
                ratingScore: 96m),

            Product.Create(
                name: "Pewsey Vale The Contours Riesling 2017",
                wineType: "White",
                varietal: "Riesling",
                region: "Eden Valley",
                winery: "Pewsey Vale",
                vintage: 2017,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 18,
                ratingScore: 94m),

            Product.Create(
                name: "Vasse Felix Heytesbury Chardonnay 2021",
                wineType: "White",
                varietal: "Chardonnay",
                region: "Margaret River",
                winery: "Vasse Felix",
                vintage: 2021,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 32,
                ratingScore: 93m),

            Product.Create(
                name: "Shaw & Smith M3 Chardonnay 2022",
                wineType: "White",
                varietal: "Chardonnay",
                region: "Adelaide Hills",
                winery: "Shaw & Smith",
                vintage: 2022,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 44,
                ratingScore: 92m),

            Product.Create(
                name: "Yalumba Y Series Viognier 2023",
                wineType: "White",
                varietal: "Viognier",
                region: "South Australia",
                winery: "Yalumba",
                vintage: 2023,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 60,
                ratingScore: 88m),

            // ── Sparkling ─────────────────────────────────────────────────────
            Product.Create(
                name: "Jansz Tasmania Premium Cuvée NV",
                wineType: "Sparkling",
                varietal: "Chardonnay / Pinot Noir",
                region: "Tasmania",
                winery: "Jansz",
                vintage: null,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 50,
                ratingScore: 90m),

            Product.Create(
                name: "Croser Blanc de Blancs 2020",
                wineType: "Sparkling",
                varietal: "Chardonnay",
                region: "Adelaide Hills",
                winery: "Croser",
                vintage: 2020,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 22,
                ratingScore: 92m),

            Product.Create(
                name: "Seppelt Show Sparkling Shiraz 2015",
                wineType: "Sparkling",
                varietal: "Shiraz",
                region: "Great Western",
                winery: "Seppelt",
                vintage: 2015,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "LowStock",
                stockCases: 8,
                ratingScore: 94m),

            // ── Rosé ──────────────────────────────────────────────────────────
            Product.Create(
                name: "Domaine Naturaliste Sauvage Rosé 2023",
                wineType: "Rose",
                varietal: "Grenache",
                region: "Margaret River",
                winery: "Domaine Naturaliste",
                vintage: 2023,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 35,
                ratingScore: 91m),

            Product.Create(
                name: "Thorn-Clarke William Randell Rosé 2023",
                wineType: "Rose",
                varietal: "Grenache / Shiraz",
                region: "Barossa Valley",
                winery: "Thorn-Clarke",
                vintage: 2023,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 42,
                ratingScore: 89m),

            // ── Dessert ───────────────────────────────────────────────────────
            Product.Create(
                name: "De Bortoli Noble One Botrytis Semillon 2020",
                wineType: "Dessert",
                varietal: "Semillon",
                region: "Riverina",
                winery: "De Bortoli",
                vintage: 2020,
                volume: "375 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 25,
                ratingScore: 95m),

            Product.Create(
                name: "Morris Wines Muscat NV",
                wineType: "Dessert",
                varietal: "Muscat",
                region: "Rutherglen",
                winery: "Morris Wines",
                vintage: null,
                volume: "500 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 30,
                ratingScore: 97m),

            Product.Create(
                name: "Chambers Rosewood Grand Muscat NV",
                wineType: "Dessert",
                varietal: "Muscat",
                region: "Rutherglen",
                winery: "Chambers Rosewood",
                vintage: null,
                volume: "375 ml",
                imageUrl: null,
                availabilityStatus: "OutOfStock",
                stockCases: 0,
                ratingScore: 99m),

            // ── Cider ─────────────────────────────────────────────────────────
            Product.Create(
                name: "Willie Smith's Organic Apple Cider",
                wineType: "Cider",
                varietal: "Apple",
                region: "Huon Valley",
                winery: "Willie Smith's",
                vintage: null,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 55,
                ratingScore: 88m),

            Product.Create(
                name: "Apple Thief Pear Cider",
                wineType: "Cider",
                varietal: "Pear",
                region: "Hawke's Bay",
                winery: "Apple Thief",
                vintage: null,
                volume: "330 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 70,
                ratingScore: 85m),

            // ── Vintage coverage 2024-2026 ────────────────────────────────────
            Product.Create(
                name: "Yalumba Barossa Shiraz 2024",
                wineType: "Red",
                varietal: "Shiraz",
                region: "Barossa Valley",
                winery: "Yalumba",
                vintage: 2024,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 36,
                ratingScore: 90m),

            Product.Create(
                name: "Shaw & Smith Sauvignon Blanc 2025",
                wineType: "White",
                varietal: "Sauvignon Blanc",
                region: "Adelaide Hills",
                winery: "Shaw & Smith",
                vintage: 2025,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 48,
                ratingScore: 91m),

            Product.Create(
                name: "Grosset Springvale Riesling 2026",
                wineType: "White",
                varietal: "Riesling",
                region: "Clare Valley",
                winery: "Grosset",
                vintage: 2026,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 24,
                ratingScore: 92m),

            // ── Test Wineries Test1–Test10 ────────────────────────────────────
            Product.Create(
                name: "Test1 Reserve Cabernet 2022",
                wineType: "Red",
                varietal: "Cabernet Sauvignon",
                region: "South Australia",
                winery: "Test1",
                vintage: 2022,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 20,
                ratingScore: 88m),

            Product.Create(
                name: "Test2 Estate Chardonnay 2023",
                wineType: "White",
                varietal: "Chardonnay",
                region: "Margaret River",
                winery: "Test2",
                vintage: 2023,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 30,
                ratingScore: 87m),

            Product.Create(
                name: "Test3 Vintage Shiraz 2021",
                wineType: "Red",
                varietal: "Shiraz",
                region: "Barossa Valley",
                winery: "Test3",
                vintage: 2021,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "LowStock",
                stockCases: 5,
                ratingScore: 89m),

            Product.Create(
                name: "Test4 Classic Riesling 2024",
                wineType: "White",
                varietal: "Riesling",
                region: "Clare Valley",
                winery: "Test4",
                vintage: 2024,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 25,
                ratingScore: 86m),

            Product.Create(
                name: "Test5 Premium Rosé 2025",
                wineType: "Rose",
                varietal: "Grenache",
                region: "McLaren Vale",
                winery: "Test5",
                vintage: 2025,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 18,
                ratingScore: 85m),

            Product.Create(
                name: "Test6 Grand Sparkling NV",
                wineType: "Sparkling",
                varietal: "Chardonnay / Pinot Noir",
                region: "Victoria",
                winery: "Test6",
                vintage: null,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 40,
                ratingScore: 84m),

            Product.Create(
                name: "Test7 Late Harvest Muscat 2026",
                wineType: "Dessert",
                varietal: "Muscat",
                region: "Rutherglen",
                winery: "Test7",
                vintage: 2026,
                volume: "375 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 15,
                ratingScore: 90m),

            Product.Create(
                name: "Test8 Organic Pinot Gris 2023",
                wineType: "White",
                varietal: "Pinot Gris",
                region: "Yarra Valley",
                winery: "Test8",
                vintage: 2023,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 22,
                ratingScore: 87m),

            Product.Create(
                name: "Test9 Barrel Select Merlot 2024",
                wineType: "Red",
                varietal: "Merlot",
                region: "Coonawarra",
                winery: "Test9",
                vintage: 2024,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "OutOfStock",
                stockCases: 0,
                ratingScore: 86m),

            Product.Create(
                name: "Test10 Single Vineyard Viognier 2025",
                wineType: "White",
                varietal: "Viognier",
                region: "Eden Valley",
                winery: "Test10",
                vintage: 2025,
                volume: "750 ml",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 28,
                ratingScore: 88m),
        };

        // Add deals to a few products
        products[0].AddDeal("6 dozen deal");
        products[2].AddDeal("4+1 deal");
        products[9].AddDeal("6 dozen deal");
        products[14].AddDeal("4+1 deal");

        db.Products.AddRange(products);
        await db.SaveChangesAsync();
    }
}
