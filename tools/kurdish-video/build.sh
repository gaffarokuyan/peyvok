#!/usr/bin/env bash
# Seslendirmeyi birlestirir ve videoyu render eder.
#   ./build.sh            -> build/narration.mp3 + output/Kurtce_Mezopotamyanin_Kadim_Dili.mp4
# Once: narration/generate_tts.py ve narration/splice_kurdish.py calistirilmis olmali,
#       ./fetch_fonts.sh ile fontlar indirilmis olmali.
set -euo pipefail
cd "$(dirname "$0")"
B=build
SECS="01_giris 02_dil_ailesi 03_arkaik 04_eril_disil 05_seslenme 06_lehceler 07_petersburg 08_medreseler 09_bediuzzaman 10_kapanis"

# 1) Seslendirme: bolumler + aralarinda 1.3 sn sessizlik
ffmpeg -v error -y -f lavfi -i anullsrc=r=44100:cl=mono -t 1.3 -c:a libmp3lame -b:a 128k $B/sil.mp3
: > $B/list.txt
for s in $SECS; do
  if [ -f "$B/spliced/$s.mp3" ]; then src="$PWD/$B/spliced/$s.mp3"; else src="$PWD/$B/tts/$s.mp3"; fi
  echo "file '$src'" >> $B/list.txt
  [ "$s" != "10_kapanis" ] && echo "file '$PWD/$B/sil.mp3'" >> $B/list.txt
done
ffmpeg -v error -y -f concat -safe 0 -i $B/list.txt -ac 1 -ar 44100 -c:a libmp3lame -b:a 192k $B/narration.mp3

# 2) Video: 4 paralel parca halinde render
N=$(python3 video/render.py nframes)
Q=$(( (N + 3) / 4 ))
: > $B/parts.txt
for i in 0 1 2 3; do
  a=$((i * Q)); b=$(( (i + 1) * Q )); [ $b -gt $N ] && b=$N
  python3 video/render.py range $a $b "$PWD/$B/part$i.mp4" &
  echo "file '$PWD/$B/part$i.mp4'" >> $B/parts.txt
done
wait

# 3) Ses + goruntu
mkdir -p output
ffmpeg -v error -y -f concat -safe 0 -i $B/parts.txt -i $B/narration.mp3 -map 0:v -map 1:a \
  -c:v copy -c:a aac -b:a 192k -movflags +faststart output/Kurtce_Mezopotamyanin_Kadim_Dili.mp4
python3 video/render.py srt output/Kurtce_Video_Altyazi.srt
echo "Hazir: output/Kurtce_Mezopotamyanin_Kadim_Dili.mp4"
