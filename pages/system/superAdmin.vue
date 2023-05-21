<template>
  <el-form :model="formData" :rules="ruleCreate" ref="form" label-width="30%">
    <h1>신규 병원 관리자 생성</h1>
    <el-form-item label="대상 병원" prop="hospitalCd">
      <el-select v-model="formData.hospitalCd" filterable 
        no-data-text="병원 정보 조회 실패" placeholder="병원을 선택하세요.">
        <el-option
          v-for="item in hospitals"
          :key="item.hospitalCd"
          :label="item.hospitalNm"
          :value="item.hospitalCd">
          <span class="fl-l">{{ item.hospitalNm }}</span>
          <span class="fl-r">{{ item.hospitalCd }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    
    <el-form-item label="통합관리자(mcare) 계정" prop="username">
      <el-input v-model="formData.username">
        <template slot="prepend">@</template>
      </el-input>
    </el-form-item>
    <el-form-item label="통합관리자(mcare) 사용자 이름" prop="fullname">
      <el-input v-model="formData.fullname"></el-input>
    </el-form-item>
    
    <el-button @click="createAdmin" type="primary">관라자 추가</el-button>
  </el-form>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'superAdminVue',
  data(){
    return {
      formData : {
        hospitalCd : '',
        username : '', // account@email.com
        fullname : '',
        enabled : true,
        roles : [],
      },
      ruleCreate : {
        hospitalCd: [{required : true, message: '대상 병원은 필수 입니다.', trigger: 'change'}],
        username: [{required : true, message: '계정은 필수 입니다.', trigger: 'blur'}],
        fullname: [{required : true, message: '사용자 이름은 필수 입니다.', trigger: 'blur'}],
      },
      // hospitals : []
    }
  },
  computed:{
    ...mapGetters({
      hospitals : 'getHospitals',
    })
  },
  async fetch(){
    // this.$customAxios(this.$apis.get_hospitals_v2, {}, this.setHospitalList);
    await this.$store.dispatch('loadHospitals');
  },
  created(){
    // 권한 조회
    // this.$axios.get('/apis/admin/api/roles/v1', this.formData)
    // .then((response)=> {
    //   console.log(response);
    // })
    // .catch((error)=> {
    //   console.error(error);
    // });
    // this.$customAxios(this.$apis.get_hospitals_v2, (response) => {
    //   console.log('전체 병원 정보 조회', response);
    //   // this.hospitals = response;
    // });
  },
  methods: {
    createAdmin(){
      this.$refs.form.validate((valid) => {
        if (!valid){
          console.error('유효성검사 오류');
          return false;
        }
        console.log('ok', this.formData);
        this.$customHeaderAxios(this.$apis.post_admins_v2, this.formData, (response) => {
          console.log('done');
        });
      });
    }
  }
}
</script>

<style scoped>
.el-form{max-width: 684px;}
</style>