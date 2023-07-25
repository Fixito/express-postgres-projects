const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const uploadProductImageLocal = async (req, res) => {
  // req.body est vide donc on a besoin du package (express-fileupload) pour envoyer notre fichier
  // console.log(req.files);

  //* Vérfie si le fichier existe
  if (!req.files) {
    throw new BadRequestError('Pas de fichier uploadé');
  }

  const productImage = req.files.image;
  console.log(productImage);

  //* Vérifie le format
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Veuillez uploader une image');
  }

  //* vérifie la taille
  // 1000 kb pour tester
  const maxSize = 1024 * 1024; // 1 mb

  if (productImage.size > maxSize) {
    throw new BadRequestError('Please Upload Image smaller 1kB');
  }

  // On peut stocker l'image où l'on veut tant qu'on la rend accessible publiquement (express.static())
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);

  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImage = async (req, res) => {
  // On stockera provisoirement nos images en local avant de les uploader pour récupérer plus facilement le chemin
  // Il faut donc ajouter une option dans la methode fileuplaod (cf. app.js)
  if (!req.files) {
    throw new BadRequestError('Pas de fichier uploadé');
  }

  // TODO: Créer un compte et un dossier "file-upload" dans Cloudinary
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'file-upload'
    }
  );

  // Supprime le ficher temporaire
  fs.unlinkSync(req.files.image.tempFilePath);

  // Ce qui nous intéresse est la prop secure_url qui permet d'accéder à l'image
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = uploadProductImage;
