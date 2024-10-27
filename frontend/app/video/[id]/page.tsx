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

export default function VideoPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 lg:px-0">
        <div className="bg-black">
          <div className="max-w-6xl mx-auto relative">
            <div ref={videoContainerRef} className="w-full">
              {showThumbnail ? (
                <div className="relative">
                  <img
                    src={videoData.thumbnail_url}
                    alt={videoData.title}
                    className="w-full h-auto"
                  />
                  <Button
                    variant="ghost"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-md px-6 py-6 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 shadow-lg flex items-center hover:text-white"
                    onClick={handlePlayPause}
                  >
                    <Play className="h-6 w-6 mr-2" />
                    Play
                  </Button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoData.movie_url}
                  className="w-full h-auto"
                  onTimeUpdate={handleTimeUpdate}
                  onDurationChange={handleDurationChange}
                />
              )}
            </div>
          </div>
          <div className="bg-gray-800 w-full">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-primary transition-colors"
                    onClick={handlePlayPause}
                  >
                    {playing ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
                <div className="flex-grow mx-4">
                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSeekChange}
                  >
                    <Slider.Track className="bg-gray-600 relative grow rounded-full h-1">
                      <Slider.Range className="absolute bg-white rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb
                      className="block w-4 h-4 bg-white rounded-full focus:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-opacity-75"
                      aria-label="Seek"
                    />
                  </Slider.Root>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-primary transition-colors"
                      onClick={handleToggleMute}
                    >
                      {muted ? (
                        <VolumeX className="h-6 w-6" />
                      ) : (
                        <Volume2 className="h-6 w-6" />
                      )}
                    </Button>
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-24 h-5"
                      value={[muted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                    >
                      <Slider.Track className="bg-gray-600 relative grow rounded-full h-1">
                        <Slider.Range className="absolute bg-white rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb
                        className="block w-4 h-4 bg-white rounded-full focus:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-opacity-75"
                        aria-label="Volume"
                      />
                    </Slider.Root>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-primary transition-colors"
                    onClick={handleToggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-6 w-6" />
                    ) : (
                      <Maximize className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-12xl mx-auto mt-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {videoData.title}
          </h1>
          <div className="mb-4">
            <p className="text-base text-muted-foreground">
              Language: {videoData.language}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-grow sm:flex-grow-0"
            >
              <ThumbsUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Like</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-grow sm:flex-grow-0"
            >
              <ThumbsDown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Dislike</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-grow sm:flex-grow-0"
            >
              <Share2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
        {/* Add a comment section here */}
      </main>
    </div>
  );
}
