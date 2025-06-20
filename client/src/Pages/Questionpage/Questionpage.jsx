import React from 'react';
import styles from './Questionpage.module.css';
import QuestionForm from '../../Components/Questions/QuestionForm/QuestionForm';
import Shared from '../../Components/Shared/Shared';

const QuestionsPage = () => {
  return (
    <Shared>
      <main className={styles.container}>
        <div className={styles.contentWrapper}>
          <section className={styles.guideSection}>
            <div className={styles.guideCard}>
              <h1 className={styles.guideTitle}>
                Steps to write a good question
              </h1>
              <ul className={styles.guideList}>
                <li>Summarize your problem in a one-line title</li>
                <li>Describe your problem in more detail</li>
                <li>Describe what you tried and what you expected to happen</li>
                <li>Review your question and post it to the site</li>
              </ul>
            </div>
          </section>

          <section className={styles.formSection}>
            <div className={styles.formCard}>
              <h3 className={styles.formHeader}>📋 Ask a public question</h3>
              <QuestionForm />
            </div>
          </section>
        </div>
      </main>
    </Shared>
  );
};

export default QuestionsPage;
