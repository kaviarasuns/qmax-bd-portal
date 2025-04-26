import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const listNumbers = query({
  // Validators for arguments.
  args: {
    count: v.number(),
  },

  // Query implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    const numbers = await ctx.db
      .query("numbers")
      // Ordered by _creationTime, return most recent
      .order("desc")
      .take(args.count);

    const userId = await getAuthUserId(ctx);

    // Initialize user and role variables
    let user = null;
    let role = null;

    // If we have a userId, fetch both user and role information
    if (userId !== null) {
      user = await ctx.db.get(userId);

      // Fetch the user's role from userRoles table using the index
      const userRole = await ctx.db
        .query("userRoles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();

      // Get the role information if userRole exists
      role = userRole ? userRole.role : null;
    }

    return {
      viewer: user?.email ?? null,
      numbers: numbers.reverse().map((number) => number.value),
      role: role, // Include the role in the return object
    };
  },
});

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
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "Approved"))
      .order("desc")
      .first();

    return prospect;
  },
});

// You can write data to the database via a mutation:
export const addNumber = mutation({
  // Validators for arguments.
  args: {
    value: v.number(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    //// Insert or modify documents in the database here.
    //// Mutations can also read from the database like queries.
    //// See https://docs.convex.dev/database/writing-data.

    const id = await ctx.db.insert("numbers", { value: args.value });

    console.log("Added new document with id:", id);
    // Optionally, return a value from your mutation.
    // return id;
  },
});

// Add a company prospect to the database
export const addCompanyProspect = mutation({
  args: {
    companyName: v.string(), // Changed from 'name' to 'companyName'
    website: v.string(),
    notes: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Authentication required to add a company prospect");
    }

    const id = await ctx.db.insert("companyProspects", {
      userId,
      companyName: args.companyName, // Changed from args.name to args.companyName
      website: args.website,
      status: "Pending", // Default status for new entries
      createdAt: Date.now(),
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
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error(
        "Authentication required to update company prospect status",
      );
    }

    // Check if the user has permission (optional, add role checks if needed)
    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!userRole || userRole.role !== "manager") {
      throw new Error("Only managers can update company prospect status");
    }

    // Define a properly typed update object
    type CompanyProspectUpdate = {
      status: "Pending" | "Approved" | "Rejected";
      notes?: string;
    };

    const updateData: CompanyProspectUpdate = {
      status: args.status,
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

    // Optional: Check if the user has permission to update this prospect
    const prospect = await ctx.db.get(args.id);
    if (!prospect) {
      throw new Error("Company prospect not found");
    }

    if (prospect.userId !== userId) {
      // Check if user has admin/manager role
      const userRole = await ctx.db
        .query("userRoles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();

      if (!userRole || !["admin", "manager"].includes(userRole.role)) {
        throw new Error("Permission denied: Can only edit your own prospects");
      }
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

// Fetch all company prospects
export const listCompanyProspects = query({
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

    const limit = args.limit ?? 50; // Default limit of 50 prospects

    const prospects = await ctx.db
      .query("companyProspects")
      // Order by creation time, most recent first
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

// You can fetch data from and send data to third-party APIs via an action:
export const myAction = action({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Action implementation.
  handler: async (ctx, args) => {
    //// Use the browser-like `fetch` API to send HTTP requests.
    //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    // const response = await ctx.fetch("https://api.thirdpartyservice.com");
    // const data = await response.json();

    //// Query data by running Convex queries.
    const data = await ctx.runQuery(api.myFunctions.listNumbers, {
      count: 10,
    });
    console.log(data);

    //// Write data by running Convex mutations.
    await ctx.runMutation(api.myFunctions.addNumber, {
      value: args.first,
    });
  },
});
