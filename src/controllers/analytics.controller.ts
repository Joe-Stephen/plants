import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service';

const getDateRange = (req: Request) => {
  const end = req.query.endDate
    ? new Date(req.query.endDate as string)
    : new Date();
  const start = req.query.startDate
    ? new Date(req.query.startDate as string)
    : new Date();

  if (!req.query.startDate) {
    // Default to 30 days ago
    start.setDate(end.getDate() - 30);
  }

  // Set times to start/end of day
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { start, end } = getDateRange(req);
    const stats = await analyticsService.getDashboardStats(start, end);
    res
      .status(200)
      .json({
        status: 'success',
        data: { ...stats, dateRange: { start, end } },
      });
  } catch (error) {
    next(error);
  }
};

export const getSalesChart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { start, end } = getDateRange(req);
    const groupBy = (req.query.groupBy as 'day' | 'month') || 'day';
    const chartData = await analyticsService.getSalesChart(start, end, groupBy);
    res.status(200).json({ status: 'success', data: chartData });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { start, end } = getDateRange(req);
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const products = await analyticsService.getTopProducts(start, end, limit);
    res.status(200).json({ status: 'success', data: { products } });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { start, end } = getDateRange(req);
    const stats = await analyticsService.getOrdersByStatus(start, end);
    res.status(200).json({ status: 'success', data: { stats } });
  } catch (error) {
    next(error);
  }
};

export const getCategorySales = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { start, end } = getDateRange(req);
    const sales = await analyticsService.getCategorySales(start, end);
    res.status(200).json({ status: 'success', data: { sales } });
  } catch (error) {
    next(error);
  }
};

export const getNewUsersChart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { start, end } = getDateRange(req);
    const groupBy = (req.query.groupBy as 'day' | 'month') || 'day';
    const chart = await analyticsService.getNewUsersChart(start, end, groupBy);
    res.status(200).json({ status: 'success', data: chart });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
    const products = await analyticsService.getLowStockProducts(threshold);
    res.status(200).json({ status: 'success', data: { products } });
  } catch (error) {
    next(error);
  }
};
