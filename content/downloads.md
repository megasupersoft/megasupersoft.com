---
title: "Downloads"
description: "Download FFFFinance for macOS, Windows, and Linux."
---

# Downloads

::download-table
::

## System Requirements

| Platform | Minimum | Recommended |
|----------|---------|-------------|
| macOS | 10.15 Catalina (Intel) / 11 Big Sur (Apple Silicon) | macOS 14+ |
| Windows | Windows 10 (64-bit) | Windows 11 |
| Linux | glibc 2.31+ (Ubuntu 20.04+, Fedora 33+) | Ubuntu 22.04+ |
| RAM | 4 GB | 8 GB |
| Disk | 500 MB | 1 GB (with AI models) |

## macOS Notes

Two separate DMGs are available — download the one that matches your Mac:

- **Apple Silicon** (M1/M2/M3/M4): `FFFFinance-arm64.dmg`
- **Intel** (2016 MacBook Air, older iMacs, etc.): `FFFFinance-x64.dmg`

Not sure which you have? Click the Apple menu > **About This Mac**. If it says "Chip: Apple M1/M2/M3/M4" you want Apple Silicon. If it says "Processor: Intel" you want Intel.

### Unsigned app warning

FFFFinance is not yet signed with an Apple Developer ID certificate. macOS will block the app on first launch.

**macOS Sequoia (15+):**

```bash
xattr -cr /Applications/FFFFinance.app
```

Or: **System Settings > Privacy & Security > Open Anyway**.

**macOS Sonoma (14) and earlier:**

Right-click the app > **Open** > **Open** in the confirmation dialog.

## Linux Notes

The **AppImage** is the universal option — works on any distro with glibc 2.31+.

```bash
chmod +x FFFFinance-*.AppImage
./FFFFinance-*.AppImage
```

**.deb** and **.rpm** packages are also available for Debian/Ubuntu and Fedora/RHEL respectively.

## Windows Notes

The **Setup .exe** is an NSIS installer that creates Start Menu shortcuts and supports auto-update. A portable `.exe` is also available in [GitHub Releases](https://github.com/DangerDrome/FFFFinance_app/releases).

## Auto-Updates

FFFFinance checks for updates automatically on launch. You can also check manually via **Settings > About > Check for Updates**. Updates are downloaded in the background and installed on restart.
