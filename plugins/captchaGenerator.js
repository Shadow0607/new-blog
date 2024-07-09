// plugins/captchaGenerator.js

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      generateCaptcha: () => {
        if (process.client) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 120;
          canvas.height = 30;

          // 生成隨機的驗證碼文字
          const text = Math.random().toString(36).substr(2, 7).toUpperCase();

          // 繪製背景
          ctx.fillStyle = '#f0f0f0';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 繪製文字
          ctx.fillStyle = '#333';
          ctx.font = '20px Arial';
          ctx.fillText(text, 10, 23);

          // 添加一些干擾線
          for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
          }

          return {
            svg: canvas.toDataURL(), // 返回 base64 編碼的圖片
            text: text
          };
        }
        return { svg: '', text: '' };
      }
    }
  };
});