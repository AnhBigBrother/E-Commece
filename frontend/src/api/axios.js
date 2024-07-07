import axios from 'axios';

const server_host = import.meta.env.VITE_SERVER_HOST;

export default axios.create({
  withCredentials: true,
  baseURL: `${server_host}/api`,
  headers: {
    // withCredentials: true,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
