<template>
    <div 
        class="w-full h-full fixed min-h-full p-1 text-center"
        :style="{backgroundImage:'url('+bgImg+')', backgroundSize: '100% 100%'}">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="50px"
            class="max-w-xl mx-auto mt-28 py-8 pl-2 pr-6 rounded-2xl bg-white"
        >
            <h2 class="m-4  mx-auto">登录</h2>
            <el-form-item label="账号" prop="email" label-width="6rem" class="mr-8">
              <el-input v-model="ruleForm.email" autocomplete="off" />
            </el-form-item>

            <el-form-item label="密码" prop="password" label-width="6rem" class="mr-8">
              <el-input 
                v-model="ruleForm.password" 
                type="password"
                autocomplete="off" 
                show-password
              />
            </el-form-item>
            <!--忘记密码和注册链接-->
            <el-form-item class="relative">
              <el-button 
                class="w-20 absolute right-16 mr-8" 
                key="primary" 
                type="primary" 
                text 
                @click="handleRegister">
                邮箱登录
              </el-button>
              <el-button 
                class="w-12 absolute right-0 mr-8" 
                key="primary" 
                type="primary" 
                text 
                @click="handleRegister">
                注册
              </el-button>
            </el-form-item>
            <!--两个点击按钮-->
            <el-button 
              class="w-1/3 mx-auto" 
              type="primary" 
              @click="submitForm(ruleFormRef)">
              登录
            </el-button>
            <el-button 
              class="w-1/3 mx-auto" 
              @click="resetForm(ruleFormRef)">
              重置
            </el-button>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref} from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import type { ILoginForm } from '@/type/login';
import bgImg from '@/assets/background/red-bg.png'
const store = useStore()
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
// 初始化表单
const ruleForm:ILoginForm = reactive({
  email: '',
  password: '',
})
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
      store.dispatch('login', ruleForm).then(() => {
        ElMessage.success('登录成功')
        router.go(-1)
      }).catch(error => {})
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

const handleRegister = () => {
  router.push('/register')
}
</script>

<!--lang='scss'，使用css预处理器scss-->
<style lang="scss" scoped>
</style>