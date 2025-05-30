<template>
  <router-link :to="{ name: 'StoryReader', params: { storyId: story.id } }">
    <div class="story-card">
      <h2>{{ story.title }}</h2>
      <p>{{ story.description }}</p>
      <button>{{ $t('readStory') }}</button>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';


defineProps<{ story: any }>();
</script>

<style scoped>
.story-card {
  background: #2d3142;
  border-radius: 1rem;
  margin: 2.2rem 0; /* more space between cards */
  padding: 1.2rem 1rem;
  box-shadow:
    0 0 16px 4px #a3bffa66, /* soft blue glow */
    0 2px 8px rgba(44, 44, 84, 0.1);
  transition: transform 0.1s, box-shadow 0.2s;
}
.story-card:hover {
  transform: scale(1.02);
  background: #3a3f5a;
  box-shadow:
    0 0 32px 8px #f2e9e4cc, /* brighter soft glow on hover */
    0 2px 16px rgba(44, 44, 84, 0.15);
}
button {
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
  border-radius: 0.75rem;
  border: none;
  background: linear-gradient(90deg, #f2e9e4 0%, #a3bffa 100%);
  color: #22223b;
  font-weight: 600;
  margin-top: 0.8rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #a3bffa33;
  transition: background 0.2s, color 0.2s;
}
button:hover, button:focus {
  background: linear-gradient(90deg, #a3bffa 0%, #f2e9e4 100%);
  color: #22223b;
}
button:focus {
  outline: 2px solid #f2e9e4;
}
</style>
