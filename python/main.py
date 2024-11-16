import os
import json
from flask import Flask, request, render_template, jsonify, send_file
from werkzeug.utils import secure_filename
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_audioclips
from pydub import AudioSegment
from openai import OpenAI
from elevenlabs import ElevenLabs, VoiceSettings
from dotenv import load_dotenv
from flask_cors import CORS
# CORSの設定
app = Flask(__name__)
CORS(app)  # これですべてのエンドポイントにCORSが適用されます

# .envファイルから環境変数を読み込む
load_dotenv()

# 環境変数からAPIキーを取得
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
# ファイルパスの設定
UPLOAD_FOLDER = 'uploads/videos'
EXTRACTED_AUDIO_DIR = 'extracted_audio'
OUTPUT_DIR = 'outputs'
CHUNK_DIR = 'chunk'
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi'}

# Flaskアプリの設定
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit

# 必要なディレクトリの作成
for directory in [UPLOAD_FOLDER, EXTRACTED_AUDIO_DIR, OUTPUT_DIR, CHUNK_DIR]:
    os.makedirs(directory, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class VideoProcessor:
    def __init__(self, video_path):
        self.video_path = video_path
        self.extracted_audio_path = os.path.join(EXTRACTED_AUDIO_DIR, 'extracted_audio.mp3')
        self.transcript_path = os.path.join(OUTPUT_DIR, 'transcript.json')
        self.combined_audio_path = os.path.join(OUTPUT_DIR, 'combined_output.mp3')
        self.output_video_path = os.path.join(OUTPUT_DIR, 'output.mp4')

    def extract_audio(self):
        try:
            video = VideoFileClip(self.video_path)
            video.audio.write_audiofile(self.extracted_audio_path)
            video.close()
            return True
        except Exception as e:
            print(f"音声抽出中にエラーが発生しました: {e}")
            return False

    def transcribe_audio(self):
        try:
            openai_client = OpenAI(api_key=OPENAI_API_KEY)
            with open(self.extracted_audio_path, "rb") as audio_file:
                transcript = openai_client.audio.translations.create(
                    model="whisper-1",
                    response_format="verbose_json",
                    file=audio_file
                )
            with open(self.transcript_path, "w", encoding="utf-8") as json_file:
                json.dump(transcript.model_dump(), json_file, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"音声の転写中にエラーが発生しました: {e}")
            return False

    def clone_voice(self):
        try:
            elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
            voice = elevenlabs_client.clone(
                name="Cloned Voice",
                description="Input video's cloned voice",
                files=[self.extracted_audio_path],
            )
            return voice.voice_id
        except Exception as e:
            print(f"声のクローン中にエラーが発生しました: {e}")
            return None

    def generate_speech_segments(self, voice_id):
        try:
            elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
            with open(self.transcript_path, "r", encoding="utf-8") as json_file:
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
                    chunk_path = os.path.join(CHUNK_DIR, f"chunk_{segment_id}.mp3")
                    with open(chunk_path, "wb") as audio_file:
                        for audio_chunk in audio:
                            audio_file.write(audio_chunk)
            return True
        except Exception as e:
            print(f"音声生成中にエラーが発生しました: {e}")
            return False

    def adjust_and_combine_audio(self):
        try:
            with open(self.transcript_path, "r", encoding="utf-8") as json_file:
                transcript_data = json.load(json_file)
            
            combined_audio = AudioSegment.empty()
            
            for segment in transcript_data.get("segments", []):
                start = segment.get("start")
                end = segment.get("end")
                segment_id = segment.get("id")
                
                audio_path = os.path.join(CHUNK_DIR, f"chunk_{segment_id}.mp3")
                
                if os.path.exists(audio_path):
                    audio = AudioSegment.from_mp3(audio_path)
                    generated_duration = len(audio) / 1000
                    original_duration = end - start
                    
                    # 音声の長さを調整
                    if generated_duration < original_duration:
                        silence = AudioSegment.silent(duration=int((original_duration - generated_duration) * 1000))
                        adjusted_audio = audio + silence
                    elif generated_duration > original_duration:
                        speed_factor = generated_duration / original_duration
                        adjusted_audio = audio.speedup(playback_speed=speed_factor)
                        adjusted_audio = adjusted_audio[:int(original_duration * 1000)]
                    else:
                        adjusted_audio = audio
                    
                    # タイミング調整
                    current_length = len(combined_audio) / 1000
                    if start > current_length:
                        silence = AudioSegment.silent(duration=int((start - current_length) * 1000))
                        combined_audio += silence
                    
                    combined_audio += adjusted_audio
            
            combined_audio.export(self.combined_audio_path, format="mp3")
            return True
        except Exception as e:
            print(f"音声の結合中にエラーが発生しました: {e}")
            return False

    def replace_audio_in_video(self):
        try:
            video = VideoFileClip(self.video_path)
            new_audio = AudioFileClip(self.combined_audio_path)
            
            if new_audio.duration > video.duration:
                new_audio = new_audio.subclip(0, video.duration)
            elif new_audio.duration < video.duration:
                repeats = int(video.duration // new_audio.duration) + 1
                new_audio = concatenate_audioclips([new_audio] * repeats).subclip(0, video.duration)
            
            final_video = video.set_audio(new_audio)
            final_video.write_videofile(self.output_video_path, codec='libx264', audio_codec='aac')
            
            video.close()
            new_audio.close()
            return True
        except Exception as e:
            print(f"動画の音声置換中にエラーが発生しました: {e}")
            return False

    def process_video(self):
        if not self.extract_audio():
            return {"success": False, "error": "音声の抽出に失敗しました"}
        
        if not self.transcribe_audio():
            return {"success": False, "error": "音声の転写に失敗しました"}
        
        voice_id = self.clone_voice()
        if not voice_id:
            return {"success": False, "error": "声のクローンに失敗しました"}
        
        if not self.generate_speech_segments(voice_id):
            return {"success": False, "error": "音声セグメントの生成に失敗しました"}
        
        if not self.adjust_and_combine_audio():
            return {"success": False, "error": "音声の結合に失敗しました"}
        
        if not self.replace_audio_in_video():
            return {"success": False, "error": "動画の音声置換に失敗しました"}
        
        return {"success": True, "output_path": self.output_video_path}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'video' not in request.files:
        return jsonify({'error': 'ビデオファイルがありません'}), 400
    
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'ファイルが選択されていません'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        processor = VideoProcessor(filepath)
        result = processor.process_video()
        
        if result["success"]:
            return jsonify({'message': '処理が完了しました', 'output_path': result["output_path"]}), 200
        else:
            return jsonify({'error': result["error"]}), 500
    
    return jsonify({'error': '許可されていないファイル形式です'}), 400

@app.route('/download/<filename>')
def download_file(filename):
    return send_file(os.path.join(OUTPUT_DIR, filename), as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, port=8080)

