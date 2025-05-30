
import StoryList from './components/StoryList.vue';
import StoryReader from './components/StoryReader.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: StoryList,
  },
  {
    path: '/story/:storyId',
    name: 'StoryReader',
    component: StoryReader,
    props: true,
  },
];

export default routes;
