"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

export default function VideoPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const channel = searchParams.get("channel");
  const views = searchParams.get("views");
  const description = searchParams.get("description");

  if (!title) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <div className="aspect-video bg-black mb-4">
          <div className="w-full h-full flex items-center justify-center text-white">
            Video Player Placeholder
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">{views}回再生</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              100K
            </Button>
            <Button variant="outline" size="sm">
              <ThumbsDown className="mr-2 h-4 w-4" />
              Dislike
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        <div className="border-t border-b py-4 mb-4">
          <h2 className="font-semibold mb-2">{channel}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </main>
    </div>
  );
}
