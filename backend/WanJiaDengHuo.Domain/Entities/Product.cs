using WanJiaDengHuo.Domain.Common;

namespace WanJiaDengHuo.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public string Style { get; private set; } = string.Empty;
    public string Brand { get; private set; } = string.Empty;
    public string Designer { get; private set; } = string.Empty;
    public int? ReleaseYear { get; private set; }
    public string SizeRange { get; private set; } = "S-XL";
    public string? ImageUrl { get; private set; }
    public string AvailabilityStatus { get; private set; } = "Available";
    public int StockCases { get; private set; }
    public decimal? RatingScore { get; private set; }
    public string? RatingBadgeUrl { get; private set; }
    public bool IsShippingAvailable { get; private set; } = true;

    // e.g. "6 dozen deal", "4+1 deal"
    public List<string> Deals { get; private set; } = [];

    // Navigation
    public ICollection<WishlistItem> WishlistItems { get; private set; } = [];
    public ICollection<CartItem> CartItems { get; private set; } = [];

    protected Product() { }

    public static Product Create(
        string name, string category, string style, string brand,
        string designer, int? releaseYear, string sizeRange, string? imageUrl,
        string availabilityStatus, int stockCases, decimal? ratingScore = null)
    {
        return new Product
        {
            Name = name,
            Category = category,
            Style = style,
            Brand = brand,
            Designer = designer,
            ReleaseYear = releaseYear,
            SizeRange = sizeRange,
            ImageUrl = imageUrl,
            AvailabilityStatus = availabilityStatus,
            StockCases = stockCases,
            RatingScore = ratingScore
        };
    }

    public void AddDeal(string deal)
    {
        Deals.Add(deal);
        SetUpdated();
    }

    public void Update(string name, string category, string style, string brand,
        string designer, int? releaseYear, string sizeRange, string? imageUrl,
        string availabilityStatus, int stockCases)
    {
        Name = name;
        Category = category;
        Style = style;
        Brand = brand;
        Designer = designer;
        ReleaseYear = releaseYear;
        SizeRange = sizeRange;
        ImageUrl = imageUrl;
        AvailabilityStatus = availabilityStatus;
        StockCases = stockCases;
        SetUpdated();
    }
}
