<script lang="ts">
    import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte';
    let count: number = 0;
    onMount(() => {
        console.log('Component mounted');
    });
    beforeUpdate(() => {
        console.log('Component will update');
    });
    afterUpdate(() => {
        console.log('Component updated');
    });
    onDestroy(() => {
        console.log('Component will be destroyed');
    });

    function increment() {
        count += 1;
    }
</script>

<button on:click={increment}>Increment</button>
<p>Count: {count}</p>