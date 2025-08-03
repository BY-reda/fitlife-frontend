import axios from 'axios';

const API = axios.create({
 baseURL: 'https://fitlife-backend-production-f043.up.railway.app/api/workouts',

});

export const getWorkouts = () => API.get('/');
export const getWorkoutById = (id) => API.get(`/${id}`);