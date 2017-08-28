import Vue from 'vue';
import Hljs from 'highlight.js';

Vue.directive('highlight', (el) => {
    console.log(el);
    Hljs.highlightBlock(el);
})
