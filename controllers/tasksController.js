const Task = require('../models/Task');
const mongoose = require('mongoose');

module.exports = {
  getTasksByUser: async (req, res) => {
    if (!req.query.userId) {
      return res.status(400).json({
        error: {
          message: 'Debe enviar el id del usuario en el query.',
          status: 400,
          stack: 'getTasksByUser function [getTasksByUser]',
        },
      });
    }

    const result = await Task.find({
      ownerId: mongoose.Types.ObjectId(req.query.userId),
    });

    return res.status(200).json(result);
  },
  getTaskById: async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({
        error: {
          message: 'Debe enviar el id del task en el query.',
          status: 400,
          stack: 'getTaskById function [getTaskById]',
        },
      });
    }

    const task = await Task.findById(req.params.id);

    return res.status(200).json(task);
  },

  updateTask: async (req, res) => {
    let task = new Task(req.body);

    if (req.body._id) {
      task = await Task.findById(req.body._id);
    }

    task.ownerId = mongoose.Types.ObjectId(req.user._id);

    try {
      if (req.body._id) {
        
        await Task.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    ...req.body
                }
            }
        );
      } else {
        await task.save();
      }

      return res.status(200).json({
        message: 'Tarea actualizada con exito.',
      });
    } catch ({ message }) {
      return res.status(500).json({
        error: {
          message,
        },
      });
    }
  },
};
