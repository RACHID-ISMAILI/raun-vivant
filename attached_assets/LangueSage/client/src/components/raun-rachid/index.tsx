import { useState } from "react";
import { Capsule } from "@shared/schema";
import CapsuleSidebar from "./capsule-sidebar";
import CapsuleMainDisplay from "./capsule-main-display";

interface RaunRachidInterfaceProps {
  className?: string;
}

export default function RaunRachidInterface({ 
  className = "" 
}: RaunRachidInterfaceProps) {
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);

  const handleCapsuleSelect = (capsule: Capsule) => {
    setSelectedCapsule(capsule);
  };

  return (
    <div className={`h-full bg-black ${className}`}>
      {/* Sidebar uniquement - le contenu principal s'affiche dans la zone LangueSage */}
      <CapsuleSidebar
        onCapsuleSelect={handleCapsuleSelect}
        selectedCapsuleId={selectedCapsule?.id}
        className="h-full"
      />
      
      {/* Zone d'affichage principal intégrée dans LangueSage */}
      {selectedCapsule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-black border border-green-500 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <button 
                onClick={() => setSelectedCapsule(null)}
                className="float-right text-green-500 hover:text-green-300 text-2xl"
              >
                ×
              </button>
              <CapsuleMainDisplay 
                capsule={selectedCapsule}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export individual components for flexible usage
export { CapsuleSidebar, CapsuleMainDisplay };