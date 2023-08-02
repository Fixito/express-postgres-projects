const express = require('express');
const router = express.Router();

const authenticateUser = require('../middleware/authentication');
const {
  validateIdParam,
  validateJobInput
} = require('../middleware/validationMiddleware.js');

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobs');

router.use('/', authenticateUser);
router.use('/:id', validateIdParam);

router.route('/').get(getAllJobs).post(validateJobInput, createJob);
router
  .route('/:id')
  .get(getJob)
  .put(validateJobInput, updateJob)
  .delete(deleteJob);

module.exports = router;
