import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './Context/Context.jsx';
import { initial, reducer } from './Utility/reducer.js';
import { QuestionProvider } from './Context/QuestionContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider reducer={reducer} initialState={initial}>
        <QuestionProvider>
          <App />
        </QuestionProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
