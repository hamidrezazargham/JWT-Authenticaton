import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance'; // Custom axios instance
import TaskForm from './TaskForm';
import './TaskList.css';

const TaskList = ({ onLogout }) => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axiosInstance.delete(`/tasks/${id}/`);
            fetchTasks(); // Refresh task list
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
    };

    const handleSaveTask = async (taskData) => {
        try {
            if (editingTask) {
                await axiosInstance.put(`/tasks/${editingTask.id}/`, taskData);
            } else {
                await axiosInstance.post('/tasks/', taskData);
            }
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Failed to save the task:', error.response ? error.response.data : error.message);
            alert('Failed to save the task. Please try again.');
        }
    };

    // Handle the drag and drop functionality
    const handleDragStart = (event, task) => {
        event.dataTransfer.setData('task', JSON.stringify(task));
    };

    const handleDrop = async (event, newStatus) => {
        event.preventDefault();
        const taskData = JSON.parse(event.dataTransfer.getData('task'));
        if (taskData.status !== newStatus) {
            // Update the task status if dropped into a different column
            try {
                await axiosInstance.put(`/tasks/${taskData.id}/`, { ...taskData, status: newStatus });
                fetchTasks();
            } catch (error) {
                console.error('Error updating task status:', error);
            }
        }
    };

    return (
        <div className="task-list-container">
            <header className="header">
                <h1>Task Management System</h1>
                <button className="logout-button" onClick={onLogout}>Logout</button>
            </header>

            {/* Add Task Section */}
            <div className="task-form">
                <h2 className="add-task-heading">Add Task</h2>
                <TaskForm fetchTasks={fetchTasks} editingTask={editingTask} setEditingTask={setEditingTask} onSaveTask={handleSaveTask} />
            </div>

            {/* Task Columns for Status */}
            <div className="task-columns">
                <div className="task-column" onDrop={(event) => handleDrop(event, 'To Do')} onDragOver={(event) => event.preventDefault()}>
                    <h3 className="column-heading">To Do</h3>
                    <ul className="task-list">
                        {tasks.filter(task => task.status === 'To Do').map(task => (
                            <li
                                key={task.id}
                                className="task-item"
                                draggable
                                onDragStart={(event) => handleDragStart(event, task)}
                                data-status="To Do"
                            >
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <h3>{task.status}</h3>
                                <div className="task-buttons">
                                    <button className="edit-button" onClick={() => handleEdit(task)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="task-column" onDrop={(event) => handleDrop(event, 'In Progress')} onDragOver={(event) => event.preventDefault()}>
                    <h3 className="column-heading">In Progress</h3>
                    <ul className="task-list">
                        {tasks.filter(task => task.status === 'In Progress').map(task => (
                            <li
                                key={task.id}
                                className="task-item"
                                draggable
                                onDragStart={(event) => handleDragStart(event, task)}
                                data-status="In Progress"
                            >
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <h3>{task.status}</h3>
                                <div className="task-buttons">
                                    <button className="edit-button" onClick={() => handleEdit(task)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="task-column" onDrop={(event) => handleDrop(event, 'Done')} onDragOver={(event) => event.preventDefault()}>
                    <h3 className="column-heading">Done</h3>
                    <ul className="task-list">
                        {tasks.filter(task => task.status === 'Done').map(task => (
                            <li
                                key={task.id}
                                className="task-item"
                                draggable
                                onDragStart={(event) => handleDragStart(event, task)}
                                data-status="Done"
                            >
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <h3>{task.status}</h3>
                                <div className="task-buttons">
                                    <button className="edit-button" onClick={() => handleEdit(task)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <footer className="footer">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default TaskList;
