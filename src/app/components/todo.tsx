"use client";
import React, { useState, useEffect } from 'react';

type Todo = {
    id: number;
    task: string;
    completed: boolean;
};

const TodoList: React.FC = () => {
    const [newTask, setNewTask] = useState('');
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const fetchTodos = async () => {
            const response = await fetch('/api/todos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch todos', await response.text());
                return;
            }

            const todos: Todo[] = await response.json();
            setTodos(todos);
        };

        fetchTodos();
    }, []);

    const addTodo = async () => {
        if (!newTask.trim()) return;

        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: newTask }),
        });

        if (!response.ok) {
            console.error('Failed to add todo', await response.text());
            return;
        }

        const newTodo: Todo = await response.json();
        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setNewTask('');
    };

    const deleteTodo = async (id: number) => {
        const response = await fetch('/api/todos', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            console.error('Failed to delete todo', await response.text());
            return;
        }

        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    const toggleTodo = async (id: number) => {
        const response = await fetch('/api/todos', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            console.error('Failed to toggle todo', await response.text());
            return;
        }

        const updatedTodo: Todo = await response.json();
        setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                    className="flex-grow p-2 border rounded"
                />
                <button
                    onClick={addTodo}
                    className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id} className="flex items-center mb-2 bg-slate-50 p-2 justify-start">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            className="mr-2"
                        />
                        <span className={todo.completed ? 'line-through' : ''}>
                            {todo.task}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="ml-2 p-1 bg-red-500 text-white rounded hover:bg-red-600 justify-self-end"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
