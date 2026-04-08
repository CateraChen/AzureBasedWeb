using Bacchus.Domain.Common;

namespace Bacchus.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string WineType { get; private set; } = string.Empty;
    public string Varietal { get; private set; } = string.Empty;
    public string Region { get; private set; } = string.Empty;
    public string Winery { get; private set; } = string.Empty;
    public int? Vintage { get; private set; }
    public string Volume { get; private set; } = "750 ml";
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
        string name, string wineType, string varietal, string region,
        string winery, int? vintage, string volume, string? imageUrl,
        string availabilityStatus, int stockCases, decimal? ratingScore = null)
    {
        return new Product
        {
            Name = name,
            WineType = wineType,
            Varietal = varietal,
            Region = region,
            Winery = winery,
            Vintage = vintage,
            Volume = volume,
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

    public void Update(string name, string wineType, string varietal, string region,
        string winery, int? vintage, string volume, string? imageUrl,
        string availabilityStatus, int stockCases)
    {
        Name = name;
        WineType = wineType;
        Varietal = varietal;
        Region = region;
        Winery = winery;
        Vintage = vintage;
        Volume = volume;
        ImageUrl = imageUrl;
        AvailabilityStatus = availabilityStatus;
        StockCases = stockCases;
        SetUpdated();
    }
}
