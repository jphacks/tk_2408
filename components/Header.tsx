import Link from "next/link";
import { Search, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-primary-background border-b">
      <Link href="/" className="text-2xl font-bold text-primary">
        YourTube
      </Link>

      <div className="flex items-center justify-center space-x-2 w-full">
        <Input
          type="search"
          placeholder="キーワードで検索"
          className="flex-grow max-w-md"
        />
        <Button size="icon" variant="ghost">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
        <span className="sr-only">User account</span>
      </Button>
    </header>
  );
}
