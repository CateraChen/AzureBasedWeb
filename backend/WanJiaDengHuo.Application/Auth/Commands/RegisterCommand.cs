using WanJiaDengHuo.Application.Common.DTOs;
using WanJiaDengHuo.Application.Common.Interfaces;
using WanJiaDengHuo.Domain.Interfaces;
using MediatR;

namespace WanJiaDengHuo.Application.Auth.Commands;

public record RegisterCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName) : IRequest<AuthResponseDto>;

public class RegisterCommandHandler(
    IUserRepository userRepo,
    IJwtService jwtService,
    IPasswordHasher passwordHasher,
    IUnitOfWork uow)
    : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(RegisterCommand cmd, CancellationToken ct)
    {
        if (await userRepo.ExistsAsync(cmd.Email, ct))
            throw new InvalidOperationException("Email already registered.");

        var hash = passwordHasher.Hash(cmd.Password);
        var user = WanJiaDengHuo.Domain.Entities.User.Create(cmd.Email, hash, cmd.FirstName, cmd.LastName);

        var refreshToken = jwtService.GenerateRefreshToken();
        user.SetRefreshToken(refreshToken, DateTime.UtcNow.AddDays(30));

        await userRepo.AddAsync(user, ct);
        await uow.SaveChangesAsync(ct);

        return new AuthResponseDto(
            jwtService.GenerateAccessToken(user.Id, user.Email, user.Role),
            refreshToken,
            jwtService.AccessTokenExpiresAt,
            user.Email, user.FirstName, user.LastName);
    }
}
