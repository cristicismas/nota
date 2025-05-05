const fetcher = async (url, options) => {
  const fetchOptions = {
    ...options,
    credentials: "include",
  };

  if (options?.body) {
    fetchOptions.headers = {
      "Content-Type": "application/json",
    };
  }

  if (url.includes("login")) {
    fetchOptions.headers = {
      "Content-Type": "application/json",
      Origin: process.env.SERVER_URL,
    };
  }

  const response = await fetch(
    `${process.env.SERVER_URL}/${url}`,
    fetchOptions,
  );

  if (!response.ok) {
    const error = await response.json();
    throw { ...error, status: response.status };
  }

  return response.json();
};

export default fetcher;
