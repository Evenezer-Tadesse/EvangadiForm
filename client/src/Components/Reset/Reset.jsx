import { useRef, useState } from "react";
import styles from "../../Pages/Auth/Auth.module.css";
import axiosInstance from "../../api/axiosConfig";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function Reset({
  setErrors,
  setEmptyFields,
  setResetPage,
  resetPage,
  setLogInDisplay,
  emptyFields,
  loginPage,
  registerPage,
}) {
  const [isLoading, setIsLoading] = useState(false);

  // Ref for email input field in reset form
  const emailDom3 = useRef(null);

  async function handlePasswordResetRequest(e) {
    e.preventDefault();
    setErrors("");
    const email = emailDom3.current.value.trim();

    // Check for empty fields
    if (!email) {
      setEmptyFields({ email: true });
      setErrors("Email is required.");
      toast.error("Email is required.");
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post("/users/reset-password", { email });
      toast.success("Password reset link sent to your email.");
      setIsLoading(false);
      setResetPage(styles.display); // Hide reset page
      setLogInDisplay(""); // Show login page
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors(
        error?.response?.data?.msg || "Error sending reset link. Try again."
      );
      setIsLoading(false);
    }
  }

  return (
    <div className={`${resetPage} ${styles.reset_con}`}>
      <h4 className={styles.reset_title}>Reset your password</h4>

      <p className={styles.reset__desc}>
        Enter your email below to receive a password reset link.
      </p>

      <form onSubmit={handlePasswordResetRequest}>
        <input
          ref={emailDom3}
          type="email"
          className={`${styles.email_input} ${
            emptyFields.email ? styles.error_bg : ""
          }`}
          onChange={() => setEmptyFields((prev) => ({ ...prev, email: false }))}
          name="emailaddress"
          placeholder="Email address"
        />

        <button className={`${styles.butn_login} butn_login`} type="submit">
          {isLoading ? <ClipLoader color="#fff" /> : "Send Reset Link"}
        </button>
      </form>

      <div className={styles.links}>
        <Link to="#" onClick={() => loginPage()}>
          Already have an account?
        </Link>
        <Link to="#" onClick={() => registerPage()}>
          Don’t have an account?
        </Link>
      </div>
    </div>
  );
}

export default Reset;
