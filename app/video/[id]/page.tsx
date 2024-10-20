"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Video } from "@/types/video";
import { VideoDescription } from "@/types/video_description";
import { useEffect, useState } from "react";

const videos: VideoDescription[] = [
  {
    id: "1",
    title: "【黒3DIO】2023年お疲れ様♡よしよしASMR【健屋花那/にじさんじ】",
    description: "健屋花那【にじさんじ】KanaSukoya",
    channelId: "111",
    channelName: "健屋花那【にじさんじ】KanaSukoya",
    channelAvatar: "/icon1.jpg",
    views: "196万",
    likes: "100K",
  },
  {
    id: "2",
    title: "イケメンかるた【火威青 】#hololiveDEV_IS #ReGLOSS",
    description: "Ao Ch. 火威青 ‐ ReGLOSS",
    channelId: "112",
    channelName: "Ao Ch. 火威青 ‐ ReGLOSS",
    channelAvatar: "/icon2.jpg",
    views: "53万",
    likes: "100K",
  },
  {
    id: "3",
    title: "【クイズ企画】私たちのイメージが丸裸に！？【#ReGLOSS印象調査】",
    description: "hololive DEV_IS",
    channelId: "113",
    channelName: "hololive DEV_IS",
    channelAvatar: "/icon3.jpg",
    views: "321万",
    likes: "100K",
  },
];

const fetchVideoData = async (id: string): Promise<VideoDescription> => {
  const video = videos.find((video) => video.id === id);
  if (!video) {
    throw new Error("Video not found");
  }
  return video;
};

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<VideoDescription | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      const data = await fetchVideoData(id as string);
      setVideo(data);
    };
    loadVideo();
  }, [id]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <div className="aspect-video bg-black mb-4">
          {/* Replace this div with an actual video player component */}
          <div className="w-full h-full flex items-center justify-center text-white">
            Video Player Placeholder
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <div className="flex items-center justify-between mb-4">
          <Link
            href={`/channel/${video.channelId}`}
            className="flex items-center space-x-2 group"
          >
            <Image
              src={video.channelAvatar}
              alt={video.channelName}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-semibold group-hover:text-primary transition-colors">
              {video.channelName}
            </span>
          </Link>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              {video.likes}
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
        <div className="text-sm text-muted-foreground mb-4">
          {video.views}回再生
        </div>
        <div className="border-t border-b py-4 mb-4">
          <p className="text-sm text-muted-foreground">{video.description}</p>
        </div>
        {/* Add a comment section here */}
      </main>
    </div>
  );
}
