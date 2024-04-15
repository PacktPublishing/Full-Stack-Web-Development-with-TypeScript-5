<script>
  import { Route, Router } from "svelte-routing";
  import Register from "./routes/Register.svelte";
  import Login from "./routes/Login.svelte";
  import Chat from "./routes/Chat.svelte";
</script>

<Router>
  <Route path="/register" component={Register} />
  <Route path="/login" component={Login} />
  <Route >
    <Chat chatId={null} />
  </Route>
  <Route path="/:id"  let:params  >
    <Chat chatId={params.id} />
  </Route>
</Router>
