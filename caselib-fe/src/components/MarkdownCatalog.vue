<template>
    <!--md目录-->
    <div>
        <MdCatalog
            :editorId="props.id"
            theme="light"
            :offset-top="0"
            :scroll-element-offset-top="60"
            @on-click="onClick"
        />
    </div>
</template>
  
<script setup lang="ts">
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import type { TocItem } from 'md-editor-v3/lib/MdEditor/extensions/MdCatalog';
const MdCatalog = MdEditor.MdCatalog;
// 组件参数
const props = defineProps<{
    id: string,
}>()
const scrollElement = document.documentElement;
// 更改url中的hash值
const onClick = (e: MouseEvent, t: TocItem) => {
    history.replaceState({}, '', `${location.pathname}#${t.text}`);
};
</script>
  