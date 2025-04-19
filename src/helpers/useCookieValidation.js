import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useCookieValidation = async () => {
  const router = useRouter();

  useEffect(() => {
    try {
      const serverUrl = process.env.SERVER_URL;
      fetch(`${serverUrl}/validate`, {
        credentials: "include",
        cache: "no-store",
      }).then((res) => {
        if (!res.ok) {
          router.push("/login");
        }
      });
    } catch (err) {
      console.error(err);
    }
  }, []);
};

export default useCookieValidation;
