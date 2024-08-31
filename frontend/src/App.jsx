import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get-dataframe')
      .then(response => {
        console.log("Data fetched from backend:", response.data);
        setData(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No tasks available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
