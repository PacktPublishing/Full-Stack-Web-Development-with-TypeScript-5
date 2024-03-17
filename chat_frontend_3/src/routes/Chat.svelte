<script lang="ts">
  import { onMount } from "svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import { authToken } from "../stores/auth";
  import ChatListSideBar from "../components/ChatListSideBar.svelte";
  import ChatDetails from "../components/ChatDetails.svelte";
  export let chatId: string;

  onMount(() => {
    if (!$authToken) {
      navigate("/register");
    }
  });
</script>

<div>
  <ChatListSideBar />
  {#if chatId}
    <ChatDetails chatId={chatId} />
  {/if}
</div>

<style>
  /* Add your styles here */
</style>
