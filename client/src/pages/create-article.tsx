import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertArticleSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { z } from "zod";

const formSchema = insertArticleSchema.extend({
  tags: z.string().optional().transform(val => val ? val.split(',').map(tag => tag.trim()).filter(Boolean) : [])
});

export default function CreateArticle() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPreview, setIsPreview] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "scientific",
      tags: "",
      author: "",
      published: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertArticleSchema>) => {
      const response = await apiRequest("POST", "/api/articles", data);
      return response.json();
    },
    onSuccess: (article) => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Article créé avec succès",
        description: article.published ? "L'article a été publié." : "L'article a été sauvegardé en brouillon.",
      });
      setLocation(`/articles/${article.id}`);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'article. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>, published: boolean) => {
    const processedData = {
      ...data,
      published,
      tags: typeof data.tags === 'string' 
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : data.tags || []
    };
    createMutation.mutate(processedData);
  };

  const watchedValues = form.watch();

  if (isPreview) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setIsPreview(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'édition
          </Button>
        </div>

        <Card>
          <CardContent className="pt-8">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                watchedValues.category === 'scientific' ? 'bg-blue-100 text-blue-800' :
                watchedValues.category === 'human' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {watchedValues.category === 'scientific' ? 'Scientifique' :
                 watchedValues.category === 'human' ? 'Humain' : 'Philosophique'}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
              {watchedValues.title || "Titre de l'article"}
            </h1>
            
            <div className="text-gray-600 mb-6">
              Par {watchedValues.author || "Auteur"}
            </div>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {watchedValues.excerpt || "Extrait de l'article..."}
            </p>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: (watchedValues.content || "Contenu de l'article...").replace(/\n/g, '<br>')
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        
        <Button variant="outline" onClick={() => setIsPreview(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Aperçu
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Créer un nouvel article</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le titre de l'article" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auteur</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'auteur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="scientific">Scientifique</SelectItem>
                          <SelectItem value="human">Humain</SelectItem>
                          <SelectItem value="philosophical">Philosophique</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extrait</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Résumé court de l'article (2-3 phrases)"
                        className="resize-none"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Entrez les tags séparés par des virgules"
                        {...field}
                        value={typeof field.value === 'string' ? field.value : field.value?.join(', ') || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu</FormLabel>
                    <FormControl>
                      <RichTextEditor 
                        content={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={form.handleSubmit((data) => onSubmit(data, false))}
                  disabled={createMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder en brouillon
                </Button>
                
                <Button
                  type="button"
                  onClick={form.handleSubmit((data) => onSubmit(data, true))}
                  disabled={createMutation.isPending}
                >
                  Publier l'article
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
