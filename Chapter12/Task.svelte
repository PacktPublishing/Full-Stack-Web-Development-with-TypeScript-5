<script lang="ts">
    import {tasks} from './stores/taskStore';

    function toggleCompletion(taskId: number) {
        tasks.update(allTasks =>
            allTasks.map(task =>
                task.id === taskId ? {...task, completed: !task.completed} : task
            )
        );
    }
</script>

<ul>
    {#each $tasks as task}
        <li on:click={() => toggleCompletion(task.id)}>
            <input type="checkbox" bind:checked={task.completed}/> {task.title}
        </li>
    {/each}
</ul>
