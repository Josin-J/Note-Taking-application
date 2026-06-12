const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
