<template>
  <div>
    <h1>병원 그룹 관리</h1>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button @click="handleEdit" type="primary">등록</el-button>
      </el-col>
    </el-row>
    <!-- 목록 -->
    <el-row class="last">
      <el-table :data="groupList" height="500px" style="width: 100%">
        <el-table-column prop="groupCd" label="그룹코드"></el-table-column>
        <el-table-column prop="groupNm" label="그룹명"></el-table-column>
        <el-table-column prop="url" label="URL"></el-table-column>
        <el-table-column prop="title" label="인사말"></el-table-column>
        <el-table-column prop="description" label="설명"></el-table-column>
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
          width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit('group', scope.row)">그룹</el-button>
            <el-button
              size="mini"
              @click="handleEdit('group_hospitals', scope.row)">그룹병원</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--//end 목록 -->

    <!-- 그룹관리 -->
    <el-drawer v-if="manageMode == 'group'"
        :title="formCreateMode ? '그룹 등록' : '그룹 수정'" 
        :visible.sync="isDrawOpen" direction="rtl" :before-close="handleDrawer" size="50%" :wrapperClosable="false">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form :model="formData" :rules="ruleCreate" ref="form" label-width="30%">
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
            <el-form-item label="인사말" prop="title">
              <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="설명" prop="description">
              <el-input v-model="formData.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
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
            
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-button @click="createGroup" type="primary">{{formCreateMode ? '그룹생성' : '그룹수정'}}</el-button>
        </el-col>
      </el-row>  
    </el-drawer>
    <!--//end 그룹관리 -->
    
    <!-- 그룹병원 관리 -->
    <GroupHospitalsVue v-else :groupCd="groupCd"/>
    <!--//end 그룹병원 관리 -->
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';

import GroupHospitalsVue from '../../components/system/groupHospitals.vue';

export default {
  name : 'groupVue',
  data(){
    return {
      formData : {
        groupCd : '',
        groupNm : '',
        enabled : true,
        url : 'http://127.0.0.1',
        title : '',
        description : '',
        hospitals : [],
      },
      ruleCreate : {
        groupCd: [{required : true, message: '그룹코드는 필수 입니다.', trigger: 'blur'}],
        groupNm: [{required : true, message: '그룹이름은 필수 입니다.', trigger: 'blur'}],
        // url: [{required : true, message: 'URL은 필수 입니다.', trigger: 'blur'}], // url 패턴 추가(pattern:/\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*/,)
        title: [{max:1000, message: '최대 1000자 까지 입력할 수 있습니다.', trigger: 'blur'}],
        description: [{max:1000, message: '최대 1000자 까지 입력할 수 있습니다.', trigger: 'blur'}],
      },
      groupCd : '',
      groupList : [],
      formCreateMode : true, // true:등록, false:수정
      manageMode : 'group', // group:그룹병원 관리, group_hospitals:그룹 관리
    }
  },
  computed:{
    ...mapGetters({
      isDrawOpen : 'isDrawOpen',
    })
  },
  components : {GroupHospitalsVue},
  created(){
    this.getGroupList();
  },
  methods: {
    createGroup(){

      this.$refs.form.validate((valid) => {
        if (!valid){
          this.$message.error('필수 정보를 입력해 주세요.');
          return false;
        }
        this.$customAxios(this.formCreateMode ? this.$apis.post_group_v2 : this.$apis.put_group_v2, 
          {...this.formData}, 
          this.respAction);
      });
    },
    // 수정 form 완료 이벤트
    respAction(response){
      this.$message({
        message: this.formCreateMode ? '그룹정보를 등록 하였습니다.' : '그룹정보를 수정 하였습니다.',
        type: 'success'
      });
      this.$refs['form'].resetFields();
      this.getGroupList();
      this.closeDrawer();
    },
    getGroupList(){
      this.$customAxios(this.$apis.get_groups, {}, this.setGroupList);
    },
    setGroupList(response){
      this.groupList = response.body && Array.isArray(response.body) ? response.body : [];
    },
    // 수정 form 이벤트
    handleEdit(cd, d){
      this.manageMode = typeof cd == 'string' ? cd : 'group';
      
      if (d){
        Object.keys(d).forEach(key => {
          this.formData[key] = d[key];
        });
        this.formCreateMode = false;
        
        if (this.manageMode == 'group_hospitals'){
          // 그룹병원 관리
          this.groupCd = d.groupCd;
        }
      } else {
        if (this.$refs['form']){
          this.$refs['form'].resetFields();
        }
        this.formCreateMode = true;
      }
      
      this.openDrawer();
    },
    handleDrawer(close){
      this.closeDrawer();
      // close();
    },
    // ...mapMutations(['setGroupCd', 'setGroupHospitals']),
    ...mapActions(['openDrawer', 'closeDrawer']),
  }
};
</script>