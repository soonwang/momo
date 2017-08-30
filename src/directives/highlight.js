import Vue from 'vue';
import 'highlight.js/styles/default.css';
import Hljs from 'highlight.js';

Vue.directive('highlight', {
    componentUpdated: function(el) {
        setTimeout(() => {
            Hljs.highlightBlock(el);
        }, 10);
    },
})
