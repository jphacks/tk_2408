"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("pass");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // エラーをリセット
    try {
      const response = await axios.post(
        "https://devesion.main.jp/jphacks/api/main.php",
        {
          login: "",
          mail: email,
          pass: password,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const isLogin = response.data.login;
      const isCreate = response.data.create;
      const userId = response.data.user_id;
      const displayLanguage = response.data.display_language; // display_languageを取得
  
      // ユーザーIDと表示言語をローカルストレージに保存
      if (userId) {
        localStorage.setItem("userId", userId);
      }
      if (displayLanguage) {
        localStorage.setItem("displayLanguage", displayLanguage);
      }
  
      if (!isCreate && isLogin) {
        router.push("/");
      } else if (isCreate && !isLogin) {
        router.push("/complete-register");
      } else {
        setError(
          "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "ログイン中にエラーが発生しました。後でもう一度お試しください。"
      );
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500">
      <div className="max-w-md w-full space-y-8 p-10 bg-background rounded-3xl shadow-2xl transform transition-all hover:scale-105">
        <div className="flex flex-col items-center">
          {/* ロゴの追加 */}
          <Image
            src="/vany-logo.png" // ロゴのパス
            alt="YourTube Logo"
            width={120} // 適宜サイズを調整
            height={120}
            className="mb-4" // 下に余白を追加
            priority
          />
          <h2 className="mt-2 text-2xl font-extrabold text-foreground text-center">
            ログイン
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">メールアドレス</label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="pl-10 bg-background text-foreground"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">パスワード</label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="pl-10 bg-background text-foreground"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-muted-foreground rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-muted-foreground"
              >
                ログイン情報を記憶する
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                パスワードを忘れた場合
              </Link>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div>
            <Button
              type="submit"
              className="w-full bg-foreground text-background font-medium py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              ログイン
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            アカウントをお持ちですか？{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
