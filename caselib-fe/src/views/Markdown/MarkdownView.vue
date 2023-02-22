<template>
  <div class="bg-white m-1 flex-1 p-8 box-border overflow-auto block">
    <!--折叠栏：标题，附件，md编辑器-->
    <el-collapse v-model="activeNames">
      <el-collapse-item title="标题" name="1">
        <!--案例头部信息-->
        <el-form 
            ref="caseHeaderRef"
            :model="caseHeader" 
            status-icon
            :rules="caseHeaderRules"
            label-width="100px">
            <el-form-item label="文章标题" prop="title" class="mt-4">
                <el-input v-model="caseHeader.title" style="width: 80%"/>
            </el-form-item>
            <el-form-item label="简介" prop="summary" >
                <el-input v-model="caseHeader.summary" type="textarea" :rows="5" style="width: 80%"/>
            </el-form-item>
            <el-form-item label="可见等级" prop="visible">
                <el-radio-group v-model="caseHeader.visible">
                    <el-radio :label="0">仅自己可见</el-radio>
                    <el-radio :label="1">所有人可见</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="附件" name="2">
        <!--展示已上传的附件-->
        <!--上传附件，手动上传-->
        <el-upload
          action="http://kkysl.free.svipss.top/case/uploadFile"
          multiple
          v-model:file-list = "fileList"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
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
            action=""
            :before-upload="beforeUploadMd"
            :limit="1"
            show-file-list=false
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
          v-model="caseBody.content" 
          width="400px"
          @onSave="onSave" 
          @onUploadImg="onUploadImg"/>
      </el-collapse-item>
    </el-collapse>
    <div class="fixed inset-x-0 bottom-0 text-center">
      <el-button type="primary" @click="handleSubmit" class="w-2/5">提交</el-button>
      <el-button @click="handleSaveAndReload" class="w-2/5">保存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onBeforeUnmount } from 'vue'
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
import { uploadImg } from '@/request/api/file'
import {
  insertCaseHeader, 
  getCaseHeader, 
  updateCaseHeader, 
  updateCaseBody, 
  getCaseBodyByCaseId,
  exportMarkdownFile} from '@/request/api/case'
import type {ICaseBody, ICaseHeader} from '@/type/case'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { key } from '@/store'
const props = defineProps<{
  caseId?: number,
}>()
// 初始化内容
const activeNames = ref(['1','2','3'])
// 获取store
const store = useStore(key);
var caseBody = ref<ICaseBody>({
  content: '# Hello Editor',
  appendix: '',
  version: 0,
})
var caseHeader = ref<ICaseHeader>({
  id: undefined,
  title: '',
  summary: '',
  authorId: store.state.id,
  state: 0,
  visible: 1,
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
var timer: number
// 该方法在页面初始化，刷新时被调用
onMounted(() => {
  console.log(props.caseId);
  
  // 每5分钟存一次md文本
  timer = setInterval(onSave, 1000 * 60 * 5)
  reload()
  // 当用户打开页面时：若是新建的案例，则先新建案例头；否则从后端获取当前md文本内容
  // 设置定时器，每5分钟提交一次内容（或是存放到本地缓存localStorage）
  // 当用户不在当前页面时，停止计时
  // 当用户点击保存，将当前数据提交到后端（这会是个同步调用）
  // 当用户关闭页面，清空缓存
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
  console.log(document.visibilityState)
  let state = document.visibilityState
  if (state == 'hidden'){
      console.log(document.visibilityState,'用户离开了')
  }
  if (state == 'visible'){
      console.log(document.visibilityState,'回来了')
  }
})
// 上传前，检查上传文件大小
const beforeUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
  let fileName = rawFile.name
  let fileType = fileName.substring(fileName.lastIndexOf("."))
  if (fileType === ".rar" || fileType === ".zip" || fileType === ".doc" || 
  fileType === ".docx" || fileType === ".pdf" || fileType === ".ppt" ) {
    if (rawFile.size / 1024 / 1024 > 5) {
      ElMessage.error('上传文件的大小应当在5MB之内!')
      return false
    }
  } 
  else {
    ElMessage.error('上传文件的格式应当为rar,zip,doc,docx,pdf,ppt')
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
      caseBody.value.content = reader.result
      ElMessage.success("导入成功")
    }
    else {
      ElMessage.error("导入失败")
    }
  }
}

// 后端将casebody中的content转化为文件，返回文件流，前端下载
const handleExport = () => {
  exportMarkdownFile(caseBody.value).then((res) => {
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
var appendixList: string[]=[]
const fileList = ref<UploadUserFile[]>([])
// 加载案例头部以及内容
const reload = () => {
  let body = localStorage.getItem('body')
  if (caseHeader.value.id === undefined){
    caseHeader.value.id = props.caseId
  }
  // 若存在caseId,则从数据库获取案例内容
  if (caseHeader.value.id !== undefined){
    getCaseHeader(caseHeader.value.id).then((res)=>{
      if (res.msg === 'success'){
        caseHeader.value = res.data 
      }
    })
    getCaseBodyByCaseId(caseHeader.value.id).then((res) => {
      if (res.msg === 'success'){
        caseBody.value = res.data 
        if (caseBody.value.appendix !== undefined){
          // 处理附件
          appendixList = caseBody.value.appendix.split("")
          // 将附件加入
          appendixList.forEach(appendix => {
            var file: UploadUserFile = {
              name: appendix.split(".")[0],
              url: appendix,
            }
            fileList.value.push(file)
          })
        }
      }
    })
  }
  if (body) {
    // 假设本地有缓存，则使用缓存
    caseBody.value.content = body
  }
}

// Promise: 插入一个新的案例头，获取并返回案例id
const pCaseHeaderInsert = () => {
  return new Promise((resolve, reject) => {
    insertCaseHeader(caseHeader.value).then((res) => {
      if (res.msg ===  'success'){
        caseHeader.value.id = res.data
        caseBody.value.caseId = res.data
        resolve(res.data)
      }
      else {
        reject('fail')
      }
    })
    .catch((error) => {reject(error)})
  })
}
// Promise: 更新caseheader
const pCaseHeaderSave = () => {
  return new Promise((resolve, reject) => {
    updateCaseHeader(caseHeader.value).then((res) => {
      if (res.msg ===  'success'){
        console.log("success");
        resolve(res.data)
      }
      else {
        console.log("fail");
        reject('fail')
      }
    })
    .catch((error) => reject(error))
  })
}
// Promise: 提交casebody
const pCaseBodySave = () => {
  return new Promise((resolve, reject) => {
    updateCaseBody(caseBody.value).then((res) => {
      if (res.msg ===  'success'){
        console.log("success");
        resolve(res.data)
      }
      else {
        console.log("fail");
        reject('fail')
      }
    })
    .catch((error) => reject(error))
  })
}
// 保存内容并且刷新界面
const handleSaveAndReload = ()=>{
  // 还没有提交，说明还在草稿阶段
  caseHeader.value.state = 0;
  handleSave();
  reload()
}
// 全部保存，header和body
const handleSave = () => {
  // 组装附件
  let appendixList:string[] = []
  fileList.value.forEach(file => {
    if (file.url !== undefined){
      appendixList.push(file.url)
    }
  });
  caseBody.value.appendix = appendixList.join(";")
  console.log(caseBody.value.appendix);
  console.log(fileList.value);
  console.log(caseHeader.value.id)
  if (caseHeader.value.id === undefined){
    // 先提交header，获取id后再提交body
    pCaseHeaderInsert().then(pCaseBodySave).then(()=>{
      ElMessage.success("保存成功")
    })
    .catch((error) => {
      ElMessage.error("保存失败")
      console.log(error)
    })
  }
  else {
    // 同时更新header和body
    console.log("here");
    pCaseHeaderSave().then(pCaseBodySave).then(() => {
      ElMessage.success("保存成功")
    })
    .catch((error) => {
      ElMessage.error("保存失败")
      console.log(error)
    })
  }
  reload()
}
// 发布案例：把state改为1,version+1,提交header和body
const handleSubmit = () => {
  caseHeader.value.state = 1
  caseBody.value.version ++
  handleSave()
  // 跳转到待审核页面,....
  //var router = useRouter()
  //router.push('/')
}
// 保存文章，点击保存案件或是快捷键触发
// v为markdown形式文本，h为html形式文本
const onSave = (v: string, h: Promise<string>) => {
  console.log(caseHeader.value.title);
  
  // console.log(v)
  // h.then((html) => {
  //   console.log(html)
  // })
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
        uploadImg(form).then((res) => {
          console.log(res)
          resolve(res.data)
        })
          .catch((error) => reject(error))
      })
    })
  )
  callback(res.map((item:any) => item.data.url))
}

</script>

<style scoped>

</style>