import { z } from "zod";

// ============================================
// Scribe / Recipe Creation Preferences
// ============================================
export const ScribePreferencesSchema = z.object({
  verbosity: z.enum(["concise", "standard", "detailed"]).default("standard"),
  tone: z.enum(["casual", "professional", "instructional"]).default("instructional"),
  creativity: z.number().min(0).max(100).default(50),
  cuisineBias: z.string().default("none"),
  useOnlyListed: z.boolean().default(false),
  allowPantryStaples: z.boolean().default(true),
  units: z.enum(["us", "metric"]).default("us"),
  weightVsVolume: z.enum(["weight", "volume"]).default("volume"),
  stepFormat: z.enum(["numbered", "paragraph"]).default("numbered"),
  includePrepTimes: z.boolean().default(true),
});

export type ScribePreferences = z.infer<typeof ScribePreferencesSchema>;

// ============================================
// Dietary & Lifestyle Preferences
// ============================================
export const DietaryPreferencesSchema = z.object({
  patterns: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  nutritionGoals: z.array(z.string()).default([]),
  defaultServings: z.number().int().min(1).max(12).default(4),
  constraintType: z.enum(["hard", "soft"]).default("soft"),
});

export type DietaryPreferences = z.infer<typeof DietaryPreferencesSchema>;

// ============================================
// Discovery & Feed Preferences
// ============================================
export const DiscoveryPreferencesSchema = z.object({
  preferredCuisines: z.array(z.string()).default([]),
  cookingTime: z.enum(["quick", "weeknight", "weekend"]).default("weeknight"),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  showTrending: z.boolean().default(true),
  showNewCreations: z.boolean().default(true),
  showHighlyRated: z.boolean().default(true),
});

export type DiscoveryPreferences = z.infer<typeof DiscoveryPreferencesSchema>;

// ============================================
// Library & Organization Preferences
// ============================================
export const LibraryPreferencesSchema = z.object({
  defaultView: z.enum(["card", "list", "compact"]).default("card"),
  sortOrder: z.enum(["recent", "cooked", "alpha"]).default("recent"),
  autoTagCuisine: z.boolean().default(true),
  autoTagDietary: z.boolean().default(true),
  autoTagMealType: z.boolean().default(true),
  autoAddFavorites: z.boolean().default(false),
  allowDuplicates: z.boolean().default(false),
});

export type LibraryPreferences = z.infer<typeof LibraryPreferencesSchema>;

// ============================================
// Social & Sharing Preferences
// ============================================
export const SocialPreferencesSchema = z.object({
  recipeVisibility: z.enum(["private", "link", "public"]).default("private"),
  allowSave: z.boolean().default(true),
  allowRemix: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  requireCredit: z.boolean().default(true),
  featuredOptIn: z.boolean().default(false),
});

export type SocialPreferences = z.infer<typeof SocialPreferencesSchema>;

// ============================================
// Cooking Mode Preferences
// ============================================
export const CookingPreferencesSchema = z.object({
  keepScreenAwake: z.boolean().default(true),
  largeTextMode: z.boolean().default(false),
  oneStepAtTime: z.boolean().default(false),
  readAloud: z.boolean().default(false),
  handsFreeNext: z.boolean().default(false),
  autoCreateTimers: z.boolean().default(true),
  timerAlerts: z.enum(["sound", "vibrate", "both", "none"]).default("sound"),
});

export type CookingPreferences = z.infer<typeof CookingPreferencesSchema>;

// ============================================
// Notification Preferences
// ============================================
export const NotificationPreferencesSchema = z.object({
  recipeSaved: z.boolean().default(true),
  commented: z.boolean().default(true),
  featured: z.boolean().default(true),
  emailWeekly: z.boolean().default(true),
  emailFeatured: z.boolean().default(false),
  emailTips: z.boolean().default(false),
});

export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;

// ============================================
// Privacy Preferences
// ============================================
export const PrivacyPreferencesSchema = z.object({
  profileVisibility: z.enum(["public", "private"]).default("public"),
  searchDiscoverable: z.boolean().default(true),
  improveScribe: z.boolean().default(false),
});

export type PrivacyPreferences = z.infer<typeof PrivacyPreferencesSchema>;

// ============================================
// Combined User Preferences
// ============================================
export const UserPreferencesSchema = z.object({
  scribe: ScribePreferencesSchema.optional(),
  dietary: DietaryPreferencesSchema.optional(),
  discovery: DiscoveryPreferencesSchema.optional(),
  library: LibraryPreferencesSchema.optional(),
  social: SocialPreferencesSchema.optional(),
  cooking: CookingPreferencesSchema.optional(),
  notifications: NotificationPreferencesSchema.optional(),
  privacy: PrivacyPreferencesSchema.optional(),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

// ============================================
// Partial schema for PATCH updates
// ============================================
export const UserPreferencesUpdateSchema = UserPreferencesSchema.partial();

export type UserPreferencesUpdate = z.infer<typeof UserPreferencesUpdateSchema>;

// ============================================
// Default values helper
// ============================================
export const DEFAULT_PREFERENCES: UserPreferences = {
  scribe: ScribePreferencesSchema.parse({}),
  dietary: DietaryPreferencesSchema.parse({}),
  discovery: DiscoveryPreferencesSchema.parse({}),
  library: LibraryPreferencesSchema.parse({}),
  social: SocialPreferencesSchema.parse({}),
  cooking: CookingPreferencesSchema.parse({}),
  notifications: NotificationPreferencesSchema.parse({}),
  privacy: PrivacyPreferencesSchema.parse({}),
};
