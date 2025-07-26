import { type Article, type InsertArticle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Articles
  createArticle(article: InsertArticle): Promise<Article>;
  getArticle(id: string): Promise<Article | undefined>;
  getAllArticles(published?: boolean): Promise<Article[]>;
  updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  searchArticles(query: string, category?: string): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
}

export class MemStorage implements IStorage {
  private articles: Map<string, Article>;

  constructor() {
    this.articles = new Map();
    this.seedData();
  }

  private seedData() {
    // Add some initial articles for demonstration
    const sampleArticles: Article[] = [
      {
        id: "1",
        title: "Les fondements neurobiologiques de la conscience",
        content: `# Les fondements neurobiologiques de la conscience

La conscience représente l'un des mystères les plus fascinants de la neuroscience moderne. Cette capacité unique qu'ont les êtres humains d'être conscients de leur propre existence et de leur environnement trouve ses racines dans des mécanismes neurobiologiques complexes.

## Le problème difficile de la conscience

David Chalmers a formulé ce qu'il appelle le "problème difficile de la conscience" : comment les processus physiques du cerveau donnent-ils naissance à l'expérience subjective ? Cette question centrale divise encore la communauté scientifique.

## Les corrélats neuronaux de la conscience

Les recherches modernes se concentrent sur l'identification des corrélats neuronaux de la conscience (CNC). Ces patterns d'activité cérébrale sont associés à des états conscients spécifiques.

### Le rôle du thalamus

Le thalamus joue un rôle crucial dans la génération et le maintien de la conscience. Cette structure agit comme un relais central qui intègre les informations sensorielles avant de les transmettre au cortex.

### Les réseaux corticaux

Les réseaux corticaux, notamment le réseau du mode par défaut, sont essentiels pour la conscience de soi et la réflexion introspective.

## Conclusion

La compréhension des mécanismes neurobiologiques de la conscience reste un défi majeur pour la science du XXIe siècle.`,
        excerpt: "Exploration des mécanismes neurobiologiques qui sous-tendent la conscience humaine, du thalamus aux réseaux corticaux.",
        category: "scientific",
        tags: ["neuroscience", "cerveau", "thalamus", "cortex"],
        author: "Dr. Marie Dubois",
        published: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2", 
        title: "L'expérience subjective : phénoménologie de la conscience",
        content: `# L'expérience subjective : phénoménologie de la conscience

La phénoménologie, fondée par Edmund Husserl, offre une approche unique pour comprendre la conscience en tant qu'expérience vécue.

## Qu'est-ce que la phénoménologie ?

La phénoménologie est l'étude des structures de l'expérience telle qu'elle est vécue de l'intérieur, sans recours aux explications causales ou aux théories scientifiques externes.

## L'intentionnalité de la conscience

Selon Franz Brentano et Edmund Husserl, toute conscience est conscience de quelque chose. Cette propriété, appelée intentionnalité, caractérise fondamentalement l'expérience consciente.

### Les actes intentionnels

- **Perception** : conscience d'objets sensibles
- **Souvenir** : conscience d'événements passés  
- **Imagination** : conscience d'objets possibles
- **Jugement** : conscience de propositions

## La réduction phénoménologique

La méthode de l'épochè permet de "mettre entre parenthèses" nos présupposés sur le monde pour se concentrer sur l'expérience pure.

## Implications pour la compréhension de la conscience

Cette approche révèle des aspects de la conscience souvent négligés par les neurosciences : la temporalité, l'incarnation, et l'intersubjectivité.`,
        excerpt: "Une approche phénoménologique de la conscience, explorant l'intentionnalité et l'expérience subjective.",
        category: "philosophical",
        tags: ["phénoménologie", "Husserl", "intentionnalité", "subjectivité"],
        author: "Prof. Jean-Luc Martin",
        published: true,
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-14"),
      },
      {
        id: "3",
        title: "Conscience et intelligence artificielle : vers une IA consciente ?",
        content: `# Conscience et intelligence artificielle : vers une IA consciente ?

L'avènement de l'intelligence artificielle soulève des questions profondes sur la nature de la conscience et la possibilité de créer des machines conscientes.

## Le test de Turing et ses limites

Alan Turing proposait un test comportemental pour évaluer l'intelligence des machines. Mais ce test suffit-il à déterminer si une machine est consciente ?

## Les approches computationnelles de la conscience

### Théorie de l'information intégrée (IIT)

Giulio Tononi propose que la conscience corresponde à l'information intégrée (Φ) d'un système. Cette approche mathématique pourrait s'appliquer aux systèmes artificiels.

### Global Workspace Theory

Bernard Baars suggère que la conscience émerge d'un "espace de travail global" où les informations sont partagées entre différents modules cognitifs.

## Les défis éthiques

Si des machines conscientes voient le jour, quelles seraient nos obligations morales envers elles ? Cette question devient de plus en plus pressante avec les progrès de l'IA.

## Conclusion

La création d'une IA consciente reste hypothétique, mais les recherches actuelles nous rapprochent de cette possibilité révolutionnaire.`,
        excerpt: "Analyse des possibilités et défis liés à la création d'une intelligence artificielle consciente.",
        category: "scientific",
        tags: ["IA", "conscience artificielle", "Turing", "éthique"],
        author: "Dr. Sophie Chen",
        published: true,
        createdAt: new Date("2024-01-13"),
        updatedAt: new Date("2024-01-13"),
      }
    ];

    sampleArticles.forEach(article => {
      this.articles.set(article.id, article);
    });
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const now = new Date();
    const article: Article = { 
      ...insertArticle, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.articles.set(id, article);
    return article;
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getAllArticles(published?: boolean): Promise<Article[]> {
    const articles = Array.from(this.articles.values());
    if (published !== undefined) {
      return articles.filter(article => article.published === published);
    }
    return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle = { 
      ...article, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async searchArticles(query: string, category?: string): Promise<Article[]> {
    const articles = Array.from(this.articles.values());
    const lowercaseQuery = query.toLowerCase();
    
    return articles.filter(article => {
      const matchesQuery = article.title.toLowerCase().includes(lowercaseQuery) ||
                          article.content.toLowerCase().includes(lowercaseQuery) ||
                          article.excerpt.toLowerCase().includes(lowercaseQuery) ||
                          article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery));
      
      const matchesCategory = !category || article.category === category;
      
      return matchesQuery && matchesCategory && article.published;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    const articles = Array.from(this.articles.values());
    return articles.filter(article => article.category === category && article.published)
                   .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const storage = new MemStorage();
