# Workflow Form - PowerAutomate Integration

A desktop application built with Tauri that integrates with PowerAutomate for document creation forms.

## Prerequisites

### Development Environment

- **Node.js** 18 or higher
- **Rust** 1.70 or higher
- **System Dependencies**:
  - macOS: Xcode Command Line Tools
  - Linux: `libwebkit2gtk-4.0-dev`, `build-essential`, `curl`, `wget`, `file`, `libssl-dev`
  - Windows: Microsoft Visual Studio C++ Build Tools

## Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for release
npm run tauri build
```

## Project Structure

```
.
├── src/                      # Frontend (HTML/CSS/JavaScript)
│   ├── index.html           # Main HTML structure
│   ├── styles.css           # All CSS styles
│   ├── app.js               # Application JavaScript
│   └── config.json          # Configuration file
├── src-tauri/               # Rust backend
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── icons/
│       └── icon.png
├── package.json
└── README.md
```

## Build

### Local Build

```bash
npm run tauri build
```

Build artifacts are generated in:
- **Windows**: `src-tauri/target/release/bundle/portable/` (.exe - single executable, no installation required)
- **macOS**: `src-tauri/target/release/bundle/macos/` (.app)

## PowerAutomate Data Format

The JSON data sent to the webhook:

```json
{
  "token": "authentication-token",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "common": {
    "common-date": "2024年1月1日",
    "common-party1-name": "当事者Aの名前",
    "common-party1-address": "当事者Aの住所",
    "common-party1-contact": "当事者Aの連絡先",
    "common-party2-name": "当事者Bの名前",
    "common-party2-address": "当事者Bの住所",
    "common-party2-contact": "当事者Bの連絡先"
  },
  "documents": [
    {
      "type": "contract",
      "name": "契約書",
      "config": { ... },
      "data": {
        "contract-content": "契約内容",
        "contract-amount": "契約金額",
        "contract-term": "契約期間"
      }
    }
  ]
}
```

## Branch Protection

This repository uses branch protection rules to ensure code quality. See [`.github/BRANCH_PROTECTION.md`](.github/BRANCH_PROTECTION.md) for setup instructions.

**Required before merging PRs:**
- ✅ CI build must pass
- ✅ At least 1 code review approval
- ❌ Direct pushes to `master` branch are not allowed

## License

MIT License
