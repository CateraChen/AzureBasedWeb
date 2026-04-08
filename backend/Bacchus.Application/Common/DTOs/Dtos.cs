namespace Bacchus.Application.Common.DTOs;

public record ProductSummaryDto(
    Guid Id,
    string Name,
    string WineType,
    string Varietal,
    string Region,
    string Winery,
    int? Vintage,
    string Volume,
    string? ImageUrl,
    string AvailabilityStatus,
    int StockCases,
    decimal? RatingScore,
    bool IsShippingAvailable,
    List<string> Deals);

public record ProductDetailDto(
    Guid Id,
    string Name,
    string WineType,
    string Varietal,
    string Region,
    string Winery,
    int? Vintage,
    string Volume,
    string? ImageUrl,
    string AvailabilityStatus,
    int StockCases,
    decimal? RatingScore,
    bool IsShippingAvailable,
    List<string> Deals,
    List<ProductSummaryDto> Recommendations);

public record PagedResult<T>(
    IEnumerable<T> Items,
    int TotalCount,
    int Page,
    int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNext => Page < TotalPages;
    public bool HasPrev => Page > 1;
}

public record FilterOptionsDto(
    IEnumerable<string> WineTypes,
    IEnumerable<string> Varietals,
    IEnumerable<string> Regions,
    IEnumerable<string> Wineries,
    IEnumerable<int> Vintages);

public record CartItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    string? ImageUrl,
    string Volume,
    int Quantity,
    string AvailabilityStatus);

public record CartDto(
    List<CartItemDto> Items,
    int TotalItems);

public record WishlistItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    string? ImageUrl,
    string Volume,
    string AvailabilityStatus);

public record AuthResponseDto(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    string Email,
    string FirstName,
    string LastName);
