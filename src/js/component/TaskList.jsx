/*

import React from 'react';

const TaskList = ({ tasks, onDeleteTask }) => {
  return (
    <ul>
      {tasks.map((task, index) => (
        <li key={index}>
          <span>{task}</span>
          <span
            className="delete-icon"
          onClick={() => onDeleteTask(index)}
          >
            &#x274C;
          </span>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
