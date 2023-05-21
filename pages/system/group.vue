<template>
  <el-form :model="formData" :rules="ruleCreate" ref="form" label-width="30%">
    <h1>병원 그룹 정보 관리</h1>
    <el-form-item label="그룹코드" prop="groupCd">
      <el-input v-model="formData.groupCd"></el-input>
    </el-form-item>
    <el-form-item label="그룹이름" prop="groupNm">
      <el-input v-model="formData.groupNm"></el-input>
    </el-form-item>
    <el-form-item label="URL" prop="url">
      <el-input v-model="formData.url" placeholder="http://wwww.hospital.kr">
        <template slot="prepend">http://</template>
      </el-input>
    </el-form-item>
    <el-form-item label="사용여부" prop="enabled">
      <el-switch v-model="formData.enabled"
        active-text="사용" inactive-text="미사용">
      </el-switch>
    </el-form-item>
    <!-- <el-form-item label="그룹병원" prop="hospitals">
      <el-select v-model="formData.hospitals" 
        value-key="hospitalCd"
        multiple filterable placeholder="그룹에 추가할 병원을 선택하세요.">
        <el-option
          v-for="item in hospitalList"
          :key="item.hospitalCd"
          :label="item.hospitalNm"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item> -->
    
    <el-button @click="createGroup" type="primary">그룹생성</el-button>
  </el-form>
</template>

<script>
export default {
  name : 'groupManageVue',
  data(){
    return {
      formData : {
        groupCd : '',
        groupNm : '',
        enabled : true,
        url : '',
        hospitals : [],
      },
      ruleCreate : {
        groupCd: [{required : true, message: '그룹코드는 필수 입니다.', trigger: 'blur'}],
        groupNm: [{required : true, message: '그룹이름은 필수 입니다.', trigger: 'blur'}],
        url: [{required : true, message: 'URL은 필수 입니다.', trigger: 'blur'}], // url 패턴 추가(pattern:/\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*/,)
      },
      hospitalList : [],
    }
  },
  // fetch(){
  //   this.$customAxios(this.$apis.get_hospitals_v2, {}, this.setHospitalList);
  // },
  methods: {
    createGroup(){
      this.$refs.form.validate((valid) => {
        if (!valid){
          console.error('유효성검사 오류');
          return false;
        }
        this.$customAxios(this.$apis.post_group_v2, this.formData, (response) => {
          console.log('done');
        });
      });
    },
//     그룹 조회 (method=GET)
// /admin-api/api/group/v2
    // setHospitalList(response){
    //   this.hospitalList = response.body ? response.body : [];
    // },
  }
};
</script>
<style scoped>
.el-form{max-width: 684px;}
</style>