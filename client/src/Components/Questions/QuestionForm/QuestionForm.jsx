import React, { useEffect, useState } from 'react';
import styles from './QuestionForm.module.css';
import { useContext } from 'react';
import { AuthContext } from '../../../Context/Context';
import { useNavigate, Link } from 'react-router-dom';
import { useRef } from 'react';
import axiosBase from '../../../api/axiosConfig';
import { toast } from 'react-toastify';

const QuestionForm = () => {
  const [{ token }, _] = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const posted = useRef(null);

  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const draft = localStorage.getItem('questionDraft');
    if (draft) {
      const { title, description, timestamp } = JSON.parse(draft);
      setTitle(title);
      setDescription(description);
      setLastSaved(new Date(timestamp));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || description) {
        const draft = { title, description, timestamp: new Date().getTime() };
        localStorage.setItem('questionDraft', JSON.stringify(draft));
        setLastSaved(new Date());
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await axiosBase.post(
        '/questions/post-questions',
        { title, description, tag },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitle('');
      setDescription('');

      posted.current.style.display = 'block';

      localStorage.removeItem('questionDraft');
      setTimeout(() => {
        navigate('/');
        posted.current.style.display = 'none';
      }, 1500);
    } catch (error) {
      toast.error(error.response.data.msg);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {lastSaved && (
        <div className={styles.draftStatus}>
          Draft auto-saved at {lastSaved.toLocaleTimeString()}
        </div>
      )}
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Be specific and imagine you're asking a question to another person"
          className={styles.input}
        />
        <p className={styles.helpText}>
          Keep your title short and to the point
        </p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>

        <div className={styles.counterContainer}>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Include all the information someone would need to answer your question"
            className={styles.textarea}
            maxLength={500}
          />
          <span className={styles.charCounter}>{description.length}/500</span>
        </div>

        <p className={styles.helpText}>
          Be detailed and include any error messages you're seeing
        </p>
      </div>

      {/* Category Picker */}
      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.label}>
          Category
        </label>
        <select
          id="category"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={styles.select}
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="Bootstrap">Bootstrap</option>
          <option value="JavaScript">JavaScript</option>
          <option value="jQuery">jQuery</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="MySQL">MySQL</option>
          <option value="Express">Express</option>
        </select>
        <p className={styles.helpText}>
          Choose the category that best fits your question
        </p>
      </div>

      <div
        className={styles.successMessage}
        style={{ display: 'none' }}
        ref={posted}
      >
        Question posted successfully!
      </div>

      <div className={styles.buttonGroup}>
        <div className={styles.backLink}>
          <Link to="/" className={styles.backButton}>
            ← Back to Questions
          </Link>
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className={styles.spinner} />
          ) : (
            'Post Your Question'
          )}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
