require('dotenv').config();
const db = require('./db');
const jsonProducts = require('./products.json');

const start = async () => {
  try {
    await db.query('BEGIN');

    for (const product of jsonProducts) {
      const { name, price, featured, rating, createdAt, company } = product;

      const query = `INSERT INTO products (name, price, featured, rating, created_at, company)
      VALUES ($1, $2, $3, $4, $5, $6);`;
      await db.query(query, [
        name,
        price,
        featured || false,
        rating || 4.5,
        createdAt || new Date().toISOString(),
        company
      ]);
    }

    await db.query('COMMIT');
    console.log('Données importées avec succès dans la table "products".');
    process.exit(0);
  } catch (error) {
    await db.query('ROLLBACK');
    console.log(
      "Erreur lors de l'importation des données dans la table des produits : ",
      error.message
    );
    process.exit(1);
  } finally {
    db.end();
  }
};

start();
