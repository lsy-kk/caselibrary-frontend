<!--单个附件：表项-->
<template>
    <div
        class="bg-white w-60 h-12 flex relative box-border rounded my-2 mr-4
                hover:bg-gray-100 ring-1 ring-gray-300">
        <img 
            :src="imageSrc(file.name)"
            class="w-8 h-8 m-2">
        <div class="my-auto">
            <el-tooltip
                effect="light"
                :content="file.name"
                placement="top"
            >
                <div class="text-sm w-32 
                            overflow-hidden overflow-ellipsis whitespace-nowrap">
                    <span > {{ file.name }} </span>
                </div>
            </el-tooltip>
            <div class="text-gray-500 text-sm">
                <span> {{ sizeWithKB(file.size) }} </span>
            </div>
        </div>
        
        <el-tooltip
            effect="light"
            content="预览"
            placement="top"
        >
            <div class="absolute right-10 top-0 my-4
                      text-black hover:text-blue-500" 
                @click="previewHanlder">
                <el-icon><View /></el-icon>
            </div>
        </el-tooltip>
        <el-tooltip
            effect="light"
            content="下载"
            placement="top"
        >
            <div class="absolute right-2 top-0 my-4 mx-2 
                      text-black hover:text-blue-500" 
                @click="downloadHanlder">
                <el-icon><Download /></el-icon>
            </div>
        </el-tooltip>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router';
import { Download, View, CloseBold } from '@element-plus/icons-vue'; 
import type { IFileVo } from '@/type/file'
// vite的静态资源引入
import zipImg from '@/assets/image/zip.png';
import pptImg from '@/assets/image/ppt.png';
import pdfImg from '@/assets/image/pdf.png';
import docImg from '@/assets/image/doc.png';
import defaultImg from '@/assets/image/unknown.png';
// 组件参数
const props = defineProps<{
    file: IFileVo
}>()
// const file: IFileVo = {
//     name: "1190200718赖思颖-移动互联网报告.pdf",
//     url: "http://case-lib.test.upcdn.net/files/141a9033-786a-400f-9afb-0b52f4cd1d91/1190200718%E8%B5%96%E6%80%9D%E9%A2%96-%E7%A7%BB%E5%8A%A8%E4%BA%92%E8%81%94%E7%BD%91%E6%8A%A5%E5%91%8A.pdf",
//     size: 17300,
// }
onMounted(() => {

})
const imageSrc = (fileName: string) => {
    let fileType = fileName.substring(fileName.lastIndexOf(".") + 1)
    if (fileType === "rar" || fileType === "zip"){
        return zipImg;
    }
    if (fileType === "doc" || fileType === "docx"){
        return docImg
    }
    if (fileType === "pdf"){
        return pdfImg;
    } 
    if (fileType === "ppt" || fileType === "pptx"){
        return pptImg;
    }
    return defaultImg;
}
const sizeWithKB = (fileSize: number | undefined) => {
    if (fileSize === undefined || fileSize === 0){
        return ""
    }
    return (Number(fileSize) / 1024).toFixed(0) + "kb";
}
const reload = () => {

}
// 预览
const previewHanlder = () => {
    window.open(
      // 备用在线预览-微软官方：https://view.officeapps.live.com/op/view.aspx?src=
      // xdoc文档预览云服务
      `https://view.xdocin.com/view?src=${encodeURIComponent(props.file.url)}`
    );
}
// 下载
const downloadHanlder = () => {
    // 创建一个请求二进制文件的请求
    const request = new XMLHttpRequest()
    request.open('GET', props.file.url, true)
    request.responseType = 'blob'
    request.onload = (e) => {
        // 会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。
        // 这个 URL 的生命周期和创建它的窗口中的 document 绑定。
        // 这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        const url = window.URL.createObjectURL(request.response)
        const a = document.createElement('a')
        a.href = url
        a.download = props.file.name
        a.click()
    }
    request.send()
}
</script>

<style scoped>
</style>