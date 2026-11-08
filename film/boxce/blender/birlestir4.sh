#!/usr/bin/env bash
# Sahne 4 deneme klibi: geniş plan (bohça açılıyor) + yakın plan (not) + Gulê'nin dış sesi (05).
# Kullanım: birlestir4.sh <render_klasoru> <cikti.mp4> [ses.mp3]
set -euo pipefail
R="$1"; OUT="$2"
HERE="$(cd "$(dirname "$0")" && pwd)"
SES="${3:-$HERE/../ses/05_gule_not.mp3}"
T="$(mktemp -d)"
# 1) geniş plan: 120 kare @24fps = 5 sn
ffmpeg -y -loglevel error -framerate 24 -i "$R/anim/genis_%04d.png" -c:v libx264 -pix_fmt yuv420p -r 24 "$T/a.mp4"
# 2) yakın plan: tek kare, 5 sn, çok yavaş yaklaşma
ffmpeg -y -loglevel error -loop 1 -framerate 24 -t 5 -i "$R/yakin_100.png" \
  -vf "scale=2560:-1,zoompan=z='1+0.0006*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=24" \
  -c:v libx264 -pix_fmt yuv420p "$T/b.mp4"
printf "file '%s'\nfile '%s'\n" "$T/a.mp4" "$T/b.mp4" > "$T/l.txt"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$T/l.txt" -c copy "$T/v.mp4"
# 3) ses: 05 yakın planın başında (5.6 sn), sessiz başlangıç
ffmpeg -y -loglevel error -i "$T/v.mp4" -i "$SES" \
  -filter_complex "[1:a]adelay=5600|5600,apad[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -shortest "$OUT"
rm -rf "$T"
echo "OK: $OUT"
