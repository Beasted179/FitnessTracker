/* eslint-disable no-useless-catch */
require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
router.use((req, res, next) => {
    console.log("A request is being made to /users");
  
    next();
});
const { 
    getUser, 
    getUserByUsername, 
    createUser, 
    getPublicRoutinesByUser, 
    getAllRoutinesByUser 
} = require('../db');


// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const _user = await getUserByUsername(username);
        if (_user) {
            res.send({
                error: 'Error',
                name: 'DuplicateUsername',
                message: `User ${username} is already in use.`
            });
        } else if (password.length < 8) {
            res.send({
                error: "Error",
                name: "Password-Too-Short",
                message: "Password not long enough"
            });
        } else {
            const user = await createUser({ username, password });

            const token = jwt.sign({ 
                id: user.id, 
                username: user.username
            }, process.env.JWT_SECRET
            );
            res.send({ message: "Sign Up Complete", token, user });
        }
    } catch (error) {
        console.log(error);
        next(error);
    } 
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please provide both username and password"
      });
    }
    try {
      const user = await getUser({ username, password });
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET
      );
      res.send({ message: "Logged In", token, user });
    } catch (error) {
      if (error.message === "User not found" || error.message === "Invalid password") {
        res.send({ error: error.message });
      } else {
        next(error);
      }
    }
  });
// GET /api/users/me
router.get('/me', async (req, res, next) => { 
    try {
        if (req.user) {
            res.send({ id: req.user.id, username: req.user.username });
        } else {
            res.status(401).send({
                error: "Error",
                name: "NotLoggedIn",
                message: "Login required to perform this action"
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});
// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
    const { username } = req.params;
    const publicRoutines = await getPublicRoutinesByUser({ username });
    const routines = await getAllRoutinesByUser({ username });

    try {
        if(req.user.username === username) {
            res.send(routines);
        } else {
            res.send(publicRoutines);
        }
        
    } catch (error) {
        next(error);
    }
})
module.exports = router;