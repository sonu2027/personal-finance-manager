async function sendEmailVerificationOTP(email) {
  const OTP = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  console.log("Generated code: ", OTP);

  const data = {
    OTP,
    email,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/sendemailverificationotp`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      return OTP;
    }
  } catch (error) {
    return error;
  }
}

export default sendEmailVerificationOTP;
