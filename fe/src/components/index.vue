<template>
  <div class="index">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="图片主题关键词">
        <el-input v-model="search" placeholder="请输入图片主题关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitFind">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table border stripe :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="题目" width="280">
      </el-table-column>
      <el-table-column prop="lables" label="标签" width="280">
      </el-table-column>
      <el-table-column prop="picUrl" label="图片地址">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="showDelPop(scope.row.index,scope.$index)">删除</el-button>
          <el-button type="primary" size="small" @click="showEditPop(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom-fenye" v-if="allCount">
      <el-pagination background layout="prev, pager, next" :total="allCount" :page-size='limit' @current-change="handleCurrentChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <el-dialog title="编辑界面" center :visible.sync="editFormVisible">
      <el-form :model="form">
        <el-form-item label="题目" :label-width="formLabelWidth">
          <el-input v-model="form.title.now" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="标签" :label-width="formLabelWidth">
          <el-input v-model="form.lables.now" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片地址" :label-width="formLabelWidth">
          <el-input v-model="form.picUrl.now" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.bottom-fenye {
  margin-top: 30px;
  text-align: center;
}

</style>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      search: '',
      tableData: [],
      allCount: 0,
      limit: 8,
      curPageNum: 1,
      editFormVisible: false,
      form: {
        title: {
          pre: "",
          now: ""
        },
        lables: {
          pre: "",
          now: ""
        },
        picUrl: {
          pre: "",
          now: ""
        }
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    onSubmitFind() {
      this.query(0, this.limit, this.search);
      this.getAllCount(this.search);
    },
    handleCurrentChange(val) {
      let that = this;
      that.curPageNum = val;
      that.query((that.curPageNum - 1) * that.limit, that.limit, that.search);
    },
    handleSizeChange(val) {
      console.log("size：" + val);
    },
    showDelPop(index, pos) {
      let that = this;
      this.$confirm('此操作将删除该文件, 是否继续?', '提示信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        that.del(index, pos);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    showEditPop(row) {
      let that = this;
      that.form.title.pre = row.title;
      that.form.lables.pre = row.lables;
      that.form.picUrl.pre = row.picUrl;
      that.form.title.now = row.title;
      that.form.lables.now = row.lables;
      that.form.picUrl.now = row.picUrl;

      that.editFormVisible = true;
    },
    confirmEdit() {
      let that = this;
      that.editFormVisible = false;
      let param = {
        title: {
          pre: that.form.title.pre,
          now: that.form.title.now
        },
        lables: {
          pre: that.form.lables.pre,
          now: that.form.lables.now
        },
        picUrl: {
          pre: that.form.picUrl.pre,
          now: that.form.picUrl.now
        }
      }
      axios.get('http://localhost:3000/update', { params: { param: encodeURIComponent(JSON.stringify(param)) } })
        .then(function(response) {
          console.log(response);
          if (response.data.code == 0) {

            that.query((that.curPageNum - 1) * that.limit, that.limit);
          }


        })
        .catch(function(error) {
          console.log(error);
        });
    },
    del(index, pos) {
      let that = this;
      console.log(index);

      axios.get('http://localhost:3000/del', { params: { i: index } })
        .then(function(response) {
          console.log(response);
          if (response.data.code == 0) {
            that.allCount--;
            that.query((that.curPageNum - 1) * that.limit, that.limit);
          }


        })
        .catch(function(error) {
          console.log(error);
        });
    },
    query(start, limit, search) {
      let that = this;
      axios.get('http://localhost:3000/find', { params: { limit: limit, start: start, search: search } })
        .then(function(response) {
          that.tableData = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getAllCount(search) {
      let that = this;
      axios.get('http://localhost:3000/count?search=' + search)
        .then(function(response) {
          console.log(response);
          if (response.data.code == 0) {
            that.allCount = response.data.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    getQueryPageOneRequest() {
      let that = this;
      return axios.get("http://localhost:3000/find?start=0&limit=" + that.limit);
    },

    getAllCountRequest() {
      return axios.get("http://localhost:3000/count");
    }

  },
  mounted() {
    let that = this;
    //this.query(0, that.limit);
    //this.getAllCount();
    axios.all([that.getAllCountRequest(), that.getQueryPageOneRequest()])
      .then(axios.spread(function(res1, res2) {
        that.tableData = res2.data.data;
        that.allCount = res1.data.data;
      }));
  }
}

</script>
