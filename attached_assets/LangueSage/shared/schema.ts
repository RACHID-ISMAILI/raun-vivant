import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const capsules = pgTable("capsules", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  likes: integer("likes").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  capsuleId: integer("capsule_id").notNull(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  capsuleId: integer("capsule_id").notNull(),
  username: text("username").notNull(),
  type: text("type").notNull(), // 'like' only
});

export const intentions = pgTable("intentions", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  author: text("author"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCapsuleSchema = createInsertSchema(capsules).pick({
  content: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  capsuleId: true,
  username: true,
  content: true,
});

export const insertVoteSchema = createInsertSchema(votes).pick({
  capsuleId: true,
  username: true,
  type: true,
});

export const insertIntentionSchema = createInsertSchema(intentions).pick({
  content: true,
  author: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Capsule = typeof capsules.$inferSelect;
export type InsertCapsule = z.infer<typeof insertCapsuleSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Intention = typeof intentions.$inferSelect;
export type InsertIntention = z.infer<typeof insertIntentionSchema>;
