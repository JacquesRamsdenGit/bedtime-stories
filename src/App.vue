

<script setup lang="ts">
// import { useI18n } from 'vue-i18n';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
// Optional: persist language selection

// Persist language selection
watch(locale, (val) => {
  localStorage.setItem('lang', val);
  // Set document title on language change
  document.title = t('appTitle');
});
if (localStorage.getItem('lang')) {
  locale.value = localStorage.getItem('lang')!;
}
// Set initial document title
document.title = t('appTitle');

</script>


<template>
  <div class="app-container">
    <div class="top-bar">
      <div style="flex:1; display:flex; align-items:center;">
        <button
          v-if="route.name === 'StoryReader'"
          class="home-btn"
          @click="router.push('/')"
          aria-label="Home"
        >
          <svg class="home-icon" xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 24 24" fill="none" stroke="#22223b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12L12 3l9 9"/><path d="M9 21V9h6v12"/></svg>
        </button>
      </div>
      <div class="lang-dropdown-container">
        <select v-model="locale" class="lang-dropdown" aria-label="Select language">
          <option value="en">English</option>
          <option value="af">Afrikaans</option>
        </select>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.app-container {

  background: linear-gradient(180deg, #22223b 0%, #4a4e69 100%);
  font-family: 'Quicksand', 'Arial Rounded MT Bold', Arial, sans-serif;
}
.top-bar {
  position: fixed;
  top: 1.5rem;
  left: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}
.home-btn {
  background: #f2e9e4;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(44, 44, 84, 0.08);
  margin-right: 1.5rem;
  transition: background 0.2s;
}
.home-btn:focus {
  outline: 2px solid #9a8c98;
}
.home-icon {
  display: block;
  min-width: 1rem;
}
.lang-dropdown-container {
  /* Now inside .top-bar */
}
.lang-dropdown {
  background: #f2e9e4;
  color: #22223b;
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(44, 44, 84, 0.1);
}
</style>

