"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagingData = exports.getPagination = void 0;
const getPagination = (query) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const offset = (page - 1) * limit;
    return { page, limit, offset };
};
exports.getPagination = getPagination;
const getPagingData = (rows, count, page, limit) => {
    const totalPages = Math.ceil(count / limit);
    return {
        data: rows,
        metadata: {
            total: count,
            page,
            limit,
            totalPages,
        },
    };
};
exports.getPagingData = getPagingData;
//# sourceMappingURL=pagination.js.map