import React from "react";
import styles from "./Four04.module.css";
import { Link } from "react-router-dom";
import Shared from "../../Components/Shared/Shared";

export default function Four04() {
  return (
    <Shared>
      <section className={styles.main_wrapper}>
        <div className={styles.content_wrapper}>
          <h1 className={styles.title}>
            Sorry, the page you are looking for couldn't be found.
          </h1>
          <p>
            Please go back to the <Link to="/">home page</Link> and try again.
            If it still doesn't work for you, please reach out to our team at
            support@evangadiforum.com.
          </p>
        </div>
      </section>
    </Shared>
  );
}
