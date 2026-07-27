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
exports.getMe = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '7d',
    });
};
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({ message: 'Please provide email, password, and name.' });
            return;
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email is already registered.' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Find or create default USER role
        let userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
        if (!userRole) {
            userRole = await prisma.role.create({
                data: { name: 'USER', permissions: 'read,book,review,wishlist' },
            });
        }
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                roleId: userRole.id,
                avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
            },
            include: { role: true },
        });
        const token = signToken(user.id);
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role.name,
                    avatar: user.avatar,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Please provide email and password.' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Incorrect email or password.' });
            return;
        }
        const token = signToken(user.id);
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role.name,
                    avatar: user.avatar,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated.' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                role: true,
                bookings: {
                    include: {
                        package: { include: { destination: true } },
                        hotel: true,
                        room: true,
                    },
                },
                wishlist: {
                    include: { package: { include: { destination: true } } },
                },
            },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role.name,
                    avatar: user.avatar,
                    bookings: user.bookings,
                    wishlist: user.wishlist,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
