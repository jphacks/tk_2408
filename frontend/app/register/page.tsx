"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Mail, Lock, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayLanguage, setDisplayLanguage] = useState("en"); // 初期値
  const [info, setInfo] = useState(""); // 説明フィールド
  const [thumbnail, setThumbnail] = useState<File | null>(null); // サムネイルファイル
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(""); // エラー
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // エラーをリセット

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("login", "");
      formData.append("user_name", username);
      formData.append("mail", email);
      formData.append("pass", password);
      formData.append("display_language", displayLanguage);
      formData.append("info", info);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail); // サムネイル画像を追加
      }

      const response = await axios.post(
        "https://devesion.main.jp/jphacks/api/main.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const isCreate = response.data.create;
      const isLogin = response.data.login;
      const userId = response.data.user_id;

      // ユーザーIDをローカルストレージに保存
      if (userId) {
        localStorage.setItem("userId", userId);
      }

      if (!isCreate && isLogin) {
        setError("すでにアカウントがあります。ログインしてください。");
        return;
      }
      if (isCreate && !isLogin) {
        router.push("/complete-register");
      } else {
        Array.from(formData.entries()).forEach(([key, value]) => {
          console.log(key, value);
        });

        console.log(response.data)
    
        setError(
          "新規登録に失敗しました。メールアドレスとパスワードを確認してください。"
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("登録中にエラーが発生しました。後でもう一度お試しください。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#face56] to-[#00ffff]">
      <div className="max-w-md w-full space-y-8 p-10 bg-background rounded-3xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-extrabold text-foreground">
            新規登録
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
                name="email"
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
                name="password"
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
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="pl-10"
                placeholder="パスワード確認"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="username" className="sr-only">
                ユーザー名
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="pl-10"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="relative">
              <label htmlFor="display-language" className="block">
                表示言語
              </label>
              <select
                id="display-language"
                name="display-language"
                value={displayLanguage}
                onChange={(e) => setDisplayLanguage(e.target.value)}
                className="block w-full p-2 border rounded-md text-muted-foreground"
                required
              >
                <option value="en">english</option>
                <option value="ja">japanese</option>
              </select>
            </div>
            <div className="relative">
              <textarea
                id="info"
                name="info"
                placeholder="自己紹介や説明"
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                required
                className="w-full p-3 border rounded-md"
              ></textarea>
            </div>
            <div className="relative">
              <label htmlFor="thumbnail" className="block">
                サムネイル画像
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                className="block mt-4 w-full text-sm text-muted-foreground"
              />
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
              新規登録
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
