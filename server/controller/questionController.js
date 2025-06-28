const { StatusCodes } = require("http-status-codes");
const dbPool = require("../db/dbConfig");

async function postQuestion(req, res) {
  const userId = req.user.userid;
  const { title, description, tag } = req.body;

  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      msg: "Please provide all required fields",
    });
  }

  try {
    // Convert tag string to PostgreSQL array format
    const tagsArray = tag ? tag.split(",").map((t) => t.trim()) : null;

    const result = await dbPool.query(
      `INSERT INTO questions (userid, title, description, tags) 
       VALUES ($1, $2, $3, $4) 
       RETURNING questionid`,
      [userId, title, description, tagsArray]
    );

    res.status(StatusCodes.CREATED).json({
      msg: "Question created successfully",
      questionid: result.rows[0].questionid,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function getAllQuestions(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const query = `
      SELECT 
        q.id AS question_id,
        q.questionid,
        q.title,
        q.tags AS tag,
        q.userid,
        q.description AS content,
        u.username,
        q.created_at,
        u.firstname,
        COUNT(a.answerid) AS answer_count
      FROM questions q
      JOIN users u ON q.userid = u.userid
      LEFT JOIN answers a ON q.questionid = a.questionid
      GROUP BY q.id, u.userid
      ORDER BY q.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await dbPool.query(query, [limit, offset]);

    if (result.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "No questions found",
      });
    }

    res.status(StatusCodes.OK).json({ questions: result.rows });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: error.message,
    });
  }
}

async function getSingleQuestion(req, res) {
  const questionId = req.params.id;

  try {
    const query = `
      SELECT 
        q.id,
        q.questionid,
        q.title,
        q.userid,
        q.description AS content,
        q.tags AS tag,
        q.created_at,
        u.username,
        u.firstname
      FROM questions q
      JOIN users u ON q.userid = u.userid
      WHERE q.id = $1
    `;

    const result = await dbPool.query(query, [questionId]);

    if (result.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        msg: "The requested question could not be found",
      });
    }

    res.status(StatusCodes.OK).json({ question: result.rows[0] });
  } catch (error) {
    console.error("Database query error:", error.stack);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: error.message,
    });
  }
}

async function editQuestion(req, res) {
  const userId = req.user.userid;
  const questionId = req.params.id;
  const { title, description, tag } = req.body;

  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      msg: "Title and description are required",
    });
  }

  try {
    // Convert tag string to PostgreSQL array format
    const tagsArray = tag ? tag.split(",").map((t) => t.trim()) : null;

    const query = `
      UPDATE questions 
      SET title = $1, description = $2, tags = $3 
      WHERE id = $4 AND userid = $5
      RETURNING *
    `;

    const result = await dbPool.query(query, [
      title,
      description,
      tagsArray,
      questionId,
      userId,
    ]);

    if (result.rowCount === 0) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        msg: "You are not authorized to edit this question or it doesn't exist",
      });
    }

    res.status(StatusCodes.OK).json({
      msg: "Question updated successfully",
      question: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: error.message,
    });
  }
}

async function deleteQuestion(req, res) {
  const userId = req.user.userid;
  const questionId = req.params.id;

  try {
    const result = await dbPool.query(
      `DELETE FROM questions 
       WHERE id = $1 AND userid = $2 
       RETURNING questionid`,
      [questionId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        msg: "Question not found or you don't have permission",
      });
    }

    res.status(StatusCodes.OK).json({
      msg: "Question deleted successfully",
      deletedId: result.rows[0].questionid,
    });
  } catch (error) {
    console.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      msg: error.message,
    });
  }
}

module.exports = {
  postQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
};
