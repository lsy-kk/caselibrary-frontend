<template>
    <div class="login-box">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="120px"
            class="demo-ruleForm"
        >
            <el-form-item label="密码" prop="pass">
              <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
            </el-form-item>

            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                  v-model="ruleForm.checkPass"
                  type="password"
                  autocomplete="off"
              />
            </el-form-item>
            <!--两个点击按钮-->
            <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

const ruleFormRef = ref<FormInstance>()

// 检查输入密码的合法性
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}

// 检查再次输入密码的合法性，以及与第一次输入的密码是否相同
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("两次输入的密码不一致，请重新输入"))
  } else {
    callback()
  }
}

// 初始化表单
const ruleForm = reactive({
  pass: '',
  checkPass: '',
})

// 校验输入
const rules = reactive({
  pass: [
    { 
        validator: validatePass, 
        trigger: 'blur' 
    },{
        min: 8,
        max: 20,
        message: "密码的长度应当在8~20之间",
        trigger: 'blur'
    }
  ],
  checkPass: [
    { 
        validator: validatePass2, 
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
    } else {
      console.log('提交失败')
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
    }
</style>