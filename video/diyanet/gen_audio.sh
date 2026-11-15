#!/bin/bash
cd "$(dirname "$0")/audio"
H='xi-api-key: proxy-injected'
curl -sS -o music.mp3 -w "music %{http_code}\n" "https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192" -H "$H" -H "Content-Type: application/json" -d '{"prompt":"Playful satirical comedy underscore with a Kurdish folk flavor for a 100 second sarcastic YouTube Short. Plucky tembur and pizzicato strings playing a cheeky, mischievous Kurdi maqam tune, bouncy daf rhythm, sneaky bassoon-like low line, occasional comic accents, tongue-in-cheek and ironic like a political satire show. Light and steady so a narrator can speak over it. No vocals.","music_length_ms":104000}' &
sfx(){ curl -sS -o "sfx_$1.mp3" -w "$1 %{http_code}\n" "https://api.elevenlabs.io/v1/sound-generation" -H "$H" -H "Content-Type: application/json" -d "{\"text\":\"$2\",\"duration_seconds\":$3,\"prompt_influence\":0.6}"; }
sfx applause "small audience enthusiastic applause and cheering, short" 2.5 &
sfx rimshot "comedy drum rimshot ba dum tss" 1.2 &
sfx cough "a man suddenly chokes and coughs loudly, comedic" 1.6 &
sfx drip "single water drop dripping into an empty echoing pool, plink" 1.0 &
sfx scratch "vinyl record scratch stop, comedic" 0.8 &
sfx ding "bright game show correct answer ding" 0.8 &
sfx buzz "game show wrong answer buzzer" 1.0 &
sfx stamp "heavy rubber stamp slam on paper desk" 0.6 &
sfx pop "cartoon pop bubble" 0.4 &
sfx tape "duct tape ripped and slapped on" 0.8 &
sfx trombone "sad trombone wah wah wah" 2.2 &
sfx tick "clock ticking, waiting" 2.0 &
wait
