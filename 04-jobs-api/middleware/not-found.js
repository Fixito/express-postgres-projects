const notFound = (_req, res) =>
  res.status(404).json({ msg: "La route n'existe pas" });

module.exports = notFound;
