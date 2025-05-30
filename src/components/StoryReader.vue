
<template>
  <main class="story-reader" aria-labelledby="storyTitle">
    <h1 id="storyTitle" class="story-title">{{ story?.title }}</h1>
    <p class="desc">{{ story?.description }}</p>
    <div class="story-page">
      <div class="page-text-scroll">
        <p class="page-text">{{ currentPageText }}</p>
      </div>
    </div>
    <div class="nav-btns">
      <div style="flex:1;display:flex;align-items:center;">
        <button v-if="pageIndex > 0" @click="prevPage">{{ $t('previous') }}</button>
      </div>
      <div style="flex:1;display:flex;align-items:center;justify-content:flex-end;">
        <button
          v-if="story && pageIndex < story.pages.length - 1"
          @click="nextPage"
          :disabled="pageIndex === (story?.pages.length - 1)"
        >
          {{ $t('next') }}
        </button>
        <button
          v-else
          class="finish-btn"
          @click="() => router.push('/')"
        >
          {{ $t('finish') }}
        </button>
      </div>
    </div>

    <button class="read-aloud" @click="toggleReadAloud">
      {{ isReading ? $t('stopReading') : $t('readAloud') }}
    </button>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();

const story = ref<any>(null);
const pageIndex = ref(0);

const isReading = ref(false);
let utterance: SpeechSynthesisUtterance | null = null;

// Voice mapping: language code to preferred voiceURI
const voiceMap: Record<string, string | undefined> = {
  en: 'Microsoft Sonia Online (Natural) - English (United Kingdom)',
  // Add more mappings as needed, e.g.:
  // af: 'Afrikaans Female',
};

function getVoiceForLang(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const preferred = voiceMap[lang];
  if (preferred) {
    const found = voices.find(v => v.voiceURI === preferred);
    if (found) return found;
  }
  // fallback: first matching language
  const fallback = voices.find(v => v.lang && v.lang.startsWith(lang));
  return fallback || null;
}

import { computed } from 'vue';
const currentPageText = computed(() => story.value?.pages[pageIndex.value]?.text || '');


function prevPage() {
  if (pageIndex.value > 0) pageIndex.value--;
}

function nextPage() {
  if (story.value && pageIndex.value < story.value.pages.length - 1) pageIndex.value++;
}

async function loadStory() {
  const id = route.params.storyId;
  const lang = locale.value;
  const res = await fetch(`/stories/${id}.${lang}.json`);
  story.value = await res.json();
  pageIndex.value = 0;
}

function toggleReadAloud() {
  if (isReading.value) {
    window.speechSynthesis.cancel();
    isReading.value = false;
    return;
  }
  if (!currentPageText.value) return;
  isReading.value = true;
  readCurrentAndNext();
}

function readCurrentAndNext() {
  if (!isReading.value || !currentPageText.value) return;
  utterance = new window.SpeechSynthesisUtterance(currentPageText.value);
  const lang = locale.value;
  utterance.lang = lang === 'af' ? 'af-ZA' : 'en-US';
  const setVoice = () => {
    const voice = getVoiceForLang(lang);
    if (utterance) {
      if (voice) utterance.voice = voice;
      utterance.onend = () => {
        if (!isReading.value) return;
        // If not last page, go to next and continue reading
        if (story.value && pageIndex.value < story.value.pages.length - 1) {
          pageIndex.value++;
          // Wait for computed to update before reading next page
          requestAnimationFrame(() => {
            setTimeout(() => {
              readCurrentAndNext();
            }, 10);
          });
        } else {
          isReading.value = false;
        }
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      setVoice();
      window.speechSynthesis.onvoiceschanged = null;
    };
    window.speechSynthesis.getVoices();
  } else {
    setVoice();
  }
}

watch(locale, loadStory);

onMounted(loadStory);
</script>

<style scoped>
.story-reader {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem 3.5rem 1rem;
  background: linear-gradient(180deg, #22223b 0%, #4a4e69 100%);
  color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(44, 44, 84, 0.2);
  position: relative;
}
.back-btn {
  background: #f2e9e4;
  color: #22223b;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 1rem;
  left: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(44, 44, 84, 0.08);
  transition: background 0.2s;
}
.back-btn:focus {
  outline: 2px solid #9a8c98;
}
.back-arrow {
  display: block;
}
.story-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  padding-top: 1rem;
}
.story-page {
  min-height: 120px;
  max-height: 220px;
  margin: 2rem 0;
  background: #2d3142;
  border-radius: 1rem;
  padding: 1.5rem;
  font-size: 1.15rem;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(44, 44, 84, 0.1);
  display: flex;
  flex-direction: column;
}
.page-text-scroll {
  overflow-y: auto;
  max-height: 160px;
}
.nav-btns {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
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
.read-aloud {
  background: linear-gradient(90deg, #a3bffa 0%, #f2e9e4 100%);
  color: #22223b;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 2.5rem;
  border: none;
  border-radius: 1rem;
  padding: 0.7rem 2rem;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px #a3bffa33;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.read-aloud:hover, .read-aloud:focus {
  background: linear-gradient(90deg, #f2e9e4 0%, #a3bffa 100%);
  color: #22223b;
}
</style>
