const getIncome = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/getincome`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        method: "GET",
        credentials: "include",
      }
    );
    let data;
    if (response) {
      data = await response.json();
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export {getIncome}
