import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "@/lib/i18n";
import LanguageSelector from "@/components/language-selector";
import type { Capsule, Comment } from "@/../../shared/schema";

function generateTitleFromContent(content: string): string {
  // Extract first meaningful words, limit to 2-3 words
  const words = content.split(' ').filter(word => word.length > 2);
  if (words.length >= 2) {
    return words.slice(0, 2).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
  return "Capsule";
}

export default function LiveDemo() {
  const { t, isRTL } = useTranslation();
  const queryClient = useQueryClient();
  const { data: capsules, isLoading, refetch } = useQuery<Capsule[]>({
    queryKey: ["/api/capsules"],
    refetchOnWindowFocus: true,
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 0, // Always consider data stale for refresh button
    cacheTime: 0, // Don't cache for immediate updates
  });

  const [activeCapsuleId, setActiveCapsuleId] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Like mutation for demo (no auth required)
  const likeMutation = useMutation({
    mutationFn: async (capsuleId: number) => {
      const response = await apiRequest("POST", `/api/capsules/${capsuleId}/demo-like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
    }
  });

  // View mutation
  const viewMutation = useMutation({
    mutationFn: async (capsuleId: number) => {
      const response = await apiRequest("POST", `/api/capsules/${capsuleId}/view`);
      return response.json();
    },
  });

  // Comments query for active capsule
  const { data: comments } = useQuery<Comment[]>({
    queryKey: ["/api/capsules", activeCapsuleId, "comments"],
    enabled: !!activeCapsuleId && showComments,
  });

  // Comment mutation for demo
  const commentMutation = useMutation({
    mutationFn: async ({ capsuleId, content }: { capsuleId: number; content: string }) => {
      const response = await apiRequest("POST", `/api/capsules/${capsuleId}/demo-comment`, {
        content
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules", activeCapsuleId, "comments"] });
      setCommentText("");
      console.log("Commentaire publié avec succès!");
    }
  });
  
  // Set default active capsule to first capsule when data loads
  const activeCapsule = capsules?.find(c => c.id === activeCapsuleId) || capsules?.[0];
  
  // Update activeCapsuleId when capsules load for the first time
  if (capsules && capsules.length > 0 && activeCapsuleId === null) {
    setActiveCapsuleId(capsules[0].id);
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-black text-green-500 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl mb-4">🚀</div>
          <p>Chargement des capsules...</p>
        </div>
      </div>
    );
  }

  if (!capsules || capsules.length === 0) {
    return (
      <div className="h-screen bg-black text-green-500 font-mono flex items-center justify-center">
        <div className="text-center">
          <p>Aucune capsule trouvée</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-green-500/20 border border-green-500 text-green-400 px-6 py-2 rounded hover:bg-green-500/30"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen bg-black text-green-500 font-mono p-2 sm:p-4 md:p-8 ${isRTL ? 'rtl' : ''}`}>
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>
      
      <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center border-b border-green-500 pb-2 sm:pb-4">
        {t('demoTitle')}
      </h1>
      
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 sm:gap-4 md:gap-8 h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] md:h-full">
        {/* Zone principale */}
        <div className="order-2 lg:order-1 lg:col-span-2 bg-black border border-green-500 rounded-lg p-3 sm:p-4 md:p-6 overflow-y-auto">
          <h2 className="text-sm sm:text-lg md:text-xl text-green-500 mb-2 sm:mb-4">
            {t('demoMainDisplay')}
          </h2>
          {activeCapsule ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500 rounded p-2 sm:p-3 md:p-4">
                <h3 className="text-green-400 mb-2 text-xs sm:text-sm md:text-base">
                  Capsule #{activeCapsule.id} 
                  <span className="hidden sm:inline"> - {generateTitleFromContent(activeCapsule.content)}</span>
                </h3>
                <p className="text-green-300 text-xs sm:text-sm leading-relaxed">
                  {activeCapsule.content}
                </p>
                <div className="flex justify-between mt-2 sm:mt-4 text-xs">
                  <span>👁️ {activeCapsule.views} {t('views')}</span>
                  <span>💚 {activeCapsule.likes} {t('likes')}</span>
                  <span className="hidden sm:inline">💬 0 commentaires</span>
                </div>
              </div>
              
              {/* Section interactions */}
              <div className="bg-black border border-green-500/50 rounded p-2 sm:p-3 md:p-4">
                <h4 className="text-green-400 mb-2 sm:mb-3 text-xs sm:text-sm">
                  {t('actions')} :
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button 
                    onClick={() => activeCapsule && likeMutation.mutate(activeCapsule.id)}
                    disabled={likeMutation.isPending}
                    className="bg-green-500/20 border border-green-500 text-green-400 px-2 sm:px-3 py-1 rounded text-xs hover:bg-green-500/30 disabled:opacity-50 flex-1 sm:flex-none"
                  >
                    💚 {likeMutation.isPending ? "..." : t('like')}
                  </button>
                  <button 
                    onClick={() => {
                      setShowComments(!showComments);
                      console.log(`Affichage commentaires: ${!showComments}`);
                    }}
                    className="bg-green-500/20 border border-green-500 text-green-400 px-2 sm:px-3 py-1 rounded text-xs hover:bg-green-500/30 flex-1 sm:flex-none"
                  >
                    💬 <span className="hidden sm:inline">{showComments ? 'Masquer' : t('comment')}</span>
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="bg-green-500/20 border border-green-500 text-green-400 px-2 sm:px-3 py-1 rounded text-xs hover:bg-green-500/30 flex-1 sm:flex-none"
                  >
                    🔗 <span className="hidden sm:inline">{t('share')}</span>
                  </button>
                </div>
              </div>

              {/* Section commentaires */}
              {showComments && (
                <div className="bg-black border border-green-500/50 rounded p-2 sm:p-3 md:p-4">
                  <h4 className="text-green-400 mb-2 sm:mb-3 text-xs sm:text-sm">
                    💬 Commentaires ({comments?.length || 0}) :
                  </h4>
                  
                  {/* Liste des commentaires */}
                  <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                    {comments?.length ? comments.map(comment => (
                      <div key={comment.id} className="bg-green-500/10 border border-green-500/30 rounded p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">
                              {comment.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-green-400 text-xs font-bold">{comment.username}</span>
                        </div>
                        <p className="text-green-300 text-xs">{comment.content}</p>
                      </div>
                    )) : (
                      <p className="text-green-400/70 text-xs text-center py-2">
                        Aucun commentaire pour l'instant. Soyez le premier à commenter !
                      </p>
                    )}
                  </div>

                  {/* Formulaire de commentaire */}
                  <div className="space-y-2">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Partagez votre réflexion..."
                      className="w-full bg-black border border-green-500 text-green-300 p-2 rounded text-xs placeholder-green-500/50 focus:outline-none focus:ring-1 focus:ring-green-400 resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          if (activeCapsule && commentText.trim()) {
                            console.log(`Ajout commentaire pour capsule #${activeCapsule.id}`);
                            commentMutation.mutate({ 
                              capsuleId: activeCapsule.id, 
                              content: commentText.trim() 
                            });
                          }
                        }}
                        disabled={!commentText.trim() || commentMutation.isPending}
                        className="bg-green-500/20 border border-green-500 text-green-400 px-3 py-1 rounded text-xs hover:bg-green-500/30 disabled:opacity-50"
                      >
                        {commentMutation.isPending ? "..." : "Publier"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-green-400">
              {t('selectCapsule')} →
            </div>
          )}
        </div>

        {/* Sidebar droite */}
        <div className="order-1 lg:order-2 bg-black border border-green-500 rounded-lg p-2 sm:p-3 md:p-4 lg:max-h-[calc(100vh-12rem)]">
          <h2 className="text-sm sm:text-base md:text-lg text-green-500 mb-2 sm:mb-3 md:mb-4 border-b border-green-500 pb-1 sm:pb-2">
            {t('capsules')} ({capsules.length})
          </h2>
          
          <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 lg:max-h-96 overflow-y-auto">
            {capsules.map(capsule => (
              <div 
                key={capsule.id}
                onClick={() => {
                  console.log(`Sélection capsule #${capsule.id}`);
                  setActiveCapsuleId(capsule.id);
                  viewMutation.mutate(capsule.id);
                }}
                className={`border rounded p-2 sm:p-3 cursor-pointer transition-all duration-200 ${
                  capsule.id === activeCapsuleId
                    ? 'border-green-400 bg-green-500/20 shadow-lg shadow-green-500/20' 
                    : 'border-green-500/50 hover:border-green-400 hover:bg-green-500/10'
                }`}
              >
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <span className="text-xs border border-green-500 px-1 sm:px-2 py-1 rounded">
                    #{capsule.id}
                  </span>
                  <div className="text-xs text-green-400">
                    👁️{capsule.views} 💚{capsule.likes}
                  </div>
                </div>
                <div className={`text-xs sm:text-sm font-medium truncate ${
                  capsule.id === activeCapsuleId ? 'text-green-300' : 'text-green-400'
                }`}>
                  {generateTitleFromContent(capsule.content)}
                </div>
                <div className="text-xs text-green-500/70 truncate mt-1 hidden sm:block">
                  {capsule.content.substring(0, 30)}...
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 sm:mt-4 md:mt-6 p-2 sm:p-3 border border-green-500/30 rounded text-center">
            <p className="text-xs text-green-400">
              <span className="hidden sm:inline">✓ Sidebar → Zone principale<br/>
              ✓ Esthétique Matrix<br/></span>
              <span className="text-green-300">🖱️ Cliquez <span className="hidden sm:inline">sur les capsules</span> !</span>
            </p>
            <button 
              onClick={() => {
                console.log("🔄 Actualisation manuelle...");
                // Simple refresh - force invalidation and refetch
                queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
                refetch();
                console.log("✅ Données actualisées");
              }}
              className="mt-2 bg-green-500/20 border border-green-500 text-green-400 px-2 py-1 rounded text-xs hover:bg-green-500/30 transition-colors"
            >
              🔄 <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 sm:mt-4 md:mt-6 text-center">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-green-500/20 border border-green-500 text-green-400 px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded hover:bg-green-500/30 transition-colors text-xs sm:text-sm"
        >
          ← <span className="hidden sm:inline">{t('backToHome')}</span><span className="sm:hidden">{t('home')}</span>
        </button>
      </div>
    </div>
  );
}