<template>
  <div v-if="isLocked" class="auth-lock">
    <div class="lock-container">
      <div class="lock-header">
        <n-icon size="48" color="var(--n-color-primary)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M336 208v-95a80 80 0 0 0-160 0v95" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
            <rect x="96" y="208" width="320" height="272" rx="48" ry="48" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/>
          </svg>
        </n-icon>
        <n-h2 style="margin: 0">访问受限</n-h2>
      </div>
      <n-text depth="3">此站点已开启私有化访问限制</n-text>
      <n-input
        v-model:value="password"
        type="password"
        placeholder="请输入访问密码"
        show-password-on="click"
        @keydown.enter="verify"
        :status="error ? 'error' : undefined"
      />
      <n-button type="primary" block @click="verify" :loading="loading">
        解锁进入
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';

const isLocked = ref(false);
const password = ref("");
const loading = ref(false);
const error = ref(false);
const message = useMessage();

// 读取环境变量
// @ts-ignore
const adminKey = typeof __ADMIN_KEY__ !== 'undefined' ? __ADMIN_KEY__ : "";

onMounted(() => {
  if (adminKey) {
    const savedAuth = localStorage.getItem("splayer_auth");
    if (savedAuth !== adminKey) {
      isLocked.value = true;
    }
  }
});

const verify = () => {
  loading.value = true;
  // 简单模拟延迟，防止爆破
  setTimeout(() => {
    if (password.value === adminKey) {
      localStorage.setItem("splayer_auth", adminKey);
      message.success("验证通过，欢迎回来");
      isLocked.value = false;
      error.value = false;
    } else {
      message.error("密码错误");
      error.value = true;
      password.value = "";
    }
    loading.value = false;
  }, 500);
};
</script>

<style scoped>
.auth-lock {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--n-color-modal);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-container {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  background: var(--n-card-color);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--n-border-color);
  text-align: center;
}

.lock-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
