using WanJiaDengHuo.Application.Common.DTOs;
using WanJiaDengHuo.Application.Common.Interfaces;
using WanJiaDengHuo.Domain.Interfaces;
using MediatR;

namespace WanJiaDengHuo.Application.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponseDto>;

public class LoginCommandHandler(
    IUserRepository userRepo,
    IJwtService jwtService,
    IPasswordHasher passwordHasher,
    IUnitOfWork uow)
    : IRequestHandler<LoginCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(LoginCommand cmd, CancellationToken ct)
    {
        var user = await userRepo.GetByEmailAsync(cmd.Email, ct)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!passwordHasher.Verify(cmd.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        var refreshToken = jwtService.GenerateRefreshToken();
        user.SetRefreshToken(refreshToken, DateTime.UtcNow.AddDays(30));
        userRepo.Update(user);
        await uow.SaveChangesAsync(ct);

        return new AuthResponseDto(
            jwtService.GenerateAccessToken(user.Id, user.Email, user.Role),
            refreshToken,
            jwtService.AccessTokenExpiresAt,
            user.Email, user.FirstName, user.LastName);
    }
}
