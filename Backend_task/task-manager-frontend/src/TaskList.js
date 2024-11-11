import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance'; // Custom axios instance
import TaskForm from './TaskForm';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';

const TaskList = () => {
    const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            if (token) {
                const response = await axiosInstance.get('/tasks/list/', {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    }
                });
    
                setTasks(response.data); 
            } else {
                console.log('No token found. Please log in.');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            if (error.response && error.response.status === 401) {
                console.log('Unauthorized. Redirecting to login...');
            }
        }
    };
    
    const onLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('csrfToken');
        navigate('/login');
    };

    const deleteTask = async (id) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log('No token found. Please log in.');
            return; 
        }

        try {
            await axiosInstance.delete(`/tasks/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            fetchTasks(); 
        } catch (error) {
            console.error('Error deleting task:', error);
            if (error.response && error.response.status === 401) {
                console.log('Unauthorized. Redirecting to login...');
            }
        }
    };


    const handleEdit = async (task) => {
        setEditingTask(task);
    
        try {
            const token = localStorage.getItem('authToken');  
    
            if (token) {
                const response = await axiosInstance.put(`/tasks/${task.id}/`, task, {
                    headers: {
                        'Authorization': `Bearer ${token}`,  
                    }
                });
    
                console.log('Task updated:', response.data);
                fetchTasks();  // Refresh the task list after the update
            } else {
                console.log('No token found. Please log in.');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            if (error.response && error.response.status === 401) {
                console.log('Unauthorized. Redirecting to login...');
            }
        }
    };
    

    const handleSaveTask = async (taskData) => {
        try {
            const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
    
            if (!token) {
                console.log('No token found. Please log in.');
                return;  // Stop if there's no token
            }
    
            const headers = {
                'Authorization': `Bearer ${token}`, 
            };
    
            if (editingTask) {
                await axiosInstance.put(`/tasks/${editingTask.id}/`, taskData, { headers });
            } else {
                await axiosInstance.post('/tasks/list/', taskData, { headers });
            }
    
            setEditingTask(null);
            fetchTasks();  // Refresh task list
        } catch (error) {
            console.error('Failed to save the task:', error.response ? error.response.data : error.message);
            alert('Failed to save the task. Please try again.');
        }
    };
    

    const handleDragStart = (event, task) => {
        event.dataTransfer.setData('task', JSON.stringify(task));
    
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log('No token found. Please log in.');
            return;
        }
    
        console.log('Token retrieved for future use:', token);
    };
    

    const handleDrop = async (event, newStatus) => {
        event.preventDefault();
        const taskData = JSON.parse(event.dataTransfer.getData('task'));
    
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log('No token found. Please log in.');
            return; 
        }
    
        if (taskData.status !== newStatus) {
            try {
                await axiosInstance.put(`/tasks/${taskData.id}/`, 
                    { ...taskData, status: newStatus }, 
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
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

            <div className="task-form">
                <h2 className="add-task-heading">Add Task</h2>
                <TaskForm fetchTasks={fetchTasks} editingTask={editingTask} setEditingTask={setEditingTask} onSaveTask={handleSaveTask} />
            </div>

            <div className="task-columns">
                <div className="task-column" onDrop={(event) => handleDrop(event, 'To Do')} onDragOver={(event) => event.preventDefault()}>
                    <h3 className="column-heading1">To Do</h3>
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
                    <h3 className="column-heading2">In Progress</h3>
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
                    <h3 className="column-heading3">Done</h3>
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
