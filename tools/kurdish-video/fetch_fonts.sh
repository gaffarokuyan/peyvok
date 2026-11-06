#!/usr/bin/env bash
# Video icin acik lisansli (OFL) fontlari npm'den indirir -> video/fonts/
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p video/fonts build/npm
cd build/npm
npm pack @expo-google-fonts/playfair-display @expo-google-fonts/inter @expo-google-fonts/amiri --silent >/dev/null
for t in expo-google-fonts-*.tgz; do mkdir -p "${t%.tgz}" && tar xzf "$t" -C "${t%.tgz}"; done
find . -name "*.ttf" | grep -E "PlayfairDisplay_(500Medium|600SemiBold|600SemiBold_Italic|700Bold)\.ttf|Inter_(400Regular|500Medium|600SemiBold)\.ttf|Amiri_700Bold\.ttf" \
  | while read -r f; do cp "$f" ../../video/fonts/; done
ls ../../video/fonts
