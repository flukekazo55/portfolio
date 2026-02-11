using System.Diagnostics;

static string? FindProjectRoot(string startPath)
{
    var current = new DirectoryInfo(startPath);

    while (current is not null)
    {
        var packageJson = Path.Combine(current.FullName, "package.json");
        var frontendDir = Path.Combine(current.FullName, "frontend");
        var backendDir = Path.Combine(current.FullName, "backend");

        if (File.Exists(packageJson) && Directory.Exists(frontendDir) && Directory.Exists(backendDir))
        {
            return current.FullName;
        }

        current = current.Parent;
    }

    return null;
}

var root = FindProjectRoot(AppContext.BaseDirectory);
if (root is null)
{
    Console.Error.WriteLine("Could not find project root. Place this EXE inside the portfolio repository.");
    Environment.Exit(1);
}

try
{
    var process = new Process
    {
        StartInfo = new ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = "/k npm run dev",
            WorkingDirectory = root,
            UseShellExecute = true,
            CreateNoWindow = false
        }
    };

    process.Start();
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Failed to start frontend/backend: {ex.Message}");
    Environment.Exit(1);
}
