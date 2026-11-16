import Axios from 'axios';
import { API_URL } from '@/config/constants';
import { onRequest, onResponseError } from './interceptors';

export const api = Axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(onRequest);
api.interceptors.response.use((response) => response, onResponseError);
