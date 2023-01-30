require('dotenv').config();
require('express-async-errors');
// express
const express = require('express');
const app = express();
// autres librairies
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');

//* routers
const authRouter = require('./routes/authRoutes');

//* middleware
const authenticateUser = require('./middleware/authentication');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
  })
);
// extra librairies
app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.json());

//* routes
app.use('/api/v1/auth', authRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}...`);
});
