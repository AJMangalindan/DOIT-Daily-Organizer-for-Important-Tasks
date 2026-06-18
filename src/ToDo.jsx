import React, { useState, useEffect } from "react";
import DoIt from './assets/DOIT LOGO.png'
import { FaTrash, FaCheck, FaUndo } from "react-icons/fa";

function ToDo() {

   const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");

    return saved
        ? JSON.parse(saved)
        : [
            { text: "Eat Breakfast", completed: false },
            { text: "Clean Room", completed: true },
          ];
    });

    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function handleInputChange(e) {
        setNewTask(e.target.value);
    }

    function addTasks() {
        const task = newTask.trim();

        if (task !== "") {
            setTasks(t => [
                ...t,
                {
                    text: task,
                    completed: false
                }
            ]);

            setNewTask("");
        }
    }

    function deleteTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function toggleDone(index) {
        setTasks(tasks =>
            tasks.map((task, i) =>
                i === index
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    }

    return (
        <div className="to-do-list">

            <img className="logo" src={DoIt} alt="Product Picture" />
            <h1>Daily Organizer for Important Tasks</h1>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <input
                    type="text"
                    placeholder="Enter a Task..."
                    value={newTask}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addTasks();
                        }
                    }}
                />

                <button
                    className="add-btn"
                    onClick={addTasks}
                >
                    Add
                </button>
            </div>

            <p>
                Completed: {tasks.filter(task => task.completed).length} / {tasks.length}
            </p>

            <ol>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <span
                            className={
                                task.completed
                                    ? "text completed"
                                    : "text"
                            }
                        >
                            {task.text}
                        </span>

                        <button
                            className="done-btn"
                            onClick={() => toggleDone(index)}
                        >
                            {task.completed ? <FaUndo /> : <FaCheck />}
                        </button>

                        <button
                            className="delete-btn"
                            onClick={() => deleteTask(index)}
                        >
                            <FaTrash />
                        </button>

                    </li>
                ))}
            </ol>

        </div>
    );
}

export default ToDo;