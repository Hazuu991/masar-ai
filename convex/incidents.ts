import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    // Get incidents from the last 24 hours (86400000 ms)
    const oneDayAgo = Date.now() - 86400000;
    const incidents = await ctx.db
      .query("incidents")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", oneDayAgo))
      .collect();
    return incidents;
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, args) => {
    const incidentId = await ctx.db.insert("incidents", {
      type: args.type,
      lat: args.lat,
      lng: args.lng,
      timestamp: Date.now(),
      votes: 1,
    });
    return incidentId;
  },
});
