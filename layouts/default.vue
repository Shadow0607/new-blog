<template>
  <div>
    <header>
      <div class="header-container">
        <h1>{{ pageTitle }}</h1>
        <div class="badge-container">
          <UBadge v-for="(link, index) in filteredLinks" :key="index">
            <NuxtLink :to="link.to">
              <span>{{ link.text }}</span>
            </NuxtLink>
          </UBadge>
        </div>
        <div class="login-button">
          <UIcon :name="isAuthenticated ? 'line-md:logout' : 'line-md:login'" dynamic @click="handleLoginClick"
            class="login-icon">
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
          <form v-else class="login-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="username" class="label">Username:</label>
              <input id="username" v-model="username" type="text" class="input-field" @blur="validateUsername" required>
              <span v-if="errors.username" class="error">{{ errors.username }}</span>
            </div>
            <div class="form-group">
              <label for="password" class="label">Password:</label>
              <input id="password" v-model="password" type="password" class="input-field" @blur="validatePassword"
                required>
              <span v-if="errors.password" class="error">{{ errors.password }}</span>
            </div>
            <div class="form-group captcha-group">
              <label for="captcha" class="label">Captcha:</label>
              <img :src="captchaSvg" @click="refreshCaptcha" class="captcha-image" alt="Captcha">
              <input id="captcha" v-model="captchaAnswer" type="text" class="input-field captcha-input" required>
            </div>
            <div class="form-group">
              <input type="checkbox" id="remember" v-model="rememberMe">
              <label for="remember">Remember me</label>
            </div>
            <button type="submit" class="submit-button" :disabled="isSubmitting">
              {{ isSubmitting ? 'Logging in...' : 'Login' }}
            </button>
          </form>
          <div class="links">
            <a href="#" @click.prevent="forgotPassword">Forgot password?</a>
            <a href="#" @click.prevent="registerAccount">Register account</a>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const { $generateCaptcha } = useNuxtApp();
const pageTitle = ref('My Website');
const showModal = ref(false);
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const isAuthenticated = ref(false);
const isSubmitting = ref(false);
const captchaSvg = ref('');
const captchaAnswer = ref('');
let correctCaptchaText = '';
const nuxtApp = useNuxtApp();

const errors = reactive({
  username: '',
  password: ''
});

const links = [
  { text: '首頁', to: '/' },
  { text: '文章', to: '/article' },
  { text: '遊戲', to: '/game' },
  { text: '關於我', to: '/about' },
];

const filteredLinks = computed(() =>
  links.filter(link => isAuthenticated.value || link.text !== '文章')
);

const validateField = (field, value, minLength, errorMessage) => {
  errors[field] = value.length < minLength ? errorMessage : '';
};

const validateUsername = () => validateField('username', username.value, 3, 'Username must be at least 3 characters long');
const validatePassword = () => validateField('password', password.value, 6, 'Password must be at least 6 characters long');

const refreshCaptcha = () => {
  const { svg, text } = $generateCaptcha();
  captchaSvg.value = svg;
  correctCaptchaText = text;
  captchaAnswer.value = '';
};

onMounted(refreshCaptcha);

const validateCaptcha = () => captchaAnswer.value.toLowerCase() === correctCaptchaText.toLowerCase();

const handleLoginClick = () => {
  console.log('Login button clicked');
  if (isAuthenticated.value) {
    logout();
  } else {
    console.log('Setting showModal to true');
    showModal.value = true;
  }
};

const handleSubmit = async () => {
  validateUsername();
  validatePassword();

  if (errors.username || errors.password) return;

  if (!validateCaptcha()) {
    alert('Incorrect captcha answer');
    refreshCaptcha();
    return;
  }

  try {
    const response = await nuxtApp.$auth.authenticate(username.value, password.value);
    if (response.results) {  // 使用你的 API 回應的正確屬性
      isAuthenticated.value = true;
      showModal.value = false;
    } else {
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again later.');
  } finally {
    username.value = '';
    password.value = '';
    refreshCaptcha();
    isSubmitting.value = false;
  }
};

const logout = () => {
  isAuthenticated.value = false;
  showModal.value = false;
};

const closeModal = () => {
  showModal.value = false;
  username.value = password.value = '';
  errors.username = errors.password = '';
};

const forgotPassword = () => console.log('Forgot password clicked');
const registerAccount = () => console.log('Register account clicked');
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

.error {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}

.captcha-input {
  width: 100%;
  display: inline-block;
}

.captcha-image {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.links {
  margin-top: 15px;
  text-align: center;
}

.links a {
  margin: 0 10px;
  color: #007bff;
  text-decoration: none;
}
.captcha-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

</style>
