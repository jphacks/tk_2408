"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert('ファイルを選択してください');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<{ filename: string }>('http://127.0.0.1:5000/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.filename);
    } catch (error) {
      console.error('エラーが発生しました:', error);
      alert('アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>ファイルアップロード</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </form>
      {result && (
        <div>
          <h3>処理結果</h3>
          <a href={`http://127.0.0.1:5000/outputs/${result}`} target="_blank" rel="noopener noreferrer">
            処理済みファイルを表示
          </a>
        </div>
      )}
    </div>
  );
}
