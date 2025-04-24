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
    name: v.string(),
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
      name: args.name,
      website: args.website,
      status: "Pending", // Default status for new entries
      createdAt: Date.now(),
      notes: args.notes,
    });

    console.log("Added new company prospect with id:", id);
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

// ...existing code...

// Fetch all company prospects
export const listCompanyProspects = query({
  args: {
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
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
