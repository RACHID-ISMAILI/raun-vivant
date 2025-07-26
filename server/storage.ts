import { users, capsules, comments, votes, intentions, type User, type InsertUser, type Capsule, type InsertCapsule, type Comment, type InsertComment, type Vote, type InsertVote, type Intention, type InsertIntention } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Capsule methods
  getCapsules(): Promise<Capsule[]>;
  getCapsule(id: number): Promise<Capsule | undefined>;
  createCapsule(capsule: any): Promise<Capsule>;
  updateCapsuleLikes(id: number, likes: number): Promise<void>;
  updateCapsuleViews(id: number, views: number): Promise<void>;
  deleteCapsule(id: number): Promise<void>;
  recordCapsuleView(capsuleId: number, username: string): Promise<boolean>;
  toggleVote(capsuleId: number, userIdentifier: string, type: string): Promise<void>;
  incrementViews(capsuleId: number): Promise<void>;
  
  // Comment methods
  getComments(capsuleId: number): Promise<Comment[]>;
  createComment(comment: any): Promise<Comment>;
  
  // Vote methods
  getVote(capsuleId: number, username: string): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
  deleteVote(capsuleId: number, username: string): Promise<void>;
  
  // Demo like methods (for click counting)
  toggleDemoLike(capsuleId: number, userIdentifier: string): Promise<Capsule>;
  
  // Intention methods
  getIntentions(): Promise<Intention[]>;
  createIntention(intention: any): Promise<Intention>;
  updateIntention(id: number, updates: any): Promise<Intention | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private capsules: Map<number, Capsule>;
  private comments: Map<number, Comment>;
  private votes: Map<number, Vote>;
  private intentions: Map<number, Intention>;
  private capsuleViews: Map<string, Set<string>>; // key: capsuleId, value: set of usernames
  private demoLikeClicks: Map<string, number>; // key: "capsuleId:userIdentifier", value: click count
  private currentUserId: number;
  private currentCapsuleId: number;
  private currentCommentId: number;
  private currentVoteId: number;
  private currentIntentionId: number;

  constructor() {
    this.users = new Map();
    this.capsules = new Map();
    this.comments = new Map();
    this.votes = new Map();
    this.intentions = new Map();
    this.capsuleViews = new Map();
    this.demoLikeClicks = new Map();
    this.currentUserId = 1;
    this.currentCapsuleId = 1;
    this.currentCommentId = 1;
    this.currentVoteId = 1;
    this.currentIntentionId = 1;
    
    // Initialize with some default capsules
    this.initializeDefaultCapsules();
  }

  private initializeDefaultCapsules() {
    const defaultCapsules = [
      {
        content: "La conscience est comme un océan infini. Chaque pensée n'est qu'une vague à sa surface, mais l'essence demeure éternellement calme et profonde. Nous ne sommes pas nos pensées, nous sommes l'observateur silencieux qui les contemple.",
        likes: 24,
        views: 147,
        createdAt: new Date(),
      },
      {
        content: "L'éveil n'est pas une destination mais un chemin. Chaque moment de présence authentique est une victoire contre l'illusion. Nous sommes déjà ce que nous cherchons à devenir.",
        likes: 18,
        views: 98,
        createdAt: new Date(),
      },
      {
        content: "Dans le silence de l'esprit, toutes les réponses se révèlent. Ne cherchez pas à comprendre avec le mental, mais à ressentir avec le cœur. La vérité ne se pense pas, elle se vit.",
        likes: 31,
        views: 203,
        createdAt: new Date(),
      },
    ];

    defaultCapsules.forEach((capsule) => {
      const id = this.currentCapsuleId++;
      this.capsules.set(id, { ...capsule, id });
    });
  }

  async getUser(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCapsules(): Promise<Capsule[]> {
    return Array.from(this.capsules.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCapsule(id: number): Promise<Capsule | undefined> {
    return this.capsules.get(id);
  }

  async createCapsule(insertCapsule: any): Promise<Capsule> {
    const id = this.currentCapsuleId++;
    const capsule: Capsule = {
      content: insertCapsule.content,
      id,
      likes: insertCapsule.likes || 0,
      views: insertCapsule.views || 0,
      createdAt: insertCapsule.createdAt || new Date(),
    };
    this.capsules.set(id, capsule);
    return capsule;
  }

  async updateCapsuleLikes(id: number, likes: number): Promise<void> {
    const capsule = this.capsules.get(id);
    if (capsule) {
      this.capsules.set(id, { ...capsule, likes });
    }
  }

  async updateCapsuleViews(id: number, views: number): Promise<void> {
    const capsule = this.capsules.get(id);
    if (capsule) {
      this.capsules.set(id, { ...capsule, views });
    }
  }

  async recordCapsuleView(capsuleId: number, username: string): Promise<boolean> {
    const key = capsuleId.toString();
    
    // Initialize the set if it doesn't exist
    if (!this.capsuleViews.has(key)) {
      this.capsuleViews.set(key, new Set());
    }
    
    const viewers = this.capsuleViews.get(key)!;
    
    // Check if this user has already viewed this capsule
    if (viewers.has(username)) {
      return false; // Already viewed, no increment needed
    }
    
    // Add user to viewers and increment view count
    viewers.add(username);
    const newViewCount = viewers.size;
    
    // Update the capsule's view count
    await this.updateCapsuleViews(capsuleId, newViewCount);
    
    return true; // New view recorded
  }

  async deleteCapsule(id: number): Promise<void> {
    this.capsules.delete(id);
  }

  async toggleVote(capsuleId: number, userIdentifier: string, type: string): Promise<void> {
    const key = `${capsuleId}:${userIdentifier}`;
    const currentClicks = this.demoLikeClicks.get(key) || 0;
    const newClicks = currentClicks + 1;
    this.demoLikeClicks.set(key, newClicks);
    
    // Calculate total likes for this capsule (sum of all user likes)
    const totalLikes = Array.from(this.demoLikeClicks.entries())
      .filter(([k]) => k.startsWith(`${capsuleId}:`))
      .reduce((sum, [, clicks]) => sum + (clicks % 2), 0); // Only count odd clicks
    
    await this.updateCapsuleLikes(capsuleId, totalLikes);
  }

  async incrementViews(capsuleId: number): Promise<void> {
    const capsule = this.capsules.get(capsuleId);
    if (capsule) {
      await this.updateCapsuleViews(capsuleId, capsule.views + 1);
    }
  }

  async getComments(capsuleId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(comment => comment.capsuleId === capsuleId);
  }

  async createComment(insertComment: any): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: insertComment.createdAt || new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async createIntention(insertIntention: any): Promise<Intention> {
    const id = this.currentIntentionId++;
    const intention: Intention = {
      content: insertIntention.content,
      author: insertIntention.author,
      id,
      createdAt: insertIntention.createdAt || new Date(),
    };
    this.intentions.set(id, intention);
    return intention;
  }

  async updateIntention(id: number, updates: any): Promise<Intention | undefined> {
    const intention = this.intentions.get(id);
    if (!intention) return undefined;
    
    const updatedIntention = { ...intention, ...updates };
    this.intentions.set(id, updatedIntention);
    return updatedIntention;
  }



  async getVote(capsuleId: number, username: string): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.capsuleId === capsuleId && vote.username === username
    );
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const vote: Vote = { ...insertVote, id };
    this.votes.set(id, vote);
    return vote;
  }

  async deleteVote(capsuleId: number, username: string): Promise<void> {
    const vote = Array.from(this.votes.entries()).find(
      ([_, v]) => v.capsuleId === capsuleId && v.username === username
    );
    if (vote) {
      this.votes.delete(vote[0]);
    }
  }

  async getIntentions(): Promise<Intention[]> {
    return Array.from(this.intentions.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }



  // Demo like system with toggle per user
  async toggleDemoLike(capsuleId: number, userIdentifier: string): Promise<Capsule> {
    const key = `${capsuleId}:${userIdentifier}`;
    const currentClicks = this.demoLikeClicks.get(key) || 0;
    const newClicks = currentClicks + 1;
    this.demoLikeClicks.set(key, newClicks);

    // Calculate total likes for this capsule by counting all users with odd clicks
    let totalLikes = 0;
    for (const [clickKey, clicks] of this.demoLikeClicks.entries()) {
      const [clickCapsuleId] = clickKey.split(':');
      if (parseInt(clickCapsuleId) === capsuleId && clicks % 2 === 1) {
        totalLikes++;
      }
    }

    // Add the original likes from initialization
    const capsule = this.capsules.get(capsuleId);
    if (capsule) {
      const originalLikes = this.getOriginalLikes(capsuleId);
      await this.updateCapsuleLikes(capsuleId, originalLikes + totalLikes);
    }

    return this.capsules.get(capsuleId)!;
  }

  private getOriginalLikes(capsuleId: number): number {
    // Return original likes from initialization
    const originalLikes = [24, 18, 31]; // Corresponds to capsule IDs 1, 2, 3
    return originalLikes[capsuleId - 1] || 0;
  }
}

export const storage = new MemStorage();
