<template>
  <div>
    <h1>병원 기본 정보 관리</h1>
    <el-row>
      <el-col>
        <el-button @click="handleOpenDrawer" type="primary">등록</el-button>
      </el-col>
    </el-row>
    <el-row class="last">
      <el-table :data="hospitalList" height="500px" style="width: 100%">
        <el-table-column prop="hospitalCd" label="병원코드" width="150"></el-table-column>
        <el-table-column prop="hospitalNm" label="병원명"></el-table-column>
        <el-table-column prop="url" label="URL"></el-table-column>
        <el-table-column prop="enabled" label="사용여부" width="150">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.enabled ? 'primary' : 'info'"
              disable-transitions>{{scope.row.enabled ? '사용' : '미사용'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="관리"
          width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">수정</el-button>
            <!-- <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Delete</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-drawer :title="formCreateMode ? '병원 기본 정보 등록' : '병원 기본 정보 수정'" 
        :visible.sync="drawerForm" direction="rtl" :before-close="handleDrawer" size="50%">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form :model="formCreateHospital" :rules="ruleCreate" ref="form" label-width="30%">
            <el-form-item label="병원코드" prop="hospitalCd">
              <el-input v-model="formCreateHospital.hospitalCd"></el-input>
            </el-form-item>
            <el-form-item label="병원이름" prop="hospitalNm">
              <el-input v-model="formCreateHospital.hospitalNm"></el-input>
            </el-form-item>
            <!-- <el-form-item label="멀티병원 이름" prop="prefix">
              <el-input v-model="formCreateHospital.prefix"></el-input>
            </el-form-item> -->
            <el-form-item label="URL" prop="url">
              <el-input v-model="formCreateHospital.url" placeholder="http://wwww.hospital.kr">
                <template slot="prepend">http://</template>
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="Push Key" prop="accKey">
              <el-input v-model="formCreateHospital.accKey"></el-input>
            </el-form-item> -->
            <el-form-item label="사용여부" prop="enabled">
              <el-switch v-model="formCreateHospital.enabled"
                active-text="사용" inactive-text="미사용">
              </el-switch>
            </el-form-item>
            <!-- <el-form-item label="통합계정 사용여부" prop="sso_yn">
              <el-switch v-model="formCreateHospital.sso_yn"
                active-text="사용" inactive-text="미사용">
              </el-switch>
            </el-form-item> -->
        
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-button @click="createHospital" type="primary" v-if="formCreateMode">병원생성</el-button>
          <el-button @click="updateHospital" type="primary" v-if="!formCreateMode">병원수정</el-button>
        </el-col>
      </el-row>
    </el-drawer>
    
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name : 'hospitalManageVue',
  data(){
    return {
      // hospitalList : [],
      formCreateMode : true, // true:등록, false:수정
      formCreateHospital : {
        hospitalNm : '',
        hospitalCd : '',
        url : '',
        enabled : true,
        sso_yn : false,
      },
      ruleCreate : {
        hospitalNm: [{required : true, message: '병원이름은 필수 입니다.', trigger: 'blur'}],
        hospitalCd: [{required : true, message: '병원코드은 필수 입니다.', trigger: 'blur'}],
        url: [{required : true, message: 'URL은 필수 입니다.', trigger: 'blur'}], // url 패턴 추가(pattern:/\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*/,)
      },
      drawerForm : false,
    }
  },
  computed:{
    ...mapGetters({
      hospitalList : 'getHospitals',
    })
  },
  async fetch(){
    // this.$customAxios(this.$apis.get_hospitals_v2, {}, this.setHospitalList);
    await this.$store.dispatch('loadHospitals');
  },
  methods: {
    createHospital(){
      this.formCreateMode = true;

      this.$refs.form.validate((valid) => {
        if (!valid){
          console.error('유효성검사 오류');
          return false;
        }

        this.$customAxios(this.$apis.post_hospitals_v2, this.formCreateHospital, (response) => {
          this.$message({
            message: '병원을 등록 하였습니다.',
            type: 'success'
          });
          this.reloadHospitals(); // 변경된 병원정보 갱신
        });
      });
    },
    updateHospital(){

      this.$refs.form.validate((valid) => {
        if (!valid){
          console.error('유효성검사 오류');
          return false;
        }
        console.error('병원 수정 API 필요');
        // TODO 병원 수정
        // this.$customAxios(this.$apis.post_hospitals_v2, this.formCreateHospital, (response) => {
        //   console.log('done');
        // });
      });
    },
    // 수정 form 이벤트
    handleEdit(i, d){
      this.formCreateMode = false;

      Object.keys(d).forEach(key => {
        console.log(key, d[key]);
        this.formCreateHospital[key] = d[key];
      });
      this.drawerForm = true;
    },
    ...mapActions({
      reloadHospitals : 'reloadHospitals'
    }),
    // drawer 이벤트
    handleOpenDrawer(){
      if (this.$refs['form']){
        this.$refs['form'].resetFields();
      }

      this.drawerForm = true;
    },
    handleDrawer(close){
      this.$refs['form'].resetFields();
      close();
    }
  }
};
</script>
<style scoped>
.el-row {margin-bottom: 20px;}
.el-row.last {margin-bottom: 0;}
</style>