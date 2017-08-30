import Vue from 'vue';

Vue.directive('drag-width', {
    inserted: function(el, binding, vnode, oldVnode) {
        var J_drag = document.getElementById('J_drag');
        var originX = '', originWidth = '';
        var move = throttle(onMove, 16);
        J_drag.addEventListener('mousedown', function(e) {
            e.preventDefault();
            originX = e.clientX;
            originWidth = parseInt(window.getComputedStyle(el).width);
            window.addEventListener('mousemove', move);
            window.addEventListener('mouseup', function(e) {
                window.removeEventListener('mousemove', move);
            });
        });
        function onMove(e) {
            var diffX = e.clientX - originX;
            el.style.width = `${originWidth - diffX}px`;
        }
        function throttle(fn, delay) {
            delay = delay || 300;
            var timer = null;
            return function() {
                if(timer) return;
                var argus = arguments;
                timer = setTimeout(function() {
                    fn.apply(null, argus);
                    timer = null;
                }, delay);
            }
        }
    }
})
