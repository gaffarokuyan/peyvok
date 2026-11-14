# final YouTube audio tracks: 1.5 s cover intro (whoosh+boom) + music/sfx mix with dubbed narration
import subprocess,sys,os
os.chdir(os.path.dirname(os.path.abspath(__file__))+'/..')
os.makedirs('dil/out',exist_ok=True)
for l in sys.argv[1:]:
  subprocess.run(['python3','mix.py',f'dil/dub_{l}/narration.wav',f'dil/out/mix_{l}.wav'],check=True)
  S='../gutiler/audio'
  subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'{S}/sfx_whoosh.mp3','-i',f'{S}/sfx_boom.mp3','-i',f'dil/out/mix_{l}.wav','-filter_complex',
    "[0]volume=0.35[w];[1]volume=0.5,adelay=150|150[bm];[w][bm]amix=inputs=2:normalize=0,apad,atrim=0:1.5,aformat=sample_rates=48000:channel_layouts=stereo[ia];[2]aformat=sample_rates=48000:channel_layouts=stereo[ma];[ia][ma]concat=n=2:v=0:a=1[a]",
    '-map','[a]','-c:a','libmp3lame','-b:a','192k',f'dil/out/dirok_annaziler_ses_{l}.mp3'],check=True)
  print(l,'ok',flush=True)
