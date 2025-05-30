<template>
  <main class="story-list" aria-labelledby="storyListTitle">
    <h1 id="storyListTitle">{{ $t('storyListTitle') }}</h1>
    <div class="search-bar">
      <input
        v-model="searchTerm"
        type="text"
        class="search-input"
        :placeholder="$t('searchPlaceholder') || 'Search stories...'"
        aria-label="Search stories by title"
      />
    </div>
    <ul class="story-list-ul">
      <li v-for="story in filteredStories" :key="story.id" class="story-list-li">
        <StoryCard :story="story" />
      </li>
    </ul>
    <!-- Language selector moved to App.vue -->
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import StoryCard from './StoryCard.vue';

const { locale } = useI18n();
const stories = ref<any[]>([]);
const searchTerm = ref('');
const filteredStories = computed(() => {
  if (!searchTerm.value.trim()) return stories.value;
  return stories.value.filter(story =>
    story.title.toLowerCase().includes(searchTerm.value.trim().toLowerCase())
  );
});

function getLang() {
  return locale.value === 'en' ? 'en' : 'af';
}

async function loadStories() {
  const lang = getLang();
  const files = [
    { id: 'brown-bear-dreams', file: `/stories/brown-bear-dreams.${lang}.json` },
    { id: 'brown-bear-picnic', file: `/stories/brown-bear-picnic.${lang}.json` },
    { id: 'brown-bear-moon', file: `/stories/brown-bear-moon.${lang}.json` },
    { id: 'brown-bear-stars', file: `/stories/brown-bear-stars.${lang}.json` },
    { id: 'brown-bear-camping', file: `/stories/brown-bear-camping.${lang}.json` },
    { id: 'brown-bear-friends', file: `/stories/brown-bear-friends.${lang}.json` },
    { id: 'brown-bear-dreams2', file: `/stories/brown-bear-dreams2.${lang}.json` },
    { id: 'brown-bear-nightlight', file: `/stories/brown-bear-nightlight.${lang}.json` },
  ];
  stories.value = [];
  for (const f of files) {
    const res = await fetch(f.file);
    const data = await res.json();
    stories.value.push({ id: f.id, ...data });
  }
}

// Search is reactive, no button needed

onMounted(loadStories);
watch(locale, () => {
  loadStories();
});
</script>

<style scoped>
.story-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: linear-gradient(180deg, #22223b 0%, #4a4e69 100%);
  color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(44, 44, 84, 0.2);
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.search-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 1rem;
  border: none;
  font-size: 1.1rem;
  background: #f2e9e4;
  color: #22223b;
  box-shadow: 0 2px 8px #a3bffa33;
}
.search-input:focus {
  outline: 2px solid #a3bffa;
}
.search-btn {
  background: linear-gradient(90deg, #a3bffa 0%, #f2e9e4 100%);
  color: #22223b;
  border: none;
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #a3bffa33;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.search-btn:hover, .search-btn:focus {
  background: linear-gradient(90deg, #f2e9e4 0%, #a3bffa 100%);
  color: #22223b;
}
.story-list-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.story-list-li {
  margin: 0;
  padding: 0;
}
.story-card {
  background: #2d3142;
  border-radius: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(44, 44, 84, 0.1);
  transition: transform 0.1s;
}
.story-card:hover {
  transform: scale(1.02);
  background: #3a3f5a;
}
.lang-switch {
  margin-top: 2rem;
  background: #f2e9e4;
  color: #22223b;
  border: none;
  border-radius: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
}
button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: none;
  background: #9a8c98;
  color: #fff;
  margin-top: 0.5rem;
  cursor: pointer;
}
button:focus {
  outline: 2px solid #f2e9e4;
}
</style>
