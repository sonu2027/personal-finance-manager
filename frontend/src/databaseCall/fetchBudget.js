const fetchBudget = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/budget/fetchbudget`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch budget: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData.budget;
  } catch (error) {
    throw error;
  }
};

export { fetchBudget };
