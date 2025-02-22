const loginUser = async (email, password) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/login`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export default loginUser;
