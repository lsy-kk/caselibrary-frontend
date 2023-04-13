<template>
  <div class="p-5">
  <div class="bg-white m-1 flex-1 p-8 box-border overflow-auto block">
    <!--折叠栏：标题，附件，md编辑器-->
    <el-collapse v-model="activeNames">
      <el-collapse-item title="标题" name="1">
        <!--案例头部信息-->
        <el-form 
            ref="caseHeaderRef"
            :model="caseParam.caseHeader" 
            status-icon
            :rules="caseHeaderRules"
            label-width="100px">
            <el-form-item label="文章标题" prop="title" class="mt-4">
                <el-input v-model="caseParam.caseHeader.title" style="width: 80%"/>
            </el-form-item>
            <el-form-item label="简介" prop="summary" >
                <el-input v-model="caseParam.caseHeader.summary" type="textarea" :rows="5" style="width: 80%"/>
            </el-form-item>
            <el-form-item label="可见等级" prop="visible">
                <el-radio-group v-model="caseParam.caseHeader.visible">
                    <el-radio :label="0">仅自己可见</el-radio>
                    <el-radio :label="1">所有人可见</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="标签" prop="tag">
              <el-select
                v-model="caseParam.newTags"
                multiple
                :multiple-limit="4"
                filterable
                placeholder="请搜索并选择标签（最多4个）"
                style="width: 80%"
              >
                <el-option
                  v-for="(item, index) in optionList.slice(0,6)" 
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="附件" name="2">
        <!--展示已上传的附件-->
        <!--上传附件，手动上传-->
        <el-upload
          :action="url"
          multiple
          v-model:file-list = "fileList"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
          :on-preview="onPreview"
          :on-remove="onRemove"
          :limit="3"
          :on-exceed="onExceed"
          class="w-1/3">
          <el-button type="primary">上传文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              上传的文件应当为rar,zip,doc,docx,pdf,ppt格式，文件大小不应大于5MB
            </div>
          </template>
        </el-upload>
      </el-collapse-item>
      <el-collapse-item title="Markdown文本编辑" name="3">
        <!--md文本的导入导出-->
        <el-col>
          <el-upload
            ref="upload"
            action="url"
            :before-upload="beforeUploadMd"
            :limit="1"
            :show-file-list="false"
            :on-exceed="onExceedMd"
            class="w-1/4">
            <template #trigger>
              <el-button type="primary">导入</el-button>
            </template>
            <el-button type="primary" @click="handleExport" class="ml-4">导出</el-button>
            <template #tip>
              <div class="el-upload__tip">
                上传的文件应当为md格式，大小不应大于2MB
              </div>
            </template>
          </el-upload>
        </el-col>
        
        <!--markdown编辑器-->
        <md-editor 
          previewTheme="vuepress"
          v-model="caseParam.caseBodyVoLatest.content" 
          width="400px"
          @onSave="onSave" 
          @onUploadImg="onUploadImg"/>
      </el-collapse-item>
    </el-collapse>
    <div class="fixed inset-x-0 bottom-0 text-center">
      <el-button type="primary" @click="handleSubmit" class="w-2/5 z-50">提交</el-button>
      <el-button @click="handleSaveAndReload" class="w-2/5 z-50">保存</el-button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive, onBeforeUnmount } from 'vue'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElMessage, genFileId} from 'element-plus'
import type { 
  FormInstance, 
  UploadInstance, 
  UploadProps, 
  UploadUserFile, 
  UploadRawFile,
  UploadFile } from 'element-plus'
import { 
  uploadFile, 
  exportMarkdownFile, 
  deleteFile } from '@/request/api/file'
import {
  submitCaseParam,
  getCaseParam,} from '@/request/api/case'
import { getTagListByPrefix } from '@/request/api/tag'
import type { ICaseParam } from '@/type/case'
import type { ITagVo} from '@/type/tag'
import type { IFileVo } from '@/type/file'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store'
const router = useRouter()
// 初始化内容
const activeNames = ref(['1','2','3'])
const url = import.meta.env.VITE_BASE_URL + "/file/uploadFile"
// 获取store
const store = useStore();
const route = useRoute();
var timer: number
var caseParam = ref<ICaseParam>({
  caseHeader : {
      title: '',
      // 作者id赋值
      authorId: store.state.id,
      state: 0,
      visible: 1,
  },
  caseBodyVoLatest : {
      content: '# Hello Editor',
      appendixList: [],
      state: 0,
      version: 1,
      createTime: '',
      updateTime: '',
  },
  oldTags : [],
  newTags : [],
});
// 该方法在页面初始化，刷新时被调用
onMounted(() => {
  // 每5分钟存一次md文本
  timer = setInterval(onSave, 1000 * 60 * 5)
  clearCase()
  // 载入案例
  reload()
  // 载入标签
  reloadTag('')
})
onBeforeUnmount(() => {
  // 清除定时器
  clearInterval(timer)
  // 清除缓存
  localStorage.removeItem('body')
})
// 刷新或离开界面时触发
window.onbeforeunload = function (e){
  // 弹出弹窗，提示用户保存
}
// 监听用户是否在当前页面
document.addEventListener('visibilitychange',function(e){
  let state = document.visibilityState
  if (state == 'hidden'){
      console.log(document.visibilityState,'用户离开了')
  }
  if (state == 'visible'){
      console.log(document.visibilityState,'回来了')
  }
})
// 清空、重置表单
const clearCase = () => {
  caseParam.value = ({
    caseHeader : {
      title: '',
      authorId: store.state.id,
      state: 0,
      visible: 1,
    },
    caseBodyVoLatest : {
        content: '# Hello Editor',
        appendixList: [],
        state: 0,
        version: 1,
        createTime: '',
        updateTime: '',
    },
    oldTags : [],
    newTags : [],
  })
}
// 监听路由
watch(route, async (newRoute, oldRoute) => {
  // 清除定时器
  clearInterval(timer)
  // 清除缓存
  localStorage.removeItem('body')
  timer = setInterval(onSave, 1000 * 60 * 5)
  clearCase()
  activeNames.value = ['1','2','3']
  fileList.value = []
  reload()
})
// 头部表单
const caseHeaderRef = ref<FormInstance>()
const caseHeaderRules = reactive({
    title: [
    { 
        required: true,
        message: "请输入标题",
        trigger: 'blur'
    },{
        max: 50,
        message: "标题字数应当在50字以内",
        trigger: 'blur'
    }
  ],
  summary: [
    {
      max: 250,
      message: "简介字数应当在250字以内",
      trigger: 'blur'
    }
  ],
  visible: [
    { 
        required: true,
        message: "请选择可见等级",
        trigger: 'blur'
    }
  ],
})

// 选择列表
var optionList = ref<ITagVo[]>([])
const reloadTag = (prefix: String) => {
  if (!optionList.value || optionList.value.length === 0){
    getTagListByPrefix(prefix).then((res) => {
      if (res.success){
        optionList.value = res.data
      }
    })
  }
}
// 上传前，检查上传文件大小
const beforeUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
  let fileName = rawFile.name
  let fileType = fileName.substring(fileName.lastIndexOf(".") + 1)
  if (fileType === "rar" || fileType === "zip" || 
      fileType === "doc" || fileType === "docx" || 
      fileType === "pdf" || fileType === "ppt" || fileType === "pptx" ) {
    if (rawFile.size / 1024 / 1024 > 5) {
      ElMessage.error('上传文件的大小应当在5MB之内!')
      return false
    }
  } 
  else {
    ElMessage.error('上传文件的格式应当为rar,zip,doc,docx,pdf,ppt,pptx')
    return false
  }
  return true
}
// 若提交成功
const onSuccess: UploadProps['onSuccess'] = (response, uploadFile: UploadFile) => {
  if (response.msg ==="success"){
    // 把url取下来，使得其最后赋值给fileList
    uploadFile.url = response.data
    ElMessage.success("上传成功")  
  }
  else {
    ElMessage.error("上传失败，请稍后重试")
  }
}
// 若提交失败
const onError: UploadProps['onError'] = (response, uploadFile) => {
  ElMessage.error("上传失败，请稍后重试")
}
// 附件超出数量
const onExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning("上传文件过多，最多上传3个附件")
}
// 删除某一文件
const onRemove: UploadProps['onRemove'] = (uploadFile) => {
  if (uploadFile.url !== undefined){
    deleteFile(uploadFile.url).then();
  }
}
// 点击文件列表，预览文件
const onPreview: UploadProps['onPreview'] = (uploadFile) => {
  if (uploadFile.url === undefined){
      return
    }
  let fileName = uploadFile.name
  let fileType = fileName.substring(fileName.lastIndexOf(".")+1)
  if (fileType === "ppt" || fileType === "pptx"  || 
      fileType === "pdf" || fileType === "doc" || fileType === "docx"){
    window.open(
      // 备用在线预览-微软官方：https://view.officeapps.live.com/op/view.aspx?src=
      // xdoc文档预览云服务
      `https://view.xdocin.com/view?src=${encodeURIComponent(uploadFile.url)}`
    );
  }
  else {
    ElMessage.warning(`${fileType}类型文件不支持预览`)
  }

}
// 文件选中后，检查参数，然后读取文件
const beforeUploadMd: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
  let fileName = rawFile.name
  let fileType = fileName.substring(fileName.lastIndexOf("."))
  if (fileType !== ".md") {
    ElMessage.error('上传文件的格式应当为.md')
  } 
  else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传文件的大小应当在2MB之内!')
  }
  else {
    readMarkdownFile(rawFile)
  }
  return false
}
const upload = ref<UploadInstance>()
// 超出数量,覆盖原本的导入文件
const onExceedMd: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
// 读取md文件内容
const readMarkdownFile = (file: UploadRawFile) => {
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onerror = () => {
    ElMessage.error("导入失败")
  }
  reader.onload = () => {
    if (typeof reader.result === 'string'){
      caseParam.value.caseBodyVoLatest.content = reader.result
      ElMessage.success("导入成功")
    }
    else {
      ElMessage.error("导入失败")
    }
  }
}

// 后端将casebody中的content转化为文件，返回文件流，前端下载
const handleExport = () => {
  exportMarkdownFile(caseParam.value.caseBodyVoLatest).then((res) => {
    let blob = new Blob([res], {
      type: 'application/force-download'
    })
    let fileName = "mdExport.md"
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  })
}
// 附件列表
const fileList = ref<UploadUserFile[]>([])
// 加载案例头部以及内容
const reload = () => {
  // 获取caseId
  if (caseParam.value.caseHeader.id === undefined){
    caseParam.value.caseHeader.id = Number(route.params.caseId)
    if (caseParam.value.caseHeader.id === 0 || Number.isNaN(caseParam.value.caseHeader.id)){
      caseParam.value.caseHeader.id = undefined
    }
  }
  // 后端获取接口
  if (caseParam.value.caseHeader.id !== undefined){
    getCaseParam(caseParam.value.caseHeader.id).then((res) => {
      if (res.success){
        caseParam.value = res.data
        if (caseParam.value.caseBodyVoLatest.appendixList !== null){
          // 将附件加入
          caseParam.value.caseBodyVoLatest.appendixList.forEach(appendix => {
            var file: UploadUserFile = {
              name: appendix.name,
              url: appendix.url,
            }
            fileList.value.push(file)
          })
        }
      }
    })
  }
  let body = localStorage.getItem('body')
  if (body) {
    // 假设本地有缓存，则使用缓存
    caseParam.value.caseBodyVoLatest.content = body
  }
}
// 保存内容并且刷新界面
const handleSaveAndReload = ()=>{
  handleSave("保存");
  reload()
}
// 全部保存，header和body
// op有两种，保存save和提交submit
const handleSave = (op: String) => {
  // 组装附件
  let appendixList:IFileVo[] = []
  fileList.value.forEach(file => {
    if (file.url !== undefined){
      let appendix:IFileVo = {
        name: file.name,
        url: file.url
      }
      appendixList.push(appendix)
    }
  });
  caseParam.value.caseBodyVoLatest.appendixList = appendixList
  // 后端提交接口
  submitCaseParam(caseParam.value).then((res) => {
    if (res.success){
      console.log(res.data);
      ElMessage.success(op + "成功")
      if (op === "提交"){
        // 跳转到案例页面,....
        router.push({path:`/case/${res.data}`})
      }
    }
    else {
      ElMessage.error(op + "失败")
    }
  }).catch(error => {
    console.log(error);
    ElMessage.error(op + "失败")
  })
}
// 发布案例：把state改为1,提交
const handleSubmit = () => {
  caseParam.value.caseHeader.state = 1
  caseParam.value.caseBodyVoLatest.state = 1
  handleSave("提交")
}
// 保存文章，点击保存案件或是快捷键触发
// v为markdown形式文本，h为html形式文本
const onSave = (v: string, h: Promise<string>) => {
  localStorage.setItem('body', v)
}
// 上传图片，需要返回图片的url
const onUploadImg = async (files: FileList, callback: (urls: string[]) => void) => { 
  const res = await Promise.all(
    Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const form = new FormData()
        form.append('file', file)
        console.log(file)
        uploadFile(form).then((res) => {
          console.log(res)
          resolve(res.data)
        })
          .catch((error) => reject(error))
      })
    })
  )
  callback(res.map((item:any) => item))
}

</script>

<style scoped>
</style>