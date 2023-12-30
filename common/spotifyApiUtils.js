import axios from "axios";
import { saveTokens } from "../auth/routes.js";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const ACCOUNT_URL = "https://accounts.spotify.com";
const headers = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};
const RETRY_DELAY_SECONDS = 5;
const MAX_RETRIES = 3;

const handleRateLimit = async (retryAfter) => {
  console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
  await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
};

const refreshToken = async (req) => {
  try {
    const queryURL = `${ACCOUNT_URL}/api/token`;
    const params = {
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: req.session["refresh_token"],
    };

    const response = await axios.post(queryURL, params, headers);
    const { access_token, expires_in, refresh_token } = response.data;
    saveTokens(req, access_token, expires_in, refresh_token);
    console.log("Refreshed successfully");
  } catch (err) {
    console.log("Refresh error: ", err);
  }
};

const handleRateLimitError = async (req, error, url, params, retryCount) => {
  const retryAfter =
    parseInt(error.response.headers["retry-after"]) || RETRY_DELAY_SECONDS;
  await handleRateLimit(retryAfter);
  return spotifyGet(req, url, params, retryCount + 1);
};

const handleAuthenticationError = async (req, url, params, retryCount) => {
  await refreshToken(req);
  params.headers.Authorization = `Bearer ${req.session["access_token"]}`;
  return spotifyGet(req, url, params, retryCount + 1);
};

const handleGetError = async (req, error, url, params, retryCount = 0) => {
  console.log("\nRetry count: ", retryCount);
  if (retryCount < MAX_RETRIES) {
    // Rate limit error
    if (error.response && error.response.status === 429) {
      console.log("\n429 ERROR Rate limited: ");
      console.log("Code:", error.code);
      console.log("Message:", error.message);
      return handleRateLimitError(req, error, url, params, retryCount);
    }
    // Token error
    else if (error.response && error.response.status === 401) {
      console.log("\n401 ERROR Authentication error: ");
      console.log("Code:", error.code);
      console.log("Message:", error.message);
      return handleAuthenticationError(req, url, params, retryCount);
    }
    // Other error
    else {
      console.error("\nOTHER ERROR: ");
      console.log("Code:", error.code);
      console.log("Message:", error.message);
      return;
      // throw error;
    }
  } else {
    console.log("Max retries exceeded");
    return;
    // throw new Error("Max retries exceeded");
  }
};

export const spotifyGet = async (req, url, params, retryCount = 0) => {
  try {
    const response = await axios.get(url, params);
    return response;
  } catch (error) {
    console.log("\nGET ERROR:");
    console.log("Code:", error.code);
    console.log("Message:", error.message);
    return await handleGetError(req, error, url, params, retryCount);
  }
};

export const checkExpiration = async (req) => {
  const expirationTime = req.session["expiration_time"];
  const currentTime = Date.now();
  const expired = currentTime >= expirationTime;
  if (expired) {
    await refreshToken(req);
  }
};