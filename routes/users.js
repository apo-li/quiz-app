const express = require ('express')
const router = express.Router()
const User = require ('../models/user')

////// yloipoihsh me classes  /////// 

// Create a new user
router.post('/', async (req, res) => {
    const { name, email, quizzes, signupDate } = req.body;
    const user = new User(name, email, quizzes, signupDate);
    try {  
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json({ message: 'Error saving user', error: err.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
try {
    const users = await User.findAll();
    res.json(users);
} catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
}
});

// Get one user
router.get('/:id', async (req, res) => {
try {
    const user = await User.findOne(req.params.id)
    if (user === null){
        return res.status(404).json({message: 'User not found'})
    }
    res.json(user)
} catch(err) {
    res.status(500).json({message: 'Error finding user', error: err.message })
}
})

// Update a user
router.patch('/:id', async (req, res) => {
try {
    const updated = await User.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
} catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
}
});

// Delete a user
router.delete('/:id', async (req, res) => {
try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
} catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
}
});

module.exports = router