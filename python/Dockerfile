# ベースイメージの指定
FROM python:3.10-slim

# 作業ディレクトリの設定
WORKDIR /app

# 必要なパッケージのインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 必要なファイルをコンテナ内にコピー
COPY requirements.txt requirements.txt
COPY app.py app.py
COPY templates/ templates/

# 依存関係のインストール
RUN pip install --no-cache-dir -r requirements.txt

# ポートの指定
EXPOSE 8080

# アプリケーションの起動コマンド
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--timeout", "3600", "app:app"]