import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import { AuthContext } from "../../Context/Context";
import axiosInstance from "../../api/axiosConfig";
import { format, formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useQuestions } from "../../Context/QuestionContext";
import { FaQuestion } from "react-icons/fa6";
import { IoMdArrowRoundUp } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import Shared from "../../Components/Shared/Shared";

const Home = () => {
  const [
    {
      user: { firstname },
      token,
    },
    _,
  ] = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category

  const [page, setPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(false); // Track if there are more questions to load
  const [hasLess, setHasLess] = useState(false); // Track if there are fewer questions to show

  const navigate = useNavigate();

  const {
    suggestions,
    questions,
    allQuestions,
    setQuestions,
    searchQuery,
    setSearchQuery,
  } = useQuestions();
  const [error, setError] = useState("");

  const searchDom = useRef(null);

  const userFirstName =
    firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/questions/all-questions", {
          params: { page, limit: 20 }, // Pass page and limit as query parameters
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasMore(res.data.questions.length > 0); // Check if there are more questions to load
        setHasLess(page > 1); // Enable "Show Less" if page > 1
        setQuestions(res.data.questions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(error.response.data.msg);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [token, page]);

  const lastQuestionRef = useRef(null);

  const handleShowMore = () => {
    setPage((prevPage) => prevPage + 1); // Load the next page
  };

  const handleShowLess = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1); // Load the previous page
    }
  };

  const formatQuestionDate = (dateString) => {
    const postedTime = new Date(dateString);
    const timeAgo = formatDistanceToNow(postedTime, { addSuffix: true });
    const formattedDate = format(postedTime, "MMM d");
    return `${timeAgo} • ${formattedDate}`;
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title); // Update the search query with the clicked suggestion
  };

  const filteredQuestions = selectedCategory
    ? questions.filter((question) => question.tag === selectedCategory)
    : questions;

  return (
    <Shared>
      <main className={styles.container}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1>
              Welcome back,{" "}
              <span className={styles.userName}>{userFirstName}</span>!
            </h1>
            <p className={styles.subtitle}>
              Ready to dive into today's coding challenges? Ask questions, share
              knowledge, and learn together!
            </p>
            <Link to="/ask" className={styles.askButton}>
              <span className={styles.plusIcon}>+</span> Ask a Question
            </Link>
          </div>
          <div className={styles.knowledgeBubbles}>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className={styles.bubble}>
                <FaQuestion size={40} className={styles.questionIcon} />
              </div>
            ))}
          </div>
        </section>

        {/* Search Bar */}
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              ref={searchDom}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by title..."
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={styles.clearButton}
              >
                ×
              </button>
            )}

            {/* Suggestions Dropdown */}
            {searchQuery && suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.title}
                  </li>
                ))}
              </ul>
            )}

            {searchQuery && (
              <p className={styles.searchResults}>
                Found {questions.length} of {allQuestions.length} questions
              </p>
            )}
          </div>
        </section>

        <div className={styles.floatingActions}>
          <button
            className={styles.mainAction}
            onClick={() => navigate("/ask")}
          >
            <span>+</span>
          </button>

          <div className={styles.secondaryActions}>
            <button
              onClick={() => {
                searchDom.current.focus();
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
              }}
            >
              🔍
            </button>
            <button
              onClick={() =>
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
              }
            >
              <IoMdArrowRoundUp size={30} />
            </button>
          </div>
        </div>

        {/* Sort by Category */}
        <section className={styles.sortSection}>
          <label htmlFor="category" className={styles.sortLabel}>
            Sort by Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="">All Categories</option>
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
        </section>

        <section className={styles.questionsSection}>
          <div className={styles.sectionHeader}>
            <h2>Latest Questions</h2>
            <p className={styles.helpText}>
              Help your fellow bootcamp students by answering their questions!
            </p>
          </div>

          <div className={styles.questionsList}>
            {isLoading ? (
              <div className={styles.loader_wrapper}>
                <ClipLoader />
              </div>
            ) : error === "No questions found" ? (
              <p>{error}</p>
            ) : (
              filteredQuestions?.map((question, index) => {
                const isLastQuestion = index === questions.length - 1;
                return (
                  <Link
                    to={`/questionDetail/${question.question_id}`}
                    key={question.question_id}
                    ref={isLastQuestion ? lastQuestionRef : null} // Attach ref to the last question
                    className={styles.questionCard}
                  >
                    <div className={styles.userColumn}>
                      <div className={styles.avatar}>
                        {question.firstname.charAt(0).toUpperCase()}
                      </div>
                      <span className={styles.username}>
                        {question.username}
                      </span>
                    </div>

                    <div className={styles.contentColumn}>
                      <h3 className={styles.questionTitle}>{question.title}</h3>
                      <div className={styles.questionMeta}>
                        <span className={styles.time}>
                          {formatQuestionDate(question.created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          <div className={styles.paginationButtons}>
            {hasLess && !isLoading && (
              <button
                onClick={handleShowLess}
                className={styles.previousPageButton} // Updated class name
              >
                Previous Page
              </button>
            )}
            {hasMore && !isLoading && (
              <button
                onClick={handleShowMore}
                className={styles.nextPageButton} // Updated class name
              >
                Next Page
              </button>
            )}
          </div>

          {!hasMore && (
            <p className={styles.noMoreQuestions}>No more questions to load.</p>
          )}
        </section>
      </main>
    </Shared>
  );
};

export default Home;
