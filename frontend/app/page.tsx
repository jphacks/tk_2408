"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { Video } from "@/types/video";
import { useRouter } from "next/navigation";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
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
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);
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
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-foreground">
          あなたへのおすすめ
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <button
              onClick={() => handleNavigation(video)}
              key={video.movie_id}
              className="group"
            >
              <div key={video.movie_id} className="group cursor-pointer">
                <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <div className="aspect-video relative">
                    {video.thumbnail_url !== "" &&
                    video.thumbnail_url !== "1.png" ? (
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <Image
                        src={"/thumb1.jpg"}
                        alt={video.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold line-clamp-2 text-foreground">
                      {video.title}
                    </h2>
                    {/* <p className="text-sm text-gray-500">{video.views}回再生</p> */}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {/* <h1 className="text-2xl font-bold mb-6 text-foreground mt-12">
          新着動画
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link href={`/video/${video.id}`} key={video.id} className="group">
              <div key={video.id} className="group cursor-pointer">
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
            </Link>
          ))}
        </div> */}
      </main>
    </div>
  );
}
