<template>
    <!--新建/更新收藏夹，填写信息-->
    <div>
        <el-dialog 
            v-model="visible"
            :title="title" 
            width = "50%"
            @close="close"
            class="px-4"
            draggable>
            <el-form 
                ref="insertFormRef"
                :model="favorites" 
                status-icon
                :rules="insertRules"
                label-width="100px">
                <el-form-item label="图片">
                    <UploadImage :oldImageUrl="String(favorites.image)"
                        @imageUrl="getImageUrl"></UploadImage>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input 
                        v-model="favorites.name"
                        maxlength="50"
                        show-word-limit 
                        placeholder="请输入收藏夹名称" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input 
                        v-model="favorites.description"
                        type="textarea"
                        :autosize="{ minRows: 2}"
                        maxlength="255"
                        show-word-limit
                        placeholder="描述" />
                </el-form-item>
                <el-form-item label="公开收藏夹" prop="visible">
                    <el-checkbox 
                        v-model="favorites.visible" 
                        :true-label = "1"
                        :false-label = "0" />
                </el-form-item>
            </el-form>
            <el-button
                @click="submitForm(insertFormRef)"
                class="sticky mt-2 w-full"
                type="primary">
                确定
            </el-button>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import UploadImage from '@/components/UploadImage.vue'
import { useStore } from '@/store';
import { IFavorites, IFavoritesVo } from '@/type/favorites';
import { insertFavorites, updateFavorites } from '@/request/api/favorites'
import { FormInstance } from 'element-plus';
import { ref, computed, defineEmits, onMounted, reactive } from 'vue'; 
const props = defineProps<{
    favoritesVo?: IFavoritesVo,
    dialogShow: boolean,
}>()
onMounted(() => {
    reset()
})
const store = useStore()
const visible = computed({
  get: () => props.dialogShow,
  set: (value) => {
    // emit('update:modelValue', value)
  },
})
const getImageUrl = (url: string) => {
    favorites.value.image = url  
}
const favorites = ref<IFavorites>({
    id: undefined,
    name: '',
    description:'',
    image: '',
    ownerId: store.state.id,
    visible: 1,
})
const title = ref('')
const reset = () => {
    if (props.favoritesVo){
        favorites.value = {
            id: props.favoritesVo.id,
            name: props.favoritesVo.name,
            description: props.favoritesVo.description,
            image: props.favoritesVo.image,
            ownerId: props.favoritesVo.owner.id,
            visible: props.favoritesVo.visible,
        }
        title.value = "更新收藏夹信息"
    }
    else {
        favorites.value = {
            id: undefined,
            name: '',
            description:'',
            image: '',
            ownerId: store.state.id,
            visible: 1,
        }
        title.value = "新建收藏夹"
    }
}
const insertFormRef = ref<FormInstance>()
// 校验对话框表单输入
const insertRules = reactive({
    name: [{ 
        required: true,
        message: "请输入收藏夹名称",
        trigger: 'blur'
    }],
})
// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
        if (props.favoritesVo){
            updateFavorites(favorites.value).then((res) => {
                successUpdate()
            })
        }
        else {
            insertFavorites(favorites.value).then((res) => {
                successInsert(res.data)
            })
        }
    } 
    else {
      return false
    }
  })
}
const emit = defineEmits<{
    (e: 'dialogClose'): void
    (e: 'dialogSuccessInsert', favoritesVo: IFavoritesVo): void
    (e: 'dialogSuccessUpdate'): void
}>()
const close = () => {
    emit('dialogClose');
}
const successInsert = (newFavoritesVo: IFavoritesVo) => {
    emit('dialogSuccessInsert', newFavoritesVo);
}
const successUpdate = () => {
    emit('dialogSuccessUpdate');
}
</script>

<style scoped>

</style>