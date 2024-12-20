"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Header from "@/components/Header";
import { Video } from "@/types/video";
import { useRouter } from "next/navigation";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
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
        console.log(response.data)
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
    params.append("id", video.movie_id);
    router.push(`/video/${video.movie_id}?${params.toString()}`);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const vtubeId = localStorage.getItem("channelId");

    if (!userId && !vtubeId) {
      router.push("/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    setFilteredVideos(
      selectedLanguage === "all"
        ? videos
        : videos.filter((video) => video.language === selectedLanguage)
    );
  }, [videos, selectedLanguage]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            あなたへのおすすめ
          </h1>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="bg-card text-foreground border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">言語を選択</option>
            <option value="japanese">日本語</option>
            <option value="english">英語</option>
            {/* 他の言語オプションを必要に応じて追加 */}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.movie_id}
              onClick={() => handleNavigation(video)}
              className="group cursor-pointer"
            >
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
                      src="/thumb1.jpg"
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
