import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Capsule } from "@shared/schema";

export default function AdminPanel() {
  const [newCapsule, setNewCapsule] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  
  const queryClient = useQueryClient();

  // Query pour vérifier si on est connecté
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me']
  });

  useEffect(() => {
    setIsLoggedIn(!!user?.user);
  }, [user]);

  // Query pour récupérer les capsules
  const { data: capsules = [] } = useQuery<Capsule[]>({
    queryKey: ['/api/capsules'],
    enabled: isLoggedIn
  });

  // Mutation pour se connecter
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
    onSuccess: () => {
      setIsLoggedIn(true);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/capsules'] });
    }
  });

  // Mutation pour créer une capsule
  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Failed to create capsule');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/capsules'] });
      setNewCapsule("");
    }
  });

  // Mutation pour supprimer une capsule
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/capsules/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete capsule');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/capsules'] });
    }
  });

  const handleLogin = () => {
    loginMutation.mutate(credentials);
  };

  const handleCreateCapsule = () => {
    if (newCapsule.trim()) {
      createMutation.mutate(newCapsule);
    }
  };

  const handleDeleteCapsule = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette capsule ?')) {
      deleteMutation.mutate(id);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">
          🔐 Admin RAUN-RACHID
        </h1>
        
        <div className="space-y-4">
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            placeholder="Nom d'utilisateur"
            className="w-full bg-black/50 border border-green-400 text-green-400 p-3 font-mono focus:border-green-300 focus:outline-none"
          />
          
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="Mot de passe"
            className="w-full bg-black/50 border border-green-400 text-green-400 p-3 font-mono focus:border-green-300 focus:outline-none"
          />
          
          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="w-full bg-green-400/20 border border-green-400 text-green-400 py-3 px-6 font-mono hover:bg-green-400/30 transition-colors disabled:opacity-50"
          >
            {loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </button>
          
          <p className="text-green-300 text-sm text-center">
            Utilisez: rachid / raun2025
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">
        ⚡ Interface Admin RAUN-RACHID
      </h1>
      
      {/* Section création de capsule */}
      <div className="mb-8 p-6 border border-green-400 bg-green-400/5">
        <h2 className="text-lg font-bold text-green-400 mb-4">
          📝 Créer une Nouvelle Capsule
        </h2>
        
        <textarea
          value={newCapsule}
          onChange={(e) => setNewCapsule(e.target.value)}
          placeholder="Contenu de la capsule spirituelle..."
          className="w-full h-32 bg-black/50 border border-green-400 text-green-400 p-4 font-mono text-sm resize-none focus:border-green-300 focus:outline-none mb-4"
        />
        
        <button
          onClick={handleCreateCapsule}
          disabled={!newCapsule.trim() || createMutation.isPending}
          className="bg-green-400/20 border border-green-400 text-green-400 py-2 px-6 font-mono hover:bg-green-400/30 transition-colors disabled:opacity-50"
        >
          {createMutation.isPending ? "Création..." : "🔥 Créer la Capsule"}
        </button>
      </div>
      
      {/* Liste des capsules */}
      <div>
        <h2 className="text-lg font-bold text-green-400 mb-4">
          💎 Capsules Existantes ({capsules.length})
        </h2>
        
        <div className="space-y-4">
          {capsules.map((capsule) => (
            <div key={capsule.id} className="border border-green-400/50 p-4 bg-black/30">
              <div className="flex justify-between items-start mb-2">
                <span className="text-green-400 font-bold">Capsule #{capsule.id}</span>
                <button
                  onClick={() => handleDeleteCapsule(capsule.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
              
              <p className="text-green-300 text-sm mb-2">
                {capsule.content}
              </p>
              
              <div className="flex gap-4 text-xs text-green-400/80">
                <span>👁 {capsule.views} vues</span>
                <span>💚 {capsule.likes} likes</span>
                <span>📅 {new Date(capsule.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          
          {capsules.length === 0 && (
            <div className="text-center text-green-400/60 py-8">
              Aucune capsule trouvée. Créez la première !
            </div>
          )}
        </div>
      </div>
    </div>
  );
}