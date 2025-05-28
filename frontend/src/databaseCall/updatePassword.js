const updatePassword = async (email, password) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/updatepassword`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    console.log("Response from updatePassword API:", response);
    

    if (!response.ok) {
      throw new Error(`Failed to update password: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Response data from updatePassword API:", responseData);
    
    return responseData.message;
  } catch (error) {
    throw error;
  }
};

export { updatePassword };
