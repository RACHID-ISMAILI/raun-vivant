import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Tag, Brain, Users, Lightbulb } from "lucide-react";

export default function ArticleDetail() {
  const { id } = useParams();

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ["/api/articles", id],
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "scientific": return <Brain className="h-4 w-4" />;
      case "human": return <Users className="h-4 w-4" />;
      case "philosophical": return <Lightbulb className="h-4 w-4" />;
      default: return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "scientific": return "Scientifique";
      case "human": return "Humain";  
      case "philosophical": return "Philosophique";
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "scientific": return "bg-blue-100 text-blue-800";
      case "human": return "bg-green-100 text-green-800";
      case "philosophical": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
        <p className="text-gray-600 mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux articles
        </Button>
      </Link>

      {/* Article Header */}
      <Card className="mb-8">
        <CardContent className="pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className={`${getCategoryColor(article.category)} flex items-center gap-1`}>
              {getCategoryIcon(article.category)}
              {getCategoryLabel(article.category)}
            </Badge>
            {!article.published && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Brouillon
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>

          {article.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <p className="text-lg text-gray-600 leading-relaxed">
            {article.excerpt}
          </p>
        </CardContent>
      </Card>

      {/* Article Content */}
      <Card>
        <CardContent className="pt-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ 
              __html: article.content.replace(/\n/g, '<br>').replace(/#{1,6}\s+(.+)/g, (match, title) => {
                const level = match.indexOf(' ') - match.indexOf('#');
                const tag = `h${Math.min(level, 6)}`;
                return `<${tag} class="text-${4-level}xl font-bold mb-4 mt-8 first:mt-0">${title}</${tag}>`;
              })
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
