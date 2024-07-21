import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const todosFilePath = path.join(process.cwd(), 'src', 'db', 'todos.json');

type Todo = {
    id: number;
    task: string;
    completed: boolean;
};

export async function POST(req: Request) {
    const { task } = await req.json();

    return new Promise<void | Response>((resolve) => {
        fs.readFile(todosFilePath, 'utf8', (err, data) => {
            if (err) {
                return resolve(NextResponse.json({ error: 'Failed to read todos' }, { status: 500 }));
            }

            let todos: Todo[] = [];
            try {
                todos = JSON.parse(data);
            } catch (e) {
                todos = [];
            }

            const newTodo: Todo = { id: Date.now(), task, completed: false };
            todos.push(newTodo);

            fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), (err) => {
                if (err) {
                    return resolve(NextResponse.json({ error: 'Failed to save todo' }, { status: 500 }));
                }
                resolve(NextResponse.json(newTodo, { status: 201 }));
            });
        });
    });
}

export async function GET() {
    return new Promise<void | Response>((resolve) => {
        fs.readFile(todosFilePath, 'utf8', (err, data) => {
            if (err) {
                return resolve(NextResponse.json({ error: 'Failed to read todos' }, { status: 500 }));
            }

            let todos: Todo[] = [];
            try {
                todos = JSON.parse(data);
            } catch (e) {
                todos = [];
            }

            resolve(NextResponse.json(todos, { status: 200 }));
        });
    });
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    return new Promise<void | Response>((resolve) => {
        fs.readFile(todosFilePath, 'utf8', (err, data) => {
            if (err) {
                return resolve(NextResponse.json({ error: 'Failed to read todos' }, { status: 500 }));
            }

            let todos: Todo[] = [];
            try {
                todos = JSON.parse(data);
            } catch (e) {
                todos = [];
            }

            todos = todos.filter((todo) => todo.id !== id);

            fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), (err) => {
                if (err) {
                    return resolve(NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 }));
                }
                resolve(NextResponse.json({ id }, { status: 200 }));
            });
        });
    });
}

export async function PATCH(req: Request) {
    const { id } = await req.json();

    return new Promise<void | Response>((resolve) => {
        fs.readFile(todosFilePath, 'utf8', (err, data) => {
            if (err) {
                return resolve(NextResponse.json({ error: 'Failed to read todos' }, { status: 500 }));
            }

            let todos: Todo[] = [];
            try {
                todos = JSON.parse(data);
            } catch (e) {
                todos = [];
            }

            const index = todos.findIndex((todo) => todo.id === id);
            if (index !== -1) {
                todos[index].completed = !todos[index].completed;
            }

            fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), (err) => {
                if (err) {
                    return resolve(NextResponse.json({ error: 'Failed to update todo' }, { status: 500 }));
                }
                resolve(NextResponse.json(todos[index], { status: 200 }));
            });
        });
    });
}
