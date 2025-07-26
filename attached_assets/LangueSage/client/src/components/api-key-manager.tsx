import { useState } from "react";
import { Key, Copy, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/simple-toast";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  lastUsed?: Date;
  usage: number;
}

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Demo Key",
      key: "demo",
      created: new Date(),
      usage: 145
    }
  ]);
  
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Veuillez donner un nom à votre clé API");
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName.trim(),
      key: `raun_${Math.random().toString(36).substr(2, 32)}`,
      created: new Date(),
      usage: 0
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName("");
    
    toast.success(`Nouvelle clé "${newKey.name}" générée avec succès`);
  };

  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
      
      toast.success("Clé API copiée dans le presse-papiers");
    } catch (err) {
      toast.error("Impossible de copier la clé");
    }
  };

  const deleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== keyId));
    toast.success("La clé API a été révoquée avec succès");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2 flex items-center justify-center">
          <Key className="w-6 h-6 mr-2" />
          Gestionnaire de Clés API
        </h2>
        <p className="text-green-400/70">
          Créez et gérez vos clés d'accès à l'API RAUN-RACHID
        </p>
      </div>

      {/* Créer nouvelle clé */}
      <Card className="bg-green-900/10 border-green-500">
        <CardHeader>
          <CardTitle className="text-green-400">Générer une nouvelle clé API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="keyName" className="text-green-400">
              Nom de la clé (pour identification)
            </Label>
            <Input
              id="keyName"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Ex: Mon App Mobile, Site Web, Bot Discord..."
              className="bg-black border-green-500 text-green-400 mt-2"
            />
          </div>
          <Button 
            onClick={generateApiKey}
            className="bg-green-600 hover:bg-green-700 text-black font-bold"
          >
            <Key className="w-4 h-4 mr-2" />
            Générer la clé API
          </Button>
        </CardContent>
      </Card>

      {/* Liste des clés existantes */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-green-400">Vos clés API actives</h3>
        
        {apiKeys.length === 0 ? (
          <Card className="bg-green-900/10 border-green-500">
            <CardContent className="text-center py-8">
              <Key className="w-12 h-12 mx-auto text-green-400/50 mb-4" />
              <p className="text-green-400/70">Aucune clé API créée</p>
              <p className="text-sm text-green-400/50">
                Générez votre première clé pour commencer à utiliser l'API
              </p>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className="bg-green-900/10 border-green-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-green-400 text-lg">{apiKey.name}</h4>
                    <p className="text-sm text-green-400/70">
                      Créée le {formatDate(apiKey.created)}
                    </p>
                    {apiKey.lastUsed && (
                      <p className="text-sm text-green-400/50">
                        Dernière utilisation: {formatDate(apiKey.lastUsed)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500">
                      {apiKey.usage} requêtes
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteKey(apiKey.id)}
                      className="border-red-500 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black p-3 rounded border border-green-500 flex justify-between items-center">
                  <code className="text-green-400 font-mono text-sm break-all">
                    {apiKey.key}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyKey(apiKey.key)}
                    className="ml-2 border-green-500 text-green-400 hover:bg-green-900/20"
                  >
                    {copiedKey === apiKey.key ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-green-900/10 rounded border border-green-500/30">
                  <p className="text-sm text-green-400/70 mb-2">
                    <strong>Utilisation :</strong>
                  </p>
                  <code className="text-xs text-green-400 block">
                    curl -H "X-API-Key: {apiKey.key}" https://raun-rachid.com/api/public/capsules
                  </code>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Informations importantes */}
      <Card className="bg-yellow-900/10 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Sécurité et bonnes pratiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-yellow-400/90">
          <p>• Gardez vos clés API secrètes et ne les partagez jamais publiquement</p>
          <p>• Utilisez des noms descriptifs pour identifier facilement vos clés</p>
          <p>• Supprimez les clés inutilisées pour maintenir la sécurité</p>
          <p>• Chaque clé est limitée à 60 requêtes par minute</p>
          <p>• Surveillez l'usage de vos clés régulièrement</p>
        </CardContent>
      </Card>
    </div>
  );
}