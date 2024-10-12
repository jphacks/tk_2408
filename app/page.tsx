"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: string;
  timestamp: string;
}

const videos: Video[] = [
  {
    id: "1",
    title: "【黒3DIO】2023年お疲れ様♡よしよしASMR【健屋花那/にじさんじ】",
    thumbnail: "/thumb1.jpg",
    channel: "健屋花那【にじさんじ】KanaSukoya",
    views: "196万",
    timestamp: "2 days ago",
  },
  {
    id: "2",
    title: "イケメンかるた【火威青 】#hololiveDEV_IS #ReGLOSS",
    thumbnail: "/thumb2.jpg",
    channel: "Ao Ch. 火威青 ‐ ReGLOSS",
    views: "53万",
    timestamp: "1 week ago",
  },
  {
    id: "3",
    title: "【クイズ企画】私たちのイメージが丸裸に！？【#ReGLOSS印象調査】",
    thumbnail: "/thumb3.jpg",
    channel: "hololive DEV_IS",
    views: "321万",
    timestamp: "3 days ago",
  },
];

export default function Home() {
  const router = useRouter();

  const handleVideoClick = (video: Video) => {
    const queryString = new URLSearchParams({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      channel: video.channel,
      views: video.views,
      timestamp: video.timestamp,
    }).toString();
    router.push(`/video/${video.id}?${queryString}`);
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-foreground">
          あなたへのおすすめ
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="aspect-video relative">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2 text-foreground">
                    {video.title}
                  </h2>
                  <p className="text-sm text-gray-500">{video.views}回再生</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <h1 className="text-2xl font-bold mb-6 text-foreground mt-12">
          新着動画
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="aspect-video relative">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2 text-foreground">
                    {video.title}
                  </h2>
                  <p className="text-sm text-gray-500">{video.views}回再生</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
