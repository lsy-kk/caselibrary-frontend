<!--个人信息管理：表单-->
<template>
    <div>
      <div class="flex max-w-3xl mx-auto mt-8 p-12 rounded-2xl bg-white">
        <UploadImage :oldImageUrl="store.state.image"
          @imageUrl="getImageUrl" class="w-1/4"></UploadImage>
        <el-form 
            ref="updateFormRef"
            :model = "form" 
            status-icon
            :rules="updateRules"
            label-width="100px"
            class="w-full"
        > 
          
            <el-form-item label="用户ID">
                <span>{{ form.id }}</span>
            </el-form-item>
            <el-form-item label="用户权限">
                    <span v-if="form.authority === 0">管理员</span>
                    <span v-if="form.authority === 1">教师</span>
                    <span v-if="form.authority === 2">学生</span>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" style="width: 80%"  disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="username">
                <el-input v-model="form.username" style="width: 80%" 
                  :disabled="!showUsernameUpdate"></el-input>
                <el-button v-if="showUsernameUpdate"
                  class="mx-auto" type="primary" plain
                  @click="showUsernameUpdate=false;form.username=store.state.username">
                  取消更改
                </el-button>
                <el-button v-else
                  class="mx-auto" type="primary" 
                  @click="showUsernameUpdate=true">
                  更改名称
                </el-button>
            </el-form-item>
            <el-form-item label="密码">
                <el-input style="width: 80%" disabled></el-input>
                <el-button class="mx-auto" type="primary" 
                  @click="handlePasswordJump">
                  更改密码
                </el-button>
            </el-form-item>
            <el-form-item>
                <div style="width: 80%" >
                    <el-button class="w-2/5 mx-auto"
                      @click="resetForm(updateFormRef)">重置</el-button>
                    <el-button type="primary" class="w-2/5 mx-auto"
                      @click="submitForm(updateFormRef)">保存</el-button>
                </div>
            </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script setup lang="ts">
import UploadImage from '@/components/UploadImage.vue'
import { ref, reactive, onMounted } from 'vue'
import { useStore } from '@/store'
import { ElMessage, type FormInstance } from 'element-plus'
import type { IUser } from '@/type/user';
import { useRouter } from 'vue-router';
import { updateUser } from '@/request/api/user'
const store = useStore()
const router = useRouter()
const showUsernameUpdate = ref(false)
var form = ref<IUser>({
  id: store.state.id,
  image: store.state.image,
  email: store.state.email,
  username: store.state.username,
  authority: store.state.authority,
})
onMounted(() => {
  reset()
})
const reset = () => {
  form.value = {
    id: store.state.id,
    image: store.state.image,
    email: store.state.email,
    username: store.state.username,
    authority: store.state.authority,
  }
}
const getImageUrl = (url: string) => {
  form.value.image = url  
}
const handlePasswordJump = () => {
  router.push({path:`/reset`})
}
const updateFormRef = ref<FormInstance>()
// 校验表单输入
const updateRules = reactive({
    username: [
      {
          min: 1,
          max: 18,
          message: "用户名的长度应当在1~18之间",
          trigger: 'blur'
      }
    ],
})
// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      updateUser(form.value).then((res) => {
        store.dispatch('reLogin')
        ElMessage.success("修改成功")
      })
    } 
    else {
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

<style scoped>
</style>