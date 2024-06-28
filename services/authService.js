// services/authService.js
export default {
    async authenticate(username, password) {
      const apiUrl = 'http://localhost/123/Account';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    },
    logout() {
      // 清理驗證狀態，例如清除 token 或 session
      return Promise.resolve();
    }
  }
  