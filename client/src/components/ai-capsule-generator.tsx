import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/simple-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AICapsuleGenerator() {
  const [theme, setTheme] = useState("");
  const [generatedCapsule, setGeneratedCapsule] = useState<any>(null);
  const queryClient = useQueryClient();

  const generateCapsuleMutation = useMutation({
    mutationFn: async ({ theme }: { theme: string }) => {
      console.log("🚀 Envoi requête avec thème:", theme);
      
      // Utiliser fetch directement pour plus de contrôle
      const response = await fetch("/api/capsules/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📦 Données brutes reçues:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("✅ Capsule générée, data reçue:", data);
      console.log("🔍 Type de data:", typeof data);
      console.log("🔍 Clés de data:", Object.keys(data || {}));
      
      // Utiliser directement les données reçues
      if (data && data.content) {
        console.log("🎯 Data valide, utilisation directe:", data);
        setGeneratedCapsule(data);
      } else {
        console.warn("⚠️ Data invalide, utilisation de fallback");
        const capsuleData = {
          id: data?.id || Date.now(),
          content: data?.content || "Contenu indisponible",
          likes: data?.likes || 0,
          views: data?.views || 0,
          createdAt: data?.createdAt || new Date().toISOString()
        };
        setGeneratedCapsule(capsuleData);
      }
      
      setTheme("");
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      toast.success("✨ Capsule de conscience générée par RAUN-RACHID");
    },
    onError: (error) => {
      console.error("❌ Erreur génération capsule:", error);
      toast.error("Impossible de générer la capsule.");
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) {
      toast.error("Veuillez saisir un thème.");
      return;
    }
    generateCapsuleMutation.mutate({ theme: theme.trim() });
  };

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card className="bg-matrix-dark border-matrix-green">
        <CardHeader className="pb-4">
          <CardTitle className="text-matrix-green flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            Générateur de Capsules Conscientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-matrix-green mb-2">
                Thème spirituel
              </label>
              <Input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: éveil intérieur, amour universel, conscience..."
                className="bg-black border border-green-500 text-green-500 placeholder-green-700 focus:ring-2 focus:ring-green-500 focus:border-green-400"
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!theme.trim() || generateCapsuleMutation.isPending}
                className="bg-matrix-green hover:bg-neon-green text-matrix-bg font-bold"
              >
                {generateCapsuleMutation.isPending ? (
                  "Génération en cours..."
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer une Capsule
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Generated Capsule Display */}
      {generatedCapsule && (
        <>
          {console.log("🎯 RENDU: generatedCapsule existe:", generatedCapsule)}
        </>
      )}
      {generatedCapsule && (
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '2px solid #00ff00',
          borderRadius: '8px',
          padding: '24px',
          margin: '16px 0',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{
              color: '#00ff00',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              margin: 0
            }}>
              ✨ Capsule générée par RAUN-RACHID
            </h3>
            {console.log("📝 TITRE RENDU: Titre affiché")}
            <div style={{
              backgroundColor: '#00ff00',
              color: '#000000',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Nouvelle
            </div>
          </div>
          
          {/* Content */}
          <div style={{
            backgroundColor: '#000000',
            border: '2px solid #00ff00',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '16px'
          }}>
            <p style={{
              color: '#00ff00',
              fontSize: '18px',
              lineHeight: '1.6',
              fontFamily: 'monospace',
              margin: 0
            }}>
              {generatedCapsule?.content || "Contenu en cours de chargement..."}
            </p>
          </div>
          
          {/* Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            <span style={{ color: '#00ff00', fontFamily: 'monospace' }}>
              Capsule #{generatedCapsule?.id || "N/A"}
            </span>
            <span style={{ color: '#00ff00', fontFamily: 'monospace' }}>
              Créée à l'instant
            </span>
          </div>
          
          {/* Close Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setGeneratedCapsule(null)}
              style={{
                backgroundColor: '#00ff00',
                color: '#000000',
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#00cc00';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#00ff00';
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}