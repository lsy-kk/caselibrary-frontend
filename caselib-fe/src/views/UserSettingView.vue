<!--个人信息管理：表单-->
<template>
    <div>
      <el-upload
        class="avatar-uploader"
        :action="url"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-avatar v-if="imageUrl" shape="square" :size="100" fit="fill" :src="imageUrl" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
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
          <el-form-item label="用户权限">
              <el-input v-model="form.authority" style="width: 80%" disabled> </el-input>
          </el-form-item>
          <el-form-item label="用户名称">
              <el-input v-model="form.username" style="width: 80%"> </el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" style="width: 80%"> </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" style="width: 80%" show-password> </el-input>
          </el-form-item>
      </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import type { IUser } from '@/type/user';

const imageUrl = ref('')
const url = import.meta.env.VITE_BASE_URL + "/file/uploadFile"
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('上传的图片格式应当为jpg或png，请重新提交。')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不得超过2MB，请重新提交。')
    return false
  }
  return true
}
var form = ref<IUser>({
    id: undefined,
    email: undefined,
    username: undefined,
    password: undefined,
    authority: undefined
})
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
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>