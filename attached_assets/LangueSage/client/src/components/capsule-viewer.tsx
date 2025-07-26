import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Eye, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/simple-toast";
import { apiRequest } from "@/lib/queryClient";
import { Capsule, Comment } from "@shared/schema";

interface CapsuleViewerProps {
  capsules: Capsule[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onAuthRequired: (action: { type: string; data?: any }) => boolean;
  currentUser: any;
}

export default function CapsuleViewer({ 
  capsules, 
  currentIndex, 
  onPrevious, 
  onNext, 
  onAuthRequired, 
  currentUser 
}: CapsuleViewerProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  const currentCapsule = capsules[currentIndex];

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["/api/capsules", currentCapsule.id, "comments"],
    enabled: showComments,
  });

  const { data: userVote } = useQuery({
    queryKey: ["/api/capsules", currentCapsule.id, "vote", currentUser?.username],
    enabled: !!currentUser,
  });

  const voteMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/capsules/${currentCapsule.id}/demo-like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      toast.success("Votre appréciation a été prise en compte.");
    },
    onError: () => {
      toast.error("Impossible d'enregistrer votre vote.");
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      apiRequest("POST", `/api/capsules/${currentCapsule.id}/demo-comment`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules", currentCapsule.id, "comments"] });
      setCommentText("");
      toast.success("Votre réflexion a été partagée.");
    },
    onError: () => {
      toast.error("Impossible de publier votre commentaire.");
    },
  });

  const handleVote = () => {
    // Demo version - no auth required for likes
    voteMutation.mutate();
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    
    // Demo version - no auth required for comments on public page
    commentMutation.mutate(commentText);
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(currentCapsule.content);
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      telegram: `https://t.me/share/url?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent('Capsule de Conscience - RAUN-VIVANT')}&body=${text}`,
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
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
    <div className="flex flex-col items-center space-y-8">
      {/* Navigation indicator */}
      <div className="flex items-center space-x-4 text-matrix-green/70">
        <span className="text-sm">
          Capsule {currentIndex + 1} sur {capsules.length}
        </span>
        <div className="flex space-x-1">
          {capsules.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-matrix-green' : 'bg-matrix-green/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main capsule card */}
      <div className="capsule-card rounded-xl p-8 border-matrix-green max-w-2xl w-full mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-matrix-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-matrix-bg font-bold text-xl">
              {(currentIndex + 1).toString().padStart(2, '0')}
            </span>
          </div>
          <h3 className="text-matrix-green font-bold text-lg mb-2">
            Capsule de Conscience
          </h3>
        </div>

        <div className="space-y-6">
          <p className="text-xl text-matrix-green leading-relaxed text-center font-light">
            {currentCapsule.content}
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-6 text-sm text-matrix-green/70">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{currentCapsule.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{currentCapsule.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{comments?.length || 0}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleVote}
              disabled={voteMutation.isPending}
              variant="outline"
              className="bg-matrix-dark hover:bg-matrix-green hover:text-matrix-bg border-matrix-green text-matrix-green"
            >
              <Heart className="w-4 h-4 mr-2" />
              J'aime
            </Button>

            <Button
              onClick={() => setShowComments(!showComments)}
              variant="outline"
              className="bg-matrix-dark hover:bg-matrix-green hover:text-matrix-bg border-matrix-green text-matrix-green"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Commentaires
              {showComments ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </Button>

            <div className="flex space-x-2">
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
          </div>

          {/* Comments section */}
          {showComments && (
            <div className="space-y-4 border-t border-matrix-green/30 pt-6">
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
                      <p className="text-matrix-green text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Comment form */}
              <div className="bg-matrix-dark rounded-lg p-4 border border-matrix-green/30">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Partagez votre réflexion..."
                  className="w-full bg-matrix-bg border border-matrix-green text-matrix-green placeholder-matrix-green/50 focus:outline-none focus:ring-2 focus:ring-matrix-green resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
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

      {/* Navigation arrows */}
      <div className="flex items-center justify-between w-full max-w-2xl">
        <Button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="bg-matrix-dark hover:bg-matrix-green hover:text-matrix-bg border-matrix-green text-matrix-green disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Précédente
        </Button>

        <div className="text-center text-matrix-green/70">
          <p className="text-sm">
            Navigation horizontale
          </p>
        </div>

        <Button
          onClick={onNext}
          disabled={currentIndex === capsules.length - 1}
          variant="outline"
          className="bg-matrix-dark hover:bg-matrix-green hover:text-matrix-bg border-matrix-green text-matrix-green disabled:opacity-50"
        >
          Suivante
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}