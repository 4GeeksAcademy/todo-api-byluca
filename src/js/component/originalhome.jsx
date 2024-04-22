/*  import React, { useState } from 'react';
import TaskList from './TaskList';

const Home = () => {
  const [username, setUsername] = useState('')

  const deleteUser =() => {
    console.log("Delete this user", username);
  }

  const fetchTodoList = () => {
    //fetch toodo list for user
    console.log('fetch todo list for' username)
    fetch(`https://playground.4geeks.com/todo/users/${username}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  }) .then(response => {
    if(response.ok) {
      return response.json()
    }
    throw Error(response.status  + "!Something went wrong" )
  }).then((todoData) => {
    console.log(todoData);
  }).catch(err => {
    console.log('Error', err);
  })


  }



  return (
    <div>
      <input value = {username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder='Enter Your Username'
      onKeyDown={(e) => { if(e.key === "Enter"){
            //fetch toodo list for THAT user

        fetchTodoList();

      }
    }}
      />
      <button onClick={deleteUser}>Delete User</button>
    </div>
  )




  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };
//aa//
  const handleChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((task, i) => i !== index);
    setTasks(updatedTasks);
  };
 
  return (
    <div className="container">
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTask}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter a task..."
      />
      <button onClick={handleAddTask}>Add Task</button>
      <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
      {tasks.length === 0 && <p className="empty-message">No tasks, add a task</p>}
    </div>
  );
};

export default Home;