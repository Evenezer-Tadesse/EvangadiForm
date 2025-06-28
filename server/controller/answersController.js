const dbPool = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function postAnswers(req, res) {
  const userId = req.user.userid;
  const { answer, questionid } = req.body;
  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      msg: "Please provide answer",
    });
  }
  try {
    await dbPool.query(
      "INSERT INTO answers(userid, questionid, answer) VALUES ($1, $2, $3)",
      [userId, questionid, answer]
    );
    res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
}

async function getAllAnswer(req, res) {
  const questionId = req.params.question_id;
  const userId = req.user.userid;

  try {
    const { rows: results } = await dbPool.query(
      `SELECT 
        answers.answerid,
        answers.answer AS content,
        users.username,
        users.userid,
        answers.created_at,
        users.firstname,
        (SELECT vote_type FROM answer_votes WHERE answer_votes.answerid = answers.answerid AND answer_votes.userid = $1) AS userVote
      FROM answers
      JOIN users ON answers.userid = users.userId
      WHERE answers.questionid = (
        SELECT questionid FROM questions WHERE id = $2
      )`,
      [userId, questionId]
    );

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        msg: "The requested answer could not be found",
      });
    }

    res.status(StatusCodes.OK).json({ answer: results });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
}

async function deleteAnswer(req, res) {
  const userId = req.user.userid;
  const answerId = req.params.id;

  try {
    const { rows: answer } = await dbPool.query(
      "SELECT userid FROM answers WHERE answerid = $1",
      [answerId]
    );

    if (answer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        msg: "Answer not found",
      });
    }

    if (answer[0].userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        msg: "You are not authorized to delete this answer",
      });
    }

    await dbPool.query("DELETE FROM answers WHERE answerid = $1", [answerId]);

    res.status(StatusCodes.OK).json({ msg: "Answer deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
}

async function voteAnswer(req, res) {
  const userId = req.user.userid;
  const answerId = req.params.id;
  const { voteType } = req.body;

  if (!["upvote", "downvote"].includes(voteType)) {
    return res.status(400).json({ msg: "Invalid vote type" });
  }

  try {
    const { rows: existingVote } = await dbPool.query(
      "SELECT vote_type FROM answer_votes WHERE userid = $1 AND answerid = $2",
      [userId, answerId]
    );

    if (existingVote.length > 0) {
      const currentVote = existingVote[0].vote_type;

      if (currentVote === voteType) {
        await dbPool.query(
          "DELETE FROM answer_votes WHERE userid = $1 AND answerid = $2",
          [userId, answerId]
        );

        return res.status(200).json({ msg: `${voteType} removed` });
      } else {
        await dbPool.query(
          "UPDATE answer_votes SET vote_type = $1 WHERE userid = $2 AND answerid = $3",
          [voteType, userId, answerId]
        );

        return res.status(200).json({ msg: `Vote changed to ${voteType}` });
      }
    } else {
      await dbPool.query(
        "INSERT INTO answer_votes (userid, answerid, vote_type) VALUES ($1, $2, $3)",
        [userId, answerId, voteType]
      );

      return res.status(200).json({ msg: `${voteType} added` });
    }
  } catch (error) {
    console.error("Vote error:", error.message);
    return res.status(500).json({ msg: "Server error while voting" });
  }
}

async function editAnswer(req, res) {
  const userId = req.user.userid;
  const answerId = req.params.id;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      msg: "Answer content cannot be empty",
    });
  }

  try {
    const { rows: answer } = await dbPool.query(
      "SELECT userid FROM answers WHERE answerid = $1",
      [answerId]
    );

    if (answer.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        msg: "Answer not found",
      });
    }

    if (answer[0].userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        msg: "You are not authorized to edit this answer",
      });
    }

    await dbPool.query("UPDATE answers SET answer = $1 WHERE answerid = $2", [
      content,
      answerId,
    ]);

    res.status(StatusCodes.OK).json({
      msg: "Answer updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
}

async function addComment(req, res) {
  const userId = req.user.userid;
  const answerId = req.params.answerId;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      msg: "Comment content cannot be empty",
    });
  }

  try {
    await dbPool.query(
      "INSERT INTO comments (answerid, userid, content) VALUES ($1, $2, $3)",
      [answerId, userId, content]
    );

    res.status(StatusCodes.CREATED).json({
      msg: "Comment added successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
}

async function getComments(req, res) {
  const answerId = req.params.answerId;

  try {
    const { rows: comments } = await dbPool.query(
      `SELECT 
        comments.commentid,
        comments.content,
        comments.created_at,
        users.username,
        users.userid
      FROM comments
      JOIN users ON comments.userid = users.userid
      WHERE comments.answerid = $1`,
      [answerId]
    );

    res.status(StatusCodes.OK).json({ comments });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
}

async function deleteComment(req, res) {
  const userId = req.user.userid;
  const commentId = req.params.commentId;

  try {
    const { rows: comment } = await dbPool.query(
      "SELECT userid FROM comments WHERE commentid = $1",
      [commentId]
    );

    if (comment.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        msg: "Comment not found",
      });
    }

    if (comment[0].userid !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        msg: "You are not authorized to delete this comment",
      });
    }

    await dbPool.query("DELETE FROM comments WHERE commentid = $1", [
      commentId,
    ]);

    res.status(StatusCodes.OK).json({ msg: "Comment deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: "An unexpected error occurred",
    });
  }
}

module.exports = {
  postAnswers,
  getAllAnswer,
  deleteAnswer,
  voteAnswer,
  editAnswer,
  addComment,
  getComments,
  deleteComment,
};
