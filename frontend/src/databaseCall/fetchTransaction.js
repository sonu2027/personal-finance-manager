const fetchTransaction = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/transaction/fetchtransaction`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
        credentials: "include",
      }
    );

    console.log("Reasponse: ", response);

    let data;
    if (response) {
      data = await response.json();
      return data.data.transactions;
    }
    throw error;
  } catch (error) {
    throw error;
  }
};

export { fetchTransaction };
