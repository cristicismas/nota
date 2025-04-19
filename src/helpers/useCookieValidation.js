import { useRouter } from "next/navigation";
import { useEffect } from "react";
import fetcher from "./swrFetcher";

const useCookieValidation = async () => {
  const router = useRouter();

  useEffect(() => {
    try {
      fetcher("validate", { method: "POST", cache: "no-store" }).catch(() => {
        router.push("/login");
      });
    } catch (err) {
      console.error(err);
    }
  }, []);
};

export default useCookieValidation;
