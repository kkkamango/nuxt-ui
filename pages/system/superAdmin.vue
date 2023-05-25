<template>
  <div>
    <h1>신규 병원 관리자 관리</h1>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form label-width="30%">
          <el-form-item label="대상 병원">
            <el-select v-model="targetHospital" filterable value-key="hospitalCd"
              no-data-text="병원 정보 조회 실패" placeholder="대상 병원을 선택하세요.">
              <el-option
                v-for="item in hospitals"
                :key="item.hospitalCd"
                :label="item.hospitalNm"
                :value="item">
                <span class="fl-l">{{ item.hospitalNm }}</span>
                <span class="fl-r">{{ item.hospitalCd }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-button @click="handleOpenDrawer" type="primary">등록</el-button>
      </el-col>
    </el-row>
    <!-- 목록 -->
    <el-row class="last">
      <el-table :data="adminList" height="500px" style="width: 100%">
        <el-table-column prop="username" label="계정" width="200"></el-table-column>
        <el-table-column prop="fullname" label="이름"></el-table-column>
        <el-table-column prop="roles" label="권한" :formatter="formatterRoles"></el-table-column>
        <el-table-column prop="passwordRetryCount" label="누적로그인실패수"></el-table-column>
        <el-table-column prop="accountNonLocked" label="계정잠김여부" width="150">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.accountNonLocked ? 'info' : 'primary'"
              disable-transitions>{{scope.row.accountNonLocked ? '잠김' : '정상'}}</el-tag>
          </template>
        </el-table-column>
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
              @click="handleEdit(scope.$index, scope.row)">관리</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-drawer :title="formCreateMode ? '신규 병원 관리자 등록' : '신규 병원 관리자 수정'" 
        :visible.sync="drawerForm" direction="rtl" :before-close="handleDrawer" size="50%">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form :model="formData" :rules="ruleCreate" ref="form" label-width="30%">
            <el-form-item label="대상 병원" prop="hospitalCd">
              <el-select v-if="formCreateMode" 
                v-model="formData.hospitalCd" filterable 
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
              <el-tag v-else type="info">{{ targetHospital.hospitalNm }}</el-tag>
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
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'superAdminVue',
  data(){
    return {
      targetHospital : {}, // 대상 병원DB
      adminList : [], // 병원DB별 관리자 계정 목록
      formCreateMode : true, // true:등록, false:수정
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
      drawerForm : false,
    }
  },
  computed:{
    ...mapGetters({
      hospitals : 'getHospitals',
      roles : 'getRoles',
    }),
  },
  watch:{
    targetHospital(value){
      console.log('targetHospital', value);
      this.$noContentTypeAxios(this.$apis.get_admins_search_v3, {
        hospitalCd : value.hospitalCd,
        size : 100,
        page : 0,
        roleTypes : 'ROLE_ADMIN%2CROLE_MCARE%2CROLE_CSADMIN%2CROLE_DEVELOPER%2CROLE_MANAGER%2CROLE_OPERATOR%2CROLE_GROUP_ADMIN%2CROLE_NURSE%2CROLE_ASAN'
      }, this.getAdminList);
    }
  },
  async fetch(){
    await this.$store.dispatch('loadHospitals');
    await this.$store.dispatch('loadRoles');
  },
  methods: {
    getAdminList(response){
        this.adminList = response.body && response.body.content || [];
    },
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
    },
    // 수정 form 이벤트
    handleEdit(i, d){
      this.formCreateMode = false;
      console.log(d);
      Object.keys(d).forEach(key => {
        this.formData[key] = d[key];
      });
      this.drawerForm = true;
    },
    handleOpenDrawer(){
      if (this.$refs['form']){
        this.$refs['form'].resetFields();
      }

      this.drawerForm = true;
    },
    handleDrawer(close){
      this.$refs['form'].resetFields();
      close();
    },
    formatterRoles(row, col){ // 테이블 > 권한 표시
      return row.roles.map(d => d.name).join(', ');
    },
  }
}
</script>

<style scoped>
.el-form{max-width: 684px;}
.el-row {margin-bottom: 20px;}
.el-row.last {margin-bottom: 0;}
</style>