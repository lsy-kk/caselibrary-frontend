<template>
    <!--后台管理：收藏夹-->
    <div class="flex-1 box-border overflow-auto p-8 bg-white">
        <div class="search-box">
          <!--头部表单，搜索框-->
          <el-form :inline="true" >
              <el-form-item label="收藏夹ID" class="w-60">
                  <el-input v-model="data.selectData.id" placeholder="请输入收藏夹ID" clearable/>
              </el-form-item>
              <el-form-item label="收藏夹名称" class="w-60">
                  <el-input v-model="data.selectData.name" placeholder="请输入收藏夹名称" clearable/>
              </el-form-item>
              <el-form-item label="所有者ID" class="w-60">
                  <el-input v-model="data.selectData.ownerId" placeholder="请输入所有者ID" clearable/>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="handleSearch">查询</el-button>
              </el-form-item>
          </el-form>
      </div>
      <!--表格数据展示区域-->
      <!--border 边框 stripe 斑马纹 sortable 代表排序-->
      <el-table :data="data.list" border stripe style="width: 100%">
          <el-table-column fixed prop="id" label="收藏夹ID" sortable width="100px"/>
          <el-table-column prop="name" label="名称" sortable width="150px"/>
          <el-table-column prop="ownerId" label="所有者ID" sortable width="100px"/>
          <el-table-column prop="visible" label="可视等级" sortable width="100px">
              <template #default="scope">
                  <span v-if="scope.row.visible === 0">仅所有者可见</span>
                  <span v-if="scope.row.visible === 1">所有人可见</span>
              </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" sortable width="300px"/>
          <el-table-column prop="image" label="图像" sortable width="200px"/>
          <el-table-column prop="status" label="状态" sortable width="80px">
              <template #default="scope">
                  <span v-if="scope.row.status === 0">禁用中</span>
                  <span v-if="scope.row.status === 1">启用中</span>
              </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable width="250px"/>
          <el-table-column prop="updateTime" label="更新时间" sortable width="250px"/>
          <el-table-column label="操作" fixed="right" width="300px">
              <template #default="scope">
                  <el-button size="default" @click="handleShowCases(scope.row)">查看内容</el-button>
                  <el-button size="default" @click="handleEdit(scope.row)">修改信息</el-button>
                  <el-button v-if="scope.row.status === 0" size="default" @click="handleStatusEdit(scope.row)" color="green">启用</el-button>
                  <el-button v-if="scope.row.status === 1" size="default" @click="handleStatusEdit(scope.row)" color="red">禁用</el-button>
              </template>
          </el-table-column>
      </el-table>

      <div style="margin: 10px 0">
          <!--分页栏-->
          <el-pagination
              v-model:currentPage="data.selectData.page"
              :page-sizes="[5, 10, 15]"
              :page-size="data.selectData.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="data.pageCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          >
          </el-pagination>

          <!-- 对话框：修改信息 -->
          <el-dialog 
              v-model="editDialogVisible" 
              title="修改文件夹信息" 
              width = "50%"
              @close="editFormRef?.resetFields()">
              <el-form 
                  ref="editFormRef"
                  :model = "form" 
                  status-icon
                  :rules="rules"
                  label-width="100px"
                  class="dialog-form"
              >
                <el-form-item label="收藏夹ID">
                    <el-input v-model="form.id" style="width: 80%" disabled> </el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" style="width: 80%"> </el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" style="width: 80%"> </el-input>
                </el-form-item>
                <el-form-item label="图像" prop="image">
                    <el-input v-model="form.image" style="width: 80%"> </el-input>
                </el-form-item>
                <el-form-item label="可见等级" prop="visible">
                    <el-radio-group v-model="form.visible">
                        <el-radio :label="0">仅所有者可见</el-radio>
                        <el-radio :label="1">所有人可见</el-radio>
                    </el-radio-group>
                </el-form-item>
              </el-form>
              <template #footer>
                  <span class="dialog-footer">
                      <el-button @click="editFormRef?.resetFields()">重置</el-button>
                      <el-button @click="editDialogVisible=false">取消</el-button>
                      <el-button type="primary" @click="handleUpdate(editFormRef)">确认</el-button>
                  </span>
              </template>
          </el-dialog>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus' 
import type { FormInstance } from 'element-plus'
import { getFavoritesList, updateFavorites} from '@/request/api/favorites';
import {type IFavorites, FavoritesData } from '@/type/favorites'
const data = reactive(new FavoritesData())
// 生命周期函数
onMounted(() => {
  reload()
})
// 搜索操作
const handleSearch = () => {
  reload()
}

// 更新页面上的数据
const reload = () => {
  getFavoritesList(data.selectData).then(res=>{
      data.list = res.data
      data.pageCount = res.data.length
  })
}

// 显示收藏夹具体内容  未完待续...
const handleShowCases = (favoritesForm: IFavorites) => {

}
// 用于存放对话框中的表单数据
// 注意,不能直接给form赋值,会使得其失去响应式
var form = ref<IFavorites>({
    id: undefined,
    name: undefined,
    description: undefined,
    image: undefined,
    visible: undefined,
})
// 校验对话框表单输入
const rules = reactive({
    name: [{ 
        required: true,
        message: "请输入收藏夹名称",
        trigger: 'blur' 
    },{
        min: 1,
        max: 15,
        message: "收藏夹名称的长度应当在1~15之间",
        trigger: 'blur'
    }],
    description: [{
        min: 0,
        max: 200,
        message: "标签描述的字数应当在0~200字之间",
        trigger: 'blur'
    },],
    image: [{
        min: 0,
        max: 200,
        message: "图像地址超长，请重新输入",
        trigger: 'blur'
    },],
    visible: [{
        required: true,
        message: "请选择收藏夹可见等级",
        trigger: 'blur' 
    }]
})

var editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()

// "修改信息"对话框中点击"确认"按钮，检验参数、更新信息
const handleUpdate = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
      if (valid) {
          updateFavorites(form.value).then(res=>{
              if(res.msg === 'success'){
                  ElMessage({
                      type:"success",
                      message:"修改权限成功"
                  })
                  reload() // 刷新数据
                  editDialogVisible.value = false //关闭"修改信息"弹窗
              }
              else{
                  ElMessage({
                      type:"error",
                      message:"修改权限失败"
                  })
              }
          }).catch((err) => {
              console.log(err)
          })
          
      }
      else {
          return false
      }
  })
}

// 点击"修改信息"按钮,弹出对话框
const handleEdit = (favoritesForm: IFavorites) => {
  // 深拷贝
  form.value = JSON.parse(JSON.stringify(favoritesForm))
  editDialogVisible.value = true
}


// 点击"禁用"或是"启用"按钮,更新标签状态信息
const handleStatusEdit = (favoritesForm: IFavorites) => {
  // 深拷贝
  form.value = JSON.parse(JSON.stringify(favoritesForm))
  if (form.value.status == 1){
      form.value.status = 0
  }
  else {
      form.value.status = 1
  }
  // 更新操作
  updateFavorites(form.value).then(res=>{
      if(res.msg === 'success'){
          ElMessage({
              type:"success",
              message:"更新状态成功"
          })
          reload() // 刷新数据
      }
      else{
          ElMessage({
              type:"error",
              message:"更新状态失败"
          })
      }
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

<style lang="scss" scoped>
</style>