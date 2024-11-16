import Link from "next/link";
import { LogOut, Menu, Search, Settings, Upload, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userIcon, setUserIcon] = useState("/placeholder-user.jpg"); // 初期値をプレースホルダーに設定
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // ローカルストレージから userId を取得
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        // API 呼び出し
        const response = await axios.post(
          "https://devesion.main.jp/jphacks/api/main.php",
          {
            get_user: "",
            user_id: userId, // ローカルストレージから取得した userId を送信
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const userData = response.data;
        console.log(userData.icon_url)
        if (userData && userData.icon_url) {
          setUserIcon(userData.icon_url); // アイコン URL を状態に設定
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    router.push(`/result?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("channelId");
    localStorage.removeItem("userId"); // ログアウト時に userId も削除
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500">
      <div className="mr-4">
        <Link className="mr-6 flex items-center space-x-2" href="/">
          <Image
            src="/vany-logo.png"
            alt="YourTube Logo"
            width={100}
            height={100}
            priority
          />
        </Link>
      </div>

      <div className="flex items-center justify-center w-full max-w-md mx-auto">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search videos..."
            className="bg-background pl-8 sm:w-[200px] md:w-[300px] lg:w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="p-2">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full hover:rounded-full"
          >
            <Avatar className="h-8 w-8 ring-1 ring-primary ring-offset-2 ring-offset-background transition-all duration-300 hover:scale-110">
              <AvatarImage
                src={userIcon} // 状態から動的にアイコン URL を設定
                alt="@username"
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" />
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end" forceMount>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Link
                href="/upload"
                className="flex w-full items-center space-x-2 hover:bg-accent hover:text-accent-foreground rounded-md p-2 text-sm transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Video</span>
              </Link>
            </div>
            <div className="grid">
              <Button
                variant="outline"
                className="flex w-full items-center justify-start space-x-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}
