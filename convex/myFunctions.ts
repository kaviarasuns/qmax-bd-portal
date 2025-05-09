import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:

// Add this new function to fetch the user role
export const getUserRole = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return userRole ? userRole.role : null;
  },
});

// Add a new function to fetch the latest approved prospect
export const getLatestApprovedProspect = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const prospect = await ctx.db
      .query("companyProspects")
      // .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "Approved"))
      .order("asc")
      .first();

    return prospect;
  },
});

// Add a company prospect to the database
export const addCompanyProspect = mutation({
  args: {
    companyName: v.string(),
    website: v.string(),
    headquarters: v.string(),
    employees: v.string(),
    potentialNeeds: v.string(),
    industry: v.string(),
    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Authentication required to add a company prospect");
    }

    // Get user from users table
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const id = await ctx.db.insert("companyProspects", {
      userId,
      submitterName: user.name, // Use name from users table
      companyName: args.companyName,
      website: args.website,
      headquarters: args.headquarters,
      employees: args.employees,
      potentialNeeds: args.potentialNeeds,
      industry: args.industry,
      status: "Pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      dateTime: Date.now(),
      notes: args.notes,
    });

    return id;
  },
});

// Update company prospect status
export const updateCompanyProspectStatus = mutation({
  args: {
    id: v.id("companyProspects"),
    status: v.union(
      v.literal("Pending"),
      v.literal("Approved"),
      v.literal("Rejected"),
    ),
    notes: v.optional(v.string()),
    approverName: v.string(),
    approverId: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error(
        "Authentication required to update company prospect status",
      );
    }

    // Check if the user has permission
    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!userRole || userRole.role !== "manager") {
      throw new Error("Only managers can update company prospect status");
    }

    // Define properly typed update object
    type UpdateData = {
      status: "Pending" | "Approved" | "Rejected";
      approverName: string;
      approverId: string;
      approvedAt: number;
      notes?: string;
    };

    const updateData: UpdateData = {
      status: args.status,
      approverName: args.approverName,
      approverId: args.approverId,
      approvedAt: Date.now(),
    };

    // Add notes if provided
    if (args.notes !== undefined) {
      updateData.notes = args.notes;
    }

    await ctx.db.patch(args.id, updateData);

    return true;
  },
});

// Update company prospect notes
export const updateCompanyProspectNotes = mutation({
  args: {
    id: v.id("companyProspects"),
    notes: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error(
        "Authentication required to update company prospect notes",
      );
    }

    // Optional role check - remove if not needed
    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!userRole || userRole.role !== "manager") {
      throw new Error("Only managers can update company prospect notes");
    }

    // Update just the notes field without the timestamp fields
    await ctx.db.patch(args.id, {
      notes: args.notes,
    });

    return true;
  },
});

// Update company prospect with all possible fields
export const updateCompanyProspect = mutation({
  args: {
    id: v.id("companyProspects"),
    companyName: v.string(),
    website: v.string(),
    linkedIn: v.string(),
    country: v.string(),
    headquarters: v.string(),
    companyType: v.string(),
    industry: v.string(),
    endProduct: v.string(),
    employees: v.string(),
    ceoName: v.string(),
    ceoLinkedIn: v.string(),
    ceoEmail: v.string(),
    phoneNumber: v.string(),
    fundingStage: v.string(),
    rdLocations: v.string(),
    potentialNeeds: v.string(),
    contacts: v.array(
      v.object({
        email: v.string(),
        linkedIn: v.string(),
      }),
    ),
    notes: v.optional(v.string()),
    status: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Authentication required to update company prospect");
    }

    // Check if the prospect exists
    const prospect = await ctx.db.get(args.id);
    if (!prospect) {
      throw new Error("Company prospect not found");
    }

    // Update all fields
    await ctx.db.patch(args.id, {
      companyName: args.companyName,
      website: args.website,
      linkedIn: args.linkedIn,
      country: args.country,
      headquarters: args.headquarters,
      companyType: args.companyType,
      industry: args.industry,
      endProduct: args.endProduct,
      employees: args.employees,
      ceoName: args.ceoName,
      ceoLinkedIn: args.ceoLinkedIn,
      ceoEmail: args.ceoEmail,
      phoneNumber: args.phoneNumber,
      fundingStage: args.fundingStage,
      rdLocations: args.rdLocations,
      potentialNeeds: args.potentialNeeds,
      contacts: args.contacts,
      notes: args.notes,
      status: args.status,
    });

    return true;
  },
});

// Save company prospect draft
export const saveCompanyProspectDraft = mutation({
  args: {
    companyName: v.string(),
    website: v.string(),
    linkedIn: v.string(),
    country: v.string(),
    headquarters: v.string(),
    companyType: v.string(),
    industry: v.string(),
    endProduct: v.string(),
    employees: v.string(),
    ceoName: v.string(),
    ceoLinkedIn: v.string(),
    ceoEmail: v.string(),
    phoneNumber: v.string(),
    fundingStage: v.string(),
    rdLocations: v.string(),
    potentialNeeds: v.string(),
    contacts: v.array(
      v.object({
        email: v.string(),
        linkedIn: v.string(),
      }),
    ),
    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Authentication required to save draft");
    }

    // Create a new prospect with status Draft
    const id = await ctx.db.insert("companyProspects", {
      ...args,
      userId,
      status: "Draft",
      createdAt: Date.now(),
    });

    return id;
  },
});

// Fetch all company prospects
export const listAllCompanyProspects = query({
  args: {
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // Return early if not authenticated instead of throwing
    if (!identity) {
      return null; // or [] or any appropriate default value
    }

    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Authentication required to list company prospects");
    }

    const limit = args.limit ?? 10000; // Default limit of 50 prospects

    const prospects = await ctx.db
      .query("companyProspects")
      // Order by creation time, most recent first
      .order("desc")
      .take(limit);

    return prospects;
  },
});

export const listCompanyProspectsByStatus = query({
  args: {
    status: v.union(
      v.literal("Pending"),
      v.literal("Approved"),
      v.literal("Rejected"),
      v.literal("Submitted"),
    ),
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Authentication required to list company prospects");
    }

    const limit = args.limit ?? 50;

    const prospects = await ctx.db
      .query("companyProspects")
      .filter((q) => q.eq(q.field("status"), args.status))
      .order("desc")
      .take(limit);

    return prospects;
  },
});

export const getCurrentUserWithRoles = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    // Get the user
    const user = await ctx.db.get(userId);

    // Get the user's roles using the index you defined
    const roles = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Return both user and roles
    return { user, roles };
  },
});
