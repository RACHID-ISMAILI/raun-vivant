import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/simple-toast";
import { apiRequest } from "@/lib/queryClient";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  pendingAction?: { type: string; data?: any } | null;
}

export default function AuthModal({ onClose, onSuccess, pendingAction }: AuthModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      apiRequest("POST", "/api/auth/login", credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast.success("Vous êtes maintenant connecté.");
      onSuccess();
    },
    onError: (error) => {
      toast.error("Nom d'utilisateur ou mot de passe incorrect.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-matrix-bg border border-matrix-green rounded-xl p-8 max-w-md w-full mx-4 animate-glow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-matrix-green">Authentification</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-matrix-green hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-sm font-medium text-matrix-green mb-2 block">
              Nom d'utilisateur
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom"
              className="bg-black border border-matrix-green text-matrix-green placeholder:text-matrix-green/50 focus:ring-2 focus:ring-matrix-green focus:border-matrix-green"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-matrix-green mb-2 block">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              className="bg-black border border-matrix-green text-matrix-green placeholder:text-matrix-green/50 focus:ring-2 focus:ring-matrix-green focus:border-matrix-green"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex-1 bg-matrix-green hover:bg-neon-green text-matrix-bg font-bold"
            >
              {loginMutation.isPending ? "Connexion..." : "Se connecter"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-matrix-dark hover:bg-red-600 text-matrix-green hover:text-white border-matrix-green"
            >
              Annuler
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-matrix-green/70">
            Nouveau ? Entrez simplement un nom d'utilisateur et un mot de passe pour créer votre compte.
          </p>
        </div>
      </div>
    </div>
  );
}
