"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indexController_1 = __importDefault(require("../controller/indexController"));
const router = (0, express_1.Router)();
// Tie controller function with root path of url(E.g localhost:3000/)
router.get('/', indexController_1.default.getDashboard);
exports.default = router;
