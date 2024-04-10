<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    let count: number = 0;
    const dispatch = createEventDispatcher<{ reset: void }>();

    function increment() {
        count += 1;
    }

    function handleResetClick(event: MouseEvent) {
        count = 0;
        dispatch('reset'); // Dispatching a custom event named 'reset'
    }
</script>

<button on:click={increment}>Increment</button>
<button on:click|preventDefault={handleResetClick}>Reset</button>