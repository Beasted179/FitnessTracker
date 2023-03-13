const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  try {
    const { rows: [ user ] } = await client.query(`
    INSERT INTO users(username, password) 
    VALUES($1, $2) 
    ON CONFLICT (username) DO NOTHING 
    RETURNING *;
    `, [username, hashedPassword]);
    
    delete user.password;

    return user;
  } catch(error) {
    return Error("Error creating users")
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error('User not found');
  }
  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword)
  if (isValid) {
    delete user.password
    return user
  } else {
    throw new Error('Incorrect password');
  }
}

async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
    SELECT id, username
    FROM users
    WHERE id=${ userId };
    `);

    if (!user) {
      return null
    }

    delete user.password

    return user;
  } catch (error) {
    console.log("Error getting user by id")
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [userName]);

    return user;
  } catch (error) {
    console.log("Error getting user by username")
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
