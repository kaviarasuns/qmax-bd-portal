import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  // New table for user roles
  userRoles: defineTable({
    userId: v.id("users"), // References the auth user ID
    role: v.string(), // e.g., "admin", "user", "moderator"
    permissions: v.optional(v.array(v.string())), // Optional array of specific permissions
  }).index("by_userId", ["userId"]), // Index to quickly look up roles by user ID
});
