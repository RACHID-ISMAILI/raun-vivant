import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow border-b border-gray-200">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="border-r border-gray-200 px-4 text-gray-500 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex-1 px-4 flex justify-between">
        {/* Search */}
        <div className="flex-1 flex">
          <form className="w-full flex md:ml-0 max-w-lg" onSubmit={handleSearch}>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <Search className="h-5 w-5" />
              </div>
              <Input
                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent bg-transparent"
                placeholder="Rechercher des articles..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right side */}
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-500">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                A
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              Administrateur
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
