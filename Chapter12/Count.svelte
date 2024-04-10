<script lang="ts">
    let count: number = 0;

    $: doubled = count * 2;

    function increment() {
        count += 1; // Triggers reactivity
    }
</script>

<button on:click={increment}>
    Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
<p>Doubled Value: {doubled}</p>