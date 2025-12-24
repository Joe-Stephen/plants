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
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const addressService = __importStar(require("../services/address.service"));
const getAll = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const addresses = await addressService.getAllAddresses(req.user.id);
        res.status(200).json({ status: 'success', data: { addresses } });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const address = await addressService.getAddressById(req.user.id, Number(req.params.id));
        res.status(200).json({ status: 'success', data: { address } });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const create = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const address = await addressService.createAddress(req.user.id, req.body);
        res.status(201).json({ status: 'success', data: { address } });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        const address = await addressService.updateAddress(req.user.id, Number(req.params.id), req.body);
        res.status(200).json({ status: 'success', data: { address } });
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        if (!req.user)
            return;
        await addressService.deleteAddress(req.user.id, Number(req.params.id));
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
//# sourceMappingURL=address.controller.js.map