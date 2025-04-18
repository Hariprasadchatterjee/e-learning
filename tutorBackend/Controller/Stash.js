import asyncError from "../Middleware/AsyncError.js";
import Stash from "../Model/Stats.js";

export const dashBoardStats = asyncError(async (req, res, next) => {
  // Get the last 12 records, sorted by date (newest first)
  const statsRecords = await Stash.find({}).sort({ createdAt: "desc" }).limit(12);
  
  // Reverse to get chronological order (oldest first)
  const reversedRecords = [...statsRecords].reverse();

  // Pad the array with empty records if we don't have 12 months of data
  const requiredPadding = 12 - reversedRecords.length;
  const paddedRecords = [
    ...Array(requiredPadding).fill({ users: 0, subscriptions: 0, views: 0 }),
    ...reversedRecords
  ];

  // Get current and previous month data
  const currentMonth = paddedRecords[paddedRecords.length - 1];
  const previousMonth = paddedRecords[paddedRecords.length - 2];

  // Extract counts
  const usersCount = currentMonth.users;
  const viewsCount = currentMonth.views;
  const subscriptionCount = currentMonth.subscriptions;

  // Helper function to calculate percentage change safely
  const calculatePercentage = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  };

  // Calculate percentages
  const userPercentage = calculatePercentage(currentMonth.users, previousMonth.users);
  const viewsPercentage = calculatePercentage(currentMonth.views, previousMonth.views);
  const subscriptionPercentage = calculatePercentage(currentMonth.subscriptions, previousMonth.subscriptions);

  // Determine profit trends
  const userProfit = userPercentage >= 0;
  const viewsProfit = viewsPercentage >= 0;
  const subscriptionProfit = subscriptionPercentage >= 0;

  res.status(200).json({
    success: true,
    dashboardData: {
      perYearRecord: paddedRecords,
      usersCount,
      viewsCount,
      subscriptionCount,
      userPercentage,
      viewsPercentage,
      subscriptionPercentage,
      userProfit,
      viewsProfit,
      subscriptionProfit
    }
  });
});