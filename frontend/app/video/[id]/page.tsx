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
  User,
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

interface Comment {
  comment_id: number;
  comment: string;
  comment_ja?: string;
  comment_en?: string;
  display_language?: string;
  user_id: string;
  username: string;
  icon_url?: string;
  likes?: number;
  dislikes?: number;
  timestamp?: string;
}

export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
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
  const [comment, setComment] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);

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
    const userId = localStorage.getItem("userId");
    const vtubeId = localStorage.getItem("channelId");

    if (!userId && !vtubeId) {
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
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const videoId = searchParams.get("id") || "";
    const fetchComments = async () => {
      try {
        const response = await axios.post(
          "https://devesion.main.jp/jphacks/api/main.php",
          {
            get_comment: "",
            movie_id: videoId,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setComments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchComments();
  }, [searchParams]);

  useEffect(() => {
    const displayLanguage = localStorage.getItem("displayLanguage") || "all";
  
    const filterComments = () => {
      if (displayLanguage === "all") {
        setFilteredComments(comments);
      } else {
        if(displayLanguage === "japanese"){
          const filtered = comments.map((comment) => ({
            ...comment,
            comment: comment.comment_ja, // comment をそのまま使用。undefined の場合は空文字列
          }));
          setFilteredComments(filtered as Comment[]); // 型アサーション
        }else if(displayLanguage === "english"){
          const filtered = comments.map((comment) => ({
            ...comment,
            comment: comment.comment_en, // comment をそのまま使用。undefined の場合は空文字列
          }));
          setFilteredComments(filtered as Comment[]); // 型アサーション
        }
      }
    };
  
    filterComments();
  }, [comments]);
  
  


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
    params.append("id", video.movie_id);
    router.push(`/video/${video.movie_id}?${params.toString()}`);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User is not logged in. Please log in to comment.");
      return;
    }

    const videoId = searchParams.get("id") || "";
    if (!videoId) {
      alert("No video selected.");
      return;
    }

    try {
      const response = await axios.post(
        "https://devesion.main.jp/jphacks/api/main.php",
        {
          add_comment: "",
          user_id: userId,
          movie_id: videoId,
          comment: comment.trim(),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );

      if (response.status === 200) {
        setComment("");
      } else {
        console.error("Failed to add comment:", response);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col lg:flex-row w-full py-12 px-4 md:px-8 lg:px-16 gap-8">
        {/* メインビデオ表示エリア */}
        <main className="lg:w-3/5 flex flex-col gap-6">
          <div className="bg-black">
            <div className="w-full aspect-video relative">
              <div ref={videoContainerRef} className="relative w-full h-full">
                {showThumbnail ? (
                  <div className="relative w-full h-full">
                    <img
                      src={videoData.thumbnail_url}
                      alt={videoData.title}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-md px-6 py-3 lg:px-8 lg:py-4 hover:scale-105 transition-all duration-300"
                      onClick={handlePlayPause}
                    >
                      <Play className="h-6 w-6 lg:h-8 lg:w-8 mr-2" />
                      Play
                    </Button>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={videoData.movie_url}
                    className="w-full h-full object-cover"
                    onTimeUpdate={handleTimeUpdate}
                    onDurationChange={handleDurationChange}
                    controls
                  />
                )}
              </div>
            </div>
          </div>
          {/* ビデオタイトルと詳細 */}
          <div className="mt-4">
            <h1 className="text-lg md:text-2xl font-bold mb-2">{videoData.title}</h1>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              Language: {videoData.language}
            </p>
          </div>
          {/* コメントセクション */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">コメント({comments.length})</h2>
            <div className="border-t border-gray-300 py-4">
              {/* コメント入力 */}
              <div className="flex items-start mb-4 gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="text-gray-500 w-6 h-6" />
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Add a public comment..."
                    rows={2}
                    value={comment}
                    onChange={handleCommentChange}
                  ></textarea>
                  <div className="flex justify-end mt-2 gap-2">
                    <button
                      className="bg-gray-200 text-gray-700 py-1 px-3 rounded-lg"
                      onClick={() => setComment("")}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                      onClick={handleCommentSubmit}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
              {/* コメントリスト */}
              {filteredComments.length > 0 ? (
                filteredComments.map((commentData, index) => (
                  commentData.comment && (
                    <div key={commentData.comment_id || index} className="flex items-start mb-4">
                      {commentData.icon_url ? (
                        <img
                          src={commentData.icon_url}
                          alt={commentData.username || "Anonymous"}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                          <User className="text-gray-500 w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-sm font-semibold">
                            {commentData.username || "Anonymous"}
                          </p>
                          <p className="text-sm">{commentData.comment}</p>
                        </div>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <button className="flex items-center space-x-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{commentData.likes || 0}</span>
                          </button>
                          <button className="flex items-center space-x-1">
                            <ThumbsDown className="h-4 w-4" />
                            <span>{commentData.dislikes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                ))
              ) : (
                <p className="text-gray-500">まだコメントがありません</p>
              )}
            </div>
          </div>
        </main>
        {/* サイドバー（関連動画リスト） */}
        <aside className="lg:w-2/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {videos.map((video) => (
            <div
              key={video.movie_id}
              onClick={() => handleNavigation(video)}
              className="group cursor-pointer"
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex">
                <div className="w-1/2 aspect-video relative">
                  <Image
                    src={video.thumbnail_url || "/thumb1.jpg"}
                    alt={video.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="w-1/2 p-4">
                  <h2 className="text-sm font-semibold line-clamp-2 text-foreground">
                    {video.title}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );  
}
