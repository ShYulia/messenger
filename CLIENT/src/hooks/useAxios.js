import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';

const useAxios = () => {
  const { user, logout } = useContext(UserContext);
  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use(
    (config) => {
      if (user.accessToken ) {
        config.headers['Authorization'] = user.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  return axiosInstance;
};



export default useAxios;