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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    // Here you would typically upload the file to your server or a cloud storage service
    // For this example, we'll just simulate an upload with a timeout
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);

    // After successful upload, redirect to the video page (you'd use the actual video ID here)
    router.push("/video/new-video-id");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">動画を投稿する</h1>
        <form onSubmit={handleUpload} className="space-y-6 max-w-2xl mx-auto">
          <div className="space-y-2">
            <Label htmlFor="file">Video File</Label>
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
          <div className="space-y-2">
            <Label htmlFor="title">ユーザー名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名を入力"
              required
            />
          </div>
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
          </div> */}
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
