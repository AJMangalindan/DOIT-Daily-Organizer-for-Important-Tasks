import React, { useState, useEffect } from "react";
import DoIt from './assets/DOIT LOGO.png'
import { FaTrash, FaCheck, FaUndo, FaEdit, FaSave } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function handleInputChange(e) {
        setNewTask(e.target.value);
    }

    function addTasks() {
        const task = newTask.trim();
        if (task !== "") {
            setTasks(t => [...t, { text: task, completed: false }]);
            setNewTask("");
        }
    }

    function deleteTask(index) {
        setTasks(tasks.filter((_, i) => i !== index));
    }

    function toggleDone(index) {
        setTasks(tasks =>
            tasks.map((task, i) =>
                i === index ? { ...task, completed: !task.completed } : task
            )
        );
    }

    function startEdit(index) {
        setEditIndex(index);
        setEditText(tasks[index].text);
    }

    function saveEdit(index) {
        const trimmed = editText.trim();
        if (trimmed !== "") {
            setTasks(tasks =>
                tasks.map((task, i) =>
                    i === index ? { ...task, text: trimmed } : task
                )
            );
        }
        setEditIndex(null);
        setEditText("");
    }

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) return;

        const reordered = Array.from(tasks);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        setTasks(reordered);
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
                        if (e.key === "Enter") addTasks();
                    }}
                />
                <button className="add-btn" onClick={addTasks}>Add</button>
            </div>

            <p>
                Completed: {tasks.filter(task => task.completed).length} / {tasks.length}
            </p>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="task-list">
                    {(provided) => (
                        <ol
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {tasks.map((task, index) => (
                                <Draggable
                                    key={index}
                                    draggableId={String(index)}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                background: snapshot.isDragging ? "#ffe8b0" : "",
                                                boxShadow: snapshot.isDragging ? "0 8px 20px rgba(0,0,0,0.15)" : "",
                                            }}
                                        >
                                            {editIndex === index ? (
                                                <input
                                                    className="edit-input"
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") saveEdit(index);
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className={task.completed ? "text completed" : "text"}>
                                                    {task.text}
                                                </span>
                                            )}

                                            <button className="done-btn" onClick={() => toggleDone(index)}>
                                                {task.completed ? <FaUndo /> : <FaCheck />}
                                            </button>

                                            <button className="delete-btn" onClick={() => deleteTask(index)}>
                                                <FaTrash />
                                            </button>

                                            {editIndex === index ? (
                                                <button className="save-btn" onClick={() => saveEdit(index)}>
                                                    <FaSave />
                                                </button>
                                            ) : (
                                                <button className="edit-btn" onClick={() => startEdit(index)}>
                                                    <FaEdit />
                                                </button>
                                            )}

                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ol>
                    )}
                </Droppable>
            </DragDropContext>

        </div>
    );
}

export default ToDo;