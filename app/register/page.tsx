"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(""); // 追加
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // エラーをリセット
    try {
      console.log(email, password);
      const response = await axios.post('https://devesion.main.jp/jphacks/api/main.php', {
        login: '',
        mail: email,
        pass: password
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const isCreate = response.data.create;
      const isLogin = response.data.login;
      console.log(isCreate);
      console.log(isLogin);
      if (!isCreate && isLogin) {
        setError("すでにアカウントがあります。ログインしてください。");
        return
      }
      if (isCreate && !isLogin) {
        router.push("/complete-register");
      } else {
        setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
      }
    } catch (error) {
      console.log(error);
      console.error("Login error:", error);
      setError("ログイン中にエラーが発生しました。後でもう一度お試しください。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#face56] to-[#00ffff]">
      <div className="max-w-md w-full space-y-8 p-10 bg-background rounded-3xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-extrabold text-foreground">
            新規登録
          </h2>
          {/* <p className="mt-2 text-sm text-muted-foreground">
            TransTubeアカウントを作成する
          </p> */}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* <div className="relative">
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
            </div> */}
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
              <label htmlFor="confirm-password" className="sr-only">
                パスワード確認
              </label>
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
