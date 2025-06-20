import React from 'react';
import './Howitworks.css';
import {
  FaUserPlus,
  FaQuestionCircle,
  FaSearch,
  FaReply,
  FaSeedling,
} from 'react-icons/fa';
import Shared from '../../Components/Shared/Shared';

const Howitworks = () => {
  return (
    <Shared>
      <section className="howItWorks">
        <div className="heroSection">
          <h1 className="heroTitle">💬 How Evangadi Forum Works</h1>
          <p className="heroSubtitle">
            A community-driven platform to ask, answer, and grow together.
          </p>
        </div>

        <div className="stepsSection">
          <div className="stepCard">
            <FaUserPlus className="stepIcon" />
            <h2 className="stepTitle">Step 1: Sign Up / Sign In</h2>
            <p className="stepDescription">
              Create an account or log in to participate. You can sign in using
              your email and password.
            </p>
          </div>

          <div className="stepCard">
            <FaQuestionCircle className="stepIcon" />
            <h2 className="stepTitle">Step 2: Ask a Question</h2>
            <p className="stepDescription">
              Go to the “Ask Question” page. Add a clear title, a detailed
              description, and relevant tags. Submit your question to the
              community.
            </p>
          </div>

          <div className="stepCard">
            <FaSearch className="stepIcon" />
            <h2 className="stepTitle">Step 3: Browse or Search Questions</h2>
            <p className="stepDescription">
              Use the search bar to find answers to similar questions. Explore
              different categories and tags for relevant topics.
            </p>
          </div>

          <div className="stepCard">
            <FaReply className="stepIcon" />
            <h2 className="stepTitle">Step 4: Answer Questions</h2>
            <p className="stepDescription">
              Click on a question that interests you. Provide a helpful,
              respectful answer to support the asker.
            </p>
          </div>

          <div className="stepCard">
            <FaSeedling className="stepIcon" />
            <h2 className="stepTitle">Step 5: Engage and Learn</h2>
            <p className="stepDescription">
              Comment to clarify or join the discussion. Learn from others or
              be the one who helps!
            </p>
          </div>
        </div>

        <div className="footerSection">
          <p className="footerText">
            🌱 Let’s grow and support each other one question at a time.
          </p>
        </div>
      </section>
    </Shared>
  );
};

export default Howitworks;
