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
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const searchParams = useSearchParams();
  const [videoData, setVideoData] = useState({
    title: "",
    movie_url: "",
    thumbnail_url: "",
    channelName: "",
    tags: "",
    language: "",
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setVideoData({
      title: searchParams.get("title") || "",
      movie_url: searchParams.get("movie_url") || "",
      thumbnail_url: searchParams.get("thumbnail_url") || "",
      channelName: searchParams.get("channelName") || "",
      tags: searchParams.get("tags") || "",
      language: searchParams.get("language") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    // Check for userId or vtubeId in localStorage
    const userId = localStorage.getItem("userId");
    const vtubeId = localStorage.getItem("channelId");

    if (!userId && !vtubeId) {
      // Redirect to login page if neither exists
      router.push("/login");
      return;
    }
  }, [router]);

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(screenfull.isFullscreen);
    };

    if (screenfull.isEnabled) {
      screenfull.on("change", handleFullscreenChange);
    }

    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", handleFullscreenChange);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (showThumbnail) {
      setShowThumbnail(false);
      setPlaying(true);
    } else if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  useEffect(() => {
    if (!showThumbnail && videoRef.current) {
      if (playing) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [showThumbnail, playing]);

  const handleVolumeChange = (newValue: number[]) => {
    const newVolume = newValue[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleToggleMute = () => {
    setMuted(!muted);
    if (videoRef.current) {
      videoRef.current.muted = !muted;
    }
  };

  const handleSeekChange = (newValue: number[]) => {
    const newTime = newValue[0];
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleToggleFullscreen = () => {
    if (videoContainerRef.current && screenfull.isEnabled) {
      screenfull.toggle(videoContainerRef.current);
    }
  };
  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

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
            {videos.map((video) => (
              <div
                key={video.movie_id}
                onClick={() => handleNavigation(video)}
                className="group cursor-pointer"
              >
                <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex">
                  {/* 画像を左側に配置 */}
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
                  {/* テキストを右側に配置 */}
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
