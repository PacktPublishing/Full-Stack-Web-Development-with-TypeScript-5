<script lang="ts">
  import { navigate } from "svelte-routing";
  import axios from "axios";
  import "../styles/auth.css";

  let name = "";
  let email = "";
  let password = "";
  let errorMessage = "";

  const API_HOST = import.meta.env.VITE_API_HOST; // Ensure to set your API_HOST in .env file

  async function register() {
    try {
      await axios.post(`${API_HOST}/api/v1/auth/register/`, {
        name,
        email,
        password,
      });
      navigate("/login/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response?.data?.message;
      } else {
        errorMessage = "An unexpected error occurred";
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
