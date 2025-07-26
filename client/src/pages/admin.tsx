import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Eye, Plus, BarChart3, Users, FileText, Clock } from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allArticles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles?admin=true"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const response = await apiRequest("PATCH", `/api/articles/${id}`, { published });
      return response.json();
    },
    onSuccess: (_, { published }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: published ? "Article publié" : "Article dépublié",
        description: published ? "L'article est maintenant visible au public." : "L'article est maintenant en brouillon.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'article.",
        variant: "destructive",
      });
    },
  });

  const publishedArticles = allArticles.filter(article => article.published);
  const draftArticles = allArticles.filter(article => !article.published);

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
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Administration</h1>
          <p className="text-gray-600">Gérez vos articles et consultez les statistiques</p>
        </div>
        <Link href="/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel article
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total articles</p>
                <p className="text-2xl font-bold text-gray-900">{allArticles.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-green-600">{publishedArticles.length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-orange-600">{draftArticles.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scientifiques</p>
                <p className="text-2xl font-bold text-purple-600">
                  {allArticles.filter(a => a.category === 'scientific').length}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les articles</CardTitle>
        </CardHeader>
        <CardContent>
          {allArticles.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article</h3>
              <p className="text-gray-500 mb-6">Commencez par créer votre premier article.</p>
              <Link href="/create">
                <Button>Créer un article</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      <Link href={`/articles/${article.id}`} className="hover:underline">
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(article.category)}>
                        {getCategoryLabel(article.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {article.published ? (
                        <Badge className="bg-green-100 text-green-800">Publié</Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">Brouillon</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/articles/${article.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => publishMutation.mutate({ 
                            id: article.id, 
                            published: !article.published 
                          })}
                          disabled={publishMutation.isPending}
                        >
                          {article.published ? "Dépublier" : "Publier"}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer "{article.title}" ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(article.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
