const express = require ('express')
const router = express.Router()
const Quiz = require ('../models/quiz')

// Create a new quiz
router.post('/', async (req, res) => {
    const { title, description, questions, creator, createdAt, updatedAt } = req.body;
    const quiz = new Quiz(title, description, questions, creator, createdAt, updatedAt);
    try {  
      const savedQuiz = await quiz.save();
      res.status(201).json(savedQuiz);
    } catch (err) {
      res.status(500).json({ message: 'Error saving quiz', error: err.message });
    }
});

// Get all quizzes
router.get('/', async (req, res) => {
try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
} catch (err) {
    res.status(500).json({ message: 'Error fetching quizzes', error: err.message });
}
});

// Get one quiz
router.get('/:id', async (req, res) => {
try {
    const quiz = await Quiz.findOne(req.params.id)
    if (quiz === null){
        return res.status(404).json({message: 'Quiz not found'})
    }
    res.json(quiz)
} catch(err) {
    res.status(500).json({message: 'Error finding quiz', error: err.message })
}
})

// Update a quiz
router.patch('/:id', async (req, res) => {
try {
    const updated = await Quiz.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Quiz not found' });
    res.json(updated);
} catch (err) {
    res.status(500).json({ message: 'Error updating quiz', error: err.message });
}
});

// Delete a quiz
router.delete('/:id', async (req, res) => {
try {
    const deleted = await Quiz.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Quiz not found' });
    res.json({ message: 'Quiz deleted' });
} catch (err) {
    res.status(500).json({ message: 'Error deleting quiz', error: err.message });
}
});

module.exports = router