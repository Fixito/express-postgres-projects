const getAllJobs = (req, res) => {
  res.send('récupère tous les jobs');
};

const getJob = (req, res) => {
  res.send('récupère un job');
};

const createJob = (req, res) => {
  res.send('crée un job');
};

const updateJob = (req, res) => {
  res.send('met à jour un job');
};

const deleteJob = (req, res) => {
  res.send('supprime job');
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
