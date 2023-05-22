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
    <el-form-item label="권한" prop="roles">
      <el-select v-model="formData.roles" 
        value-key="id"
        multiple filterable placeholder="관리자 권한을 선택하세요.">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="통합관리자계정" prop="username">
      <el-input v-model="formData.username">
        <template slot="prepend">@</template>
      </el-input>
    </el-form-item>
    <el-form-item label="통합관리자 사용자 이름" prop="fullname">
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
        roles: [{required : true, message: '관리자 권한은 필수 입니다.', trigger: 'change'}],
        username: [{required : true, message: '계정은 필수 입니다.', trigger: 'blur'}],
        fullname: [{required : true, message: '사용자 이름은 필수 입니다.', trigger: 'blur'}],
      },
    }
  },
  computed:{
    ...mapGetters({
      hospitals : 'getHospitals',
      roles : 'getRoles',
    }),
  },
  async fetch(){
    await this.$store.dispatch('loadHospitals');
    await this.$store.dispatch('loadRoles');
  },
  methods: {
    createAdmin(){
      this.$refs.form.validate((valid) => {
        if (!valid){
          // console.error('유효성검사 오류');
          this.$message.error('필수 정보를 입력해 주세요.');
          return false;
        }
        
        this.$customAxios(this.$apis.post_admins_v2, this.formData, (response) => {
          this.$message({
            message: '통합관리자 계정을 등록 하였습니다.',
            type: 'success'
          });
          this.$refs['form'].resetFields();
        });
      });
    }
  }
}
</script>

<style scoped>
.el-form{max-width: 684px;}
</style>