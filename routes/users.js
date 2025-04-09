const express = require ('express')
const router = express.Router()
const User = require ('../models/user')

// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find()
//         res.json(users)
//     } catch (err) {
//         res.status(500).json({message: err.message})
//     }
// })

// router.get('/:id', getUser, (req, res) => {
//     res.json(res.user)
// })

// router.post('/', async (req, res) => {
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         quizzes: req.body.quizzes
//     })
//     try{
//         const newUser = await user.save()
//         res.status(201).json(newUser)
//     } catch (err) {
//         res.status(400).json({message: err.message})
//     }

// })

// router.patch('/:id', getUser, async (req, res) => {   //updates only one element not all of them (!= put)
//     console.log(req.body)
//     if (req.body.name != null){
//         res.user.name = req.body.name
//     }
//     if (req.body.email != null){
//         res.user.email = req.body.email
//     }
//     if (req.body.quizzes != null){
//         res.user.quizzes = req.body.quizzes
//     }
//     try{
//         const updatedUser = await res.user.save()
//         res.json(updatedUser)
//     } catch (err) {
//         res.status(400).json({message: err.message})
//     }
// })

// router.delete('/:id', getUser, async (req, res) => {
//     try{
//         await res.user.deleteOne()
//         res.json({message: 'Deleted user'})
//     } catch (err) {
//         res.status(500).json({message: err.message})
//     }
// })

// async function getUser(req, res, next) {
//     let user
//     try {
//         user = await User.findById(req.params.id)
//         if (user == null){
//             return res.status(404).json({message: 'Cannot find user'})
//         }
//     } catch(err) { 
//         return res.status(500).json({message: err.message})
//     }
//     res.user = user
//     next()
// }

////// yloipoihsh me classes  /////// 

// Create a new user
router.post('/', async (req, res) => {
    try {
      const { name, email, quizzes, signupDate } = req.body;
      const user = new User(name, email, quizzes, signupDate);
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json({ message: 'Error saving quiz', error: err.message });
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