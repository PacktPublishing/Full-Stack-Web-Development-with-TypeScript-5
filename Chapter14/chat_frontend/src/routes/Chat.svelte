<script lang="ts">
    import {onMount} from "svelte";
    import {navigate} from "svelte-routing";
    import {authToken} from "../stores/auth";
    import ChatListSideBar from "../components/ChatListSideBar.svelte";
    import ChatDetails from "../components/ChatDetails.svelte";
    import Header from "../components/Header.svelte";
    import '../styles/chat.css'
    export let chatId: string | null;

    onMount(() => {
        if (!$authToken) {
            navigate("/register");
        }
    });
</script>

<div>
    <Header></Header>
    <div class="container">
        <div class="chat-list-container">
            <ChatListSideBar chatId={chatId}/>

        </div>
        <div class="chat-container">
            {#if chatId}
                <ChatDetails chatId={chatId}/>
            {/if}
        </div>
    </div>
</div>
