"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterCompletePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#face56] to-[#00ffff]">
      <div className="max-w-md w-full space-y-8 p-10 bg-background rounded-3xl shadow-2xl transform transition-all hover:scale-105">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-2xl font-extrabold text-foreground">
            登録完了
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            アカウントの作成が完了しました。
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-center text-muted-foreground">
            ようこそ！ Vanyをお楽しみください。
          </p>
          <div>
            <Link href="/">
              <Button
                className="w-full bg-black hover:bg-black/90 text-white font-medium py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                ホームへ戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}