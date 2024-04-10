<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";

  import { navigate } from "svelte-routing";
  import CreateChatPopup from "./CreateChatPopup.svelte";
  const API_HOST = import.meta.env.VITE_API_HOST;
  // TODO models
  let chats: { id: string; name: string }[] = [];

  onMount(async () => {
    try {
      const response = await axios.get(`${API_HOST}/api/v1/chat/`);
      chats = response.data.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  });

  let isCreatingNewChat = true;

  function selectChat(chatId: string) {
    navigate(`/${chatId}`);
  }

  function createNewChat() {
    isCreatingNewChat = true;
  }
</script>

<div>
  {isCreatingNewChat}
  {#if isCreatingNewChat}
    <CreateChatPopup />
  {/if}
  <button on:click={() => createNewChat()}>New Chat</button>
  <ul>
    {#each chats as chat}
      <li on:click={() => selectChat(chat.id)}>
        {chat.name}
      </li>
    {/each}
  </ul>
</div>
