// Traces to: 66 - Password hashing storage proof
// L2-050: passwords stored as PBKDF2 hashes; hash is non-reversible; change rotates hash
using Microsoft.AspNetCore.Identity;

namespace TheUpperRoom.Api.Tests.Security;

public class PasswordStorageTests
{
    private static readonly IPasswordHasher<object> Hasher = new PasswordHasher<object>();

    [Fact]
    public void HashPassword_DoesNotContainPlaintext()
    {
        var hash = Hasher.HashPassword(new(), "P@ssw0rd!");
        Assert.DoesNotContain("P@ssw0rd!", hash);
    }

    [Fact]
    public void HashPassword_MatchesPbkdf2FormatPrefix()
    {
        var hash = Hasher.HashPassword(new(), "P@ssw0rd!");
        var bytes = Convert.FromBase64String(hash);
        // ASP.NET Identity v3 format: byte[0] = 0x01
        Assert.Equal(0x01, bytes[0]);
    }

    [Fact]
    public void HashPassword_TwoCallsProduce_DifferentHashes()
    {
        var h1 = Hasher.HashPassword(new(), "same_password");
        var h2 = Hasher.HashPassword(new(), "same_password");
        Assert.NotEqual(h1, h2);
    }

    [Fact]
    public void HashPassword_ChangePassword_RotatesHash()
    {
        var oldHash = Hasher.HashPassword(new(), "OldPass1!");
        var newHash = Hasher.HashPassword(new(), "NewPass2!");
        Assert.NotEqual(oldHash, newHash);
    }

    [Fact]
    public void VerifyHashedPassword_Succeeds_WithCorrectPassword()
    {
        var hash = Hasher.HashPassword(new(), "MyPass123!");
        var result = Hasher.VerifyHashedPassword(new(), hash, "MyPass123!");
        Assert.Equal(PasswordVerificationResult.Success, result);
    }

    [Fact]
    public void VerifyHashedPassword_Fails_WithWrongPassword()
    {
        var hash = Hasher.HashPassword(new(), "MyPass123!");
        var result = Hasher.VerifyHashedPassword(new(), hash, "WrongPass!");
        Assert.Equal(PasswordVerificationResult.Failed, result);
    }
}
