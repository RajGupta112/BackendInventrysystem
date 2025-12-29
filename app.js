import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://inventory-frontend-zeta-five.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
     
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


app.use(express.json());


app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Inventory Management API is running 🚀',
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);


app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});



app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
