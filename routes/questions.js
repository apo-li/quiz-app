const express = require ('express')
const router = express.Router()
const Question = require ('../models/question')
// import Question from '../models/question'

// Create a new question
router.post('/', async (req, res) => {
    const { text, options, correctAnswer, quizId, points, givenTime, createdAt, updatedAt } = req.body;
    const question = new Question(text, options, correctAnswer, quizId, points, givenTime, createdAt, updatedAt);
    try {  
      const savedQuestion = await question.save();
      res.status(201).json(savedQuestion);
    } catch (err) {
      res.status(500).json({ message: 'Error saving question', error: err.message });
    }
});

// Get all questions
router.get('/', async (req, res) => {
try {
    const questions = await Question.findAll();
    res.json(questions);
} catch (err) {
    res.status(500).json({ message: 'Error fetching questions', error: err.message });
}
});

// Get one question
router.get('/:id', async (req, res) => {
try {
    const question = await Question.findOne(req.params.id)
    if (question === null){
        return res.status(404).json({message: 'Question not found'})
    }
    res.json(question)
} catch(err) {
    res.status(500).json({message: 'Error finding question', error: err.message })
}
})

// Update a question
router.patch('/:id', async (req, res) => {
try {
    req.body.updatedAt = Date.now();
    const updated = await Question.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Question not found' });
    res.json(updated);
} catch (err) {
    res.status(500).json({ message: 'Error updating question', error: err.message });
}
});

// Delete a question
router.delete('/:id', async (req, res) => {
try {
    const deleted = await Question.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
} catch (err) {
    res.status(500).json({ message: 'Error deleting question', error: err.message });
}
});

module.exports = router