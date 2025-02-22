const deleteTransaction = async (transactionId) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/transaction/deletetransaction/${transactionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete transaction: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData.data.transaction;
  } catch (error) {
    throw error;
  }
};

export { deleteTransaction };
