<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import axios from "axios";
  import "../styles/auth.css";
  import { authToken } from "../stores/auth";
  import { API_HOST } from "../constants";
  let name = "";
  let email = "";
  let password = "";
  let errorMessage = "";

  onMount(() => {
    if ($authToken) {
      navigate("/");
    }
  });

  async function register() {
    try {
      await axios.post(`${API_HOST}/api/v1/auth/register/`, {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      const defaultError = "An unexpected error occurred";
      if (axios.isAxiosError(error) && error.response) {
        const errorSlug = error?.response?.data?.error;
        switch (errorSlug) {
          case "ERROR_USER_ALREADY_EXIST":
            errorMessage = "User already exists, try logging in instead";
            break;
          default:
            errorMessage = defaultError;
        }
      } else {
        errorMessage = defaultError;
      }
    }
  }

  $: formValid = email.length > 0 && password.length > 0 && name.length > 0;
</script>

<div class="auth-container">
  <form on:submit|preventDefault={register} class="auth-form">
    <div class="form-header">
      <h2>Create Account</h2>
    </div>
    {#if errorMessage}
      <div class="error">{errorMessage}</div>
    {/if}
    <div class="input-group">
      <input type="text" placeholder="Name" bind:value={name} required />
    </div>
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
        >Sign Up</button
      >
    </div>
    <div class="switch-auth">
      Already have an account? <a href="/login">Sign in here.</a>
    </div>
  </form>
</div>
