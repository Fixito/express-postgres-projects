const notFound = (req, res) => res.status(404).send("La route n'existe pas");

module.exports = notFound;
