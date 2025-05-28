const verifyEmail = async (email) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/verifyemail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to verify email: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.message=== "Email verified successfully") {
      return data.message; 
    } else {
      throw new Error(data.message || "Email verification failed");
    }
  } catch (error) {
    throw new Error("Failed to verify email");
  }
};

export { verifyEmail };
