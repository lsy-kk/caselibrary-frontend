<template>
    <!--md预览-->
    <div>
        <md-editor
            previewTheme="vuepress"
            v-model="props.text"
            :editorId="props.id"
            :theme="props.theme"
            preview-only />
    </div>
</template>

<script setup lang="ts">
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
// 组件参数
const props = defineProps<{
    theme: string,
    text: string,
    id: string,
}>()
// 重写replaceState和pushState
const bindEventListener = (type: string) => {
    // 获取原始定义
    const historyEvent = history[type];
    return function() {
        // 经过包装的pushState或replaceState
        const newEvent = historyEvent.apply(this, arguments);
        // 定义一个type的新事件
        const event = new Event(type);
        // 将调用pushState或replaceState时的参数放到事件参数event上
        event.arguments = arguments;
        // 调用pushState或replaceState时触发该事件
        window.dispatchEvent(event);
        return newEvent;
    };
};
//修改原始定义
history.replaceState = bindEventListener('replaceState');
// 监听replaceState事件
window.addEventListener('replaceState', ()=>{ 
    onHtmlChanged()
});
// 防止多次触发滑动事件的函数
const debounce = (fn: (...params: Array<any>) => any, ms = 200) => {
    let timer = 0;
    return (...params: Array<any>) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = window.setTimeout(() => {
            fn.apply(this, params);
            timer = 0;
        }, ms);
    };
};
// 当url中hash发生变化时，滑动到相应位置
const onHtmlChanged = debounce(() => {
    const { hash } = location;
    if (/^#/.test(hash)) {
        const headingId = decodeURIComponent(hash.replace('#', ''));
        if (headingId) {
            const targetHeadDom = document.getElementById(headingId);
            if (targetHeadDom) {
                targetHeadDom.scrollIntoView({ behavior: 'smooth' })
        }
        }
    }
});
</script>
    