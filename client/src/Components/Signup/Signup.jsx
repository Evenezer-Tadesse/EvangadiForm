import styles from "../../pages/Auth/Auth.module.css";
import axiosInstance from "../../api/axiosConfig";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function Signup({
  regInDisplay,
  loginPage,
  setEmptyFields,
  errors,
  setErrors,
  emptyFields,
}) {
  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Ref for email input field in registration form
  const emailDom2 = useRef(null);

  // Ref for first name input field
  const firstNameDom = useRef(null);

  // Ref for last name input field
  const lastNameDom = useRef(null);

  // Ref for username input field
  const userNameDom = useRef(null);

  // Ref for password input field in registration form
  const passwordDom2 = useRef(null);

  // Handle form submission for registration
  async function handleSubmitSignUp(e) {
    e.preventDefault();
    setErrors(""); // Reset errors before submission
    setEmptyFields({
      email: false,
      password: false,
      username: false,
      firstname: false,
      lastname: false,
    });

    const username = userNameDom.current.value.trim();
    const firstname = firstNameDom.current.value.trim();
    const lastname = lastNameDom.current.value.trim();
    const email = emailDom2.current.value.trim();
    const password = passwordDom2.current.value.trim();

    // Check for empty fields
    const newEmptyFields = {};
    if (!email) newEmptyFields.email = true;
    if (!password) newEmptyFields.password = true;
    if (!username) newEmptyFields.username = true;
    if (!firstname) newEmptyFields.firstname = true;
    if (!lastname) newEmptyFields.lastname = true;

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
      await axiosInstance.post("/users/register", {
        username,
        firstname,
        lastname,
        email,
        password,
      });

      toast.success("Registration successful! You can now log in.");
      setIsLoading(false);
      loginPage(); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Error during sign up:", error.response.data.msg);
      toast.error(error.response.data.msg);
      setIsLoading(false);
      setErrors(
        error.response.data.msg || "An error occurred. Please try again."
      );
    }
  }

  return (
    <div className={regInDisplay}>
      <h3 className={styles.join_net}>Join the network</h3>

      <p className={styles.alrdy}>
        Already have an account?{" "}
        <Link to="" onClick={() => loginPage()}>
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmitSignUp}>
        <small className={styles.error_display}>{errors && errors}</small>

        <input
          type="email"
          ref={emailDom2}
          className={`${styles.email_input} ${
            emptyFields.email ? styles.error_bg : ""
          }`}
          onChange={() => setEmptyFields({ ...emptyFields, email: false })}
          name="eva_email"
          placeholder="Email address"
        />

        <div className={styles.personal_info}>
          <input
            ref={firstNameDom}
            id="fname-input"
            type="text"
            className={`${styles.f_name} ${
              emptyFields.firstname ? styles.error_bg : ""
            }`}
            onChange={() =>
              setEmptyFields({ ...emptyFields, firstname: false })
            }
            name="firstname"
            placeholder="First Name"
          />

          <input
            ref={lastNameDom}
            id="lname-input"
            type="text"
            className={`${styles.l_name} ${
              emptyFields.lastname ? styles.error_bg : ""
            }`}
            onChange={() => setEmptyFields({ ...emptyFields, lastname: false })}
            name="lastname"
            placeholder="Last Name"
          />

          <input
            ref={userNameDom}
            type="text"
            className={`${styles.l_name} ${styles.userName_input} ${
              emptyFields.username ? styles.error_bg : ""
            }`}
            onChange={() => setEmptyFields({ ...emptyFields, username: false })}
            name="User name"
            placeholder="User Name"
          />
        </div>

        <div className={styles.paswrd_insert}>
          <input
            ref={passwordDom2}
            type={showPassword ? "password" : "text"}
            className={`${styles.password__input} ${
              emptyFields.password ? styles.error_bg : ""
            }`}
            onChange={() => setEmptyFields({ ...emptyFields, password: false })}
            name="password"
            placeholder="Password"
          />
          <div
            className={styles.toggle_password}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <p className={`${styles.term_policy} ${styles.small}`}>
          I agree to the{" "}
          <Link to="https://legacy.evangadi.com/legal/privacy/">
            privacy policy
          </Link>{" "}
          and{" "}
          <Link to="https://legacy.evangadi.com/legal/terms/">
            terms of service
          </Link>
          .
        </p>

        <button
          id={styles.agree_but}
          className={`${styles.butn_login} butn_login`}
          type="submit"
        >
          {isLoading ? <ClipLoader color="#fff" /> : "Agree and Join"}
        </button>

        <Link to="" className={styles.already} onClick={() => loginPage()}>
          Already have an account?
        </Link>
      </form>
    </div>
  );
}

export default Signup;
