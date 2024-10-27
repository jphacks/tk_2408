import os
import json
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_audioclips
from pydub import AudioSegment
from openai import OpenAI
from elevenlabs import ElevenLabs, VoiceSettings
from dotenv import load_dotenv

# .envファイルから環境変数を読み込む
load_dotenv()

# 環境変数からAPIキーを取得
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')

# ファイルパスの設定
VIDEO_PATH = 'uploads/videos/pekora_2.mp4'
EXTRACTED_AUDIO_PATH = 'extracted_audio/extracted_audio.mp3'
OUTPUT_MOVIE_PATH = 'outputs/output.mp4'
TRANSCRIPT_JSON_PATH = 'transcript.json'
CHUNK_DIR = 'chunk'
COMBINED_AUDIO_PATH = 'outputs/combined_output.mp3'  # Changed this line

# ディレクトリが存在しない場合は作成
os.makedirs(os.path.dirname(EXTRACTED_AUDIO_PATH), exist_ok=True)
os.makedirs(CHUNK_DIR, exist_ok=True)
os.makedirs(os.path.dirname(COMBINED_AUDIO_PATH), exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_MOVIE_PATH), exist_ok=True)

# 動画から音声を抽出
def extract_audio(video_path, output_audio_path):
    try:
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(output_audio_path)
        print("音声の抽出が完了しました。")
    except Exception as e:
        print(f"音声抽出中にエラーが発生しました: {e}")
    finally:
        video.close()

# 音声をテキストに変換し、JSONファイルに保存
def transcribe_audio(audio_path, transcript_path, openai_api_key):
    try:
        openai_client = OpenAI(api_key=openai_api_key)
        with open(audio_path, "rb") as audio_file:
            transcript = openai_client.audio.translations.create(
                model="whisper-1",
                response_format="verbose_json",
                file=audio_file
            )
        with open(transcript_path, "w", encoding="utf-8") as json_file:
            json.dump(transcript.model_dump(), json_file, ensure_ascii=False, indent=2)
        print("音声の転写が完了しました。")
    except Exception as e:
        print(f"音声の転写中にエラーが発生しました: {e}")

# 声のクローン
def clone_voice(elevenlabs_api_key, audio_files):
    try:
        elevenlabs_client = ElevenLabs(api_key=elevenlabs_api_key)
        voice = elevenlabs_client.clone(
            name="Cloned Voice",
            description="Input video's cloned voice",
            files=audio_files,
        )
        print("声のクローンが完了しました。")
        return voice.voice_id
    except Exception as e:
        print(f"声のクローン中にエラーが発生しました: {e}")
        return None

# 転写されたテキストを音声に変換し、各セグメントを保存
def generate_speech_segments(transcript_path, voice_id, elevenlabs_client, chunk_dir):
    try:
        with open(transcript_path, "r", encoding="utf-8") as json_file:
            transcript_data = json.load(json_file)
        
        for segment in transcript_data.get("segments", []):
            segment_id = segment.get("id")
            text = segment.get("text")
            if text:
                audio = elevenlabs_client.text_to_speech.convert(
                    voice_id=voice_id,
                    optimize_streaming_latency="0",
                    output_format="mp3_22050_32",
                    text=text
                )
                chunk_path = os.path.join(chunk_dir, f"chunk_{segment_id}.mp3")
                with open(chunk_path, "wb") as audio_file:
                    for audio_chunk in audio:
                        audio_file.write(audio_chunk)
                print(f"セグメント {segment_id} の音声を生成しました。")
    except Exception as e:
        print(f"音声生成中にエラーが発生しました: {e}")

# 各音声セグメントを調整し、1つの音声ファイルに結合
def adjust_and_combine_audio(transcript_path, chunk_dir, combined_audio_path):
    try:
        with open(transcript_path, "r", encoding="utf-8") as json_file:
            transcript_data = json.load(json_file)
        
        combined_audio = AudioSegment.empty()
        
        for segment in transcript_data.get("segments", []):
            text = segment.get("text")
            start = segment.get("start")
            end = segment.get("end")
            segment_id = segment.get("id")
            
            if text:
                audio_path = os.path.join(chunk_dir, f"chunk_{segment_id}.mp3")
                
                if os.path.exists(audio_path):
                    audio = AudioSegment.from_mp3(audio_path)
                    generated_duration = len(audio) / 1000  # ミリ秒から秒へ
                    original_duration = end - start
                    
                    print(f"セグメントID: {segment_id}, テキスト: {text}")
                    print(f"開始: {start:.2f}s, 終了: {end:.2f}s, 元の長さ: {original_duration:.2f}s")
                    print(f"生成された音声の長さ: {generated_duration:.2f}s")
                    
                    # 音声の長さを調整
                    if generated_duration < original_duration:
                        silence_duration = original_duration - generated_duration
                        silence = AudioSegment.silent(duration=int(silence_duration * 1000))
                        adjusted_audio = audio + silence
                        print(f"{silence_duration:.2f}s の無音を追加しました。")
                    elif generated_duration > original_duration:
                        speed_factor = generated_duration / original_duration
                        adjusted_audio = audio.speedup(playback_speed=speed_factor)
                        adjusted_audio = adjusted_audio[:int(original_duration * 1000)]
                        print(f"再生速度を {speed_factor:.2f} 倍に調整しました。")
                    else:
                        adjusted_audio = audio
                        print("音声の長さが一致しました。調整は不要です。")
                    
                    # セグメントの開始時間に合わせて無音を追加
                    current_length = len(combined_audio) / 1000
                    if start > current_length:
                        silence_duration = start - current_length
                        silence = AudioSegment.silent(duration=int(silence_duration * 1000))
                        combined_audio += silence
                        print(f"開始時間に合わせて {silence_duration:.2f}s の無音を追加しました。")
                    
                    combined_audio += adjusted_audio
                    print(f"合成音声の総長さ: {len(combined_audio)/1000:.2f}s")
                else:
                    print(f"セグメントID: {segment_id} の音声ファイルが見つかりません。")
            
            print("---")
        
        combined_audio.export(combined_audio_path, format="mp3")
        print(f"結合された音声を '{combined_audio_path}' に保存しました。")
    except Exception as e:
        print(f"音声の結合中にエラーが発生しました: {e}")

# 元の動画の音声を新しい音声に置き換え
def replace_audio_in_video(video_path, new_audio_path, output_path):
    try:
        video = VideoFileClip(video_path)
        print(f"動画ファイル '{video_path}' を読み込みました。")
        
        new_audio = AudioFileClip(new_audio_path)
        print(f"新しい音声ファイル '{new_audio_path}' を読み込みました。")
        
        # 音声の長さを動画に合わせる
        if new_audio.duration > video.duration:
            new_audio = new_audio.subclip(0, video.duration)
            print("新しい音声を動画の長さに合わせてトリミングしました。")
        elif new_audio.duration < video.duration:
            repeats = int(video.duration // new_audio.duration) + 1
            new_audio = concatenate_audioclips([new_audio] * repeats).subclip(0, video.duration)
            print("新しい音声を動画の長さに合わせて繰り返し調整しました。")
        
        final_video = video.set_audio(new_audio)
        final_video.write_videofile(output_path, codec='libx264', audio_codec='aac')
        print(f"出力ファイル '{output_path}' を作成しました。")
    except Exception as e:
        print(f"動画の音声置換中にエラーが発生しました: {e}")
    finally:
        video.close()
        new_audio.close()

def main():
    extract_audio(VIDEO_PATH, EXTRACTED_AUDIO_PATH)
    
    transcribe_audio(EXTRACTED_AUDIO_PATH, TRANSCRIPT_JSON_PATH, OPENAI_API_KEY)
    
    elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
    voice_id = clone_voice(ELEVENLABS_API_KEY, [EXTRACTED_AUDIO_PATH])
    if not voice_id:
        return
    
    generate_speech_segments(TRANSCRIPT_JSON_PATH, voice_id, elevenlabs_client, CHUNK_DIR)
    
    adjust_and_combine_audio(TRANSCRIPT_JSON_PATH, CHUNK_DIR, COMBINED_AUDIO_PATH)
    
    replace_audio_in_video(VIDEO_PATH, COMBINED_AUDIO_PATH, OUTPUT_MOVIE_PATH)

if __name__ == "__main__":
    main()
