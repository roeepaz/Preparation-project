import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [data, setData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    is_done: false,
    importance: 'Medium', // Default importance level
    estimated_end_time: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get-dataframe')
      .then(response => {
        console.log("Data fetched from backend:", response.data);
        setData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleRadioChange = (id) => {
    setSelectedTaskId(id);
  };
  const fetchTasks = () => {
    axios.get('http://127.0.0.1:5000/get-dataframe')
      .then(response => {
        console.log("Data fetched from backend:", response.data);
        setData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleDelete = () => {
    if (selectedTaskId) {
      axios.delete(`http://127.0.0.1:5000/delete-task/${selectedTaskId}`)
        .then(response => {
          console.log(response.data);
          fetchTasks();  // Refresh the task list after deletion
        })
        .catch(error => console.error('Error deleting task:', error));
    } else {
      alert("Please select a task to delete.");
    }
  };


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTask(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTask = () => {
    axios.post('http://127.0.0.1:5000/add-task', newTask)
      .then(response => {
        console.log(response.data);
        fetchTasks(); 

        setNewTask({
          name: '',
          description: '',
          is_done: false,
          importance: 'Medium',
          estimated_end_time: ''
        });
      })
      .catch(error => console.error('Error adding task:', error));
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
            <th>Is Done</th>
            <th>Importance</th>
            <th>Estimated End Time</th>
            <th>Select</th> 

          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(task => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{task.is_done ? 'Yes' : 'No'}</td>
                <td>{task.importance}</td>
                <td>{task.estimated_end_time}</td>
                <td>
                  <input 
                    type="radio" 
                    name="task-select" 
                    value={task.id}
                    checked={selectedTaskId === task.id}
                    onChange={() => handleRadioChange(task.id)} 
                  />
                  </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No tasks available</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={handleDelete}>Delete Selected Task</button>

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
       <input 
         type="text" 
         name="estimated_end_time" 
         placeholder="Estimated End Time" 
         value={newTask.estimated_end_time} 
         onChange={handleInputChange} 
       />
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
       <button onClick={handleAddTask}>Add Task</button>
     </div>
    </div>
  );
}

export default App;
