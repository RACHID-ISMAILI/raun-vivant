import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { ArticleCard } from "@/components/article-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Brain, User, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "scientific": return <Brain className="h-4 w-4" />;
      case "human": return <User className="h-4 w-4" />;
      case "philosophical": return <Lightbulb className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "scientific": return "Scientifique";
      case "human": return "Humain";
      case "philosophical": return "Philosophique";
      default: return "Tous";
    }
  };

  const getCategoryCount = (category: string) => {
    return articles.filter(article => article.category === category).length;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
          LangueSage
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Un blog académique dédié à l'exploration de la conscience sous ses aspects scientifiques, humains et philosophiques
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher des articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="scientific">Scientifique</SelectItem>
              <SelectItem value="human">Humain</SelectItem>
              <SelectItem value="philosophical">Philosophique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Stats */}
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="flex items-center gap-2">
            <BookOpen className="h-3 w-3" />
            Total: {articles.length}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Brain className="h-3 w-3" />
            Scientifique: {getCategoryCount("scientific")}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <User className="h-3 w-3" />
            Humain: {getCategoryCount("human")}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Lightbulb className="h-3 w-3" />
            Philosophique: {getCategoryCount("philosophical")}
          </Badge>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun article trouvé
          </h3>
          <p className="text-gray-500">
            {searchQuery || selectedCategory !== "all" 
              ? "Essayez de modifier vos critères de recherche."
              : "Aucun article n'a encore été publié."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
