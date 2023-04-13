<template>
    <!--后台管理:案例-->
    <div class="flex-1 box-border overflow-auto p-8 bg-white">
        <div>
          <!--头部表单，搜索框-->
          <el-form 
            ref="searchFormRef"
            :model="data.selectData"
            :rules="rules"
            :inline="true" >
              <el-form-item label="案例ID" prop="id">
                  <el-input v-model.number="data.selectData.id" placeholder="请输入案例ID" style="width: 110px"/>
              </el-form-item>
              <el-form-item label="作者ID" prop="authorId">
                  <el-input v-model.number="data.selectData.authorId" placeholder="请输入作者ID" style="width: 110px"/>
              </el-form-item>
              <el-form-item label="可视等级" prop="visible">
                <el-select v-model="data.selectData.visible" placeholder="所有" style="width: 75px">
                    <el-option label="隐藏" :value="0" />
                    <el-option label="公开" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="发布状态" prop="state">
                <el-select v-model="data.selectData.state" placeholder="所有" style="width: 85px" >
                    <el-option label="草稿" :value="0" />
                    <el-option label="已发布" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select v-model="data.selectData.status" placeholder="所有" style="width: 75px">
                    <el-option label="启用" :value="1" />
                    <el-option label="禁用" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="handleSearch">查询</el-button>
                  <el-button @click="searchFormRef?.resetFields()">重置</el-button>
              </el-form-item>
          </el-form>
      </div>
      <!--表格数据展示区域-->
      <!--border 边框 stripe 斑马纹 sortable 代表排序-->
      <el-table :data="data.list" border stripe style="width: 100%">
          <el-table-column fixed prop="id" label="案例ID" sortable width="100px"/>
          <el-table-column prop="authorId" label="作者ID" sortable width="100px"/>
          <el-table-column prop="visible" label="可视等级" width="100px">
              <template #default="scope">
                  <span v-if="scope.row.visible === 0">隐藏</span>
                  <span v-if="scope.row.visible === 1">公开</span>
              </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" show-overflow-tooltip width="150px"/>
          <el-table-column prop="state" label="发布状态" width="100px">
              <template #default="scope">
                  <span v-if="scope.row.state === 0">草稿</span>
                  <span v-if="scope.row.state === 1">已发布</span>
              </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable show-overflow-tooltip/>
          <el-table-column prop="updateTime" label="更新时间" sortable show-overflow-tooltip/>
          <el-table-column label="操作" fixed="right" width="200px">
              <template #default="scope">
                  <el-button size="default" @click="handleShowCase(scope.row)">查看详情</el-button>
                  <el-button v-if="scope.row.status === 1" size="default" @click="handleStatusEdit(scope.row)" color="green">启用中</el-button>
                  <el-button v-if="scope.row.status === 0" size="default" @click="handleStatusEdit(scope.row)" color="red">禁用中</el-button>
              </template>
          </el-table-column>
      </el-table>
      <div class="margin: 10px 0">
        <!--分页栏-->
        <el-pagination
            v-model:currentPage="data.selectData.page"
            :page-sizes="[5, 10, 15]"
            :page-size="data.selectData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="data.pageCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="mt-4"
        >
        </el-pagination>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { getCaseList, updateCase} from '@/request/api/case';
import {type ICaseHeader, CaseData } from '@/type/case'
import { useRouter } from 'vue-router';
const data = reactive(new CaseData())
const router = useRouter()
// 生命周期函数
onMounted(() => {
  reload()
})
const searchFormRef = ref<FormInstance>()
const rules = reactive({
  id: [
    { 
        type: 'number',
        message: "请输入数字",
        trigger: 'blur' 
    }
  ],
  authorId: [
    { 
        type: 'number',
        message: "请输入数字",
        trigger: 'blur' 
    }
  ],
})
// 搜索操作
const handleSearch = () => {
    reload()
}

// 更新页面上的数据
const reload = () => {
    getCaseList(data.selectData).then(res=>{
        data.list = res.data.recordList
        data.pageCount = res.data.total
    })
}

// 显示案例具体内容  未完待续...
const handleShowCase = (caseForm: ICaseHeader) => {
    router.push({path:`/case/${caseForm.id}`})
}
// 用于存放对话框中的表单数据
// 注意,不能直接给form赋值,会使得其失去响应式
var form = ref<ICaseHeader>({})
// 点击"禁用"或是"启用"按钮,更新案例状态信息
const handleStatusEdit = (caseForm: ICaseHeader) => {
    // 深拷贝
    form.value = JSON.parse(JSON.stringify(caseForm))
    if (form.value.status == 1){
        form.value.status = 0
    }
    else {
        form.value.status = 1
    }
    // 更新操作
    updateCase(form.value).then(res=>{
        ElMessage.success("更新状态成功")
        reload() // 刷新数据
    }).catch((err) => {
        console.log(err)
    })
}

// 改变当前每页的显示条数时触发
const handleSizeChange = (newPageSize:number) => { 
    data.selectData.pageSize = newPageSize
    reload()
}

// 改变当前页码时触发
const handleCurrentChange = (newPageNum:number) => { 
    data.selectData.page = newPageNum
    reload()
}
</script>

<style scoped>

</style>