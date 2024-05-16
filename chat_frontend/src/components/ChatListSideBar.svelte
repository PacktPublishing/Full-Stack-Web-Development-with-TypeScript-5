<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";

  import { navigate } from "svelte-routing";
  import CreateChatPopup from "./CreateChatPopup.svelte";
  import { API_HOST } from "../constants";
  import "../styles/chatList.css";

  let chats: { id: string; name: string }[] = [];
  let errorMessage: string | null = null;
  export let chatId: string | null;

  async function getData() {
    try {
      const response = await axios.get(`${API_HOST}/api/v1/chat/`);
      chats = response.data.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
      errorMessage = "Failed to fetch chats. Please try again later.";
    }
  }

  onMount(async () => {
    await getData();
  });

  let isCreatingNewChat = false;

  function selectChat(chatId: string) {
    navigate(`/${chatId}`);
  }

  function createNewChat() {
    isCreatingNewChat = true;
  }

  async function onCreate(newChatId: string) {
    onClose();
    navigate(`/${newChatId}`);
    await getData();
  }

  function onClose() {
    isCreatingNewChat = false;
  }
</script>

<div class="chat-list-container">
  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {/if}
  {#if isCreatingNewChat}
    <CreateChatPopup {onCreate} {onClose} />
  {/if}
  {#if chats.length === 0}
    <div class="no-chats">No chats available. Create a new one!</div>
  {/if}
  <div class="chat-list">
    {#each chats as chat (chat.id)}
      <div
        class="chat-list-item"
        class:selected={chat.id === chatId}
        on:click={() => selectChat(chat.id)}
        on:keydown|preventDefault={(event) =>
          event.key === "Enter" && selectChat(chat.id)}
        tabindex="0"
        role="button"
      >
        {chat.name}
      </div>
    {/each}
  </div>
  <button on:click={() => createNewChat()}>New Chat</button>
</div>
