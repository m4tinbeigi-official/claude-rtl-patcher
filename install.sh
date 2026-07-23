#!/usr/bin/env bash
set -euo pipefail

repo="m4tinbeigi-official/claude-rtl-patcher"
version="${CLAUDE_RTL_VERSION:-latest}"
case "$(uname -s)" in
  Darwin) platform="macos" ;;
  Linux) platform="linux" ;;
  *) echo "Unsupported operating system" >&2; exit 1 ;;
esac
case "$(uname -m)" in
  x86_64|amd64) arch="x64" ;;
  arm64|aarch64)
    [[ "$platform" == "macos" ]] || { echo "Linux ARM64 builds are not available yet" >&2; exit 1; }
    arch="arm64" ;;
  *) echo "Unsupported CPU architecture" >&2; exit 1 ;;
esac
asset="claude-rtl-patcher-${platform}-${arch}"
base="https://github.com/${repo}/releases"
url="${base}/$([[ "$version" == latest ]] && echo latest/download || echo download/${version})/${asset}"
install_dir="${CLAUDE_RTL_INSTALL_DIR:-${HOME}/.local/bin}"
mkdir -p "$install_dir"
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
echo "Downloading ${asset}..."
curl --fail --location --silent --show-error "$url" --output "$tmp"
chmod 755 "$tmp"
mv "$tmp" "${install_dir}/claude-rtl-patcher"
echo "Installed to ${install_dir}/claude-rtl-patcher"
exec "${install_dir}/claude-rtl-patcher" "$@"
