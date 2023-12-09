import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Id, Doc } from "./_generated/dataModel";

export const archieve = mutation({
  args: {
    id: v.id("documents"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("UnAuthenticated");
    }
    const userId = identity.subject;
    const existingDocuments = await ctx.db.get(args.id);

    if (!existingDocuments) {
      throw new Error("Not Found");
    }

    if (existingDocuments.userId !== userId) {
      throw new Error("Not Found");
    }

    const recursive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child?._id, {
          isArchived: true,
        });
        await recursive(child?._id);
      }
    };

    const documents = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    await recursive(args.id);
    return documents;
  },
});

export const sidebarGet = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("UnAuthenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args?.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return document;
  },
});

export const get = query({
  async handler(ctx) {
    const identitiy = await ctx.auth.getUserIdentity();
    if (!identitiy) throw new Error("User is not authenticated");
    const documents = await ctx.db.query("documents").collect();
    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});

export const getTrash = query({
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return documents;
  },
});

export const restored = mutation({
  args: { id: v.id("documents") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    const exisitingDocuments = await ctx.db.get(args.id);
    if (!exisitingDocuments) {
      throw new Error("not found");
    }

    if (exisitingDocuments.userId !== userId) {
      throw new Error("UnAuthorized");
    }
    const option: Partial<Doc<"documents">> = {
      isArchived: false,
    };
    
    if (exisitingDocuments?.parentDocument) {
      const parent = await ctx.db.get(exisitingDocuments.parentDocument);
      if (parent?.isArchived) {
        option.parentDocument = undefined;
      }
    }
    await ctx.db.patch(args?.id, option);
    return exisitingDocuments;
  },
});
