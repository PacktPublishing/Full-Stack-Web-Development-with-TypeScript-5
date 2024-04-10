import {writable} from 'svelte/store';

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

const initialTasks: Task[] = [
    {id: 1, title: 'Learn Svelte', completed: false},
];

export const tasks = writable<Task[]>(initialTasks);