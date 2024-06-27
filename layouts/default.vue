<template>
  <div>
    <header>
      <div class="header-container">
        <h1>{{ pageTitle }}</h1>
        <div class="badge-container">
          <UBadge
            v-for="(link, index) in links"
            :key="index"
          >
            <NuxtLink :to="link.to">
              <span>{{ link.text }}</span>
            </NuxtLink>
          </UBadge>
        </div>
        <div class="login-button">
          <UIcon name="line-md:account" dynamic @click="showModal = true" class="login-icon">login</UIcon>
        </div>
      </div>
    </header>
    <div v-if="showModal" class="modal-container" @click="closeModal">
      <div class="modal" @click.stop>
        <span class="close" @click.stop="closeModal">&times;</span>
        <div class="modal-content">
          <h3 class="modal-title">Log In</h3>
          <form class="login-form" @submit.prevent="login">
            <div class="form-group">
              <label for="username" class="label">Username:</label>
              <input id="username" v-model="username" type="text" class="input-field">
            </div>
            <div class="form-group">
              <label for="password" class="label">Password:</label>
              <input id="password" v-model="password" type="password" class="input-field">
            </div>
            <button type="submit" class="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
    <div class="container">
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
      password: '',
      links: [
        {text: '首頁', to: '/' },
        {text: '關於我', to: '/about' },
        {text: '遊戲', to: '/game' },
      ]
    }
  },
  methods: {
    login() {
      this.username = ''
      this.password = ''
      this.showModal = false
    },
    closeModal() {
      this.showModal = false
      this.username = ''
      this.password = ''
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.header-container {
  display: flex;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 20px;
}

.badge-container {
  display: flex;
  align-items: left;
}

.login-button {
  margin-left: auto;
  cursor: pointer;
}

.login-icon {
  font-size: 24px;
}

.container {
  display: flex;
  height: 100vh;
}

aside {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav ul li {
  margin-bottom: 10px;
}

nav ul li a {
  text-decoration: none;
  color: #333;
}

.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  display: block;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #555;
}
</style>
