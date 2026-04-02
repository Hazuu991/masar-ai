import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  incidents: defineTable({
    type: v.string(), // 'jam', 'accident', 'roadblock', 'hazard', 'trucks'
    lat: v.number(),
    lng: v.number(),
    timestamp: v.number(),
    votes: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});
