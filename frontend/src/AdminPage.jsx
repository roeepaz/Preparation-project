import React, { useEffect, useState } from 'react';
import { fetchTasks, deleteTasks } from './APIServer';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { getTasks, handleRadioChange } from './CommonFunctions';

const AdminPage = () => {
  const role = sessionStorage.getItem('role');
  const [data, setData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
      return;
    }

    // Fetch tasks initially
    getTasksData();

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

  const handleDelete = async () => {
    if (selectedTaskId) {
      try {
        await deleteTasks(selectedTaskId);  // Delete the selected task
        getTasksData();  // Refresh tasks after deletion
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    } else {
      alert('Please select at least one task to delete.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('role');
    navigate('/'); // Redirect to login page
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
            <th>Is done?</th>
            <th>Select</th>
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

      <button onClick={handleDelete}>
        Admin Delete Selected Task
      </button>
    </div>
  );
};

export default AdminPage;
