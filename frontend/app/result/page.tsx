"use client";

import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Minimize,
  Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import * as Slider from "@radix-ui/react-slider";
import screenfull from "screenfull";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Video } from "@/types/video";

export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]); // フィルタリング結果用の状態
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.post(
          "https://devesion.main.jp/jphacks/api/main.php",
          {
            get_movie_list: "",
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const query = searchParams.get("query"); // クエリパラメータから検索文字を取得
    if (query) {
      const filtered = videos.filter((video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) // タイトルでフィルタリング
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos); // 検索文字がない場合は全て表示
    }
  }, [videos, searchParams]);

  const handleNavigation = (video: Video) => {
    const params = new URLSearchParams();
    params.append("title", video.title);
    params.append("thumbnail_url", video.thumbnail_url);
    params.append("movie_url", video.movie_url);
    params.append("tags", video.tags);
    params.append("language", video.language);
    router.push(`/video/${video.movie_id}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full py-12 px-16">
        <main className="w-full px-12">
          <div className="grid grid-cols-1 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.movie_id}
                onClick={() => handleNavigation(video)}
                className="group cursor-pointer"
              >
                <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex">
                  <div className="w-1/2 aspect-video relative">
                    {video.thumbnail_url !== "" && video.thumbnail_url !== "1.png" ? (
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <Image
                        src="/thumb1.jpg"
                        alt={video.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="w-1/2 p-10">
                    <h2 className="text-lg font-semibold line-clamp-2 text-foreground">
                      {video.title}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
