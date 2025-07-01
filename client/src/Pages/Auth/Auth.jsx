import React, { useState } from "react";
import styles from "./Auth.module.css";
import About from "../../Components/About/About";
import Login from "../../Components/Login/Login";
import Signup from "../../Components/Signup/Signup";
import Reset from "../../Components/Reset/Reset";
import Shared from "../../Components/Shared/Shared";

function Auth() {
  // State to manage the display of login form
  const [logInDisplay, setLogInDisplay] = useState("");

  // State to manage the display of registration form
  const [regInDisplay, setRegInDisplay] = useState(styles.display);

  // State to manage the display of password reset form
  const [resetPage, setResetPage] = useState(styles.display);

  // State to manage errors
  const [errors, setErrors] = useState("");

  // Empty fields for error display
  const [emptyFields, setEmptyFields] = useState({
    email: false,
    password: false,
    username: false,
    firstname: false,
    lastname: false,
  });

  // page changing functions start here***
  function registerPage() {
    setErrors(""); // Reset errors
    setEmptyFields({
      email: false,
      password: false,
      username: false,
      firstname: false,
      lastname: false,
    }); // Reset empty fields
    setRegInDisplay("");
    setLogInDisplay(styles.display);
    setResetPage(styles.display);
  }
  function loginPage() {
    setErrors(""); // Reset errors
    setEmptyFields({
      email: false,
      password: false,
      username: false,
      firstname: false,
      lastname: false,
    }); // Reset empty fields
    setLogInDisplay("");
    setRegInDisplay(styles.display);
    setResetPage(styles.display);
  }

  return (
    <Shared>
      <section className={styles.main__bg}>
        <div className={styles.loginLayout}>
          {/* Left side */}
          <div className={styles.left_side}>
            <Login
              setErrors={setErrors}
              setEmptyFields={setEmptyFields}
              logInDisplay={logInDisplay}
              registerPage={registerPage}
              errors={errors}
              emptyFields={emptyFields}
              setResetPage={setResetPage}
              setLogInDisplay={setLogInDisplay}
              setRegInDisplay={setRegInDisplay}
            />

            {/* register form */}
            <Signup
              setErrors={setErrors}
              setEmptyFields={setEmptyFields}
              regInDisplay={regInDisplay}
              errors={errors}
              loginPage={loginPage}
              emptyFields={emptyFields}
            />

            {/* reset form */}
            <Reset
              setErrors={setErrors}
              setEmptyFields={setEmptyFields}
              emptyFields={emptyFields}
              setResetPage={setResetPage}
              resetPage={resetPage}
              setLogInDisplay={setLogInDisplay}
              loginPage={loginPage}
              registerPage={registerPage}
            />
          </div>

          {/* Right Side */}
          <About />
        </div>
      </section>
    </Shared>
  );
}

export default Auth;
