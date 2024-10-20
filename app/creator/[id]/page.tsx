"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Settings,
  Bell,
  Edit3,
  Upload,
  TrendingUp,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  timestamp: string;
}

const mockVideos: Video[] = [
  {
    id: "1",
    title: "How to Make a Viral Video",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "100K",
    timestamp: "2 days ago",
  },
  {
    id: "2",
    title: "Behind the Scenes: My Studio Setup",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "50K",
    timestamp: "1 week ago",
  },
  {
    id: "3",
    title: "Q&A: Answering Your Top Questions",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "75K",
    timestamp: "3 weeks ago",
  },
  {
    id: "4",
    title: "My Journey as a Content Creator",
    thumbnail: "/placeholder.svg?height=180&width=320",
    views: "200K",
    timestamp: "1 month ago",
  },
];

export default function CreatorProfilePage() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("PopularCreator");
  const [bio, setBio] = useState(
    "Welcome to my channel! I create entertaining and educational content about technology and lifestyle."
  );

  const handleSave = () => {
    // Here you would typically save the changes to the backend
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Profile Picture"
                width={150}
                height={150}
                className="rounded-full"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => alert("Change profile picture")}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-grow space-y-4">
              {isEditing ? (
                <>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-2xl font-bold"
                  />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{username}</h1>
                  <p className="text-muted-foreground">{bio}</p>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
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
              <p className="text-2xl font-bold">1.2M</p>
              <p className="text-muted-foreground">Subscribers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">500</p>
              <p className="text-muted-foreground">Videos</p>
            </div>
            <div>
              <p className="text-2xl font-bold">50M</p>
              <p className="text-muted-foreground">Total Views</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="videos" className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="videos">
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
                        <span>{video.views} views</span>
                        <span>{video.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="playlists">
            <p className="text-muted-foreground">Manage your playlists here.</p>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>View Trends</CardTitle>
                  <CardDescription>
                    Your channel's performance over the last 28 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="h-10 w-10 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">+15%</p>
                      <p className="text-sm text-muted-foreground">
                        Increase in views
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>
                    Estimated revenue for the current month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <DollarSign className="h-10 w-10 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">$1,234.56</p>
                      <p className="text-sm text-muted-foreground">
                        This month's earnings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="about">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">About {username}</h2>
              <p>{bio}</p>
              <p className="text-muted-foreground">
                Joined YourTube on January 1, 2020
              </p>
              <h3 className="text-xl font-semibold mt-4">
                Channel Description
              </h3>
              <p>
                On this channel, you'll find a mix of tech reviews, lifestyle
                vlogs, and educational content. I post new videos every
                Wednesday and Sunday. Don't forget to subscribe and hit the
                notification bell!
              </p>
              <h3 className="text-xl font-semibold mt-4">Business Inquiries</h3>
              <p>
                For business inquiries, please contact: business@
                {username.toLowerCase()}.com
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
