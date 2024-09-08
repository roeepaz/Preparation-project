import React, { useEffect, useState } from 'react';
import { fetchTasks} from './APIServer';

export const getTasks = async () => {
    try {
      const response = await fetchTasks();
      return response;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  };
  
  export const handleRadioChange = (prevSelectedID,id, setSelectedTaskId) => {
    prevSelectedID === id ? setSelectedTaskId(null) : setSelectedTaskId(id);
  }; 