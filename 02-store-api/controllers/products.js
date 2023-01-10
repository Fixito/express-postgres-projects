const db = require('../db');

const getAllProductsStatic = async (req, res) => {
  // throw new Error('test de la librairie async errors');
  // return res.status(200).json({ msg: 'route test de products' });

  //* démo pour filter les réponses
  //* name
  // const { rows } = await db.query('SELECT * FROM products');
  // const { rows } = await db.query(
  //   'SELECT * FROM products WHERE featured = true'
  // );
  // const { rows } = await db.query(
  //   "SELECT * FROM products WHERE name = 'albany sectional'"
  // );

  // const { rows } = await db.query(
  //   "SELECT * FROM products WHERE name = 'albany '"
  // );

  // const { rows } = await db.query(
  //   "SELECT * FROM products WHERE name = 'albany '"
  // );

  // const search = 'ab';
  // const { rows } = await db.query(
  //   "SELECT * FROM products WHERE name ILIKE concat('%', $1::VARCHAR, '%')",
  //   [search]
  // );

  //*sort
  // const { rows } = await db.query(
  //   'SELECT * FROM products ORDER BY name, price',
  //   [search]
  // );

  //* fields
  const { rows } = await db.query(
    'SELECT name, price FROM products ORDER BY name, price',
    [search]
  );

  return res.status(200).json({ products: rows, nbHits: rows.length });
};

const getAllProducts = async (req, res) => {
  // console.log(req.query);

  const { name, sort, fields } = req.query;

  let queryString = 'SELECT * FROM products';
  let parameters = [];

  if (fields) {
    queryString = `SELECT ${fields} FROM products`;
  }

  if (name) {
    queryString = `${queryString} WHERE name ILIKE $1`;
    parameters.push(`%${name}%`);
  }

  if (sort) {
    const sortList = sort
      .split(',')
      .map((field) =>
        field.startsWith('-') ? `${field.slice(1)} DESC` : field
      )
      .join(',');
    queryString = `${queryString} ORDER BY ${sortList}`;
  }

  //* pagination + limit
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  queryString = `${queryString} LIMIT $${parameters.length + 1} OFFSET $${
    parameters.length + 2
  }`;
  // 23 products, limit 7
  // 4 pages, 7 7 7 2
  parameters.push(limit, offset);

  const { rows } = await db.query(queryString, parameters);

  // return res.status(200).json({ msg: 'route products' });
  res.status(200).json({ products: rows, nbHits: rows.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
