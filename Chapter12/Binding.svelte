<script lang="ts">
    let name: string = 'John Doe';
    let favoriteColor: string = 'blue';

    const colors: string[] = ['red', 'green', 'blue', 'yellow'];
</script>

<div>
    <input type="text" bind:value={name}/>
    <select bind:value={favoriteColor}>
        {#each colors as color}
            <option value={color}>{color}</option>
        {/each}
    </select>
</div>

<p>Hello, {name}! Your favorite color is {favoriteColor}.</p>
