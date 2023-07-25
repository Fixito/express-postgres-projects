const { StatusCodes } = require('http-status-codes');

const notFound = (_req, res) =>
  res.status(StatusCodes.OK).send({ msg: "La route n'existe pas" });

module.exports = notFound;
