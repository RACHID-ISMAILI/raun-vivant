import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Heart, MessageCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Capsule } from "@shared/schema";

interface CapsuleSidebarProps {
  onCapsuleSelect: (capsule: Capsule) => void;
  selectedCapsuleId?: number;
  className?: string;
}

export default function CapsuleSidebar({ 
  onCapsuleSelect, 
  selectedCapsuleId,
  className = ""
}: CapsuleSidebarProps) {
  const { data: capsules, isLoading } = useQuery<Capsule[]>({
    queryKey: ["/api/capsules"],
  });

  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className={`w-80 bg-black border-l border-green-500 p-4 ${className}`}>
        <div className="space-y-4">
          <div className="text-green-500 font-mono text-sm font-bold border-b border-green-500 pb-2">
            CAPSULES RAUN-RACHID
          </div>
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="bg-black border-green-500 animate-pulse">
              <CardContent className="p-3">
                <div className="h-4 bg-green-500/20 rounded mb-2"></div>
                <div className="h-3 bg-green-500/20 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 bg-black border-l border-green-500 p-4 font-mono ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-green-500 text-sm font-bold border-b border-green-500 pb-2">
          CAPSULES RAUN-RACHID ({capsules?.length || 0})
        </div>

        {/* Capsules List */}
        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-green-500">
          {capsules?.map((capsule, index) => (
            <Card 
              key={capsule.id}
              className={`
                bg-black border cursor-pointer transition-all duration-200 hover:border-green-400 hover:shadow-md hover:shadow-green-500/20
                ${selectedCapsuleId === capsule.id 
                  ? 'border-green-400 shadow-md shadow-green-500/20 bg-green-500/5' 
                  : 'border-green-500/50'
                }
              `}
              onClick={() => onCapsuleSelect(capsule)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs border-green-500 text-green-500 bg-transparent"
                  >
                    #{index + 1}
                  </Badge>
                  {selectedCapsuleId === capsule.id && (
                    <ChevronRight className="w-4 h-4 text-green-400" />
                  )}
                </div>
                
                <div className="text-green-500 text-xs leading-relaxed mb-3">
                  {truncateContent(capsule.content)}
                </div>
                
                <div className="flex items-center justify-between text-green-500/70">
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{capsule.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{capsule.likes}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-green-500 hover:text-green-400 hover:bg-green-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCapsuleSelect(capsule);
                    }}
                  >
                    Lire
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {capsules?.length === 0 && (
          <div className="text-center py-8 text-green-500/70">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Aucune capsule disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}