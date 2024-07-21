import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const todosFilePath = path.join(process.cwd(), 'src', 'db', 'todos.json');

type Todo = {
    id: number;
    task: string;
    completed: boolean;
};

export async function GET() {
    try {
        const data = await fs.readFile(todosFilePath, 'utf8');
        const todos: Todo[] = JSON.parse(data);
        return NextResponse.json(todos, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read todos' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { task } = await req.json();

        const data = await fs.readFile(todosFilePath, 'utf8');
        const todos: Todo[] = JSON.parse(data);

        const newTodo: Todo = { id: Date.now(), task, completed: false };
        todos.push(newTodo);

        await fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2));
        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add todo' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        const data = await fs.readFile(todosFilePath, 'utf8');
        let todos: Todo[] = JSON.parse(data);

        todos = todos.filter((todo) => todo.id !== id);

        await fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2));
        return NextResponse.json({ id }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id } = await req.json();

        const data = await fs.readFile(todosFilePath, 'utf8');
        const todos: Todo[] = JSON.parse(data);

        const index = todos.findIndex((todo) => todo.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        todos[index].completed = !todos[index].completed;

        await fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2));
        return NextResponse.json(todos[index], { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
    }
}
