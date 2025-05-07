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

  const response = await fetch(`api/${url}`, fetchOptions);

  if (!response.ok) {
    const error = await response.json();
    throw { ...error, status: response.status };
  }

  return response.json();
};

export default fetcher;
