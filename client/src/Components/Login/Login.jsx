import styles from "../../pages/Auth/Auth.module.css";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../Context/Context";
import { Type } from "../../Utility/actionType";
import axiosInstance from "../../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function Login({
  setErrors,
  setEmptyFields,
  logInDisplay,
  registerPage,
  errors,
  emptyFields,
  setResetPage,
  setLogInDisplay,
  setRegInDisplay,
}) {
  const [_, dispatch] = useContext(AuthContext);
  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Ref for email input field
  const emailDom1 = useRef(null);

  // Ref for password input field in login form
  const passwordDom1 = useRef(null);

  // Navigate hook for programmatic navigation
  const navigate = useNavigate();

  // Handle form submission for login
  async function handleSubmitLogin(e) {
    e.preventDefault();

    setErrors(""); // Reset errors before submission
    setEmptyFields({
      email: false,
      password: false,
      username: false,
      firstname: false,
      lastname: false,
    });

    // Get values from input fields
    const email = emailDom1.current.value.trim();
    const password = passwordDom1.current.value.trim();

    // Check for empty fields
    const newEmptyFields = {};
    if (!email) newEmptyFields.email = true;
    if (!password) newEmptyFields.password = true;

    if (Object.keys(newEmptyFields).length > 0) {
      setEmptyFields(newEmptyFields);
      setErrors("All fields are required.");
      toast.error("All fields are required.");

      // Clear emptyFields after 2 seconds
      setTimeout(() => {
        setEmptyFields({
          email: false,
          password: false,
          username: false,
          firstname: false,
          lastname: false,
        });
      }, 2000);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token); // Store token in localStorage

      localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user info in localStorage

      dispatch({
        type: Type.ADD_USER,
        payload: {
          token: res.data.token,
          user: res.data.user,
        },
      });

      setIsLoading(false);
      navigate("/", { replace: true }); // Redirect to home page after successful login
    } catch (error) {
      console.error("Error during Login:", error);
      toast.error(error?.response?.data?.msg);
      setErrors(error?.response?.data?.msg);
      setIsLoading(false);
    }
  }

  function passwordReset() {
    setErrors(""); // Reset errors
    setEmptyFields({
      email: false,
      password: false,
      username: false,
      firstname: false,
      lastname: false,
    }); // Reset empty fields
    setResetPage("");
    setLogInDisplay(styles.display);
    setRegInDisplay(styles.display);
  }

  return (
    <div className={logInDisplay}>
      <h3 className={styles.login_account}>Login to your account</h3>

      <p className={styles.alrdy}>
        Don't have an account?{" "}
        <Link
          to=""
          className={styles.creat_account}
          onClick={() => registerPage()}
        >
          Create an account
        </Link>
      </p>

      <form className={styles.login_form} onSubmit={handleSubmitLogin}>
        <small className={styles.error_display}>{errors && errors}</small>
        <small className={styles.error_display}></small>

        <input
          type="email"
          ref={emailDom1}
          className={`${styles.email_input} ${styles.email_input_login} ${
            emptyFields.email ? styles.error_bg : ""
          }`}
          onChange={() => setEmptyFields({ ...emptyFields, email: false })}
          placeholder="Email Address"
        />

        <input
          type={showPassword ? "password" : "text"}
          ref={passwordDom1}
          className={`${styles.password__input} ${
            emptyFields.password ? styles.error_bg : ""
          }`}
          onChange={() => setEmptyFields({ ...emptyFields, password: false })}
          placeholder="Password"
        />

        <span
          className={styles.toggle_password}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>

        <p className={styles.forgotPwd}>
          <Link
            to=""
            className={`${styles.lnk_toggler} ${styles.da}`}
            onClick={() => passwordReset()}
          >
            Forgot Password?
          </Link>
        </p>

        <button type="submit" className={`butn_login ${styles.butn_login}`}>
          {isLoading ? <ClipLoader color="#fff" /> : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
