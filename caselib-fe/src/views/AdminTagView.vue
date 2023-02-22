<template>
  <!--后台管理：标签-->
  <div class="flex-1 box-border overflow-auto p-8 bg-white">
      <div>
          <!--头部表单，搜索框-->
          <el-form :inline="true" >
              <el-form-item label="标签ID" class="w-60">
                  <el-input v-model="data.selectData.id" placeholder="请输入标签ID" clearable/>
              </el-form-item>
              <el-form-item label="标签名称" class="w-60">
                  <el-input v-model="data.selectData.name" placeholder="请输入标签名称" clearable/>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="handleSearch">查询</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="handleInsert">添加</el-button>
              </el-form-item>
          </el-form>
      </div>
      <!--表格数据展示区域-->
      <!--border 边框 stripe 斑马纹 sortable 代表排序-->
      <el-table :data="data.list" border stripe style="width: 100%">
          <el-table-column fixed prop="id" label="标签ID" sortable width="100px"/>
          <el-table-column prop="name" label="名称" sortable width="150px"/>
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

          <!--对话框：点击"添加"按钮,弹出相应对话框-->
          <el-dialog 
              v-model="insertDialogVisible" 
              title="新增标签" 
              width = "50%"
              @close="insertFormRef?.resetFields()">
              <el-form 
                  ref="insertFormRef"
                  :model = "form" 
                  status-icon
                  :rules="rules"
                  label-width="100px"
                  class="dialog-form"
              >
                <el-form-item label="标签名" prop="name">
                    <el-input v-model="form.name" style="width: 80%"> </el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" style="width: 80%"> </el-input>
                </el-form-item>
                <el-form-item label="图像" prop="image">
                    <el-input v-model="form.image" style="width: 80%"> </el-input>
                </el-form-item>
              </el-form>
              <template #footer>
                  <span class="dialog-footer">
                      <el-button @click="insertFormRef?.resetFields()">重置</el-button>
                      <el-button @click="insertDialogVisible=false">取消</el-button>
                      <el-button type="primary" @click="handleSave(insertFormRef)">确认</el-button>
                  </span>
              </template>
          </el-dialog>
          <!-- 对话框：修改信息 -->
          <el-dialog 
              v-model="editDialogVisible" 
              title="修改信息" 
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
                <el-form-item label="标签ID">
                    <el-input v-model="form.id" style="width: 80%" disabled> </el-input>
                </el-form-item>
                <el-form-item label="标签名" prop="name">
                    <el-input v-model="form.name" style="width: 80%"> </el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" style="width: 80%"> </el-input>
                </el-form-item>
                <el-form-item label="图像" prop="image">
                    <el-input v-model="form.image" style="width: 80%"> </el-input>
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
import { getTagList, updateTag, insertTag } from '@/request/api/tag';
import {type ITag, TagData } from '@/type/tag'
const data = reactive(new TagData())
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
  getTagList(data.selectData).then(res=>{
      data.list = res.data
      data.pageCount = res.data.length
  })
}

// 用于存放对话框中的表单数据
// 注意,不能直接给form赋值,会使得其失去响应式
var form = ref<ITag>({
    id: undefined,
    name: undefined,
    description: undefined,
    image: undefined,
})
// 校验对话框表单输入
const rules = reactive({
    name: [{ 
        required: true,
        message: "请输入标签名",
        trigger: 'blur' 
    },{
        min: 1,
        max: 15,
        message: "标签名的长度应当在1~15之间",
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
    },]
})

// 控制"新增"对话框的弹出
var insertDialogVisible = ref(false)
const insertFormRef = ref<FormInstance>()
// "新增"对话框中提交表单，检验参数，并新增数据
const handleSave = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
      if (valid) {
          insertTag(form.value).then(res=>{
              if(res.msg === 'success'){
                  ElMessage({
                      type:"success",
                      message:"新增成功"
                  })
                  reload() // 刷新数据
                  insertDialogVisible.value = false //关闭"新增"弹窗
              }
              else{
                  ElMessage({
                      type:"error",
                      message:"新增失败"
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
// 手动重置表单
const reset = () => {
  form.value = {
    id: undefined,
    name: undefined,
    description: undefined,
    image: undefined,
  }
}
// 点击"新增"按钮,弹出对话框
const handleInsert = () => { 
  reset()
  insertDialogVisible.value = true
}




var editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()

// "修改信息"对话框中点击"确认"按钮，检验参数、更新信息
const handleUpdate = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
      if (valid) {
          updateTag(form.value).then(res=>{
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
const handleEdit = (tagForm: ITag) => {
  // 深拷贝
  form.value = JSON.parse(JSON.stringify(tagForm))
  editDialogVisible.value = true
}


// 点击"禁用"或是"启用"按钮,更新标签状态信息
const handleStatusEdit = (tagForm: ITag) => {
  // 深拷贝
  form.value = JSON.parse(JSON.stringify(tagForm))
  if (form.value.status == 1){
      form.value.status = 0
  }
  else {
      form.value.status = 1
  }
  // 更新操作
  updateTag(form.value).then(res=>{
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