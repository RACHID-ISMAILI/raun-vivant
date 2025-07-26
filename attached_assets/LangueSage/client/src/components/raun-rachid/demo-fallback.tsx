import { ArrowLeft, Settings, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DemoFallback() {
  return (
    <div className="h-screen bg-black text-green-500 font-mono relative overflow-hidden">
      {/* Matrix-style background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 gap-1 h-full text-xs">
          {Array.from({ length: 400 }, (_, i) => (
            <div key={i} className="text-green-500">
              {Math.random() > 0.7 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : ''}
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-green-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-500 flex items-center">
                <Rocket className="w-6 h-6 mr-3" />
                RAUN-RACHID - INTERFACE LANGUÉSAGE
              </h1>
              <p className="text-green-500/70 mt-2">
                Démonstration de l'intégration sidebar droite + zone principale
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="bg-black hover:bg-green-500/10 border-green-500 text-green-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>

        {/* Main Content - Simulate Layout */}
        <div className="flex-1 flex">
          {/* Main Area Placeholder */}
          <div className="flex-1 p-6">
            <Card className="bg-black border-green-500 h-full">
              <CardHeader>
                <CardTitle className="text-green-500 text-center">
                  Zone Principale d'Affichage
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="text-6xl opacity-30">📱</div>
                  <h3 className="text-xl">Interface LangueSage + RAUN-RACHID</h3>
                  <div className="space-y-2 text-green-500/70">
                    <p>✓ Sidebar droite avec capsules de conscience</p>
                    <p>✓ Zone principale d'affichage du contenu sélectionné</p>
                    <p>✓ Navigation cliquable sidebar → contenu principal</p>
                    <p>✓ Esthétique Matrix préservée</p>
                  </div>
                  <div className="mt-6 p-4 border border-green-500/30 rounded">
                    <p className="text-sm text-green-500/80">
                      <strong>Composants prêts pour intégration :</strong><br/>
                      • CapsuleSidebar<br/>
                      • CapsuleMainDisplay<br/>
                      • RaunRachidInterface
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Simulation */}
          <div className="w-80 border-l border-green-500 p-4">
            <div className="space-y-4">
              <div className="text-green-500 text-sm font-bold border-b border-green-500 pb-2">
                CAPSULES RAUN-RACHID (3)
              </div>
              
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-black border-green-500/50 cursor-pointer hover:border-green-400">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs border border-green-500 text-green-500 px-2 py-1 rounded">
                        #{i}
                      </span>
                      <div className="text-xs text-green-500/70">
                        👁️ {20 + i * 10} 💚 {5 + i * 3}
                      </div>
                    </div>
                    <div className="text-green-500 text-xs leading-relaxed">
                      {i === 1 && "La conscience est comme un océan infini..."}
                      {i === 2 && "L'éveil n'est pas une destination mais un chemin..."}
                      {i === 3 && "Dans le silence de l'esprit, toutes les réponses..."}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-green-500 p-4 text-center text-green-500/70">
          <p className="text-sm">
            🚀 Architecture RAUN-RACHID prête pour intégration dans LangueSage
          </p>
        </div>
      </div>
    </div>
  );
}