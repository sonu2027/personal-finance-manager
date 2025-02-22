const fetchTransactions = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token is missing");
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

    if (!response.ok) {
      throw new Error(`Failed to fetch transaction: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("responseData", responseData);
    
    return responseData.transactions;
  } catch (error) {
    throw error;
  }
};

export { fetchTransactions };
