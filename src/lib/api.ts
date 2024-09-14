import axios from 'axios';
import { getSession } from 'next-auth/react';


const api = () => {
  const defaultOptions = {
    baseURL: process.env.ENV_API_URL || process.env.NEXT_PUBLIC_ENV_API,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    if (session) {
      request.headers.Authorization = `Bearer ${session.user.token}`;
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`error`, error);
    },
  );

  return instance;
};

export default api();