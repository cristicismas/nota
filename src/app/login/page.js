"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

    try {
      const username = e.target.querySelector("#username").value;
      const password = e.target.querySelector("#password").value;

      const response = await fetch(`${process.env.SERVER_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Username or password is wrong");
        } else if (response.status === 500) {
          setError("Internal server error");
        } else {
          setError("Something unexpected happened");
        }
      } else {
        router.push("/");
      }

      console.log(response);
    } catch (err) {
      console.error(err);
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
