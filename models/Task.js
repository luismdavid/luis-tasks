const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: false,
    maxlength: 100,
  },
  content: {
    type: String,
    required: false,
    minlength: 6,
    maxlength: 500,
  },
  order: {
    type: Number,
    required: false,
  },
  color: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    maxlength: 100,
  },
  pinned: {
    type: Boolean,
    required: false,
    default: false,
  },
  tags: {
    type: Array,
    required: false,
    default: []
  }
});

module.exports = model('Tasks', taskSchema);
