import axios from 'axios';

export const fetchTasks = async () => {
  const response = await axios.get('http://127.0.0.1:5000/get-dataframe');
  return response.data;
};

export const addTask = async (task) => {
  const response = await axios.post('http://127.0.0.1:5000/add-task', task);
  return response.data;
};

export const deleteTasks = async (taskIds) => {
  const response = await axios.delete('http://127.0.0.1:5000/delete-tasks', {
    data: { ids: taskIds },
  });
  return response.data;
};
