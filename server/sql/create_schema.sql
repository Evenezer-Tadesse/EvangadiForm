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
  FOREIGN KEY(userid) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS answers (
  answerid INT(100) NOT NULL AUTO_INCREMENT,
  userid INT(20) NOT NULL,
  questionid VARCHAR(100) NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(answerid),
  FOREIGN KEY(questionid) REFERENCES questions(questionid),
  FOREIGN KEY(userid) REFERENCES users(userId)
);

CREATE TABLE comments (
  commentid INT AUTO_INCREMENT PRIMARY KEY,
  answerid INT NOT NULL,
  userid INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (answerid) REFERENCES answers(answerid),
  FOREIGN KEY (userid) REFERENCES users(userid)
);
