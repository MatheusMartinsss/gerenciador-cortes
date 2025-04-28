import axios from 'axios';



const api = () => {
  const defaultOptions = {
    baseURL: process.env.ENV_API_URL || process.env.NEXT_PUBLIC_ENV_API,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const token = localStorage.getItem('token');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
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