const dbConnection = require("../db/dbConfig")
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  postAnswers,
  deleteAnswer,
  getAllAnswer,
  voteAnswer,
  editAnswer,
  addComment,
  getComments,
  deleteComment
} = require('../controller/answersController');

router.post('/postanswer', authMiddleware, postAnswers);

router.get('/:question_id', authMiddleware, getAllAnswer);

router.delete('/delete/:id', authMiddleware, deleteAnswer);

router.put('/edit/:id', authMiddleware, editAnswer);

router.post('/vote/:id', authMiddleware, voteAnswer);

router.post('/comments/:answerId', authMiddleware, addComment); // Add a comment
router.get('/comments/:answerId', authMiddleware, getComments); // Get all comments for an answer
router.delete('/comments/:commentId', authMiddleware, deleteComment); // Delete a comment

module.exports = router;



 
// answerRoute.js


// const express = require("express");
// const router = express.Router();
// const { postAnswers, getAllAnswer } = require("../controllers/answerController");
// const authenticate = require("../middleware/authenticate"); // If you have authentication

// // Get all answers for a question
// router.get("/:question_Id", getAllAnswer);

// // Post a new answer (protected route)
// router.post("/", authenticate, postAnswers);

// module.exports = router;