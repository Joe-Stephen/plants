"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStock = exports.getNewUsersChart = exports.getCategorySales = exports.getOrdersByStatus = exports.getTopProducts = exports.getSalesChart = exports.getDashboard = void 0;
const analyticsService = __importStar(require("../services/analytics.service"));
const getDateRange = (req) => {
    const end = req.query.endDate
        ? new Date(req.query.endDate)
        : new Date();
    const start = req.query.startDate
        ? new Date(req.query.startDate)
        : new Date();
    if (!req.query.startDate) {
        start.setDate(end.getDate() - 30);
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};
const getDashboard = async (req, res, next) => {
    try {
        const { start, end } = getDateRange(req);
        const stats = await analyticsService.getDashboardStats(start, end);
        res
            .status(200)
            .json({
            status: 'success',
            data: { ...stats, dateRange: { start, end } },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboard = getDashboard;
const getSalesChart = async (req, res, next) => {
    try {
        const { start, end } = getDateRange(req);
        const groupBy = req.query.groupBy || 'day';
        const chartData = await analyticsService.getSalesChart(start, end, groupBy);
        res.status(200).json({ status: 'success', data: chartData });
    }
    catch (error) {
        next(error);
    }
};
exports.getSalesChart = getSalesChart;
const getTopProducts = async (req, res, next) => {
    try {
        const { start, end } = getDateRange(req);
        const limit = req.query.limit ? Number(req.query.limit) : 5;
        const products = await analyticsService.getTopProducts(start, end, limit);
        res.status(200).json({ status: 'success', data: { products } });
    }
    catch (error) {
        next(error);
    }
};
exports.getTopProducts = getTopProducts;
const getOrdersByStatus = async (req, res, next) => {
    try {
        const { start, end } = getDateRange(req);
        const stats = await analyticsService.getOrdersByStatus(start, end);
        res.status(200).json({ status: 'success', data: { stats } });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrdersByStatus = getOrdersByStatus;
const getCategorySales = async (req, res, next) => {
    try {
        const { start, end } = getDateRange(req);
        const sales = await analyticsService.getCategorySales(start, end);
        res.status(200).json({ status: 'success', data: { sales } });
    }
    catch (error) {
        next(error);
    }
};
exports.getCategorySales = getCategorySales;
const getNewUsersChart = async (req, res, next) => {
    try {
        const { start, end } = getDateRange(req);
        const groupBy = req.query.groupBy || 'day';
        const chart = await analyticsService.getNewUsersChart(start, end, groupBy);
        res.status(200).json({ status: 'success', data: chart });
    }
    catch (error) {
        next(error);
    }
};
exports.getNewUsersChart = getNewUsersChart;
const getLowStock = async (req, res, next) => {
    try {
        const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
        const products = await analyticsService.getLowStockProducts(threshold);
        res.status(200).json({ status: 'success', data: { products } });
    }
    catch (error) {
        next(error);
    }
};
exports.getLowStock = getLowStock;
//# sourceMappingURL=analytics.controller.js.map