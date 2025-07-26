import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, X, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/simple-toast";
import { apiRequest } from "@/lib/queryClient";
import { Capsule, Comment } from "@shared/schema";

interface CapsuleCardProps {
  capsule: Capsule;
  index: number;
  onAuthRequired: (action: { type: string; data?: any }) => boolean;
  currentUser: any;
}

export default function CapsuleCard({ capsule, index, onAuthRequired, currentUser }: CapsuleCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["/api/capsules", capsule.id, "comments"],
    enabled: showComments,
  });

  const voteMutation = useMutation({
    mutationFn: (type: "like" | "dislike") =>
      apiRequest("POST", `/api/capsules/${capsule.id}/demo-like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      toast.success("Votre vote a été pris en compte.");
    },
    onError: (error) => {
      toast.error("Impossible d'enregistrer votre vote.");
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      apiRequest("POST", `/api/capsules/${capsule.id}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules", capsule.id, "comments"] });
      setCommentText("");
      toast.success("Votre commentaire a été ajouté.");
    },
    onError: (error) => {
      toast.error("Impossible de publier votre commentaire.");
    },
  });

  const handleVote = (type: "like" | "dislike") => {
    // Demo version - no auth required for likes
    voteMutation.mutate(type);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    
    if (onAuthRequired({ type: "comment", data: { capsuleId: capsule.id, content: commentText } })) {
      commentMutation.mutate(commentText);
    }
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(capsule.content);
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      telegram: `https://t.me/share/url?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent('Capsule de Conscience - RACHID')}&body=${text}`,
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "il y a quelques minutes";
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${Math.floor(hours / 24)}j`;
  };

  return (
    <div className="capsule-card rounded-xl p-6 border-matrix-green">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-matrix-green rounded-full flex items-center justify-center">
            <span className="text-matrix-bg font-bold">{index.toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <p className="text-lg mb-4 font-modern text-white leading-relaxed">
            {capsule.content}
          </p>
          
          {/* Interaction Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {/* Vote Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote("like")}
                disabled={voteMutation.isPending}
                className="bg-matrix-dark hover:bg-matrix-green hover:text-matrix-bg transition-colors border-matrix-green text-matrix-green"
              >
                <Heart className="w-4 h-4 mr-1" />
                {capsule.likes}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote("dislike")}
                disabled={voteMutation.isPending}
                className="bg-matrix-dark hover:bg-red-600 hover:text-white transition-colors border-red-600 text-red-600"
              >
                <X className="w-4 h-4 mr-1" />
                {capsule.dislikes}
              </Button>
            </div>
            
            {/* Share Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => handleShare("whatsapp")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                WhatsApp
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleShare("telegram")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Telegram
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleShare("email")}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Email
              </Button>
            </div>
            
            {/* Comment Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleComments}
              className="text-matrix-green hover:text-white transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-1" />
              {comments?.length || 0} commentaires
              {showComments ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>
          </div>
          
          {/* Comments Section */}
          {showComments && (
            <div className="mt-6 space-y-4 border-t border-matrix-dark pt-4">
              {comments?.map((comment) => (
                <div key={comment.id} className="bg-matrix-dark rounded-lg p-4 border border-matrix-green/30">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-matrix-green rounded-full flex items-center justify-center">
                      <span className="text-matrix-bg text-sm font-bold">
                        {comment.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-matrix-green font-bold text-sm">{comment.username}</span>
                        <span className="text-gray-500 text-xs">{formatTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-white text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Comment Form */}
              <div className="bg-matrix-dark rounded-lg p-4 border border-matrix-green/30">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Partagez votre réflexion..."
                  className="w-full bg-matrix-bg border border-matrix-green text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-matrix-green resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleComment}
                    disabled={!commentText.trim() || commentMutation.isPending}
                    className="bg-matrix-green hover:bg-neon-green text-matrix-bg font-bold"
                  >
                    {commentMutation.isPending ? "Publication..." : "Publier"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
