const db = require('../db');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, ValidationError } = require('../errors');
const { itemSchema } = require('../schemas');
const checkPermissions = require('../utils/checkPermissions.js');

// crée un item
const createItem = async (req, res) => {
  const { name } = req.body;

  const { error } = itemSchema.validate(req.body, { abortEarly: false });

  if (error) {
    throw new ValidationError('Échec de la validation.', error.details);
  }

  const { rows: items } = await db.query(
    'INSERT INTO items (name, user_id) VALUES ($1, $2) RETURNING *',
    [name, req.user.userId]
  );

  res.status(StatusCodes.CREATED).json({ items });
};

// récupère tous les items
const getAllItems = async (_req, res) => {
  const { rows: items } = await db.query('SELECT * FROM items');
  res.status(200).json({ items, count: items.length });
};

// récupère un item
const getItem = async (req, res) => {
  const { id } = req.params;
  const {
    rows: [item]
  } = await db.query('SELECT * FROM items WHERE item_id = $1', [id]);

  if (!item) {
    throw new BadRequestError(`Pas d'item avec l'id : ${id}`);
  }

  res.status(StatusCodes.OK).json({ item });
};

// modifie un item
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  // on vérifie d'abord si l'item existe et appartient à l'utilisateur
  const {
    rows: [item]
  } = await db.query('SELECT * FROM items WHERE item_id = $1', [id]);

  if (!item) {
    throw new BadRequestError(`Pas d'item avec l'id : ${id}`);
  }

  checkPermissions(req.user, item.user_id);

  const {
    rows: [updatedItem]
  } = await db.query(
    'UPDATE items SET completed = $1 WHERE item_id = $2 RETURNING *',
    [!!completed, id]
  );

  res.status(StatusCodes.OK).json({ item: updatedItem });
};

// supprime un item
const deleteItem = async (req, res) => {
  const { id } = req.params;

  const {
    rows: [item]
  } = await db.query('SELECT * FROM items WHERE item_id = $1', [id]);

  if (!item) {
    throw new BadRequestError(`Pas d'item avec l'id : ${id}`);
  }

  checkPermissions(req.user, item.user_id);

  const {
    rows: [deletedItem]
  } = await db.query('DELETE FROM items WHERE item_id = $1 RETURNING *', [id]);

  res
    .status(StatusCodes.OK)
    .json({ item: deletedItem, msg: 'Success! Item removed' });
};

module.exports = {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem
};
