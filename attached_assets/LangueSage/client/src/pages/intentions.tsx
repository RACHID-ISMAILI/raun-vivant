import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/simple-toast";
import { apiRequest } from "@/lib/queryClient";
import { Intention, InsertIntention } from "@shared/schema";
import { useLocation } from "wouter";
import MatrixRain from "@/components/matrix-rain";
import LanguageSelector from "@/components/language-selector";
import { useTranslation } from "@/lib/i18n";
import SEOHead from "@/components/seo-head";

export default function Intentions() {
  const { t, isRTL } = useTranslation();
  const [, setLocation] = useLocation();
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const queryClient = useQueryClient();

  const { data: intentions, isLoading } = useQuery<Intention[]>({
    queryKey: ["/api/intentions"],
  });

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const createIntentionMutation = useMutation({
    mutationFn: async (intention: InsertIntention) => {
      const response = await apiRequest("POST", "/api/intentions", intention);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/intentions"] });
      setContent("");
      setAuthor("");
      
      // Show AI analysis (either OpenAI or intelligent fallback)
      if (data?.analysis) {
        setAiAnalysis(data.analysis);
        toast.success(`✨ Intention analysée par RAUN-RACHID • Profondeur: ${data.analysis.spiritualDepth}/10`);
      } else {
        toast.success("Votre intention sacrée a été ajoutée à la liste vivante.");
      }
    },
    onError: (error) => {
      console.error("Erreur création intention:", error);
      toast.error("Impossible d'envoyer votre intention.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Veuillez écrire votre intention.");
      return;
    }
    
    createIntentionMutation.mutate({ content, author: author.trim() || undefined });
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

  return (
    <div className={`bg-matrix-bg text-matrix-green min-h-screen font-mono overflow-hidden ${isRTL ? 'rtl' : ''}`}>
      <SEOHead 
        title={t('intentionTitle')}
        description={t('intentionSubtitle')}
        keywords="intentions, spiritualité, méditation, éveil, raun, rachid, conscience"
      />
      <MatrixRain />
      
      <div className="relative z-10 container mx-auto p-2 sm:p-4 md:p-6">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-matrix-green animate-glow">
              {t('intentionTitle')}
            </h1>
            <p className="text-matrix-green/70 mt-1 sm:mt-2 text-sm sm:text-base">
              {t('intentionSubtitle')}
            </p>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="bg-matrix-dark hover:bg-matrix-green hover:text-matrix-bg border-matrix-green text-matrix-green text-sm self-end sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
        </div>

        {/* Intention Form */}
        <Card className="mb-4 sm:mb-6 md:mb-8 bg-matrix-dark border-matrix-green">
          <CardHeader className="pb-3 sm:pb-4 md:pb-6">
            <CardTitle className="text-matrix-green flex items-center text-sm sm:text-base md:text-lg">
              <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">{t('shareAnIntention')}</span>
              <span className="sm:hidden">{t('newIntention')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-matrix-green mb-2">
                  {t('nameOptional')}
                </label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className="bg-black border border-green-500 text-green-500 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-green-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-matrix-green mb-2">
                  {t('yourIntention')}
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('intentionPlaceholder')}
                  className="min-h-[120px] bg-black border border-green-500 text-green-500 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-green-400 resize-none"
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!content.trim() || createIntentionMutation.isPending}
                  className="bg-matrix-green hover:bg-neon-green text-matrix-bg font-bold text-sm sm:text-base w-full sm:w-auto"
                >
                  {createIntentionMutation.isPending ? t('sending') : (
                    <>
                      <span className="hidden sm:inline">{t('shareButton')}</span>
                      <span className="sm:hidden">{t('shareButton').split(' ')[0]}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* AI Analysis Display */}
        {aiAnalysis && (
          <Card className="mb-4 sm:mb-6 md:mb-8 bg-matrix-dark border-matrix-green animate-glow">
            <CardHeader className="pb-3 sm:pb-4 md:pb-6">
              <CardTitle className="text-matrix-green flex items-center text-sm sm:text-base md:text-lg">
                ✨ Analyse de RAUN-RACHID
                <div className="ml-auto flex items-center">
                  <div className="text-xs bg-matrix-green text-matrix-bg px-2 py-1 rounded">
                    Profondeur: {aiAnalysis.spiritualDepth}/10
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/50 rounded-lg p-4 border border-matrix-green/30">
                  <h4 className="text-matrix-green font-bold mb-2 text-sm">🧘 Conscience</h4>
                  <p className="text-green-300 text-sm leading-relaxed">{aiAnalysis.consciousness}</p>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4 border border-matrix-green/30">
                  <h4 className="text-matrix-green font-bold mb-2 text-sm">💎 Guidance</h4>
                  <p className="text-green-300 text-sm leading-relaxed">{aiAnalysis.guidance}</p>
                </div>
              </div>
              
              <div className="bg-black/50 rounded-lg p-4 border border-matrix-green/30">
                <h4 className="text-matrix-green font-bold mb-2 text-sm">🌟 Affirmation</h4>
                <p className="text-green-300 text-sm leading-relaxed italic">"{aiAnalysis.affirmation}"</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs text-matrix-green/70">Énergie: </span>
                  <span className="ml-2 text-xs bg-matrix-green/20 text-matrix-green px-2 py-1 rounded capitalize">
                    {aiAnalysis.energy}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setAiAnalysis(null)}
                  variant="outline"
                  className="bg-matrix-dark hover:bg-matrix-green hover:text-matrix-bg border-matrix-green text-matrix-green text-sm"
                >
                  Fermer l'analyse
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Intentions List */}
        <Card className="bg-matrix-dark border-matrix-green">
          <CardHeader className="pb-3 sm:pb-4 md:pb-6">
            <CardTitle className="text-matrix-green text-sm sm:text-base md:text-lg">
              <span className="hidden sm:inline">{t('intentionsList')}</span>
              <span className="sm:hidden">{t('intentions')} ({intentions?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-matrix-bg border border-matrix-green rounded-lg p-4 animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-matrix-green rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-matrix-green/20 rounded w-3/4"></div>
                        <div className="h-4 bg-matrix-green/20 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {intentions?.length === 0 ? (
                  <div className="text-center py-8 text-matrix-green/70">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('noIntentions')}</p>
                    <p className="text-sm mt-2">{t('firstIntention')}</p>
                  </div>
                ) : (
                  intentions?.map((intention, index) => (
                    <div
                      key={intention.id}
                      className="bg-matrix-bg border border-matrix-green rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-matrix-green rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-matrix-bg text-sm font-bold">
                            {intention.author ? intention.author.charAt(0).toUpperCase() : "💫"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-matrix-green font-bold text-sm">
                              {intention.author || t('anonymousSoul')}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {formatTime(intention.createdAt)}
                            </span>
                          </div>
                          <p className="text-white text-sm leading-relaxed">
                            {intention.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}