"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Image,
  FileText,
  Globe,
} from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Make sure this component exists
import axios from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [channelName, setChannelName] = useState("");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("create_vtuber", "");
    formData.append("vmail", email);
    formData.append("vpass", password);
    formData.append("vname", channelName);
    if (bannerImage) formData.append("vbanner", bannerImage);
    formData.append("vdescription", description);
    formData.append("vlanguage", language);

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
      console.log(response.data);
      const isLogin = response.data.login;
      const isCreate = response.data.create;
      const channelId = response.data.channel_id;

      // チャンネルIDをローカルストレージに保存
      if (channelId) {
        localStorage.setItem("channelId", channelId);
      }

      if (!isLogin && isCreate) {
        router.push("/complete-register");
      } else if (isLogin && !isCreate) {
        router.push("/");
      } else {
        setError("登録に失敗しました。入力内容を確認してください。");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("登録中にエラーが発生しました。後でもう一度お試しください。");
    }
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setBannerImage(file);
    setBannerPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    multiple: false,
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#face56] to-[#00ffff]">
      <div className="max-w-xl w-full space-y-8 p-10 bg-background rounded-3xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-extrabold text-foreground">
            VTuber新規登録
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">
                メールアドレス
              </label>
              <Input
                id="email-address"
                name="vmail"
                type="email"
                autoComplete="email"
                required
                className="pl-10"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <Input
                id="password"
                name="vpass"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="pl-10"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="channel-name" className="sr-only">
                チャンネル名
              </label>
              <Input
                id="channel-name"
                name="vname"
                type="text"
                required
                className="pl-10"
                placeholder="チャンネル名"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="relative">
              <label
                htmlFor="banner-image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                バナー画像
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                <input {...getInputProps()} id="banner-image" name="vbanner" />
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="mx-auto max-h-40 object-contain"
                  />
                ) : (
                  <div>
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      クリックまたはドラッグ＆ドロップでバナー画像をアップロード
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                説明
              </label>
              <div className="relative">
                <Textarea
                  id="description"
                  name="vdescription"
                  required
                  className="pl-10 pt-3"
                  placeholder="チャンネルの説明"
                  value={description}
                  rows={3}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="language" className="sr-only">
                言語
              </label>
              <Input
                id="language"
                name="vlanguage"
                type="text"
                required
                className="pl-10"
                placeholder="言語"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div>
            <Button
              type="submit"
              className="w-full bg-black hover:bg-black/90 text-white font-medium py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              VTuber登録
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            アカウントをお持ちですか？{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
