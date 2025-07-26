import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Capsule } from "@/../../shared/schema";

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

export default function SimpleDemo() {
  const { data: capsules, isLoading } = useQuery<Capsule[]>({
    queryKey: ["/api/capsules"]
  });

  const [activeCapsuleId, setActiveCapsuleId] = useState<number | null>(null);
  
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
    <div className="h-screen bg-black text-green-500 font-mono p-8">
      <h1 className="text-3xl font-bold mb-8 text-center border-b border-green-500 pb-4">
        🚀 RAUN-RACHID - Interface LangueSage
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Zone principale */}
        <div className="lg:col-span-2 bg-black border border-green-500 rounded-lg p-6">
          <h2 className="text-xl text-green-500 mb-4">Zone Principale d'Affichage</h2>
          {activeCapsule ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500 rounded p-4">
                <h3 className="text-green-400 mb-2">
                  Capsule #{activeCapsule.id} - {generateTitleFromContent(activeCapsule.content)}
                </h3>
                <p className="text-green-300 text-sm leading-relaxed">
                  {activeCapsule.content}
                </p>
                <div className="flex justify-between mt-4 text-xs">
                  <span>👁️ {activeCapsule.views} vues</span>
                  <span>💚 {activeCapsule.likes} likes</span>
                  <span>💬 0 commentaires</span>
                </div>
              </div>
            
            {/* Section interactions */}
            <div className="bg-black border border-green-500/50 rounded p-4">
              <h4 className="text-green-400 mb-3 text-sm">Actions disponibles :</h4>
              <div className="flex gap-3">
                <button className="bg-green-500/20 border border-green-500 text-green-400 px-3 py-1 rounded text-xs hover:bg-green-500/30">
                  💚 Liker
                </button>
                <button className="bg-green-500/20 border border-green-500 text-green-400 px-3 py-1 rounded text-xs hover:bg-green-500/30">
                  💬 Commenter
                </button>
                <button className="bg-green-500/20 border border-green-500 text-green-400 px-3 py-1 rounded text-xs hover:bg-green-500/30">
                  🔗 Partager
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar droite */}
        <div className="bg-black border border-green-500 rounded-lg p-4">
          <h2 className="text-lg text-green-500 mb-4 border-b border-green-500 pb-2">
            Gélules ({capsules.length})
          </h2>
          
          <div className="space-y-3">
            {capsules.map(capsule => (
              <div 
                key={capsule.id}
                onClick={() => setActiveCapsuleId(capsule.id)}
                className={`border rounded p-3 cursor-pointer transition-all duration-200 ${
                  capsule.id === activeCapsuleId
                    ? 'border-green-400 bg-green-500/20 shadow-lg shadow-green-500/20' 
                    : 'border-green-500/50 hover:border-green-400 hover:bg-green-500/10'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs border border-green-500 px-2 py-1 rounded">
                    #{capsule.id}
                  </span>
                  <div className="text-xs text-green-400">
                    👁️{capsule.views} 💚{capsule.likes}
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  capsule.id === activeCapsuleId ? 'text-green-300' : 'text-green-400'
                }`}>
                  {capsule.title}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 border border-green-500/30 rounded text-center">
            <p className="text-xs text-green-400">
              ✓ Sidebar → Zone principale<br/>
              ✓ Esthétique Matrix<br/>
              <span className="text-green-300">🖱️ Cliquez sur les capsules !</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-green-500/20 border border-green-500 text-green-400 px-6 py-2 rounded hover:bg-green-500/30 transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
}