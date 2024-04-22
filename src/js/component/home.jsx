// For the teaacher thats going to check my work please leave a note saying how can i update the "numeber of tasks left" after i check mark a box please.
import React, { useState, useEffect } from "react";
import {
  createUser,
  fetchAllUsers,
  fetchUsersTasks,
  addTask,
  deleteTask,
  updateTask,
  deleteUser,
} from "./api";
import("../../styles/index.css");

const Home = () => {
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    if (!userName) return;
    try {
      const data = await fetchUsersTasks(userName);
      setTasks(data.todos || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userName.trim() === "") {
      alert("Username can't be empty. Please enter a username");
      return;
    }
    try {
      const allUsers = await fetchAllUsers();
      if (allUsers && allUsers.length > 0) {
        const userExists = allUsers.some((user) => user.name === userName);
        if (userExists) {
          alert("User exists, getting your tasks...");
          fetchTasks();
        } else {
          console.log("User does not exist, creating user...");
          const newUser = await createUser(userName);
          if (newUser) {
            alert("New user created, you can start adding your tasks");
            console.log("User created successfully:", newUser);
            fetchTasks();
            setUsernameSubmitted(true);
          } else {
            console.error("Failed to create user");
          }
        }
      } else {
        console.error("Failed to fetch all users");
      }
    } catch (error) {
      console.error("Error handling form submit:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      try {
        await addTask(userName, { label: newTask });
        fetchTasks();
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const deleteAllTasks = async () => {
    try {
      for (const task of tasks) {
        await deleteTask(task.id);
      }
      const isUserDeleted = await deleteUser(userName);
      if (isUserDeleted) {
        alert("No more tasks left, user deleted");
        console.log("User deleted successfully");
        setTasks([]);
        setUserName("");
        setUsernameSubmitted(false);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const deleteTaskById = async (todoId) => {
    try {
      const success = await deleteTask(todoId);
      if (success) {
        const updatedTasks = tasks.filter((task) => task.id !== todoId);
        setTasks(updatedTasks);
        console.log("Task deleted successfully");
        if (updatedTasks.length === 0) {
          const isUserDeleted = await deleteUser(userName);
          if (isUserDeleted) {
            alert("No more tasks left, user deleted");
            console.log("User deleted successfully");
            setTasks([]);
            setUserName("");
            setUsernameSubmitted(false);
          } else {
            throw new Error("Failed to delete user");
          }
        }
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskStatus = async (todoId) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === todoId);
      taskToUpdate.is_done = !taskToUpdate.is_done;
      await updateTask(todoId, taskToUpdate);
      const updatedTasks = tasks.map((task) =>
        task.id === todoId ? taskToUpdate : task
      );
      setTasks(updatedTasks);
      console.log("Task status toggled successfully");
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  useEffect(() => {
    if (userName && usernameSubmitted) {
      fetchTasks();
    }
  }, [userName, usernameSubmitted]);

  return (
    <div className="container">
      <h1>Welcome to your Personal Todo List</h1>
      <p>Enjoy the productivity and make it happen!</p>
      {usernameSubmitted || tasks.length > 0 ? (
        <>
          <h1>Hello {`${userName}, here is your own todo list:`}</h1>
          <input
            type="text"
            placeholder="Enter task"
            value={newTask}
            onChange={handleNewTaskChange}
            onKeyPress={(event) => {
              if (event.key === "Enter") handleAddTask();
            }}
          />
        </>
      ) : (
        //  input username
        <h1>
          <input
            type="text"
            placeholder="Enter user name"
            value={userName}
            onChange={handleUserNameChange}
            onKeyPress={handleKeyPress} 
          />
        </h1>
      )}
      {/* if userName is not empty */}
      {userName && (
        <>
          <div>
            Tasks left to complete: <strong>{tasks.length}</strong>
          </div>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                <span>
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={task.is_done}
                    onChange={() => toggleTaskStatus(task.id)}
                  />
                </span>
                <label className={task.is_done ? "lineThrough" : ""}>
                  {task.label}
                </label>
                <i
                  className="fas fa-trash"
                  onClick={() => deleteTaskById(task.id)}
                ></i>
              </li>
            ))}
          </ul>
          {tasks.length > 0 && (
            <button className="deleteButton" onClick={deleteAllTasks}>
              Delete All Tasks
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
