import { Link } from "wouter";
import { Article } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Brain, Users, Lightbulb } from "lucide-react";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "scientific": return <Brain className="h-3 w-3" />;
      case "human": return <Users className="h-3 w-3" />;
      case "philosophical": return <Lightbulb className="h-3 w-3" />;
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

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Category and Date */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <Badge className={`${getCategoryColor(article.category)} flex items-center gap-1`}>
            {getCategoryIcon(article.category)}
            {getCategoryLabel(article.category)}
          </Badge>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={article.createdAt.toString()}>
              {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 font-serif line-clamp-2 flex-grow-0">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <User className="h-3 w-3" />
            <span>{article.author}</span>
          </div>
          
          <Link href={`/articles/${article.id}`}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-600">
              Lire l'article
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
