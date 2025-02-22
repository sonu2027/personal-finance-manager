const updateIncome = async (income) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/updateincome`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token
        },
        method: "PUT",
        body: JSON.stringify({ income }),
        credentials: "include",
      }
    );
    if (response.ok) return true;
    else return false;
  } catch (error) {
    throw error;
  }
};

export default updateIncome;
