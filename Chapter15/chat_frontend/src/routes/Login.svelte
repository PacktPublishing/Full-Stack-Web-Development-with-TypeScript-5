<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import axios from "axios";
  import "../styles/auth.css";
  import { authToken } from "../stores/auth";
  import { API_HOST } from "../constants";

  let email = "";
  let password = "";
  let errorMessage = "";
  $: formValid = email.length > 0 && password.length > 0;

  onMount(() => {
    if ($authToken) {
      navigate("/");
    }
  });

  async function login() {
    try {
      const response = await axios.post(`${API_HOST}/api/v1/auth/login/`, {
        email,
        password,
      });
      authToken.set(response.data?.token);
      navigate("/");
    } catch (error) {
      const defaultError = "An unexpected error occurred";
      if (axios.isAxiosError(error) && error.response) {
        const errorSlug = error?.response?.data?.error;
        switch (errorSlug) {
          case "INVALID_CREDENTIALS":
            errorMessage = "Invalid email or password";
            break;
          default:
            errorMessage = defaultError;
        }
      } else {
        errorMessage = defaultError;
      }
    }
  }
</script>

<div class="auth-container">
  <form on:submit|preventDefault={login} class="auth-form">
    <div class="form-header">
      <h2>Login</h2>
    </div>
    {#if errorMessage}
      <div class="error">{errorMessage}</div>
    {/if}
    <div class="input-group">
      <input type="email" placeholder="Email" bind:value={email} required />
    </div>
    <div class="input-group">
      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        required
      />
    </div>
    <div class="action-group">
      <button type="submit" class="auth-btn" disabled={!formValid}
        >Sign in</button
      >
    </div>
    <div class="switch-auth">
      Don't have an account? <a href="/register">Register here</a>.
    </div>
  </form>
</div>
