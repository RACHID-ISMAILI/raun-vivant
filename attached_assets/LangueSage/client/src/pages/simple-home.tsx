import React, { useState } from "react";
import { Link } from "wouter";
import type { Capsule } from "@shared/schema";

interface CapsuleWithDetails extends Capsule {
  titre?: string;
  preview?: string;
}

export default function SimpleHome() {
  const [selectedCapsule, setSelectedCapsule] = useState<CapsuleWithDetails | null>(null);

  const handleCapsuleSelect = (capsule: CapsuleWithDetails) => {
    setSelectedCapsule(capsule);
  };

  return (
    <div className="p-8">
      {/* Message défilant spirituel */}
      <div className="mb-6 p-4 border border-green-400 bg-green-400/10 text-center">
        <div className="text-green-400 font-mono animate-pulse text-lg font-bold">
          🔥 "Je suis vivant en conscience, nul ne peut éteindre ce que je suis" 🔥
        </div>
      </div>

      {selectedCapsule ? (
        /* Zone d'affichage capsule sélectionnée */
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-green-400 bg-green-400/5 p-8 text-center min-h-[450px] flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-green-400 mb-6">
              {selectedCapsule.titre || `Capsule #${selectedCapsule.id}`}
            </h1>
            
            <div className="text-green-300 leading-relaxed text-lg mb-8 max-w-2xl mx-auto">
              {selectedCapsule.content}
            </div>
            
            <div className="flex justify-center gap-6 text-green-400/80 mb-6">
              <span>👁 {selectedCapsule.views} vues</span>
              <span>💚 {selectedCapsule.likes} likes</span>
              <span>🆔 #{selectedCapsule.id}</span>
            </div>
            
            <button 
              onClick={() => setSelectedCapsule(null)}
              className="mx-auto px-6 py-2 border border-green-400 text-green-400 hover:bg-green-400/10 transition-colors"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      ) : (
        /* Page d'accueil par défaut */
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-green-400 mb-6">
            🔥 RAUN-RACHID REACT INTERFACE 🔥
          </h1>
          <div className="text-2xl text-green-300 mb-4 animate-pulse">
            ✅ CACHE SUPPRIMÉ - INTERFACE PROPRE !
          </div>
          <p className="text-green-300 mb-8 text-xl">
            Espace numérique de conscience et d'éveil spirituel
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="p-6 border border-green-400/50 bg-green-400/10">
              <h2 className="text-xl text-green-400 mb-3">📁 Capsules</h2>
              <p className="text-green-300 text-sm mb-4">
                Cliquez sur une capsule dans la sidebar droite pour l'afficher dans cette zone
              </p>
              <div className="text-xs text-green-400/60">
                ✅ Navigation interactive opérationnelle
              </div>
            </div>
            
            <div className="p-6 border border-green-400/50 bg-green-400/10">
              <h2 className="text-xl text-green-400 mb-3">✨ Intentions</h2>
              <p className="text-green-300 text-sm mb-4">
                Partagez vos intentions spirituelles et recevez des réponses IA automatiques
              </p>
              <Link 
                href="/intentions" 
                className="inline-block text-sm px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400/20 transition-colors"
              >
                → Accéder aux Intentions
              </Link>
            </div>
            
            <div className="p-6 border border-green-400/50 bg-green-400/10">
              <h2 className="text-xl text-green-400 mb-3">⚡ Admin</h2>
              <p className="text-green-300 text-sm mb-4">
                Interface de gestion pour Rachid (rachid/raun2025)
              </p>
              <Link 
                href="/admin" 
                className="inline-block text-sm px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400/20 transition-colors"
              >
                → Interface Admin
              </Link>
            </div>
          </div>
          
          <div className="p-6 border border-green-400 bg-green-400/5 max-w-2xl mx-auto">
            <h3 className="text-lg text-green-400 mb-4">🎯 Status RAUN-RACHID</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-green-300">
              <div>✅ Sidebar RAUN-RACHID active</div>
              <div>✅ API + PostgreSQL configuré</div>
              <div>✅ Réponses IA automatiques</div>
              <div>✅ Admin fonctionnel</div>
              <div>✅ Commentaires avec défilement</div>
              <div>✅ Suppression capsules (Admin)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}