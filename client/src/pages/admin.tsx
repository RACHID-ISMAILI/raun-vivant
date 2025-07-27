import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, ChevronLeft, ChevronRight, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/simple-toast";
import { apiRequest } from "@/lib/queryClient";
import { Capsule, InsertCapsule } from "@shared/schema";
import { useLocation } from "wouter";
import MatrixRain from "@/components/matrix-rain";
import AICapsuleGenerator from "@/components/ai-capsule-generator";

// Composant de connexion admin
function AdminLoginInterface({ onLogin }: { onLogin: (user: any) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data);
        toast.success("Connexion réussie !");
      } else {
        toast.error("Identifiants incorrects");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black text-green-400 min-h-screen font-mono overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md bg-black/80 border-2 border-green-400 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Lock className="w-12 h-12 text-green-400 animate-pulse" />
            </div>
            <CardTitle className="text-2xl text-green-400 animate-glow">
              Administration RAUN-RACHID
            </CardTitle>
            <p className="text-green-300/70 text-sm">
              Authentification requise pour accéder au panel
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-green-300 text-sm mb-2">
                  Nom d'utilisateur
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="rachid"
                  className="bg-black/80 border-green-400 text-green-100 placeholder:text-green-300/50"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-green-300 text-sm mb-2">
                  Mot de passe
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="raun2025"
                  className="bg-black/80 border-green-400 text-green-100 placeholder:text-green-300/50"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full bg-green-600 hover:bg-green-700 text-black font-bold"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button
                onClick={() => window.location.href = "/"}
                variant="ghost"
                className="text-green-400 hover:bg-green-400/20"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [newCapsuleContent, setNewCapsuleContent] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const queryClient = useQueryClient();

  // Vérifier l'authentification au chargement
  useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const { data: capsules } = useQuery<Capsule[]>({
    queryKey: ["/api/capsules"],
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
    },
  });

  const createCapsuleMutation = useMutation({
    mutationFn: (capsule: InsertCapsule) => apiRequest("POST", "/api/capsules", capsule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      setNewCapsuleContent("");
      toast.success("Nouvelle capsule de conscience publiée.");
    },
    onError: () => {
      toast.error("Impossible de créer la capsule.");
    },
  });

  const deleteCapsuleMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/capsules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
      toast.success("La capsule a été supprimée avec succès.");
    },
    onError: () => {
      toast.error("Impossible de supprimer la capsule.");
    },
  });

  const handleCreateCapsule = () => {
    if (!newCapsuleContent.trim()) {
      toast.error("Veuillez écrire le contenu de la capsule.");
      return;
    }
    
    createCapsuleMutation.mutate({ content: newCapsuleContent });
  };

  const handleDeleteCapsule = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette capsule ?")) {
      deleteCapsuleMutation.mutate(id);
    }
  };

  const handleLogout = () => {
    console.log("🔴 DÉCONNEXION DÉCLENCHÉE - Bouton Déconnexion");
    logoutMutation.mutate();
  };

  const handleBackToSite = () => {
    // Retour au site SANS déconnexion
    console.log("🟢 RETOUR AU SITE - Bouton Retour au site");
    setLocation("/");
  };

  // Interface de connexion si non authentifié
  if (!currentUser) {
    return <AdminLoginInterface onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="bg-matrix-bg text-matrix-green min-h-screen font-mono overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-matrix-green animate-glow">
              Interface d'Administration
            </h1>
            <p className="text-matrix-green/70 mt-2">
              Bienvenue, {(currentUser as any)?.user?.username || 'Administrateur'}
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={handleBackToSite}
              variant="outline"
              className="bg-matrix-dark hover:bg-matrix-green hover:text-matrix-bg border-matrix-green text-matrix-green"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Retour au site
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Creation Form */}
        <Card className="mb-8 bg-matrix-dark border-matrix-green">
          <CardHeader>
            <CardTitle className="text-matrix-green flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Créer une nouvelle capsule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={newCapsuleContent}
                onChange={(e) => setNewCapsuleContent(e.target.value)}
                placeholder="Écrivez votre capsule de conscience..."
                className="min-h-[200px] bg-black border border-matrix-green text-matrix-green placeholder:text-matrix-green/50 focus:ring-2 focus:ring-matrix-green focus:border-matrix-green resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleCreateCapsule}
                  disabled={!newCapsuleContent.trim() || createCapsuleMutation.isPending}
                  className="bg-matrix-green hover:bg-neon-green text-matrix-bg font-bold"
                >
                  {createCapsuleMutation.isPending ? "Publication..." : "Publier la capsule"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Capsule Generator */}
        <div className="mb-8">
          <AICapsuleGenerator />
        </div>

        {/* Existing Capsules */}
        <Card className="bg-matrix-dark border-matrix-green">
          <CardHeader>
            <CardTitle className="text-matrix-green flex items-center justify-between">
              <span>Gestion des capsules existantes</span>
              <div className="text-sm text-green-300/70">
                {capsules?.length || 0} capsule(s) au total
              </div>
            </CardTitle>
            <p className="text-green-300/60 text-sm mt-2">
              Toutes les capsules (manuelles et générées par IA) sont listées ici. 
              Cliquez sur 🗑️ pour supprimer une capsule.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {capsules?.map((capsule, index) => (
                <div
                  key={capsule.id}
                  className="bg-matrix-bg border border-matrix-green rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-matrix-green text-sm font-bold">
                          #{capsule.id}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(capsule.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white text-sm leading-relaxed mb-3">
                        {capsule.content}
                      </p>
                      <div className="flex space-x-4 text-xs text-matrix-green/70">
                        <span>❤️ {capsule.likes} j'aime</span>
                        <span>👁️ {capsule.views} vues</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteCapsule(capsule.id)}
                      disabled={deleteCapsuleMutation.isPending}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}