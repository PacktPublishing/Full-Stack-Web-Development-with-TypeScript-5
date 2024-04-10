<script lang="ts">
    import {onMount} from "svelte";
    import {navigate} from "svelte-routing";
    import {authToken} from "../stores/auth";
    import ChatListSideBar from "../components/ChatListSideBar.svelte";
    import ChatDetails from "../components/ChatDetails.svelte";

    export let chatId: string | null;

    onMount(() => {
        if (!$authToken) {
            navigate("/register");
        }
    });
</script>

<div>
    <ChatListSideBar/>
    {#if chatId}
        <ChatDetails chatId={chatId}/>
    {/if}
    <button on:click={() => {
      authToken.remove();
      navigate("/login");
  }}>
        Log out
    </button>
</div>

<style>
    /* Add your styles here */
</style>
