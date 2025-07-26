import { useState } from "react";
import { Copy, CheckCircle, ExternalLink, Key, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/lib/simple-toast";

export default function ApiDocumentation() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
      toast.success("Code copié dans le presse-papiers");
    } catch (err) {
      toast.error("Impossible de copier le code");
    }
  };

  const CopyButton = ({ text, item }: { text: string; item: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, item)}
      className="ml-2 p-2"
    >
      {copiedItem === item ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

  const endpoints = [
    {
      method: "GET",
      path: "/api/public/capsules",
      description: "Récupérer toutes les capsules de conscience",
      params: "Aucun",
      response: "Array de capsules avec id, content, likes, views, createdAt"
    },
    {
      method: "GET", 
      path: "/api/public/capsules/:id",
      description: "Récupérer une capsule spécifique",
      params: "id: number (ID de la capsule)",
      response: "Objet capsule avec détails complets"
    },
    {
      method: "GET",
      path: "/api/public/intentions",
      description: "Récupérer les intentions spirituelles",
      params: "Aucun",
      response: "Array d'intentions avec id, content, author, createdAt"
    },
    {
      method: "POST",
      path: "/api/public/intentions", 
      description: "Créer une nouvelle intention",
      params: "content: string, author?: string",
      response: "Intention créée avec ID assigné"
    },
    {
      method: "GET",
      path: "/api/public/stats",
      description: "Statistiques publiques de la plateforme",
      params: "Aucun",
      response: "Métriques complètes et activité récente"
    }
  ];

  const jsExample = `// Exemple d'utilisation JavaScript
const apiKey = 'votre-cle-api';
const baseUrl = 'https://raun-rachid.com';

// Récupérer toutes les capsules
async function getCapsules() {
  const response = await fetch(\`\${baseUrl}/api/public/capsules\`, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data.data; // Array de capsules
}

// Créer une intention
async function createIntention(content, author) {
  const response = await fetch(\`\${baseUrl}/api/public/intentions\`, {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content, author })
  });
  
  return await response.json();
}`;

  const pythonExample = `# Exemple d'utilisation Python
import requests

API_KEY = 'votre-cle-api'
BASE_URL = 'https://raun-rachid.com'

headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
}

# Récupérer les statistiques
def get_stats():
    response = requests.get(f'{BASE_URL}/api/public/stats', headers=headers)
    return response.json()

# Récupérer une capsule spécifique
def get_capsule(capsule_id):
    response = requests.get(f'{BASE_URL}/api/public/capsules/{capsule_id}', headers=headers)
    return response.json()

# Créer une intention
def create_intention(content, author=None):
    data = {'content': content}
    if author:
        data['author'] = author
    
    response = requests.post(f'{BASE_URL}/api/public/intentions', 
                           headers=headers, json=data)
    return response.json()`;

  const curlExample = `# Exemples cURL

# Récupérer toutes les capsules
curl -H "X-API-Key: votre-cle-api" \\
     https://raun-rachid.com/api/public/capsules

# Récupérer les statistiques
curl -H "X-API-Key: votre-cle-api" \\
     https://raun-rachid.com/api/public/stats

# Créer une intention
curl -X POST \\
     -H "X-API-Key: votre-cle-api" \\
     -H "Content-Type: application/json" \\
     -d '{"content":"Ma nouvelle intention spirituelle","author":"Mon Nom"}' \\
     https://raun-rachid.com/api/public/intentions`;

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 animate-glow">
            🌐 API RAUN-RACHID
          </h1>
          <p className="text-green-400 text-lg">
            API publique pour l'intégration des capsules de conscience
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500">
              <Globe className="w-4 h-4 mr-1" />
              API Publique v1.0
            </Badge>
            <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500">
              <Key className="w-4 h-4 mr-1" />
              Authentification par clé API
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-green-900/20">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Exemples</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-green-900/10 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Authentification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>L'API RAUN-RACHID nécessite une clé API pour l'authentification :</p>
                <div className="bg-black p-4 rounded border border-green-500 flex justify-between items-center">
                  <code>X-API-Key: votre-cle-api</code>
                  <CopyButton text="X-API-Key: votre-cle-api" item="auth-header" />
                </div>
                <p className="text-sm text-green-400">
                  Contactez l'équipe RAUN-RACHID pour obtenir votre clé API personnalisée.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-900/10 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400">Limites de taux</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• 60 requêtes par minute pour les endpoints GET</li>
                  <li>• 10 requêtes par minute pour les endpoints POST</li>
                  <li>• Limitation par adresse IP</li>
                  <li>• Headers de réponse incluent les limites actuelles</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-900/10 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400">Format de réponse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black p-4 rounded border border-green-500">
                  <pre className="text-sm">
{`{
  "success": true,
  "data": [...],
  "total": 10,
  "timestamp": "2025-01-19T23:00:00.000Z"
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="bg-green-900/10 border-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Badge variant={endpoint.method === 'GET' ? 'default' : 'destructive'}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-green-400">{endpoint.path}</code>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Description :</strong> {endpoint.description}</p>
                  <p><strong>Paramètres :</strong> {endpoint.params}</p>
                  <p><strong>Réponse :</strong> {endpoint.response}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card className="bg-green-900/10 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  JavaScript / Node.js
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black p-4 rounded border border-green-500 relative">
                  <pre className="text-sm overflow-x-auto">{jsExample}</pre>
                  <CopyButton text={jsExample} item="js-example" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/10 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400">Python</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black p-4 rounded border border-green-500 relative">
                  <pre className="text-sm overflow-x-auto">{pythonExample}</pre>
                  <CopyButton text={pythonExample} item="python-example" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/10 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400">cURL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black p-4 rounded border border-green-500 relative">
                  <pre className="text-sm overflow-x-auto">{curlExample}</pre>
                  <CopyButton text={curlExample} item="curl-example" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card className="bg-green-900/10 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400">Webhooks RAUN-RACHID</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Recevez des notifications en temps réel pour les événements importants :</p>
                <ul className="space-y-2">
                  <li>• <code>capsule.created</code> - Nouvelle capsule publiée</li>
                  <li>• <code>capsule.liked</code> - Capsule likée par un utilisateur</li>
                  <li>• <code>intention.created</code> - Nouvelle intention partagée</li>
                  <li>• <code>user.registered</code> - Nouvel utilisateur inscrit</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-900/10 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400">Enregistrer un webhook</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black p-4 rounded border border-green-500">
                  <pre className="text-sm">
{`POST /api/webhooks/register
{
  "url": "https://votre-site.com/webhook",
  "events": ["capsule.created", "intention.created"],
  "secret": "votre-secret-securise",
  "name": "Mon Webhook"
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-900/10 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400">Intégrations populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Discord</h4>
                    <p className="text-sm text-green-400">Notifications automatiques dans votre serveur</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Slack</h4>
                    <p className="text-sm text-green-400">Alertes pour votre équipe de modération</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Zapier</h4>
                    <p className="text-sm text-green-400">Automatisation avec 1000+ applications</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Applications personnalisées</h4>
                    <p className="text-sm text-green-400">Intégrez avec votre propre système</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12 p-6 border-t border-green-500">
          <p className="text-green-400 mb-4">
            Besoin d'aide ? Consultez la documentation complète ou contactez notre équipe.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-900/20">
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentation complète
            </Button>
            <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-900/20">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}