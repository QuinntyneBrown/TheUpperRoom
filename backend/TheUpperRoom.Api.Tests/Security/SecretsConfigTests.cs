// Traces to: 71 - Secrets scanning and runtime configuration
// L2-056: appsettings files contain no hardcoded secrets; .gitignore covers secrets files
using System.Text.RegularExpressions;

namespace TheUpperRoom.Api.Tests.Security;

public class SecretsConfigTests
{
    private static readonly string RepoRoot =
        Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", ".."));

    private static readonly string ApiRoot =
        Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "TheUpperRoom.Api"));

    // Matches JWT tokens, long base64, AWS-style keys
    private static readonly Regex SecretPattern = new(
        @"(ey[A-Za-z0-9_-]{20,}|AKIA[A-Z0-9]{16}|[A-Za-z0-9+/]{40,}={0,2})",
        RegexOptions.Compiled);

    [Fact]
    public void AppSettings_ContainNoHardcodedSecrets()
    {
        if (!Directory.Exists(ApiRoot)) return;

        var settingsFiles = Directory.GetFiles(ApiRoot, "appsettings*.json")
            .Where(f => !f.Contains("Production"));

        foreach (var file in settingsFiles)
        {
            var content = File.ReadAllText(file);
            var matches = SecretPattern.Matches(content);
            Assert.True(matches.Count == 0,
                $"{Path.GetFileName(file)} contains potential secret-shaped values: {string.Join(", ", matches.Cast<Match>().Select(m => m.Value.Substring(0, Math.Min(8, m.Value.Length)) + "..."))}");
        }
    }

    [Fact]
    public void GitIgnore_CoversSecretsFiles()
    {
        var gitIgnorePath = Path.Combine(RepoRoot, ".gitignore");
        if (!File.Exists(gitIgnorePath)) return;

        var content = File.ReadAllText(gitIgnorePath);
        Assert.Contains("appsettings.Production.json", content);
        Assert.Contains(".env", content);
    }
}
