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

const mockVideos: Channel = {
  id: "111",
  name: "健屋花那【にじさんじ】KanaSukoya",
  avatar: "/icon1.jpg",
  description:
    "お加減はいかがでしょうか。にじさんじ所属バーチャルライバーの 健屋 花那(すこや かな)です。まだまだ未熟ではありますが、皆さんが元気にそしてハッピーになれるような時間をお届けしたいと思います。気軽にすこってください。",
  views: 1960000,
  subscribers: 100000,
  totalVideos: 500,
  totalViews: 50000000,
};

export default function ChannelPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);

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
              <h1 className="text-3xl font-bold">{channel.name}</h1>
              <p className="text-muted-foreground">{channel.description}</p>
              <Button onClick={() => setIsEditing(true)}>チャンネル登録</Button>
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
