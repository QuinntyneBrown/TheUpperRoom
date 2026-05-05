// Traces to: 68 - Injection and stored-XSS hardening checks
// L2-052: no raw SQL concatenation patterns in backend code
using System.Text.RegularExpressions;

namespace TheUpperRoom.Api.Tests.Security;

public class SqlInjectionTests
{
    private static readonly string ApiSourcePath =
        Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "TheUpperRoom.Api"));

    [Fact]
    public void NoRawSqlInterpolation_InApiSource()
    {
        if (!Directory.Exists(ApiSourcePath)) return;

        var csFiles = Directory.GetFiles(ApiSourcePath, "*.cs", SearchOption.AllDirectories)
            .Where(f => !f.Contains("obj" + Path.DirectorySeparatorChar));

        var violations = new List<string>();
        var pattern = new Regex(@"FromSqlRaw\(\s*\$""", RegexOptions.Compiled);

        foreach (var file in csFiles)
        {
            var content = File.ReadAllText(file);
            if (pattern.IsMatch(content))
                violations.Add(Path.GetRelativePath(ApiSourcePath, file));
        }

        Assert.Empty(violations);
    }

    [Fact]
    public void NoRawSqlConcatenation_InApiSource()
    {
        if (!Directory.Exists(ApiSourcePath)) return;

        var csFiles = Directory.GetFiles(ApiSourcePath, "*.cs", SearchOption.AllDirectories)
            .Where(f => !f.Contains("obj" + Path.DirectorySeparatorChar));

        var violations = new List<string>();
        var pattern = new Regex(@"FromSqlRaw\(\s*"".+\+", RegexOptions.Compiled);

        foreach (var file in csFiles)
        {
            var content = File.ReadAllText(file);
            if (pattern.IsMatch(content))
                violations.Add(Path.GetRelativePath(ApiSourcePath, file));
        }

        Assert.Empty(violations);
    }
}
