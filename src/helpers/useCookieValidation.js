import { useRouter } from "next/navigation";

const useCookieValidation = async () => {
  const router = useRouter();

  try {
    const serverUrl = process.env.SERVER_URL;
    const response = await fetch(`${serverUrl}/validate`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      router.push("/login");
    }
  } catch (err) {
    console.error(err);
  }
};

export default useCookieValidation;
