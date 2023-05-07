<template>
    <!--后台管理：用户-->
    <div class="flex-1 box-border overflow-auto p-8 bg-white">
        <div>
            <!--头部表单，搜索框-->
            <el-form :inline="true" >
                <el-form-item label="用户ID" class="w-60">
                    <el-input v-model="data.selectData.id" placeholder="请输入用户ID" clearable/>
                </el-form-item>

                <el-form-item label="用户邮箱" class="w-60">
                    <el-input v-model="data.selectData.email" placeholder="请输入用户邮箱" clearable/>
                </el-form-item>

                <el-form-item label="用户权限" class="w-40">
                    <el-select v-model="data.selectData.authority" placeholder="所有" clearable>
                        <el-option label="管理员" :value="0" />
                        <el-option label="教师" :value="1" />
                        <el-option label="学生" :value="2" />
                    </el-select>
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
            <el-table-column fixed prop="id" label="用户ID" sortable width="100px"/>
            <el-table-column prop="email" label="邮箱" sortable width="200px" show-overflow-tooltip/>
            <el-table-column prop="username" label="名称" sortable width="200px" show-overflow-tooltip/>
            <el-table-column prop="authority" label="权限" sortable width="80px">
                <template #default="scope">
                    <span v-if="scope.row.authority === 0">管理员</span>
                    <span v-if="scope.row.authority === 1">教师</span>
                    <span v-if="scope.row.authority === 2">学生</span>
                </template>
            </el-table-column>
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
                    <el-button size="default" @click="handleAuthorityEdit(scope.row)">修改权限</el-button>
                    <el-button size="default" @click="handlePasswordEdit(scope.row)">修改密码</el-button>
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
                class="mt-4"
            >
            </el-pagination>

            <!--对话框：点击"添加"按钮,弹出相应对话框-->
            <el-dialog 
                v-model="insertDialogVisible" 
                title="新增用户" 
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
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" style="width: 80%"> </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" style="width: 80%" show-password> </el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="authority">
                        <el-radio-group v-model="form.authority">
                            <el-radio :label="0">管理员</el-radio>
                            <el-radio :label="1">教师</el-radio>
                            <el-radio :label="2">学生</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" style="width: 80%"> </el-input>
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
            <!-- 对话框：修改权限 -->
            <el-dialog 
                v-model="authorityDialogVisible" 
                title="修改权限" 
                width = "50%"
                @close="authorityFormRef?.resetFields()">
                <el-form 
                    ref="authorityFormRef"
                    :model = "form" 
                    status-icon
                    :rules="authorityRules"
                    label-width="100px"
                    class="dialog-form"
                >
                    <el-form-item label="用户ID">
                        <el-input v-model="form.id" style="width: 80%" disabled> </el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" style="width: 80%" disabled> </el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="authority">
                        <el-radio-group v-model="form.authority">
                            <el-radio :label="0">管理员</el-radio>
                            <el-radio :label="1">教师</el-radio>
                            <el-radio :label="2">学生</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="authorityFormRef?.resetFields()">重置</el-button>
                        <el-button @click="authorityDialogVisible=false">取消</el-button>
                        <el-button type="primary" @click="handleAuthorityUpdate(authorityFormRef)">确认</el-button>
                    </span>
                </template>
            </el-dialog>
            <!--对话框：修改密码-->
            <el-dialog 
                v-model="passwordDialogVisible" 
                title="修改密码" 
                width = "50%"
                @close="passwordFormRef?.resetFields()">
                <el-form 
                    ref="passwordFormRef"
                    :model = "form" 
                    status-icon
                    :rules="passwordRules"
                    label-width="100px"
                    class="dialog-form"
                >
                    <el-form-item label="用户ID">
                        <el-input v-model="form.id" style="width: 80%" disabled> </el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" style="width: 80%" disabled> </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" style="width: 80%" show-password> </el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="passwordFormRef?.resetFields()">重置</el-button>
                        <el-button @click="passwordDialogVisible=false">取消</el-button>
                        <el-button type="primary" @click="handlePasswordUpdate(passwordFormRef)">确认</el-button>
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
import { getUserList, updateUser, updatePassword, insertUser } from '@/request/api/user';
import {type IUser, InitUser } from '@/type/user'
const data = reactive(new InitUser())
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
    getUserList(data.selectData).then(res=>{
        data.list = res.data.recordList
        data.pageCount = res.data.total
    })
}

// 用于存放对话框中的表单数据
// 注意,不能直接给form赋值,会使得其失去响应式
var form = ref<IUser>({
    id: undefined,
    email: undefined,
    username: undefined,
    password: undefined,
    authority: undefined
})

// 控制"新增"对话框的弹出
var insertDialogVisible = ref(false)
const insertFormRef = ref<FormInstance>()
// 校验对话框表单输入
const rules = reactive({
  username: [
    { 
        required: true,
        message: "请输入用户名",
        trigger: 'blur' 
    },{
        min: 1,
        max: 18,
        message: "用户名的长度应当在1~18之间",
        trigger: 'blur'
    }
  ],
  password: [
    { 
        required: true,
        message: "请输入密码",
        trigger: 'blur'
    },{
        min: 6,
        max: 20,
        message: "密码的长度应当在6~20之间",
        trigger: 'blur'
    }
  ],
  authority: [
    { 
        required: true,
        message: "请选择权限",
        trigger: 'blur'
    }
  ],
  email: [
    { 
        required: true,
        message: "请输入邮箱",
        trigger: 'blur'
    }
  ],
})
// "新增"对话框中提交表单，检验参数，并新增数据
const handleSave = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            insertUser(form.value).then(res=>{
                if (res.success){
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
        email: undefined,
        image: undefined,
        username: undefined,
        password: undefined,
        authority: undefined,
        status: undefined,
        createTime: undefined,
        updateTime: undefined,
    }
}
// 点击"新增"按钮,弹出对话框
const handleInsert = () => { 
    reset()
    insertDialogVisible.value = true
}


// 控制"修改密码"对话框的弹出
var passwordDialogVisible = ref(false)
const passwordFormRef = ref<FormInstance>()
// 校验对话框表单输入
const passwordRules = reactive({
    password: [
    { 
        required: true,
        message: "请输入密码",
        trigger: 'blur'
    },{
        min: 6,
        max: 20,
        message: "密码的长度应当在6~20之间",
        trigger: 'blur'
    }
  ],
})
// "修改密码"对话框中点击"确认"按钮，检验参数、更新信息
const handlePasswordUpdate = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            updatePassword(form.value).then(res=>{
                if (res.success){
                    ElMessage({
                        type:"success",
                        message:"更新密码成功"
                    })
                    reload() // 刷新数据
                    passwordDialogVisible.value = false //关闭"修改密码"弹窗
                }
                else{
                    ElMessage({
                        type:"error",
                        message:"更新密码失败"
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
// 点击"修改密码"按钮,弹出对话框
const handlePasswordEdit = (userForm: IUser) => {
    // 深拷贝
    form.value = JSON.parse(JSON.stringify(userForm))
    form.value.password = ""
    passwordDialogVisible.value = true
}


var authorityDialogVisible = ref(false)
const authorityFormRef = ref<FormInstance>()
// 校验"修改权限"对话框提交表单
const authorityRules = reactive({
    authority: [
    { 
        required: true,
        message: "请选择权限",
        trigger: 'blur'
    }
  ]
})

// "修改权限"对话框中点击"确认"按钮，检验参数、更新信息
const handleAuthorityUpdate = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            updateUser(form.value).then(res=>{
                if (res.success){
                    ElMessage({
                        type:"success",
                        message:"修改权限成功"
                    })
                    reload() // 刷新数据
                    authorityDialogVisible.value = false //关闭"修改权限"弹窗
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

// 点击"修改权限"按钮,弹出对话框
const handleAuthorityEdit = (userForm: IUser) => {
    // 深拷贝
    form.value = JSON.parse(JSON.stringify(userForm))
    authorityDialogVisible.value = true
}


// 点击"禁用"或是"启用"按钮,更新用户状态信息
const handleStatusEdit = (userForm: IUser) => {
    // 深拷贝
    form.value = JSON.parse(JSON.stringify(userForm))
    if (form.value.status == 1){
        form.value.status = 0
    }
    else {
        form.value.status = 1
    }
    // 更新操作
    updateUser(form.value).then(res=>{
        if (res.success){
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