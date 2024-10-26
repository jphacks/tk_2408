"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !thumbnail) {
      alert("動画ファイルとサムネイル画像の両方をアップロードしてください。");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("post_movie", "");
    formData.append("title", title);
    formData.append("language", language);
    formData.append("tags", tags);
    formData.append("movie", file);
    formData.append("thumbnail", thumbnail);
    formData.append("category", category);

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
      console.log("Upload response:", response.data);
      if (response.data.error) {
        alert("エラー: " + response.data.error);
      } else if (response.data.success) {
        alert("アップロード成功！");
        router.push("/");
      } else {
        alert("不明なレスポンス。サーバーの応答を確認してください。");
      }
      setIsUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("アップロードに失敗しました。");
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">動画を投稿する</h1>
        <form onSubmit={handleUpload} className="space-y-6 max-w-2xl mx-auto">
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
            <div className="space-y-2">
              <Label htmlFor="file">動画ファイル</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
          {/* <div className="space-y-2">
            <Label htmlFor="title">ユーザー名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名を入力"
              required
            />
          </div> */}
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
          {/* <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="説明を入力"
              rows={4}
            />
          </div> */}
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
          <div className="space-y-2">
            <Label htmlFor="language">言語</Label>
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
            className="w-full"
          >
            {isUploading ? "アップロード中..." : "アップロード"}
          </Button>
        </form>
      </main>
    </div>
  );
}
