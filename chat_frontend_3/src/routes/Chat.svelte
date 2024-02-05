<script lang="ts">
  import { onMount } from "svelte";
  import { Router, Route, navigate } from "svelte-routing";
  import { authToken } from "../stores/auth";
  import ChatListSideBar from "../components/ChatListSideBar.svelte";
  import ChatDetails from "../components/ChatDetails.svelte";

  onMount(() => {
    if (!$authToken) {
      navigate("/register");
    }
  });
</script>

<div>
  <ChatListSideBar />
  <Router>
    <Route path="/" />
    <Route path="/:id" let:params>
      <ChatDetails chatId={params.id} />
    </Route>
  </Router>
</div>

<style>
  /* Add your styles here */
</style>
