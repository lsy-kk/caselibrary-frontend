<template>
    <div class="w-full h-full fixed min-h-full p-1 text-center"
        :style="{backgroundImage:'url('+bgImg+')', backgroundSize: '100% 100%'}">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            status-icon
            :rules="rules"
            label-width="50px"
            class="max-w-xl mx-auto mt-28 py-4 px-4 rounded-2xl bg-white"
        >
            <h2 class="m-4 mx-auto">修改密码</h2>
            <el-form-item label="密码" prop="pass" label-width="6rem" class="mr-8">
              <el-input 
                v-model="ruleForm.pass" 
                type="password" 
                autocomplete="off" 
                show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass" label-width="6rem" class="mr-8">
              <el-input
                v-model="ruleForm.checkPass"
                type="password"
                autocomplete="off"
                show-password />
            </el-form-item>
            <!--两个点击按钮-->
            <div class="my-4">
              <el-button type="primary" class="w-1/3 mx-auto" 
                @click="submitForm(ruleFormRef)">提交</el-button>
              <el-button class="w-1/3 mx-auto" 
                @click="resetForm(ruleFormRef)">重置</el-button>
            </div>
            
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMain, ElMessage, FormInstance } from 'element-plus'
import bgImg from '@/assets/background/red-bg.png'
import { updatePassword } from '@/request/api/user'
import { IUser } from '@/type/user';
import { store } from '@/store';
import router from '@/router';
const ruleFormRef = ref<FormInstance>()
// 检查输入密码的合法性
const validatePass = (rule: any, value: any, callback: any) => {
  //必须包含大小写字母和数字，长度在6-20位之间
  var regex = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}")
  if (value === "") {
      callback(new Error("请输入密码"));
  } 
  else if (value.length < 6 || value.length > 20) {
    callback(new Error("密码的长度应当在6~20之间"));
  } 
  else if (!regex.test(value)) {
    callback(new Error("密码必须同时包含字母和数字"));
  } 
  else {
    callback();
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
      let user: IUser = {
        id: store.state.id,
        password: ruleForm.pass,
      }
      updatePassword(user).then((res) => {
        ElMessage.success("修改密码成功")
        router.go(-1)
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

<style lang="scss" scoped>
</style>