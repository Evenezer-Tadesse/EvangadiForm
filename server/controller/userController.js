require("dotenv").config();
const dbPool = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !email || !firstname || !lastname || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      msg: "Please provide full information",
    });
  }

  if (password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Password must be at least 8 characters",
    });
  }

  try {
    const existingUser = await dbPool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        msg: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbPool.query(
      `INSERT INTO users (username, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5)`,
      [username, firstname, lastname, email, hashedPassword]
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "User registered successfully",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Server Error",
      msg: error.message,
    });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      msg: "Please provide all required fields!",
    });
  }

  try {
    const result = await dbPool.query(
      "SELECT userid, username, password, firstname FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        msg: "Invalid credential",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        msg: "Invalid password",
      });
    }

    const token = jwt.sign(
      { username: user.username, userid: user.userid },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(StatusCodes.OK).json({
      msg: "User login successful",
      token,
      user: {
        username: user.username,
        firstname: user.firstname,
        userid: user.userid,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

async function checkUser(req, res) {
  const { username, userid } = req.user;

  res.status(StatusCodes.OK).json({
    msg: "User is authenticated",
    username,
    userid,
  });
}

async function resetPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide an email address",
    });
  }

  try {
    const result = await dbPool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "User not found with this email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expirationTime = new Date(Date.now() + 3600000); // 1 hour

    await dbPool.query(
      "UPDATE users SET reset_token = $1, reset_token_expiration = $2 WHERE email = $3",
      [hashedToken, expirationTime, email]
    );

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(StatusCodes.OK).json({
      msg: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Server error",
    });
  }
}

async function verifyResetToken(req, res) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide a valid token and new password",
    });
  }

  if (newPassword.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Password should be at least 8 characters",
    });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const result = await dbPool.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiration > $2",
      [hashedToken, new Date()]
    );

    if (result.rows.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await dbPool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = $2",
      [hashedPassword, hashedToken]
    );

    return res.status(StatusCodes.OK).json({
      msg: "Password updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Server error",
    });
  }
}

module.exports = {
  register,
  loginUser,
  checkUser,
  resetPassword,
  verifyResetToken,
};
