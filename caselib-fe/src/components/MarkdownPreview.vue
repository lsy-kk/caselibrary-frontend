<template>
    <!--md预览-->
    <div>
        <MdEditor
            previewTheme="vuepress"
            v-model="props.text"
            :editorId="props.id"
            theme="light"
            preview-only />
    </div>
</template>

<script setup lang="ts">
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { onMounted } from 'vue';
onMounted(() => {
    replaceStateRedesign()
})
// 组件参数
const props = defineProps<{
    text: string,
    id: string,
}>()
// 设置replaceState监听
const replaceStateRedesign = () =>{
    // 获取原始定义
    var _replaceState = history.replaceState;
    // 重定义replaceState事件
    history.replaceState = function (state, title, url) {
      _replaceState.call(this, state, title, url);
      // 调用replaceState时触发该事件(state-replace)
      window.dispatchEvent(new CustomEvent("state-replace", state));
    };
}
// 监听replaceState事件
window.addEventListener('state-replace', ()=>{ 
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
    