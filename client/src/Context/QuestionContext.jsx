import { createContext, useContext, useState, useMemo } from "react";

const QuestionContext = createContext();

function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter questions based on title search for suggestions
  const searchedSuggestions = useMemo(() => {
    return searchQuery.length > 0
      ? questions
          .filter((question) =>
            question.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5) // Limit to 5 suggestions
      : [];
  }, [questions, searchQuery]);

  // Filter questions based on title search for main display
  const searchedQuestions = useMemo(() => {
    return searchQuery.length > 0
      ? questions.filter((question) =>
          question.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : questions;
  }, [questions, searchQuery]);

  const value = useMemo(() => {
    return {
      questions: searchedQuestions,
      allQuestions: questions,
      setQuestions,
      searchQuery,
      setSearchQuery,
      suggestions: searchedSuggestions, // Add suggestions to context
    };
  }, [searchedQuestions, searchedSuggestions, questions, searchQuery]);

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}

function useQuestions() {
  const context = useContext(QuestionContext);
  if (context === undefined)
    throw new Error("QuestionContext was used outside of QuestionProvider");
  return context;
}

export { QuestionProvider, useQuestions };
