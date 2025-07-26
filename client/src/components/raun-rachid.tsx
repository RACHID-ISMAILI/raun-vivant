import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Capsule, Comment } from "@shared/schema";

interface CapsuleWithDetails extends Capsule {
  titre?: string;
  preview?: string;
  comments?: Comment[];
}

interface Props {
  className?: string;
  onCapsuleSelect?: (capsule: CapsuleWithDetails) => void;
}

export default function RaunRachidInterface({ className = "", onCapsuleSelect }: Props) {
  const [selectedCapsule, setSelectedCapsule] = useState<number | null>(null);
  const [showComments, setShowComments] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
  const queryClient = useQueryClient();

  // Récupérer les capsules depuis l'API
  const { data: capsules = [], isLoading } = useQuery({
    queryKey: ['/api/capsules'],
    select: (data: Capsule[]) => data.map(capsule => ({
      ...capsule,
      titre: `Capsule #${capsule.id}`,
      preview: capsule.content.substring(0, 100) + "..."
    }))
  });

  // Récupérer les commentaires pour une capsule
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['/api/capsules', selectedCapsule, 'comments'],
    enabled: !!selectedCapsule
  });

  // Mutation pour liker une capsule
  const likeMutation = useMutation({
    mutationFn: async (capsuleId: number) => {
      const response = await fetch(`/api/capsules/${capsuleId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' })
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
      queryClient.invalidateQueries({ queryKey: ['/api/capsules', selectedCapsule, 'comments'] });
      setNewComment("");
    }
  });

  // Mutation pour supprimer une capsule (admin)
  const deleteMutation = useMutation({
    mutationFn: async (capsuleId: number) => {
      const response = await fetch(`/api/capsules/${capsuleId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/capsules'] });
      setSelectedCapsule(null);
    }
  });

  const handleCapsuleClick = (capsule: CapsuleWithDetails) => {
    setSelectedCapsule(capsule.id);
    onCapsuleSelect?.(capsule);
  };

  const handleLike = (capsuleId: number) => {
    likeMutation.mutate(capsuleId);
  };

  const handleComment = (capsuleId: number) => {
    if (newComment.trim()) {
      commentMutation.mutate({ capsuleId, content: newComment });
    }
  };

  const handleDelete = (capsuleId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette capsule ?')) {
      deleteMutation.mutate(capsuleId);
    }
  };

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setIsAdmin(data.user?.username === 'rachid');
      })
      .catch(() => setIsAdmin(false));
  }, []);

  if (isLoading) {
    return (
      <div className={`border-l border-green-400 bg-black/30 ${className}`}>
        <div className="p-4 text-center text-green-400">
          ⚡ Chargement des capsules...
        </div>
      </div>
    );
  }

  return (
    <div className={`border-l border-green-400 bg-black/30 ${className}`}>
      <div className="p-4 h-full overflow-y-auto">
        <h3 className="text-sm font-bold mb-4 text-green-400 border-b border-green-400 pb-2">
          📁 Capsules de Conscience
        </h3>
        
        <div className="space-y-4">
          {capsules.map((capsule) => (
            <div key={capsule.id} className="relative">
              <div
                onClick={() => handleCapsuleClick(capsule)}
                className={`border cursor-pointer transition-all duration-300 p-3 bg-black/50 ${
                  selectedCapsule === capsule.id 
                    ? 'border-green-300 bg-green-400/10 shadow-lg shadow-green-400/20' 
                    : 'border-green-400 hover:border-green-300 hover:bg-green-400/5'
                }`}
              >
                <div className="text-xs font-bold mb-2 text-green-400 flex justify-between items-center">
                  <span>{capsule.titre}</span>
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(capsule.id);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs"
                      title="Supprimer (Admin)"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <div className="text-xs mb-2 line-clamp-3 leading-relaxed text-green-300">
                  {capsule.preview}
                </div>
                <div className="flex gap-3 text-xs text-green-400/80">
                  <span>👁 {capsule.views}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(capsule.id);
                    }}
                    className="hover:text-green-300 transition-colors"
                  >
                    💚 {capsule.likes}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowComments(showComments === capsule.id ? null : capsule.id);
                    }}
                    className="hover:text-green-300 transition-colors"
                  >
                    💬 Commenter
                  </button>
                  <span>#{capsule.id}</span>
                </div>
              </div>
              
              {/* Section commentaires */}
              {showComments === capsule.id && (
                <div className="mt-2 border border-green-400/50 bg-black/70 p-3 max-h-40 overflow-y-auto">
                  <div className="space-y-2 mb-3">
                    {comments.map((comment: Comment) => (
                      <div key={comment.id} className="text-xs">
                        <div className="text-green-400 font-bold">{comment.username}:</div>
                        <div className="text-green-300">{comment.content}</div>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <div className="text-xs text-green-400/60">Aucun commentaire</div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Votre commentaire..."
                      className="flex-1 bg-black/50 border border-green-400/50 text-green-400 text-xs p-1 focus:border-green-400 focus:outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleComment(capsule.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleComment(capsule.id)}
                      className="bg-green-400/20 border border-green-400 text-green-400 px-2 py-1 text-xs hover:bg-green-400/30 transition-colors"
                    >
                      💬
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-green-400/30">
          <div className="text-xs text-green-400/60 text-center">
            Interface RAUN-RACHID v3.0
          </div>
        </div>
      </div>
    </div>
  );
}