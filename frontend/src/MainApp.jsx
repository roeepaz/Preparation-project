import React, { useEffect, useState } from 'react';
import { fetchTasks, addTask, deleteTasks } from './APIServer';
import './App.css';
import { useNavigate } from 'react-router-dom';

const MainApp = () => {
  const role = sessionStorage.getItem('role');
  const [data, setData] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  //TODO make sure that the user see all the error
  const validation = () => {
    const newError = {};
    if (newTask.name.length == 0) newError.name = 'Name must be filled out';
    if (newTask.description.length == 0)
      newError.description = 'Description must be filled out';
    if (newTask.estimated_end_time.length == 0)
      newError.time = 'Time must be filled out';
    setError(newError);
    return Object.keys(newError).length == 0;
  };
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    is_done: false,
    importance: 'Medium', // Default importance level
    estimated_end_time: ''
  });

  const handleCheckboxChange = (id) => {
    setSelectedTaskIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((taskId) => taskId !== id) // Deselect
        : [...prevSelectedIds, id] // Select multiple
    );
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  useEffect(() => {
    //protecting the app
    if (!role) navigate('/');
    getTasks();
  }, [role, navigate]);


  // work with Async/await
  const getTasks = async () => {
    try {
      const taskData = await fetchTasks();
      setData(taskData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleRadioChange = (id) => {
    if (selectedRadioTaskId === id) {
      setSelectedRadioTaskId(null); // Uncheck the radio button if clicked again
    } else {
      setSelectedRadioTaskId(id); // Check the radio button if different
    }
  };
  const handleAddTask = async () => {
    if (validation()) {
      try {
        await addTask(newTask);
        getTasks();
        setNewTask({
          name: '',
          description: '',
          is_done: false,
          importance: 'Medium',
          estimated_end_time: '',
        });
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      const errorMessages = Object.values(error).join('\n');
      alert(`Please fix the following errors:\n${errorMessages}`);
    }
  };

  const handleDelete = async () => {
    if (selectedTaskIds.length > 0) {
      try {
        await deleteTasks(selectedTaskIds);
        getTasks();
      } catch (error) {
        console.error('Error deleting tasks:', error);
      }
    } else {
      alert('Please select at least one task to delete.');
    }
  };

  return (
    <div>
      <h1>Task List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Importance</th>
            <th>Estimated End Time</th>
            {role === 'user' && <th>Select Tasks</th>}
            {role === 'admin' && <th>Select</th>}
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
                {role === 'user' && (
                  <td>
                    <input
                      type="checkbox"
                      name="task-select"
                      value={task.id}
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={() => handleCheckboxChange(task.id)}
                    />
                  </td>
                )}
                {role === 'admin' && (
                  <td>
                    <input
                      type="radio"
                      name="task-select"
                      value={task.id}
                      checked={selectedTaskIds.includes(task.id)}
                      onChange={() => handleRadioChange(task.id)}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No tasks available</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleDelete}>
      {role == 'admin' && (
        <p>Delete Selected Tasks</p>
      )}
      {role == 'user' && (
        <p>I'm a user and I finished the selected tasks</p>
      )}
      </button>

      {role == 'user' && (
        <form id="user">
          <h2>Add New Task</h2>
          <div>
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
          </div>
        </form>
      )}
    </div>
  );
};

export default MainApp;
