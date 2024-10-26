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
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import * as Slider from "@radix-ui/react-slider";
import screenfull from "screenfull";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function VideoPage() {
  const [isClient, setIsClient] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
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

  useEffect(() => {
    setIsClient(true);
    setVideoData({
      title: searchParams.get("title") || "",
      movie_url: searchParams.get("movie_url") || "",
      thumbnail_url: searchParams.get("thumbnail_url") || "",
      channelName: searchParams.get("channelName") || "",
      tags: searchParams.get("tags") || "",
      language: searchParams.get("language") || "",
    });
  }, [searchParams]);

  if (!videoData) {
    return <div>Loading...</div>;
  }

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
  const handlePlayPause = () => setPlaying(!playing);
  const handleVolumeChange = (newValue: number[]) => setVolume(newValue[0]);
  const handleToggleMute = () => setMuted(!muted);
  const handleSeekChange = (newValue: number[]) => {
    setPlayed(newValue[0]);
    setSeeking(true);
  };

  const handleSeekMouseUp = () => {
    console.log("seeking", played);
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(played, "fraction");
    }
  };
  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };
  const handleToggleFullscreen = () => {
    if (videoContainerRef.current && screenfull.isEnabled) {
      screenfull.toggle(videoContainerRef.current);
    }
  };
  const handleDuration = (duration: number) => {
    setDuration(duration);
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
      <main className="container mx-auto py-8">
        <div className="bg-black">
          <div className="max-w-3xl mx-auto relative">
            <div ref={videoContainerRef} className="aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center">
                {isClient && (
                  <ReactPlayer
                    ref={playerRef}
                    url={videoData.movie_url}
                    width="100%"
                    height="100%"
                    playing={playing}
                    volume={volume}
                    muted={muted}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                  />
                )}
              </div>
            </div>
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
                  {formatTime(played * duration)} / {formatTime(duration)}
                </div>
              </div>
              <div className="flex-grow mx-4">
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[played]}
                  max={1}
                  step={0.001}
                  onValueChange={handleSeekChange}
                  onValueCommit={handleSeekMouseUp}
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
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">{videoData.title}</h1>
          <div className="flex space-x-2 mb-4">
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Like
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
          {videoData.tags}
        </div>
        <div className="border-t border-b py-4 mb-4">
          <h2 className="font-semibold mb-2">{videoData.channelName}</h2>
          <p className="text-sm text-muted-foreground">
            Language: {videoData.language}
          </p>
        </div>
        {/* Add a comment section here */}
      </main>
    </div>
  );
}
