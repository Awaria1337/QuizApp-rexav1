import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';

export async function GET() {
    try {
        await dbConnect();
        const tasks = await Task.find({}).sort({ createdAt: -1 });
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        await dbConnect();
        const task = await Task.create(data);
        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();
        const { id, ...updateData } = data;
        
        await dbConnect();
        const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }
        
        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        
        await dbConnect();
        const task = await Task.findByIdAndDelete(id);
        
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
