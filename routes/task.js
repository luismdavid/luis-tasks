var express = require('express');
var router = express.Router();

var tasksController = require('../controllers/tasksController');

const loggedIn = require('../middleware/loggedIn');

router
  .route('')
  .get(loggedIn, tasksController.getTasksByUser)
  .put(loggedIn, tasksController.updateTask);

router.get('/getTaskById/:id', tasksController.getTaskById);

module.exports = router;
