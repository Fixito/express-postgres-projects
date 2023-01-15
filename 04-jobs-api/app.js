require('dotenv').config();
require('express-async-errors');
// librairies de sécurité supplémentaires
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const express = require('express');
const app = express();

const authenticateUser = require('./middleware/authentication');

//* routers
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');

//*error handler
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(express.json());
// extra librairies
app.use(helmet());
app.use(cors());
app.use(xss());

//* routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}...`);
});
