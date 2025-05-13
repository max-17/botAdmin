"use server";

import { db } from "@/lib/db";

export async function getDashboardData() {
  const thisMonth = new Date().getMonth();
  const lastMonthStart = new Date(new Date().setMonth(thisMonth - 1));
  lastMonthStart.setDate(1); // Start of last month
  const lastMonthEnd = new Date(new Date().setMonth(thisMonth));
  lastMonthEnd.setDate(0); // End of last month

  const [
    thisMonthRev,
    lastMonthRev,
    ordersThisMonth,
    ordersToday,
    ordersYesterday,
    users,
    products,
  ] = await Promise.all([
    db.order.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)), // Start of this month
        },
      },
      _sum: {
        total: true,
      },
    }),
    db.order.aggregate({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
      _sum: {
        total: true,
      },
    }),
    db.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)), // Start of this month
        },
        status: { not: { in: ["PENDING", "CANCELED"] } },
      },
    }),
    db.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
        },
        status: { not: { in: ["PENDING", "CANCELED"] } },
      },
    }),
    db.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 1)), // Start of yesterday
          lt: new Date(new Date().setDate(new Date().getDate())), // End of yesterday
        },
        status: { not: { in: ["PENDING", "CANCELED"] } },
      },
    }),
    db.user.count(),
    db.product.count(),
  ]);

  let revenueDifferencePercent;

  const thisMonthRevenue = thisMonthRev._sum.total || 0;
  const lastMonthRevenue = lastMonthRev._sum.total || 0;

  const revenueDifference = thisMonthRevenue - lastMonthRevenue;
  if (revenueDifference === 0) {
    revenueDifferencePercent = 0; // No difference
  } else if (lastMonthRevenue === 0 || thisMonthRevenue === 0) {
    revenueDifferencePercent = "н/д"; // cannot be calculated
  } else {
    const val = revenueDifference / (lastMonthRevenue / 100);
    revenueDifferencePercent = val > 0 ? "+" + val : val;
  }

  return {
    revenueDifferencePercent,
    thisMonthRevenue,
    ordersThisMonth,
    ordersToday,
    ordersYesterday,
    users,
    products,
  };
}
