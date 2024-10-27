"use client";

import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("ファイルを選択してください");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data.filename);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("アップロードに失敗しました");
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
          {uploading ? "アップロード中..." : "アップロード"}
        </button>
      </form>
      {result && (
        <div>
          <h3>処理結果</h3>
          <a
            href={`http://127.0.0.1:5000/outputs/${result}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            処理済みファイルを表示
          </a>
        </div>
      )}
    </div>
  );
}
