import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import DBCon from './libs/db.js';
import AuthRoutes from './routes/Auth.js';
import { BlogRoutes } from './routes/Blogs.js'; // ✅ matches the export style
import DashboardRoutes from './routes/Dashboard.js';
import CommentRoutes from './routes/Comments.js';
import PublicRoutes from './routes/Public.js';

import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

// Convert ES module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App setup
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
DBCon();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Setup
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true,
};
app.use(cors(corsOptions));

// Static folder for uploaded images
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Serve other public static assets (if any)
app.use(express.static('public'));

// Routes
app.use('/auth', AuthRoutes);
app.use('/blog', BlogRoutes);
app.use('/dashboard', DashboardRoutes);
app.use('/comment', CommentRoutes);
app.use('/public', PublicRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
