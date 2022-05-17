const router = require('express').Router();
const { User } = require('../../models');

// naming conventions (i.e /api/users, /api/posts, /api/comments), along with the use of HTTP methods follow a famous API architectural pattern called REST, or Representational State Transfer; APIs built following this pattern are what's known as RESTful APIs
// some guidelines => name endpoints in a way that describes the data you're interfacing with, usee HTTP methods like get, post, put, and delete to describe the action you're performing to interface with that endpoint (GET /api/users - you should expect to receive user data), and use the propert HTTP status codes like 400, 404, and 500 to indicate errors in a request
// RESTful APIs are no language or library, but rather a pattern that developers use when building an API 

// GET /api/users
router.get('/', (req, res) => {});

// GET /api/users/1
router.get('/:id', (req, res) => {});

// POST /api/users
router.post('/', (req, res) => {});

// PUT /api/users/1
router.put('/:id', (req, res) => {});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {});

module.exports = router;