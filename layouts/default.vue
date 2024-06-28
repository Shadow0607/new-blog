<template>
  <div>
    <header>
      <div class="header-container">
        <h1>{{ pageTitle }}</h1>
        <div class="badge-container">
          <UBadge
            v-for="(link, index) in filteredLinks"
            :key="index"
          >
            <NuxtLink :to="link.to">
              <span>{{ link.text }}</span>
            </NuxtLink>
          </UBadge>
        </div>
        <div class="login-button">
          <UIcon
            :name="isAuthenticated ? 'line-md:logout' : 'line-md:login'"
            dynamic
            @click="isAuthenticated ? logout() : showModal = true"
            class="login-icon"
          >
            {{ isAuthenticated ? 'logout' : 'login' }}
          </UIcon>
        </div>
      </div>
    </header>
    <div v-if="showModal" class="modal-container" @click="closeModal">
      <div class="modal" @click.stop>
        <span class="close" @click.stop="closeModal">&times;</span>
        <div class="modal-content">
          <h3 class="modal-title">{{ isAuthenticated ? 'Log Out' : 'Log In' }}</h3>
          <form v-if="isAuthenticated" class="logout-form">
            <p>Are you sure you want to log out?</p>
            <button @click.prevent="logout" class="submit-button">Logout</button>
          </form>
          <form v-else class="login-form" @submit.prevent="login">
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


<script setup>
import { ref } from 'vue';
import { useNuxtApp } from '#app';

const pageTitle = ref('My Website');
const showModal = ref(false);
const username = ref('');
const password = ref('');
const isAuthenticated = ref(false);

const links = [
  { text: '首頁', to: '/' },
  { text: '文章', to: '/article' },
  { text: '遊戲', to: '/game' },
  { text: '關於我', to: '/about' },
];

const filteredLinks = computed(() =>
  links.filter(link => isAuthenticated.value || link.text !== '文章')
);

const nuxtApp = useNuxtApp();

const login = async () => {
  try {
    // 處理登入邏輯...
    isAuthenticated.value = true;  // 假設登入成功
    showModal.value = false;
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again later.');
  } finally {
    username.value = '';
    password.value = '';
  }
};

const logout = () => {
  // 處理登出邏輯...
  isAuthenticated.value = false;
  showModal.value = false;
};

const closeModal = () => {
  showModal.value = false;
  username.value = '';
  password.value = '';
};
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
