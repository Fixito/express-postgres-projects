require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// security packages
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');

// middlewares
const errorHandler = require('./middlewares/errorHandlerMiddleware.js');
const notFound = require('./middlewares/notFoundMiddleware.js');

// routers
const itemRouter = require('./routes/itemRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes.js');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
  })
);

app.use(helmet());
app.use(xss());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/v1/items', itemRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listenning on port ${port}`));
