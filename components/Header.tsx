import Link from "next/link";
import { LogOut, Menu, Search, Settings, Upload, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
    // For now, we'll just redirect to the home page
    router.push("/");
  };
  return (
    <header className="flex items-center justify-between p-4 bg-primary-background border-b">
      <div className="mr-4 hidden md:flex">
        <Link className="mr-6 flex items-center space-x-2" href="/">
          <span className="text-2xl font-bold">YourTube</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/">ホーム</Link>
          <Link href="/trending">トレンド</Link>
          {/* <Link href="/subscriptions">購読</Link> */}
        </nav>
      </div>
      <Button variant="outline" size="icon" className="mr-2 md:hidden">
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-10 items-center justify-end space-x-2">
        <form onSubmit={handleSearch} className="w-full max-w-lg">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search videos..."
              className="w-full bg-background pl-8 sm:w-[300px] md:w-[400px] lg:w-[500px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full hover:rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="@username" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end" forceMount>
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" alt="@username" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">username</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Link
                href="/channel-settings"
                className="flex w-full items-center space-x-2 hover:bg-accent hover:text-accent-foreground rounded-md p-2 text-sm transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Channel Settings</span>
              </Link>
              <Link
                href="/account-settings"
                className="flex w-full items-center space-x-2 hover:bg-accent hover:text-accent-foreground rounded-md p-2 text-sm transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
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
