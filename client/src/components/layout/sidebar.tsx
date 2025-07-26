import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Brain, Home, Plus, Settings, FileText } from "lucide-react";

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Créer un article", href: "/create", icon: Plus },
  { name: "Administration", href: "/admin", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <Brain className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-xl font-bold text-primary font-serif">LangueSage</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary-50 border-r-4 border-primary-500 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-primary-500" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Blog académique sur la conscience
          </div>
        </div>
      </div>
    </div>
  );
}
