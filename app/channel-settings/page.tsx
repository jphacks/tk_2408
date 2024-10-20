"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Settings, Bell, Edit3, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { Channel } from "@/types/channel";

const mockVideos: Channel[] = [
  {
    id: "111",
    name: "健屋花那【にじさんじ】KanaSukoya",
    avatar: "/icon1.jpg",
    description:
      "お加減はいかがでしょうか。にじさんじ所属バーチャルライバーの 健屋 花那(すこや かな)です。まだまだ未熟ではありますが、皆さんが元気にそしてハッピーになれるような時間をお届けしたいと思います。気軽にすこってください。",
    views: 1960000,
    subscribers: 100000,
    totalVideos: 500,
    totalViews: 50000000,
  },
  {
    id: "112",
    name: "Ao Ch. 火威青 ‐ ReGLOSS",
    avatar: "/icon2.jpg",
    description:
      "可愛い女の子かと思った？じゃじゃーん！青くんでした。hololive DEV_ISからデビューしたReGLOSSの火威青です。",
    views: 530000,
    subscribers: 1200000,
    totalVideos: 500,
    totalViews: 50000000,
  },
  {
    id: "113",
    name: "hololive DEV_IS",
    avatar: "/icon3.jpg",
    description:
      "「hololive DEV_IS」は、カバー株式会社が運営する「ホロライブプロダクション」傘下のグループです。各タレント・公式チャンネルのチャンネル登録をよろしくお願いします！",
    views: 3210000,
    subscribers: 1200000,
    totalVideos: 500,
    totalViews: 50000000,
  },
];

const fetchChannelData = async (id: string): Promise<Channel> => {
  const channel = mockVideos.find((channel) => channel.id === id);
  if (!channel) {
    throw new Error("Channel not found");
  }
  return channel;
};

export default function ChannelSettingsPage() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const loadChannel = async () => {
      const data = await fetchChannelData(id as string);
      setChannel(data);
    };
    loadChannel();
  }, [id]);

  const handleSave = () => {
    setIsEditing(false);
  };

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <Image
                src={channel.avatar}
                alt="Channel Avatar"
                width={150}
                height={150}
                className="rounded-full"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => alert("Change channel avatar")}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-grow space-y-4">
              {isEditing ? (
                <>
                  <Input
                    value={channel.name}
                    onChange={(e) =>
                      setChannel({ ...channel, name: e.target.value })
                    }
                    className="text-2xl font-bold"
                  />
                  <textarea
                    value={channel.description}
                    onChange={(e) =>
                      setChannel({ ...channel, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{channel.name}</h1>
                  <p className="text-muted-foreground">{channel.description}</p>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Channel
                  </Button>
                </>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-8 flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold">{channel.subscribers}</p>
              <p className="text-muted-foreground">登録者</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{channel.totalVideos}</p>
              <p className="text-muted-foreground">投稿数</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{channel.totalViews}</p>
              <p className="text-muted-foreground">総再生数</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="videos" className="mt-8">
          {/* <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList> */}
          <TabsContent value="videos">
            <h1 className="text-2xl font-bold">投稿一覧</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {mockVideos.map((video) => (
                <Link
                  href={`/video/${video.id}`}
                  key={video.id}
                  className="group"
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
                      <h2 className="text-lg font-semibold line-clamp-2">
                        {video.title}
                      </h2>
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>{video.views}回再生</span>
                        <span>{video.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="playlists">
            <p className="text-muted-foreground">No playlists created yet.</p>
          </TabsContent>
          <TabsContent value="about">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About {channel.name}</h2>
              <p>{channel.description}</p>
              <p className="text-muted-foreground">
                Joined YourTube on January 1, 2020
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
