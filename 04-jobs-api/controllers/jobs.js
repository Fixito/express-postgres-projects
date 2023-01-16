const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const db = require('../db');

const getAllJobs = async (req, res) => {
  const { rows: jobs } = await db.query(
    'SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at',
    [req.user.userID]
  );

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const {
    rows: [job],
  } = await db.query('SELECT * FROM jobs WHERE user_id = $1 AND job_id = $2', [
    userID,
    Number(jobID),
  ]);

  if (!job) {
    throw new NotFoundError(`Pas de job avec l'id : ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  const { company, position } = req.body;
  const { userID } = req.user;

  const {
    rows: [job],
  } = await db.query(
    'INSERT INTO jobs(company, position, user_id) VALUES($1, $2, $3) RETURNING *',
    [company, position, userID]
  );

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position, status },
    user: { userID },
    params: { id: jobID },
  } = req;

  if (!company || !position) {
    throw new BadRequestError(
      'Les champs société, poste ne peuvent pas être vides'
    );
  }

  const {
    rows: [job],
  } = await db.query(
    'UPDATE jobs SET company = $1, position = $2, status = $3 WHERE job_id = $4 AND user_id = $5 RETURNING *',
    [company, position, status, Number(jobID), userID]
  );

  if (!job) {
    throw new NotFoundError(`Pas de job avec l'id : ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const {
    rows: [job],
  } = await db.query(
    'DELETE FROM jobs WHERE job_id = $1 AND user_id = $2 RETURNING *',
    [Number(jobID), userID]
  );

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobID}`);
  }

  res.status(StatusCodes.OK).send({ job });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
