import axios from "axios";

const API_URL =
  "http://localhost:5000/analytics";


export async function getAnalytics() {
  try {
    const response =
      await axios.get(API_URL);

    return response.data;

  } catch (error) {
    throw new Error(
      "Failed to retrieve analytics information."
    );
  }
}