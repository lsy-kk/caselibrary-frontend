<template>
  <div class="login-box">
      <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="50px"
          class="max-w-xl mx-auto mt-28 py-8 pl-2 pr-6 rounded-2xl bg-white"
      >
          <h2 class="my-4 mx-auto">登录或注册</h2>
          <el-form-item label="邮箱" prop="email" label-width="6rem" class="mr-8">
            <el-input v-model="ruleForm.email" autocomplete="off" />
          </el-form-item>
          <el-form-item label="验证码" prop="password" label-width="6rem" class="mr-8">
            <el-input 
              v-model="ruleForm.password" 
              :loading="loading"
              autocomplete="off" 
              style="width: 60%"
            />
            <el-button 
              type="primary" 
              plain
              @click="handleEmailCode"
              style="width: 40%">
              <template v-if="isSend">
                {{ counts }}秒后可重发
              </template>
              <template v-else>
                获取验证码
              </template>
            </el-button>
          </el-form-item>
          <el-form-item class="relative">
            <el-button 
              class="w-40 absolute right-0 mr-8" 
              key="primary" 
              type="primary" 
              text 
              @click="handleJumpLogin">
              账号密码登录
            </el-button>
          </el-form-item>
          <!--两个点击按钮-->
          <el-button 
            class="w-3/5 mx-auto" 
            type="primary" 
            @click="submitForm(ruleFormRef)">
            登录或注册
          </el-button>
      </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { useStore } from '@/store'
import { sendEmailCode} from '../request/api/login'
import type {ILoginForm} from '../type/login'
import { useRouter } from 'vue-router';
const ruleFormRef = ref<FormInstance>()
// 初始化表单
const ruleForm:ILoginForm = reactive({
  email: '',
  password: '',
})
const store = useStore()
const router = useRouter()
// 校验输入
const rules = reactive({
  email: [
    { 
        required: true,
        message: "请输入邮箱账号",
        trigger: 'blur' 
    }
  ],
  password: [
    { 
        required: true,
        message: "请输入验证码",
        trigger: 'blur'
    },{
        min: 6,
        max: 6,
        message: "验证码的长度应当为6位",
        trigger: 'blur'
    }
  ],
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      store.dispatch('loginByEmailCode', ruleForm).then(() => {
        router.go(-1)
      }).catch(error => {
        ElMessage.error(error)
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
// 定时器
let timer: number;
// 倒计时时间
const counts = ref(60);
// 是否发送了验证码 防止连点
const isSend = ref(false);
// 加载，发送中
const loading = ref(false)
const handleEmailCode = () => {
  //if (isSend.value || counts.value != 60) return;
  isSend.value = true;
  loading.value = true;
  sendEmailCode(ruleForm).then((res) => {
    loading.value = false;
    console.log(res);
    if (res.success){
      ElMessage.success("发送成功")
    }
    else {
      ElMessage.error("发送失败，请重试")
    }
  })
  // 每秒计时
  timer = setInterval(() => {
    counts.value--;
    if (counts.value < 0) {
      clearInterval(timer);
      counts.value = 60;
      isSend.value = false;
    }
  }, 1000);
  
}

const handleJumpLogin = () => {
  router.push('/login')
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