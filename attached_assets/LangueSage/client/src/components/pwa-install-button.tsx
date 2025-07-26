import { useState, useEffect } from "react";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pwaManager } from "@/lib/pwa";
import { useTranslation } from "@/lib/i18n";

export default function PWAInstallButton() {
  const { t } = useTranslation();
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Écoute les événements PWA
    const handleInstallable = () => setShowInstall(true);
    const handleInstalled = () => setShowInstall(false);

    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);

    // Vérifie le statut initial
    const status = pwaManager.getInstallationStatus();
    if (status.canInstall && !status.isStandalone) {
      setShowInstall(true);
    }

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await pwaManager.installApp();
      if (success) {
        setShowInstall(false);
      }
    } catch (error) {
      console.error('Erreur installation PWA:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
      <div className="bg-black border border-green-500 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-green-500 font-bold text-sm">
              {t('installApp')}
            </h3>
            <p className="text-green-300 text-xs">
              {t('installDescription')}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold text-xs"
          >
            <Download className="w-4 h-4 mr-1" />
            {isInstalling ? t('installing') : t('install')}
          </Button>
          <Button
            onClick={() => setShowInstall(false)}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500/10 text-xs"
          >
            {t('later')}
          </Button>
        </div>
      </div>
    </div>
  );
}