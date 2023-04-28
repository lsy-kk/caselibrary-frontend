<template>
    <div>
        <!--搜索框-->
        <el-autocomplete
            v-model="keyword"
            class="w-100 mt-4 border-2 border-gray-300 rounded-md"
            :fetch-suggestions="querySearch"
            maxlength="20"
            show-word-limit
            placeholder="输入关键字搜索......"
            clearable
            @select="handleSelect"
            @keyup.enter.native="handleSearch"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus';
const router = useRouter()
const route = useRoute()
var searchHistorys: string[] = []
const keyword = ref('')
onMounted(() => {
    // 获取最近搜索
    var str = localStorage.getItem('searchHistory')
    if (str){
        searchHistorys = JSON.parse(str);
    }
    // 获取url中的keyword
    str = decodeURI(route.path)
    if (str.startsWith('/search/')){
        keyword.value = str.substring(8, str.lastIndexOf('/'))
    }
})
const handleSelect = (item: string) => {
}
// 搜索
const handleSearch = () => {
    if (keyword.value.trim() === ''){
        return
    }
    var index = searchHistorys.indexOf(keyword.value)
    if (index == -1){
        // 存储到本地，最近7次搜索
        if (searchHistorys.length == 7){
            searchHistorys.pop();
        }
        searchHistorys.unshift(keyword.value);
    }
    else {
        // 更新关键字位置
        searchHistorys.splice(index, 1)
        searchHistorys.unshift(keyword.value);
    }
    localStorage.setItem('searchHistory',JSON.stringify(searchHistorys));
    let str = route.path
    if (str.length >= 8 && str.substring(0,8) === '/search/'){
        let lastPath = str.substring(str.lastIndexOf('/')+1)
        router.push({path: `/search/${keyword.value}/${lastPath}`})
    }
    else {
        router.push({path:`/search/${keyword.value}`})
    }
}
interface IResultItem {
  value: string
}
const querySearch = (queryString: string, cb: any) => {
    const list = queryString
        ? searchHistorys.filter(createFilter)
        : searchHistorys
    const results: IResultItem[] = []
    list.forEach(item => {
        var resultItem: IResultItem = {
            value: item,
        }
        results.push(resultItem)
    })
    cb(results)
}
const createFilter = (searchHistory: string) => {
    return searchHistory.toLowerCase().match(keyword.value.toLowerCase())
}
</script>

<style scoped>

</style>