<template>
    <div style="padding: 10px">
        <!--功能区域-->
        <div style="margin: 10px 0">
            <el-button type="primary" @click="add">新增</el-button>
        </div>
        <!--搜索区域-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder="请输入标签名称" clearable style="width: 20%"/>
            <el-button type="primary" style="margin-left: 5px" @click="load">查询</el-button>
        </div>
  
        <!--表格数据展示区域-->
        <!--border 边框 stripe 斑马纹 sortable 代表排序-->
        <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column prop="uid" label="员工序号" sortable/>
            <el-table-column prop="uname" label="员工名称" sortable/>
            <el-table-column prop="upwd" label="员工密码" sortable/>
            <el-table-column prop="sex" label="性别" sortable>
                <template #default="scope">
                    <span v-if="scope.row.sex === '1'">男</span>
                    <span v-if="scope.row.sex === '2'">女</span>
                    <span v-if="scope.row.sex === '3'">未知</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址" sortable/>
            <el-table-column label="Operations">
                <template #default="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-popconfirm title="确认删除吗?" @confirm="handleDelete(scope.row.uid)">
                        <template #reference>
                            <el-button size="mini" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
  
      <div style="margin: 10px 0">
        <el-pagination
            v-model:currentPage="currentPage"
            :page-sizes="[5, 10, 15]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        >
        </el-pagination>
  
        <el-dialog v-model="dialogFormVisible" title="员工更改" width = "30%">
          <el-form :model = "form" label-width="120px">
            <el-form-item label="员工名称">
                <el-input v-model="form.uname" style="width: 80%"> </el-input>
            </el-form-item>
            <el-form-item label="员工密码">
              <el-input v-model="form.upwd" style="width: 80%"> </el-input>
            </el-form-item>
            <el-form-item label="员工性别">
              <el-radio v-model="form.sex" label="1">男</el-radio>
              <el-radio v-model="form.sex" label="2">女</el-radio>
              <el-radio v-model="form.sex" label="3">未知</el-radio>
            </el-form-item>
            <el-form-item label="员工地址">
              <el-input type = "textarea" v-model="form.address" style="width: 80%"> </el-input>
            </el-form-item>
          </el-form>
  
          <template #footer>
            <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="save">确认</el-button>
            </span>
          </template>
        </el-dialog>
  
      </div>
    </div>
  </template>
  
  <script lang="ts">
  
  
  
  
  import request from "../request";
  import { ElMessage } from 'element-plus'
  
  export default {
    name: 'Home',
    components: {
  
    },
  
    created() {
      this.load()
    },
  
    data() {
      return {
        search:'',
        currentPage:1,
        pageSize:10,
        total:0,
        dialogFormVisible:false,
        form:{},
  
        tableData: [
  
        ]
      }
    },
  
    methods:{
      handleEdit(row){
        // 深拷贝
        this.form = JSON.parse(JSON.stringify(row))
        this.dialogFormVisible = true
      },
      handleSizeChange(pageSize){ // 改变当前每页的个数触发
        this.pageSize = pageSize
        this.load()
      },
      handleCurrentChange(pageNum){ // 改变当前页码触发
        this.currentPage = pageNum
        this.load()
      },
  
      handleDelete(uid){
        request.delete("/user/" + uid).then(res => {
          if(res.code === '0'){
            ElMessage({
              type:"success",
              message:"删除成功"
            })
          }else{
            ElMessage({
              type:"error",
              message:"删除失败"
            })
          }
          this.load()
        })
      },
      // 打开弹窗 进行新增操作
      add(){
        this.dialogFormVisible = true;
        // 先清空表单属性
        this.form = {}
  
      },
      save(){
        if(this.form.uid){
          request.put("/user", this.form).then(res => {
            console.log(res)
            if(res.code === '0'){
              ElMessage({
                type:"success",
                message:"更新成功"
              })
            }else{
             ElMessage({
                type:"error",
                message:"更新失败"
              })
            }
  
            this.load() // 刷新数据
            this.dialogFormVisible = false //关闭弹窗
          })
        }
        else{
          request.post("/user", this.form).then(res => {
            console.log(res)
            if(res.code === '0'){
              ElMessage({
                type:"success",
                message:"增加成功"
              })
            }else{
              ElMessage({
                type:"error",
                message:"增加失败"
              })
            }
  
            this.load() // 刷新数据
            this.dialogFormVisible = false //关闭弹窗
          })
        }
      },
  
      load(){
        request.get("/user",{
          params:{
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            search: this.search
          }
        }).then(res => {
          console.log(res)
          this.tableData = res.data.records
          this.total = res.data.total
        })
      }
  
    }
  }
  </script>
  