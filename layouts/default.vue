<template>
  <div>
    <header>
      <div class="header-container">
        <h1>{{ pageTitle }}</h1>
        <NuxtLink to="/">
          <span>首頁</span>
        </NuxtLink>
        <NuxtLink to="/about">
          <span>關於我</span>
        </NuxtLink>
      </div>


      <div class="login-button">
        <i class="material-icons" @click="showModal = true">login</i>
      </div>
    </header>
    <div v-if="showModal" class="modal-container" @click="closeModal">
      <div class="modal" @click.stop>
        <span class="close" @click.stop="closeModal">&times;</span>
        <div class="modal-content">
          <h3 class="modal-title">
            Log In
          </h3>
          <form class="login-form" @submit.prevent="login">
            <div class="form-group">
              <label for="username" class="label">Username:</label>
              <input id="username" v-model="username" type="text" class="input-field">
            </div>
            <div class="form-group">
              <label for="password" class="label">Password:</label>
              <input id="password" v-model="password" type="password" class="input-field">
            </div>
            <button type="submit" class="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="container">
      <aside>
        <nav>
          <ul>
            <li>

            </li>
            <li>
              <NuxtLink to="/game">
                <span>遊戲</span>
              </NuxtLink>
            </li>
            <li>

            </li>
          </ul>
        </nav>
      </aside>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageTitle: 'My Website',
      showModal: false,
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      // Handle login logic here
      this.username = ''
      this.password = ''
      // You can add your login logic here, e.g., sending a request to your backend
      // After successful login, you can close the modal by setting showModal to false
      this.showModal = false
    },
    closeModal() {
      // Close modal and clear username and password
      this.showModal = false
      this.username = ''
      this.password = ''
    }
  }
}
</script>

<style>
.container {
  display: flex;
  height: 100vh;
  /* Fill the entire viewport height */
}

header {
  padding: 20px;
  background-color: #333;
  color: white;
}

main {
  padding: 20px;
}

aside {
  display: flex;
  flex-direction: column;
  /* Align nav vertically */
  padding: 20px;
  width: 200px;
  background-color: #f4f4f4;
  height: 100%;
  /* Fill the entire container height */
}

nav ul {
  list-style: none;
  padding: 0;
}

.header-container {
  display: flex;
  align-items: center;
  /* 垂直居中對齊 */
}

nav ul li {
  margin-bottom: 10px;
}

nav ul li a {
  text-decoration: none;
  color: #333;
  display: flex;
  justify-content: space-between;
}

nav ul li a span:first-child {
  margin-right: 10px;
}

.modal-container {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  display: flex;
  height: 100vh;
  /* Fill the entire viewport height */
}

.modal {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  position: relative;
}

.modal-content {
  color: #000;
}

.close {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  font-size: 20px;
}

.login-form {
  text-align: center;
}

.label {
  color: #000;
  display: block;
  margin-bottom: 5px;
  float: left;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  color: #fff;
  background-color: #333;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

.login-button {
  float: right;
  align-items: center;
}
</style>
