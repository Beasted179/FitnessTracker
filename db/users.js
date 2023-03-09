const client = require("./client");
const bcrypt = require('bcrypt');
// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const result = await client.query(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username`,
      [username, password]
    );

    const user = result.rows[0];
    delete user.password;
    return user;
  } catch (err) {
    console.error(err);
    throw err; // rethrow error so calling function can handle it
  }
}


async function getUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [username]);
    if (user) {
      const passwordMatch = password === user.password;
      
      //console.log('Password match:', passwordMatch);
      
      if (passwordMatch) {
        delete user.password;
        return user;
      }
    }
    
    return null;
  } catch (error) {
    throw error;
  }
}
async function getUserByUsername(username) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM users WHERE username=$1;
    `, [username]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const result = await client.query(
      `SELECT id, username FROM users WHERE id = $1`,
      [id]
    );
      //console.log(result, "this is the result")
    const user = result.rows[0];
    return user;
  } catch (err) {
    console.error(err);
    throw err; // rethrow error so calling function can handle it
  }
}



module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
