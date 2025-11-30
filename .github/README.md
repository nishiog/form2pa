# GitHub Actions Workflows

## release.yml

### Automatic Release (Recommended)

When a PR is merged to the `master` branch, a **date-based tag is automatically created** and builds for Windows/Mac are executed.

#### Tag Naming Convention

- **First build of the day**: `YYYY-MM-DD` (e.g., `2024-11-30`)
- **Subsequent builds on the same day**: `YYYY-MM-DD.1`, `YYYY-MM-DD.2`, ... (e.g., `2024-11-30.1`)

#### Workflow

1. Merge PR to `master` branch
2. Date tag is automatically created (with sequence number if tag already exists)
3. Builds are executed for all platforms
4. Build artifacts are uploaded to GitHub Releases

### Manual Release

You can also manually create and push a tag:

```bash
# Create tag manually
git tag 2024-11-30
git push origin 2024-11-30
```

Alternatively, you can manually trigger the GitHub Actions workflow.

### Build Artifacts

After the build completes, the following artifacts are uploaded to GitHub Releases:
- **Windows**: `.exe` (portable executable) ⭐ Main target - Single executable file, no installation required
- **macOS**: `.app` (optional - continues even if it fails)

**Note**: On Windows, a portable executable (`.exe`) is generated. You can download and run it immediately. Settings files are automatically saved in the same directory as the executable.

