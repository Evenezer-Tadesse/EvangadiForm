/* DROP TABLE IF EXISTS answer_votes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  userId INT(20) NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  firstname VARCHAR(20) NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  email VARCHAR(30) NOT NULL,
  password VARCHAR(100) NOT NULL,
  PRIMARY KEY(userId)
);

CREATE TABLE IF NOT EXISTS questions (
  id INT(20) NOT NULL AUTO_INCREMENT,
  questionid VARCHAR(100) NOT NULL UNIQUE,
  userid INT(20) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(200) NOT NULL,
  tag VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id, questionid),
  FOREIGN KEY(userid) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers (
  answerid INT(100) NOT NULL AUTO_INCREMENT,
  userid INT(20) NOT NULL,
  questionid VARCHAR(100) NOT NULL,
  answer TEXT NOT NULL,
  likes INT DEFAULT 0,
  dislikes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(answerid),
  FOREIGN KEY(questionid) REFERENCES questions(questionid) ON DELETE CASCADE,
  FOREIGN KEY(userid) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  commentid INT AUTO_INCREMENT PRIMARY KEY,
  answerid INT NOT NULL,
  userid INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (answerid) REFERENCES answers(answerid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answer_votes (
  vote_id INT AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL,
  answerid INT NOT NULL,
  vote_type ENUM('upvote', 'downvote') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_answer_vote UNIQUE (userid, answerid),
  FOREIGN KEY (userid) REFERENCES users(userId) ON DELETE CASCADE,
  FOREIGN KEY (answerid) REFERENCES answers(answerid) ON DELETE CASCADE
);

 */

 DROP TABLE IF EXISTS answer_votes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM type for vote_type
CREATE TYPE vote_type AS ENUM ('upvote', 'downvote');

CREATE TABLE users (
  userId SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  firstname VARCHAR(20) NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  questionid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  userid INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  tags VARCHAR(100)[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (userid) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE answers (
  answerid SERIAL PRIMARY KEY,
  userid INT NOT NULL,
  questionid UUID NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (questionid) REFERENCES questions(questionid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE comments (
  commentid SERIAL PRIMARY KEY,
  answerid INT NOT NULL,
  userid INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (answerid) REFERENCES answers(answerid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE answer_votes (
  vote_id SERIAL PRIMARY KEY,
  userid INT NOT NULL,
  answerid INT NOT NULL,
  vote_type vote_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (userid, answerid),
  FOREIGN KEY (userid) REFERENCES users(userId) ON DELETE CASCADE,
  FOREIGN KEY (answerid) REFERENCES answers(answerid) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_questions_user ON questions(userid);
CREATE INDEX idx_answers_question ON answers(questionid);
CREATE INDEX idx_comments_answer ON comments(answerid);
CREATE INDEX idx_votes_answer ON answer_votes(answerid);