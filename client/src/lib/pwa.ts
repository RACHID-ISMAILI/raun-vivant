// PWA Manager pour RAUN-RACHID
export class PWAManager {
  private deferredPrompt: any = null;
  private isInstalled = false;

  constructor() {
    this.init();
  }

  private init(): void {
    // Écoute l'événement beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Détecte si l'app est déjà installée
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallButton();
      console.log('💚 PWA: Application installée avec succès');
    });

    // Enregistre le Service Worker
    this.registerServiceWorker();
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('💚 PWA: Service Worker enregistré', registration.scope);
        
        // Écoute les mises à jour du SW
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nouvelle version disponible
                this.showUpdateNotification();
              }
            });
          }
        });
      } catch (error) {
        console.log('❌ PWA: Échec enregistrement SW', error);
      }
    }
  }

  public async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('❌ PWA: Prompt d\'installation non disponible');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('💚 PWA: Installation acceptée');
        this.deferredPrompt = null;
        return true;
      } else {
        console.log('⚠️ PWA: Installation refusée');
        return false;
      }
    } catch (error) {
      console.log('❌ PWA: Erreur installation', error);
      return false;
    }
  }

  private showInstallButton(): void {
    // Déclenche un événement personnalisé pour afficher le bouton d'installation
    window.dispatchEvent(new CustomEvent('pwa-installable'));
  }

  private hideInstallButton(): void {
    // Déclenche un événement personnalisé pour masquer le bouton d'installation
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  }

  private showUpdateNotification(): void {
    // Déclenche un événement personnalisé pour notifier d'une mise à jour
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  public isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  public getInstallationStatus(): { canInstall: boolean; isInstalled: boolean; isStandalone: boolean } {
    return {
      canInstall: !!this.deferredPrompt,
      isInstalled: this.isInstalled,
      isStandalone: this.isStandalone()
    };
  }

  // Demande la permission pour les notifications push
  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('❌ PWA: Notifications non supportées');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Envoie une notification locale
  public showNotification(title: string, options: NotificationOptions = {}): void {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      });
    }
  }
}

// Instance globale
export const pwaManager = new PWAManager();