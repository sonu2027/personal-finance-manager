const createBudget = async (data) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/budget/createbudget`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create budget: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData.response;
  } catch (error) {
    throw error;
  }
};

export { createBudget };
