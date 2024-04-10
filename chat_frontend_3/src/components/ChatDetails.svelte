<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";

  export let chatId: string;
  const API_HOST = import.meta.env.VITE_API_HOST;
  let messages: { message: string }[] = [];
  let newMessage = "";
  console.log('here')
  onMount(async () => {
    await loadMessages();
  });

  async function loadMessages() {
    try {
      const response = await axios.get(
        `${API_HOST}/api/v1/chat/${chatId}/message/`
      );
      messages = response.data.data;
      console.log(messages)
      console.log(response.data.data)
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  async function sendMessage() {
    try {
      const response = await axios.post(
        `${API_HOST}/api/v1/chat/${chatId}/message/`,
        { message: newMessage }
      );
      messages = [...messages, {message:newMessage}, response.data.data];
      newMessage = "";
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
</script>

<div>
  <ul>
    {#each messages as message}
      <li>{message.message}</li>
    {/each}
  </ul>
  <textarea bind:value={newMessage} placeholder="Type a message"></textarea>
  <button on:click={sendMessage}>Send</button>
</div>
