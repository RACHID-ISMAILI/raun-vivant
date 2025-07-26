
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTranslation, Language } from '@/lib/i18n';

const languageNames = {
  fr: 'Français',
  en: 'English', 
  ar: 'العربية'
};

const languageFlags = {
  fr: '🇫🇷',
  en: '🇺🇸',
  ar: '🇸🇦'
};

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-black hover:bg-green-500/10 border-green-500 text-green-500 hover:text-green-400"
        >
          <Globe className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{languageFlags[language]} {languageNames[language]}</span>
          <span className="sm:hidden">{languageFlags[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="bg-black border-green-500 text-green-500">
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`hover:bg-green-500/10 cursor-pointer ${
              language === lang ? 'bg-green-500/20' : ''
            }`}
          >
            <span className="mr-2">{languageFlags[lang]}</span>
            {languageNames[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}