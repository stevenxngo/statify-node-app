import axios from "axios";

const handleRateLimit = async (retryAfter) => {
  console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
  await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
};

export const performRequestWithRetry = async (url, params) => {
  try {
    const response = await axios.post(url, params);

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = parseInt(error.response.headers["retry-after"]) || 5;
      await handleRateLimit(retryAfter);
      return performRequestWithRetry(url, params);
    } else {
      throw error;
    }
  }
};
