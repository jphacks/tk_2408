"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, Repeat2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import axios from "axios";
export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleTop = () => {
    router.push("/");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !thumbnail) {
      setModalState({
        isOpen: true,
        title: "エラー",
        message:
          "動画ファイルとサムネイル画像の両方をアップロードしてください。",
      });
      return;
    }
    setIsUploading(true);
    setIsProcessing(true);
    setError("");

    let processedVideoUrl = "";

    try {
      const flaskFormData = new FormData();
      flaskFormData.append("video", file);

      const flaskResponse = await fetch(
        "https://flask-app-706273948152.asia-northeast1.run.app/upload",
        {
          method: "POST",
          body: flaskFormData,
        }
      );

      if (flaskResponse.ok) {
        const flaskData = await flaskResponse.json();
        processedVideoUrl = `https://flask-app-706273948152.asia-northeast1.run.app/download/${flaskData.output_path
          .split("/")
          .pop()}`;
        setProcessedVideoUrl(processedVideoUrl);
      } else {
        console.warn(
          "Flask server is not responding. Continuing with original video."
        );
      }
    } catch (error) {
      console.error("Error communicating with Flask server:", error);
      console.warn("Continuing with original video.");
    } finally {
      setIsProcessing(false);
    }

    const formData = new FormData();
    formData.append("post_movie", "");
    formData.append("title", title);
    formData.append("language", language);
    formData.append("tags", tags);

    // 処理済み動画の取得とアップロードを修正
    if (processedVideoUrl) {
      try {
        const response = await fetch(processedVideoUrl);
        if (!response.ok) throw new Error("Failed to fetch processed video");

        const blob = await response.blob();
        const originalFileName = file?.name || "video";
        const timestamp = new Date().getTime();
        const processedFileName = `processed_${timestamp}_${originalFileName}`;

        const processedFile = new File([blob], processedFileName, {
          type: "video/mp4",
        });
        formData.append("movie", processedFile);
      } catch (error) {
        console.error("Error downloading processed video:", error);
        if (file) {
          formData.append("movie", file);
        } else {
          throw new Error(
            "処理済み動画のダウンロードに失敗し、元のファイルも見つかりません。"
          );
        }
      }
    } else {
      // 処理済み動画がない場合は元の動画を使用
      formData.append("movie", file);
    }
    formData.append("thumbnail", thumbnail);
    formData.append("category", category);

    // localStorageからchannel_idを取得
    const channelId = localStorage.getItem("channelId");
    if (!channelId) {
      setModalState({
        isOpen: true,
        title: "エラー",
        message: "チャンネルIDが見つかりません。ログインしてください。",
      });
      setIsUploading(false);
      return;
    }
    formData.append("channel_id", channelId);

    try {
      const response = await axios.post(
        "https://devesion.main.jp/jphacks/api/main.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.error) {
        setModalState({
          isOpen: true,
          title: "エラー",
          message: "エラー: " + response.data.error,
        });
      } else if (response.data.success) {
        setModalState({
          isOpen: true,
          title: "成功",
          message: "アップロード成功！",
        });
      } else {
        setModalState({
          isOpen: true,
          title: "警告",
          message: "不明なレスポンス。サーバーの応答を確認してください。",
        });
      }
      setIsUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setModalState({
        isOpen: true,
        title: "エラー",
        message: "アップロードに失敗しました。",
      });
      setIsUploading(false);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };
  const handleGoHome = () => {
    router.push("/");
  };
  const handleReset = () => {
    setModalState({
      isOpen: false,
      title: "",
      message: "",
    });
    setFile(null);
    setThumbnail(null);
    setTitle("");
    setCategory("");
    setLanguage("");
    setTags("");
    setProcessedVideoUrl("");
    setError("");
    setProgress(0);
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!processedVideoUrl && (
          <form onSubmit={handleUpload} className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
              動画を投稿する
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">サムネイル画像</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="thumbnail"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition duration-300 ease-in-out"
                  >
                    {thumbnail ? (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(thumbnail)}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm">クリックして変更</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            クリックしてアップロード
                          </span>
                          またはドラッグ＆ドロップ
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPEG, PNG, GIF (最大 2MB)
                        </p>
                      </div>
                    )}
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                      onChange={handleThumbnailChange}
                      required
                    />
                  </label>
                </div>
                {thumbnail && (
                  <div className="flex items-center justify-between p-2 mt-2 bg-gray-100 rounded">
                    <span className="text-sm truncate">{thumbnail.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setThumbnail(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">動画ファイル</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full h-40 md:h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          クリックしてアップロード
                        </span>
                        またはドロップ
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        MP4, WebM or OGG (MAX. 2GB)
                      </p>
                    </div>
                    <Input
                      id="file"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {file && (
                  <div className="flex items-center justify-between p-2 mt-2 bg-gray-100 rounded">
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="タイトルを入力"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">カテゴリ</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entertainment">
                      エンターテイメント
                    </SelectItem>
                    <SelectItem value="education">教育</SelectItem>
                    <SelectItem value="sports">スポーツ</SelectItem>
                    <SelectItem value="technology">テクノロジー</SelectItem>
                    <SelectItem value="music">音楽</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">翻訳したい言語</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="言語を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="japanese">日本語</SelectItem>
                  <SelectItem value="english">英語</SelectItem>
                  <SelectItem value="chinese">中国語</SelectItem>
                  <SelectItem value="korean">韓国語</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={!file || isUploading}
              className="w-full md:w-auto"
            >
              {isUploading ? "アップロード中..." : "アップロード"}
            </Button>
          </form>
        )}
      </main>
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        message={modalState.message}
      >
        {modalState.title === "成功" && (
          <>
            <div className="space-y-6">
              <div className="aspect-w-16 aspect-h-9">
                <video
                  className="rounded-lg w-full"
                  controls
                  src={processedVideoUrl}
                >
                  お使いのブラウザは動画の再生に対応していません。
                </video>
              </div>

              <div className="flex space-x-4">
                <a
                  href={processedVideoUrl}
                  download
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <ArrowDownToLine className="-ml-1 mr-2 h-5 w-5" />
                  ダウンロード
                </a>
                <button
                  onClick={handleReset}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Repeat2 className="-ml-1 mr-2 h-5 w-5" />
                  新しい動画を投稿
                </button>
              </div>
            </div>
            <Button
              onClick={handleGoHome}
              className="mt-4 px-16 text-white font-bold bg-blue-600 hover:bg-blue-700 transition duration-300 w-full"
            >
              TOPへ
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}
