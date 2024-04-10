<script lang="ts">
    interface Task {
        id: number;
        name: string;
        completed: boolean;
    }

    let tasks: Task[] = [
        {id: 1, name: 'Learn Svelte', completed: false},
        {id: 2, name: 'Build an app', completed: false},
    ];

    function toggleTaskCompletion(taskId: number) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
        }
    }
</script>

{#if tasks.length === 0}
    <p>No tasks found. Add some tasks!</p>
{:else}
    <ul>
        {#each tasks as task}
            <li on:click={() => toggleTaskCompletion(task.id)}>
                <input type="checkbox" bind:checked={task.completed}/> {task.name}
            </li>
        {/each}
    </ul>
{/if}
