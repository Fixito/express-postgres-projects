require('dotenv').config();
require('express-async-errors');
// express
const express = require('express');
const app = express();
// autres librairies
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');

//* routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

//* middleware
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60
  })
);

// extra librairies
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(xss());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//* routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}...`);
});
