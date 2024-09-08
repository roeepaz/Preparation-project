import axios from 'axios';

const handleApiError = async (fn, ...params) => {
  try {
    const response = await fn(...params);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;  // Rethrow to be caught in the calling component if needed
  }
};

export const fetchTasks = () => handleApiError(() => axios.get('http://127.0.0.1:5000/get-dataframe'));

export const addTask = (newTask) => handleApiError(() => axios.post('http://127.0.0.1:5000/add-task', newTask));

export const deleteTasks = (taskId) =>
  handleApiError(() => axios.delete('http://127.0.0.1:5000/delete-tasks', {
    data: { id: taskId }
  }));

export const updateTask = (taskId) => handleApiError(() => axios.put('http://127.0.0.1:5000/toggle-task-status', { id: taskId }));
