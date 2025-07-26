// Internationalization system for RAUN-RACHID - Simplified version

export type Language = 'fr' | 'en' | 'ar';

export interface Translation {
  // Navigation
  home: string;
  demo: string;
  intentions: string;
  admin: string;
  api: string;
  login: string;
  logout: string;
  
  // Main page
  welcomeTitle: string;
  welcomeSubtitle: string;
  startDemo: string;
  shareIntention: string;
  
  // Demo page
  demoTitle: string;
  demoMainDisplay: string;
  capsules: string;
  actions: string;
  like: string;
  comment: string;
  share: string;
  views: string;
  likes: string;
  comments: string;
  selectCapsule: string;
  discoverCapsules: string;
  consciousnessCapsules: string;
  refresh: string;
  backToHome: string;
  
  // Intentions page
  intentionTitle: string;
  intentionSubtitle: string;
  shareAnIntention: string;
  newIntention: string;
  nameOptional: string;
  yourIntention: string;
  namePlaceholder: string;
  intentionPlaceholder: string;
  shareButton: string;
  sending: string;
  intentionsList: string;
  noIntentions: string;
  firstIntention: string;
  anonymousSoul: string;
  
  // Common
  back: string;
  loading: string;
  error: string;
  success: string;
  cancel: string;
  confirm: string;

  // PWA Install
  installApp: string;
  installDescription: string;
  install: string;
  installing: string;
  later: string;
}

export const translations: Record<Language, Translation> = {
  fr: {
    // Navigation
    home: "Accueil",
    demo: "Démo",
    intentions: "Intentions",
    admin: "Admin",
    api: "API",
    login: "Connexion",
    logout: "Déconnexion",
    
    // Main page
    welcomeTitle: "RAUN-RACHID",
    welcomeSubtitle: "Réseau d'éveil spirituel",
    startDemo: "🚀 Demo",
    shareIntention: "💫 Intention Vivante",
    
    // Demo page
    demoTitle: "🚀 RAUN-RACHID - Interface LangueSage",
    demoMainDisplay: "Zone Principale d'Affichage",
    capsules: "Capsules",
    actions: "Actions disponibles",
    like: "J'aime",
    comment: "Commenter",
    share: "Partager",
    views: "vues",
    likes: "j'aimes",
    comments: "commentaires",
    selectCapsule: "Découvrir les capsules",
    discoverCapsules: "Découvrir les capsules", 
    consciousnessCapsules: "Capsules de Conscience",
    refresh: "Actualiser",
    backToHome: "Retour à l'accueil",
    
    // Intentions page
    intentionTitle: "💫 Intention Vivante",
    intentionSubtitle: "Partagez vos intentions, souhaits et messages sacrés",
    shareAnIntention: "Partager une intention",
    newIntention: "Nouvelle intention",
    nameOptional: "Nom (optionnel)",
    yourIntention: "Votre intention *",
    namePlaceholder: "Votre nom ou pseudonyme",
    intentionPlaceholder: "Écrivez votre intention, votre souhait, votre message sacré...",
    shareButton: "Partager l'intention",
    sending: "Envoi...",
    intentionsList: "Liste des intentions vivantes",
    noIntentions: "Aucune intention partagée pour le moment.",
    firstIntention: "Soyez le premier à partager une intention sacrée.",
    anonymousSoul: "Âme anonyme",
    
    // Common
    back: "Retour",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    cancel: "Annuler",
    confirm: "Confirmer",

    // PWA Install
    installApp: "Installer l'App",
    installDescription: "Accès rapide depuis votre écran d'accueil",
    install: "Installer",
    installing: "Installation...",
    later: "Plus tard"
  },
  
  en: {
    // Navigation
    home: "Home",
    demo: "Demo",
    intentions: "Intentions",
    admin: "Admin",
    api: "API",
    login: "Login",
    logout: "Logout",
    
    // Main page
    welcomeTitle: "RAUN-RACHID",
    welcomeSubtitle: "Spiritual Awakening Network",
    startDemo: "🚀 Demo",
    shareIntention: "💫 Living Intention",
    
    // Demo page
    demoTitle: "🚀 RAUN-RACHID - LangueSage Interface",
    demoMainDisplay: "Main Display Area",
    capsules: "Capsules",
    actions: "Available Actions",
    like: "Like",
    comment: "Comment",
    share: "Share",
    views: "views",
    likes: "likes",
    comments: "comments",
    selectCapsule: "Discover capsules",
    discoverCapsules: "Discover capsules",
    consciousnessCapsules: "Consciousness Capsules", 
    refresh: "Refresh",
    backToHome: "Back to home",
    
    // Intentions page
    intentionTitle: "💫 Living Intention",
    intentionSubtitle: "Share your intentions, wishes and sacred messages",
    shareAnIntention: "Share an intention",
    newIntention: "New intention",
    nameOptional: "Name (optional)",
    yourIntention: "Your intention *",
    namePlaceholder: "Your name or username",
    intentionPlaceholder: "Write your intention, your wish, your sacred message...",
    shareButton: "Share intention",
    sending: "Sending...",
    intentionsList: "List of living intentions",
    noIntentions: "No intentions shared yet.",
    firstIntention: "Be the first to share a sacred intention.",
    anonymousSoul: "Anonymous soul",
    
    // Common
    back: "Back",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    confirm: "Confirm",

    // PWA Install
    installApp: "Install App",
    installDescription: "Quick access from your home screen",
    install: "Install",
    installing: "Installing...",
    later: "Later"
  },
  
  ar: {
    // Navigation
    home: "الرئيسية",
    demo: "تجريب",
    intentions: "النوايا",
    admin: "إدارة",
    api: "واجهة برمجية",
    login: "تسجيل دخول",
    logout: "تسجيل خروج",
    
    // Main page
    welcomeTitle: "راعون-رشيد",
    welcomeSubtitle: "شبكة الصحوة الروحية",
    startDemo: "🚀 تجريب",
    shareIntention: "💫 النية الحية",
    
    // Demo page
    demoTitle: "🚀 راعون-رشيد - واجهة لغة الحكمة",
    demoMainDisplay: "منطقة العرض الرئيسية",
    capsules: "الكبسولات",
    actions: "الإجراءات المتاحة",
    like: "إعجاب",
    comment: "تعليق",
    share: "مشاركة",
    views: "مشاهدات",
    likes: "إعجابات",
    comments: "تعليقات",
    selectCapsule: "اكتشاف الكبسولات",
    discoverCapsules: "اكتشاف الكبسولات",
    consciousnessCapsules: "كبسولات الوعي",
    refresh: "تحديث", 
    backToHome: "العودة للرئيسية",
    
    // Intentions page
    intentionTitle: "💫 النية الحية",
    intentionSubtitle: "شارك نواياك وأمانيك ورسائلك المقدسة",
    shareAnIntention: "مشاركة نية",
    newIntention: "نية جديدة",
    nameOptional: "الاسم (اختياري)",
    yourIntention: "نيتك *",
    namePlaceholder: "اسمك أو اسم المستخدم",
    intentionPlaceholder: "اكتب نيتك، أمنيتك، رسالتك المقدسة...",
    shareButton: "مشاركة النية",
    sending: "جاري الإرسال...",
    intentionsList: "قائمة النوايا الحية",
    noIntentions: "لم يتم مشاركة أي نوايا بعد.",
    firstIntention: "كن أول من يشارك نية مقدسة.",
    anonymousSoul: "روح مجهولة",
    
    // Common
    back: "رجوع",
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    cancel: "إلغاء",
    confirm: "تأكيد",

    // PWA Install  
    installApp: "تثبيت التطبيق",
    installDescription: "وصول سريع من شاشتك الرئيسية",
    install: "تثبيت",
    installing: "جاري التثبيت...",
    later: "لاحقاً"
  }
};

// Language detection and management
export class I18nManager {
  private currentLanguage: Language = 'fr';
  
  constructor() {
    this.detectLanguage();
  }
  
  private detectLanguage(): void {
    // Try localStorage first (user preference)
    const savedLang = localStorage.getItem('raun-language') as Language;
    if (savedLang && translations[savedLang]) {
      this.currentLanguage = savedLang;
      return;
    }
    
    // Detect from browser
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) {
      this.currentLanguage = 'en';
    } else if (browserLang.startsWith('ar')) {
      this.currentLanguage = 'ar';
    } else {
      this.currentLanguage = 'fr'; // Default to French
    }
    
    this.saveLanguage();
  }
  
  private getLanguageFromUrl(): Language | null {
    const path = window.location.pathname;
    if (path.startsWith('/en/')) return 'en';
    if (path.startsWith('/ar/')) return 'ar';
    if (path.startsWith('/fr/')) return 'fr';
    return null;
  }
  
  private saveLanguage(): void {
    localStorage.setItem('raun-language', this.currentLanguage);
  }
  
  public setLanguage(lang: Language): void {
    this.currentLanguage = lang;
    this.saveLanguage();
    
    // Don't change URL - just update the language preference
    // The routing system will stay the same, only the content changes
  }
  
  private getLocalizedPath(path: string, lang: Language): string {
    // Remove existing language prefix
    const cleanPath = path.replace(/^\/(en|fr|ar)/, '') || '/';
    
    // Add new language prefix if not French (default)
    if (lang === 'fr') {
      return cleanPath;
    } else {
      return `/${lang}${cleanPath}`;
    }
  }
  
  public getCurrentLanguage(): Language {
    return this.currentLanguage;
  }
  
  public getTranslation(key: keyof Translation): string {
    return translations[this.currentLanguage][key];
  }
  
  public isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }
}

// Global instance
export const i18n = new I18nManager();

// Simple hook for components without React state
export function useTranslation() {
  const t = (key: keyof Translation) => i18n.getTranslation(key);
  
  return {
    language: i18n.getCurrentLanguage(),
    setLanguage: (lang: Language) => i18n.setLanguage(lang),
    t,
    isRTL: i18n.isRTL()
  };
}