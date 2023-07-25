const { StatusCodes } = require('http-status-codes');
const db = require('../db');

const createProduct = async (req, res) => {
  const { name, image, price } = req.body;

  const {
    rows: [product]
  } = await db.query(
    'INSERT INTO products(name, image, price) VALUES($1, $2, $3) RETURNING *',
    [name, image, price]
  );

  res.status(StatusCodes.OK).json({ product });
};

const getAllProducts = async (_req, res) => {
  const { rows: products } = await db.query('SELECT * FROM products');
  res.status(StatusCodes.OK).json({ products });
};

module.exports = { createProduct, getAllProducts };
