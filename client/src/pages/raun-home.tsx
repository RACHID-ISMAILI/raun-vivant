import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, User, Settings } from "lucide-react";
import { Link } from "wouter";
import type { Capsule, Comment } from "@shared/schema";
import MatrixRain from "@/components/matrix-rain";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/simple-toast";

export default function RaunHome() {
  const [currentCapsuleIndex, setCurrentCapsuleIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  // Récupérer les capsules
  const { data: capsules = [], isLoading } = useQuery<Capsule[]>({
    queryKey: ['/api/capsules'],
  });

  // Récupérer les commentaires pour la capsule actuelle
  const currentCapsule = capsules[currentCapsuleIndex];
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['/api/capsules', currentCapsule?.id, 'comments'],
    enabled: !!currentCapsule
  });

  // Mutation pour liker une capsule
  const likeMutation = useMutation({
    mutationFn: async (capsuleId: number) => {
      const response = await fetch(`/api/capsules/${capsuleId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to like');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/capsules'] });
    }
  });

  // Mutation pour ajouter un commentaire
  const commentMutation = useMutation({
    mutationFn: async ({ capsuleId, content }: { capsuleId: number; content: string }) => {
      const response = await fetch(`/api/capsules/${capsuleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Failed to comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/capsules', currentCapsule?.id, 'comments'] });
      setNewComment("");
      toast.success("Commentaire ajouté avec succès");
    }
  });

  const handlePrevious = () => {
    if (currentCapsuleIndex > 0) {
      setCurrentCapsuleIndex(currentCapsuleIndex - 1);
      setShowComments(false);
    }
  };

  const handleNext = () => {
    if (currentCapsuleIndex < capsules.length - 1) {
      setCurrentCapsuleIndex(currentCapsuleIndex + 1);
      setShowComments(false);
    }
  };

  const handleLike = () => {
    if (currentCapsule) {
      likeMutation.mutate(currentCapsule.id);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && currentCapsule) {
      commentMutation.mutate({
        capsuleId: currentCapsule.id,
        content: newComment
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && currentCapsule) {
      navigator.share({
        title: `Capsule RAUN-RACHID #${currentCapsule.id}`,
        text: currentCapsule.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papiers");
    }
  };

  // Navigation clavier
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case ' ':
          event.preventDefault();
          handleLike();
          break;
        case 'c':
          setShowComments(!showComments);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentCapsuleIndex, capsules.length, showComments]);

  if (isLoading) {
    return (
      <div className="bg-black text-green-400 min-h-screen font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-xl">Chargement des capsules de conscience...</div>
          <div className="mt-4 text-sm opacity-70">Connexion à la matrice...</div>
        </div>
      </div>
    );
  }

  if (!capsules.length) {
    return (
      <div className="bg-black text-green-400 min-h-screen font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Aucune capsule de conscience disponible</div>
          <Link href="/admin">
            <Button className="bg-green-600 hover:bg-green-700 text-black">
              Interface Admin
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-green-400 min-h-screen font-mono overflow-hidden relative">
      <MatrixRain />
      
      {/* En-tête avec profil */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="/rachid-photo.jpg" 
                alt="Rachid ISMAILI" 
                className="w-16 h-16 rounded-full border-2 border-green-400 shadow-lg animate-pulse"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23003300'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%2300ff00' font-family='monospace' font-size='24'%3ER%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-400 animate-glow">
                RACHID ISMAILI
              </h1>
              <div className="text-sm text-green-300/70 animate-typing">
                RAUN-RACHID • ÉVEIL • CONSCIENCE • LUMIÈRE
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link href="/admin">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-transparent border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>

        {/* Message défilant */}
        <div className="text-center mb-8">
          <div className="text-green-300 text-lg animate-marquee">
            🌟 Je suis vivant en conscience, nul ne peut éteindre ce que je suis 🌟
          </div>
        </div>

        {/* Navigation des capsules */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <Button
            onClick={handlePrevious}
            disabled={currentCapsuleIndex === 0}
            variant="ghost"
            size="lg"
            className="text-green-400 hover:bg-green-400/20 disabled:opacity-30"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          
          <div className="text-green-300 text-lg min-w-[200px] text-center">
            Capsule {currentCapsuleIndex + 1} / {capsules.length}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentCapsuleIndex === capsules.length - 1}
            variant="ghost"
            size="lg"
            className="text-green-400 hover:bg-green-400/20 disabled:opacity-30"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>

        {/* Capsule principale */}
        {currentCapsule && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 border-2 border-green-400 rounded-lg p-8 shadow-2xl backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-xl text-green-300 mb-4">Capsule #{currentCapsule.id}</h2>
                <p className="text-green-100 text-lg leading-relaxed whitespace-pre-wrap">
                  {currentCapsule.content}
                </p>
              </div>
              
              {/* Statistiques et actions */}
              <div className="flex justify-between items-center border-t border-green-400/30 pt-4">
                <div className="flex space-x-6 text-sm text-green-300/70">
                  <span>👁️ {currentCapsule.views} vues</span>
                  <span>💚 {currentCapsule.likes} j'aime</span>
                  <span>💬 {comments.length} commentaires</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleLike}
                    variant="ghost"
                    size="sm"
                    className="text-green-400 hover:bg-green-400/20"
                    disabled={likeMutation.isPending}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    J'aime
                  </Button>
                  
                  <Button
                    onClick={() => setShowComments(!showComments)}
                    variant="ghost"
                    size="sm"
                    className="text-green-400 hover:bg-green-400/20"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Commenter
                  </Button>
                  
                  <Button
                    onClick={handleShare}
                    variant="ghost"
                    size="sm"
                    className="text-green-400 hover:bg-green-400/20"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>

            {/* Section commentaires */}
            {showComments && (
              <div className="mt-6 bg-black/60 border border-green-400/50 rounded-lg p-6">
                <h3 className="text-lg text-green-300 mb-4">Commentaires ({comments.length})</h3>
                
                {/* Nouveau commentaire */}
                <div className="mb-6">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Partagez votre réflexion..."
                    className="bg-black/80 border-green-400 text-green-100 placeholder:text-green-300/50 resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || commentMutation.isPending}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-black"
                  >
                    {commentMutation.isPending ? "Publication..." : "Publier"}
                  </Button>
                </div>

                {/* Liste des commentaires */}
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-green-400/10 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 font-semibold">{comment.username}</span>
                        <span className="text-green-300/50 text-xs">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-green-100 text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="fixed bottom-4 left-4 text-green-300/50 text-xs">
          <div>← → Navigation • Espace: J'aime • C: Commentaires</div>
        </div>
      </div>
    </div>
  );
}