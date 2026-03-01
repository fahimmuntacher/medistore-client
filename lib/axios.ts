// "use server";
import axios from "axios";

// const cookieStore = await cookies();
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  // headers: {
  //   "Content-Type": "application/json",
  //   Cookie: cookieStore.toString(),
  // },
  withCredentials: true,
});

export default api;
