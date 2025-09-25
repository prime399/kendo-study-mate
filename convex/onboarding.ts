import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const isOnboardingComplete = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    const userSettings = await ctx.db
      .query("userSettings")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first()

    return userSettings?.isOnboardingDone ?? false
  },
})

export const completeOnboarding = mutation({
  args: {
    dailyGoal: v.number(),
    studyDuration: v.number(),
    selectedGroupIds: v.array(v.id("groups")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    const existingSettings = await ctx.db
      .query("userSettings")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first()

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        isOnboardingDone: true,
        lastUpdated: Date.now(),
      })
    } else {
      await ctx.db.insert("userSettings", {
        userId,
        isOnboardingDone: true,
        lastUpdated: Date.now(),
      })
    }

    const existingStudySettings = await ctx.db
      .query("studySettings")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first()

    if (existingStudySettings) {
      await ctx.db.patch(existingStudySettings._id, {
        dailyGoal: args.dailyGoal,
        studyDuration: args.studyDuration,
        lastUpdated: Date.now(),
      })
    } else {
      await ctx.db.insert("studySettings", {
        userId,
        dailyGoal: args.dailyGoal,
        studyDuration: args.studyDuration,
        totalStudyTime: 0,
        lastUpdated: Date.now(),
      })
    }

    for (const groupId of args.selectedGroupIds) {
      const existing = await ctx.db
        .query("groupMembers")
        .filter((q) =>
          q.and(
            q.eq(q.field("groupId"), groupId),
            q.eq(q.field("userId"), userId),
          ),
        )
        .first()

      if (!existing) {
        await ctx.db.insert("groupMembers", {
          groupId,
          userId,
          joinedAt: Date.now(),
          role: "member",
        })
      }
    }
  },
})

export const getSuggestedGroups = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 4, 12))

    const groups = await ctx.db.query("groups").order("desc").take(limit)

    const groupsWithMemberCounts = await Promise.all(
      groups.map(async (group) => {
        const members = await ctx.db
          .query("groupMembers")
          .withIndex("by_group")
          .filter((q) => q.eq(q.field("groupId"), group._id))
          .collect()

        return {
          ...group,
          memberCount: members.length,
        }
      }),
    )

    return groupsWithMemberCounts
  },
})

