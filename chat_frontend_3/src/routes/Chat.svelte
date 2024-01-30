<script lang="ts">
  import ChatListSideBar from "../components/ChatListSideBar.svelte";
  import ChatDetails from "../components/ChatDetails.svelte";
  import SelectChat from "../components/SelectChat.svelte";
  import Logout from "../components/Logout.svelte";

  export let id: string | undefined = undefined;
</script>

<div>
  <ChatListSideBar />
  {#if id}
    <ChatDetails chatId={id} />
  {:else}
    <SelectChat />
  {/if}
  <Logout />
</div>

<style>
  /* Add your styles here */
</style>
