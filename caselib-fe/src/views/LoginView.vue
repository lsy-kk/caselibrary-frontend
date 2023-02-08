<template>
    <div class="login-box">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="50px"
            class="w-1/2 mx-auto mt-28 p-6 rounded-2xl bg-white"
        >
            <h2 class="m-4">登录</h2>
            <el-form-item label="账号" prop="email">
            <el-input v-model="ruleForm.email" autocomplete="off" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
            <el-input 
              v-model="ruleForm.password" 
              type="password"
              autocomplete="off" 
              show-password
            />
            </el-form-item>
            <!--忘记密码和注册链接-->
            <el-form-item class="relative">
              <el-button class="w-1/5 absolute right-16" key="primary" type="primary" text @click="">忘记密码</el-button>
              <el-button class="w-1/5 absolute right-0" key="primary" type="primary" text @click="">注册</el-button>
            </el-form-item>
            <!--两个点击按钮-->
            <el-form-item>
              <el-button class="w-2/5" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
              <el-button class="w-2/5" @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { login} from '../request/login'
import { useRouter } from 'vue-router';
import type { ILoginForm } from '@/type/login';
const ruleFormRef = ref<FormInstance>()

// 初始化表单
const ruleForm:ILoginForm = reactive({
  email: '',
  password: '',
})

const router = useRouter()
// 校验输入
const rules = reactive({
  email: [
    { 
        required: true,
        message: "请输入账号",
        trigger: 'blur' 
    }
  ],
  password: [
    { 
        required: true,
        message: "请输入密码",
        trigger: 'blur'
    }
  ],
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('提交成功')
      login(ruleForm).then((res)=>{
        console.log(res)
        const msg:string = res.msg
        if (msg == 'success'){
          // 保存用户信息及token
          localStorage.setItem('token', res.data)
          console.log(res.data);
          // 登录成功
          ElMessage({
            type:"success",
            message:"登录成功",
            showClose: true,
          })
          // 跳转页面到首页
          router.push('/')
        }
        else {
          // 密码错误提示
          ElMessage({
            type:"error",
            message:"账号或密码错误",
            showClose: true,
          })
        }
      }).catch((err) => {
        ElMessage({
            type:"error",
            message:"服务器错误，请重试",
            showClose: true,
          })
      })
    } else {
      return false
    }
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return 
  formEl.resetFields()
}
</script>

<!--lang='scss'，使用css预处理器scss-->
<style lang="scss" scoped>
    .login-box{
        width: 100%;
        height: 100%;
        min-height: 100vh; //base.css中有了
        background: url("../assets/bg.jpg");
        background-size: 100%;
        opacity: 0.8;
        padding: 1px;
        text-align: center;
    }
</style>