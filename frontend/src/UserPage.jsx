import React, { useEffect, useState } from 'react';
import { addTask, updateTask } from './APIServer';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { getTasks, handleRadioChange } from './CommonFunctions';

const UserPage = () => {
  const role = sessionStorage.getItem('role');
  const [data, setData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    is_done: false,
    importance: 'Medium',
    estimated_end_time: ''
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'user') {
      navigate('/');
      return;
    }

    getTasksData();  // Fetch tasks initially

    // Set up interval to fetch tasks every 5 seconds
    const intervalId = setInterval(getTasksData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [role, navigate]);

  const getTasksData = async () => {
    try {
      const tasks = await getTasks();
      setData(tasks);  // Set fetched tasks
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const validation = () => {
    const newError = {};
    if (!newTask.name) newError.name = 'Name must be filled out';
    if (!newTask.description) newError.description = 'Description must be filled out';
    if (!newTask.estimated_end_time) newError.time = 'Time must be filled out';
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTask = async () => {
    if (validation()) {
      try {
        await addTask(newTask);
        setNewTask({ name: '', description: '', is_done: false, importance: 'Medium', estimated_end_time: '' });
        getTasksData();  // Refresh tasks after adding a new one
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      const errorMessages = Object.values(error).join('\n');
      alert(`Please fix the following errors:\n${errorMessages}`);
    }
  };

  const handleUpdate = async () => {
    if (selectedTaskId) {
      try {
        await updateTask(selectedTaskId);  // Update the selected task
        getTasksData();  // Refresh tasks after updating
        alert(`Task ${selectedTaskId} has been marked as done!`);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    } else {
      alert('Please select a task to update.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('role');
    navigate('/');  // Redirect to login page
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>Task List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Importance</th>
            <th>Estimated End Time</th>
            <th>Is Done?</th>
            <th>Select Task</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{task.importance}</td>
                <td>{task.estimated_end_time}</td>
                <td>{task.is_done ? 'yes' : 'no'}</td>
                <td>
                  <input
                    type="radio"
                    name="task-select"
                    value={task.id}
                    checked={selectedTaskId === task.id}
                    onClick={() => handleRadioChange(selectedTaskId, task.id, setSelectedTaskId)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No tasks available</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={handleUpdate}>
        I'm a user and I finished this task
      </button>

      <form>
        <h2>Add New Task</h2>
        <input
          type="text"
          name="name"
          placeholder="Task Name"
          value={newTask.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleInputChange}
        />
        <label>
          Estimated End Time:
          <input
            type="time"
            name="estimated_end_time"
            value={newTask.estimated_end_time}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Importance:
          <select
            name="importance"
            value={newTask.importance}
            onChange={handleInputChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <button type="button" onClick={handleAddTask}>
          Add Task
        </button>
      </form>
    </div>
  );
};

export default UserPage;
