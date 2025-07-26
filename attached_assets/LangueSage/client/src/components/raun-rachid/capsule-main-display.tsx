import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Share2, Eye, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/lib/simple-toast";
import { apiRequest } from "@/lib/queryClient";
import { Capsule, Comment } from "@shared/schema";

interface CapsuleMainDisplayProps {
  capsule: Capsule | null;
  className?: string;
}

export default function CapsuleMainDisplay({ 
  capsule,
  className = ""
}: CapsuleMainDisplayProps) {
  const [newComment, setNewComment] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [viewedCapsules, setViewedCapsules] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Get comments for current capsule
  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["/api/capsules", capsule?.id, "comments"],
    enabled: !!capsule?.id,
  });

  // Track view when capsule changes
  const viewCapsuleMutation = useMutation({
    mutationFn: (capsuleId: number) => apiRequest("POST", `/api/capsules/${capsuleId}/view`),
    onSuccess: (_, capsuleId) => {
      setViewedCapsules(prev => new Set(prev).add(capsuleId));
    },
  });

  // Like/unlike mutation (demo version - no auth required)
  const voteMutation = useMutation({
    mutationFn: ({ capsuleId }: { capsuleId: number }) =>
      apiRequest("POST", `/api/capsules/${capsuleId}/demo-like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      setHasLiked(!hasLiked);
      toast.success(hasLiked ? "J'aime retiré" : "Merci pour votre soutien !");
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ capsuleId, content }: { capsuleId: number; content: string }) =>
      apiRequest("POST", `/api/capsules/${capsuleId}/comments`, { 
        content,
        username: currentUser?.username || "Anonyme"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules", capsule?.id, "comments"] });
      setNewComment("");
      toast.success("Votre commentaire a été publié avec succès.");
    },
  });

  // Track view on capsule change
  useEffect(() => {
    if (capsule && !viewedCapsules.has(capsule.id)) {
      viewCapsuleMutation.mutate(capsule.id);
    }
  }, [capsule?.id]);

  const handleLike = () => {
    if (!capsule) return;
    voteMutation.mutate({ capsuleId: capsule.id });
  };

  const handleAddComment = () => {
    if (!capsule || !newComment.trim()) return;
    
    if (!currentUser) {
      toast.error("Vous devez être connecté pour commenter.");
      return;
    }

    addCommentMutation.mutate({ 
      capsuleId: capsule.id, 
      content: newComment.trim() 
    });
  };

  const handleShare = () => {
    if (!capsule) return;
    
    const shareText = `Découvrez cette capsule de conscience RAUN-RACHID : "${capsule.content.substring(0, 100)}..."`;
    
    if (navigator.share) {
      navigator.share({
        title: "Capsule RAUN-RACHID",
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Le contenu a été copié dans le presse-papiers.");
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!capsule) {
    return (
      <div className={`flex-1 bg-black text-green-500 p-6 font-mono ${className}`}>
        <Card className="bg-black border-green-500 h-full flex items-center justify-center">
          <CardContent className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">Sélectionnez une capsule</h3>
            <p className="text-green-500/70">
              Choisissez une capsule de conscience dans la sidebar pour l'afficher ici.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex-1 bg-black text-green-500 p-6 font-mono ${className}`}>
      <Card className="bg-black border-green-500 h-full">
        <CardHeader className="border-b border-green-500">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-500 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Capsule de Conscience
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-green-500/70">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(capsule.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1 overflow-y-auto">
          {/* Main Content */}
          <div className="mb-6">
            <p className="text-green-500 leading-relaxed text-lg whitespace-pre-wrap">
              {capsule.content}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6 text-green-500/70">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{capsule.views} vues</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{capsule.likes} j'aimes</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{comments?.length || 0} commentaires</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-6">
            <Button
              onClick={handleLike}
              variant="outline"
              className="bg-black hover:bg-green-500/10 border-green-500 text-green-500 hover:text-green-400"
              disabled={voteMutation.isPending}
            >
              <Heart className={`w-4 h-4 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
              J'aime
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="bg-black hover:bg-green-500/10 border-green-500 text-green-500 hover:text-green-400"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>

          <Separator className="bg-green-500/30 my-6" />

          {/* Comments Section */}
          <div className="space-y-4">
            <h4 className="text-green-500 font-bold">Commentaires</h4>

            {/* Add Comment */}
            {currentUser ? (
              <div className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez vos réflexions sur cette capsule..."
                  className="bg-black border-green-500 text-white placeholder:text-green-500/50 focus:border-green-400 focus:ring-green-400"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || addCommentMutation.isPending}
                  className="bg-green-500 hover:bg-green-400 text-black"
                >
                  {addCommentMutation.isPending ? "Envoi..." : "Commenter"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-green-500/70">
                <p>Connectez-vous pour ajouter un commentaire</p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments?.map((comment) => (
                <Card key={comment.id} className="bg-green-500/5 border-green-500/30">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-green-500" />
                      <span className="text-green-400 font-medium text-sm">
                        {comment.username}
                      </span>
                      <span className="text-green-500/50 text-xs">
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-green-500/90 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </CardContent>
                </Card>
              )) || (
                <div className="text-center py-4 text-green-500/70">
                  <p className="text-sm">Aucun commentaire pour l'instant</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}