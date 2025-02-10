import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Task from '@/models/Task';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id).select('completedTasks');
        const tasks = await Task.find({ status: 'active' });

        const tasksWithProgress = tasks.map(task => {
            const isCompleted = user.completedTasks.some(
                ct => ct.taskId.toString() === task._id.toString()
            );

            return {
                ...task.toObject(),
                isCompleted
            };
        });

        return NextResponse.json(tasksWithProgress);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { taskId } = await request.json();

        const task = await Task.findById(taskId);
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if task is already completed
        const isCompleted = user.completedTasks.some(
            ct => ct.taskId.toString() === taskId
        );

        if (isCompleted) {
            return NextResponse.json({ error: 'Task already completed' }, { status: 400 });
        }

        // Add task to completed tasks
        user.completedTasks.push({ taskId });

        // Add rewards
        await user.addXP(task.reward.xp);
        user.gems += task.reward.gems || 0;
        user.hearts += task.reward.hearts || 0;

        await user.save();

        return NextResponse.json({ 
            message: 'Task completed successfully',
            rewards: task.reward,
            newLevel: user.level,
            newXP: user.xp
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
