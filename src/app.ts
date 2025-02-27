import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import path from 'path';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'], // Remove the trailing slash
    credentials: true, // Add this to support credentials
  }),
);

app.use(morgan('dev'));

// routes
app.use('/api', router);

// Test
app.get('/test', (_req, res) => {
  const file = path.join(__dirname, './app/templates', 'test.html');
  res.sendFile(file);
});

// Global Error Handler
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
