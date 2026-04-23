using Microsoft.EntityFrameworkCore;
using WanJiaDengHuo.Domain.Entities;

namespace WanJiaDengHuo.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(BaccDbContext db)
    {
        if (await db.Products.AnyAsync())
            return;

        var products = new List<Product>
        {
            Product.Create(
                name: "Classic Silk Dress",
                category: "Dresses",
                style: "Formal",
                brand: "WanJiaDengHuo Signature",
                designer: "Zhang Wei",
                releaseYear: 2026,
                sizeRange: "XS-XL",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 50,
                ratingScore: 4.9m),

            Product.Create(
                name: "Summer Linen Shirt",
                category: "Tops",
                style: "Casual",
                brand: "Echo Breezes",
                designer: "Li Na",
                releaseYear: 2026,
                sizeRange: "S-XXL",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 120,
                ratingScore: 4.7m),

            Product.Create(
                name: "Tailored Wool Coat",
                category: "Outerwear",
                style: "Formal",
                brand: "North Loom",
                designer: "Chen Hao",
                releaseYear: 2026,
                sizeRange: "S-XL",
                imageUrl: null,
                availabilityStatus: "LowStock",
                stockCases: 18,
                ratingScore: 4.8m),

            Product.Create(
                name: "Minimal Knit Cardigan",
                category: "Outerwear",
                style: "Casual",
                brand: "Soft Harbor",
                designer: "Wang Fang",
                releaseYear: 2026,
                sizeRange: "XS-L",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 72,
                ratingScore: 4.6m),

            Product.Create(
                name: "Relaxed Wide-Leg Trousers",
                category: "Bottoms",
                style: "Casual",
                brand: "City Frame",
                designer: "Liu Qiang",
                releaseYear: 2026,
                sizeRange: "S-XXL",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 96,
                ratingScore: 4.5m),

            Product.Create(
                name: "Pleated A-Line Skirt",
                category: "Bottoms",
                style: "Formal",
                brand: "Quiet Bloom",
                designer: "Zhao Min",
                releaseYear: 2026,
                sizeRange: "XS-XL",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 60,
                ratingScore: 4.8m),

            Product.Create(
                name: "Performance Running Set",
                category: "Sportswear",
                style: "Athleisure",
                brand: "Pulse Line",
                designer: "Sun Rui",
                releaseYear: 2026,
                sizeRange: "S-XXL",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 140,
                ratingScore: 4.4m),

            Product.Create(
                name: "Classic Leather Belt",
                category: "Accessories",
                style: "Formal",
                brand: "Heritage Stitch",
                designer: "Qian Yi",
                releaseYear: 2026,
                sizeRange: "One Size",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 200,
                ratingScore: 4.9m),

            Product.Create(
                name: "Structured Blazer",
                category: "Outerwear",
                style: "Formal",
                brand: "North Loom",
                designer: "Han Lu",
                releaseYear: 2026,
                sizeRange: "S-XXL",
                imageUrl: null,
                availabilityStatus: "LowStock",
                stockCases: 24,
                ratingScore: 4.9m),

            Product.Create(
                name: "Graphic Cotton Tee",
                category: "Tops",
                style: "Casual",
                brand: "Urban Edge",
                designer: "Wang Fang",
                releaseYear: 2026,
                sizeRange: "XS-XXXL",
                imageUrl: null,
                availabilityStatus: "Available",
                stockCases: 300,
                ratingScore: 4.4m)
        };

        products[0].AddDeal("Signature collection");
        products[2].AddDeal("Tailored offer");
        products[6].AddDeal("Activewear bundle");

        db.Products.AddRange(products);
        await db.SaveChangesAsync();
    }
}
