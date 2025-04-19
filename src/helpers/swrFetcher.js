const fetcher = async (url, options) => {
  const response = await fetch(`${process.env.SERVER_URL}/${url}`, {
    ...options,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
};

export default fetcher;
