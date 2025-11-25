import axios from 'axios';

const apiSquare = axios.create({
  baseURL: import.meta.env.VITE_API_WEB_BASE_URL as string,
});


export { apiSquare };
