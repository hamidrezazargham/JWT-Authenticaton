import React, { useState, useEffect } from 'react';
import './TaskForm.css'; // Import the CSS for styling

const TaskForm = ({ fetchTasks, editingTask, setEditingTask, onSaveTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('To Do'); // Default status

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
            setStatus(editingTask.status);
        } else {
            setTitle('');
            setDescription('');
            setStatus('To Do');
        }
    }, [editingTask]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const taskData = { title, description, status };
        onSaveTask(taskData);
        clearForm();
    };

    const clearForm = () => {
        setEditingTask(null);
        setTitle('');
        setDescription('');
        setStatus('To Do');
    };

    return (
        <div className="task-form-container">
            <form className="task-form" 
                onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="task-title">Task Title:</label>
                    <input
                        id="task-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter task title"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="task-description">Description:</label>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Enter task description"
                    ></textarea>
                </div>
                <div className="input-group">
                    <label htmlFor="task-status">Status:</label>
                    <select
                        id="task-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button">
                        {editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                    {editingTask && (
                        <button type="button" className="cancel-button" onClick={clearForm}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
