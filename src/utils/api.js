const fetchApi = async (endpoint, method, body = null) => {
  const baseUrl = process.env.API_URL || "http://localhost:8000/api";

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { detail: "Unable to parse server error" };
      }

      const errorMessage =
        errorData?.email?.[0] ||
        errorData?.username?.[0] ||
        errorData?.password?.[0] ||
        errorData?.error ||
        errorData?.detail ||
        "Something went wrong";

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
};

export default fetchApi;
