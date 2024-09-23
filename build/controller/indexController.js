"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getDashboard = (req, res) => {
    res.render('index', { title: 'Dashboard' });
};
// export for router
exports.default = { getDashboard };
