"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
// Request parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logger
app.use((0, morgan_1.default)('dev'));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date(), service: 'EcoVoyage API' });
});
// Mount Routes
app.use('/api', api_routes_1.default);
// Global Error Handler
app.use(error_middleware_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🌲 EcoVoyage Luxury Server started successfully!`);
    console.log(`🟢 Running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Listening at http://localhost:${PORT}`);
    console.log(`=================================================`);
});
