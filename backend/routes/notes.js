const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      filter.$or = [{ title: regex }, { content: regex }];
    }
    const notes = await Note.find(filter)
      .populate('category', 'name')
      .sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || null,
      user: req.user._id,
    });
    const saved = await note.save();
    const populated = await saved.populate('category', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category || null,
      },
      { new: true, runValidators: true }
    ).populate('category', 'name');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
