import { Link } from 'react-router-dom';
import styles from '../../pages/Auth/Auth.module.css';

function About() {
  return (
    <div className={styles.right_side}>
      <div className={styles.right_in_contener}>
        <small className="about">About</small>
        <h2 className={`${styles.evangadi_network} ${styles.text_gradients}`}>
          Evangadi Networks
        </h2>

        <p className={`${styles.p1} ${styles.infoParagraph}`}>
          No matter what stage of life you are in, whether you’re just starting
          elementary school or being promoted to CEO of a Fortune 500 company,
          you have much to offer to those who are trying to follow in your
          footsteps.
        </p>
        <p className={`${styles.p2} ${styles.infoParagraph}`}>
          Wheather you are willing to share your knowledge or you are just
          looking to meet mentors of your own, please start by joining the
          network here.
        </p>

        <button className={`${styles.h_w_butn} h_w_butn`}>
          <Link to="/how-it-works">HOW IT WORKS</Link>
        </button>
      </div>
    </div>
  );
}

export default About