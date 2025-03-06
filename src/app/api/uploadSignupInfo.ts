export const postSignupInfo = async (name: string, email: string) => {
  try {
    const res = await fetch(
      `https://4pp4vkycth.execute-api.us-east-2.amazonaws.com/dev?name=${name}&email=${email}`
    );
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data.");
  }
};
