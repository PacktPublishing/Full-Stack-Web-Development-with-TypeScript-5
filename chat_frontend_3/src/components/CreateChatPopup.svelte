<script lang="ts">
  import axios from 'axios';
  import { writable } from 'svelte/store';

  const API_HOST = import.meta.env.VITE_API_HOST;
  const chatName = writable('');

  async function createChat() {
    try {
      const response = await axios.post(`${API_HOST}/api/v1/chat/`, { name: $chatName });
      // Handle the response, close the popup, and maybe navigate to the new chat
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }
</script>

<div>
  <input type="text" bind:value={$chatName} placeholder="Enter chat name" />
  <button on:click={createChat}>Create</button>
</div>
