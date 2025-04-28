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

  // New table for company prospects
  companyProspects: defineTable({
    userId: v.id("users"),
    companyName: v.string(),
    website: v.string(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    // Optional fields for executive update
    linkedIn: v.optional(v.string()),
    country: v.optional(v.string()),
    headquarters: v.optional(v.string()),
    companyType: v.optional(v.string()),
    industry: v.optional(v.string()),
    endProduct: v.optional(v.string()),
    employees: v.optional(v.string()),
    ceoName: v.optional(v.string()),
    ceoLinkedIn: v.optional(v.string()),
    ceoEmail: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    fundingStage: v.optional(v.string()),
    rdLocations: v.optional(v.string()),
    potentialNeeds: v.optional(v.string()),
    contacts: v.optional(
      v.array(
        v.object({
          email: v.string(),
          linkedIn: v.string(),
        }),
      ),
    ),
    dateTime: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_companyName", ["companyName"]), // Add index for company name searches
});
