"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "@/helpers/swrFetcher";
// components
import SpinningLoader from "@/components/SpinningLoader";
// styles
import styles from "./styles.module.css";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const username = e.target.querySelector("#username").value;
      const password = e.target.querySelector("#password").value;

      await fetcher("login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      router.push("/");
    } catch (err) {
      if (err.status === 401) {
        setError("Username or password is wrong");
      } else if (err.status === 500) {
        setError("Internal server error");
      } else {
        setError("Something unexpected happened");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Nota</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input required id="username" type="text" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input required id="password" type="password" />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <SpinningLoader className={styles.loader} />
          </div>
        ) : (
          <button type="submit">Log in</button>
        )}
      </form>
    </div>
  );
}
