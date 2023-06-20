<template>
  <div>
    <h1>화면(Config) 관리</h1>
    <el-row>
      <el-col :span="10">
        <el-select v-model="targetHospital" filterable value-key="hospitalCd"
          no-data-text="병원 정보 조회 실패" placeholder="대상 병원을 선택하세요." default-first-option
          @change="getConfigList">
          <el-option
            v-for="item in hospitals"
            :key="item.hospitalCd"
            :label="item.hospitalNm"
            :value="item">
            <span class="fl-l">{{ item.hospitalNm }}</span>
            <span class="fl-r">{{ item.hospitalCd }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="10" v-show="targetHospital && targetHospital.hospitalCd">
        <el-button @click="handleEdit('create')" type="primary">등록</el-button>
        <el-button @click="initConfig" type="warning" icon="el-icon-refresh" circle=""></el-button>
      </el-col>
    </el-row>

    <!-- 목록 -->
    <el-row class="last">
      <el-table :data="configList" height="500px" style="width: 100%">
        <el-table-column prop="hospitalCd" label="요양기관번호" width="130"></el-table-column>
        <el-table-column prop="name" label="병원명" width="150"></el-table-column>
        <el-table-column prop="prefix" label="prefix"></el-table-column>
        <el-table-column prop="locale" label="국제화"></el-table-column>
        <el-table-column prop="address" label="병원주소" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="telno" label="전화번호" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="displayType" label="Type"></el-table-column>
        <el-table-column prop="displayConfigJs" label="javascript" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="displayTheme" label="Theme" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="apiUrl" label="API URL" width="150" show-overflow-tooltip></el-table-column>
        
        <el-table-column
          fixed="right"
          label="관리"
          width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit('edit', scope.row)">수정</el-button>
              <el-button
                size="mini" type="danger"
                @click="handleEdit('delete', scope.row)">삭제</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-drawer :title="this.formMode == 'create' ? '화면(Config) 등록' : '화면(Config) 수정'" 
        :visible.sync="isDrawOpen" direction="rtl" :before-close="handleDrawer" size="50%">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form :model="formData" :rules="ruleCreate" ref="form" label-width="30%">
            <el-form-item label="요양기관번호" prop="hospitalCd">
              <el-select v-model="formData.hospitalCd" filterable disabled
                no-data-text="병원 정보 조회 실패" placeholder="선택하세요." default-first-option>
                <el-option
                  v-for="item in hospitals" value-key="hospitalCd"
                  :key="item.hospitalCd"
                  :label="`${item.hospitalCd} ${item.hospitalNm}`"
                  :value="item.hospitalCd" >
                  <span class="fl-l">{{ item.hospitalNm }}</span>
                  <span class="fl-r">{{ item.hospitalCd }}</span>
                </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="병원명" prop="name">
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="prefix" prop="prefix">
              <el-input v-model="formData.prefix"></el-input>
            </el-form-item>
            <el-form-item label="설명" prop="description">
              <el-input v-model="formData.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
            <el-form-item label="국제화" prop="locale">
              <el-select v-model="formData.locale" placeholder="선택하세요." default-first-option :disabled="formMode != 'create'">
                <el-option value="ko">ko</el-option>
                <el-option value="en">en</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="병원주소" prop="address">
              <el-input v-model="formData.address"></el-input>
            </el-form-item>
            <el-form-item label="전화번호" prop="telno">
              <el-input v-model="formData.telno"></el-input>
            </el-form-item>
            <el-form-item label="Type" prop="displayType">
              <el-input v-model="formData.displayType"></el-input>
            </el-form-item>
            <el-form-item label="javascript" prop="displayConfigJs">
              <el-input v-model="formData.displayConfigJs"></el-input>
            </el-form-item>
            <el-form-item label="Theme" prop="displayTheme">
              <el-input v-model="formData.displayTheme"></el-input>
            </el-form-item>
            <el-form-item label="Naver 지도 링크" prop="locationNaver">
              <el-input v-model="formData.locationNaver"></el-input>
            </el-form-item>
            <el-form-item label="API URL" prop="apiUrl">
              <el-input v-model="formData.apiUrl"></el-input>
            </el-form-item>
            <el-form-item label="apiKey" prop="apiKey">
              <el-input v-model="formData.apiKey"></el-input>
            </el-form-item>
            <el-form-item label="secretKey" prop="secretKey">
              <el-input v-model="formData.secretKey"></el-input>
            </el-form-item>
            <el-form-item label="결제시작시간" prop="allowStart">
              <el-input v-model="formData.allowStart"></el-input>
            </el-form-item>
            <el-form-item label="결제종료시간" prop="allowEnd">
              <el-input v-model="formData.allowEnd"></el-input>
            </el-form-item>
            <el-form-item label="파트너코드" prop="partnerCode">
              <el-input v-model="formData.partnerCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="파트너TaxId" prop="partnerTaxId">
              <el-input v-model="formData.partnerTaxId" disabled></el-input>
            </el-form-item>
            <el-form-item label="timeout" prop="timeout">
              <el-input v-model="formData.timeout"></el-input>
            </el-form-item>
            <el-form-item label="심플 로그인 여부" prop="simpleJoinYn">
              <el-switch v-model="formData.simpleJoinYn"
                active-text="사용" inactive-text="미사용">
              </el-switch>
            </el-form-item>
            <el-form-item label="메인화면 커스텀 여부" prop="customMainYn">
              <el-switch v-model="formData.customMainYn"
                active-text="사용" inactive-text="미사용">
              </el-switch>
            </el-form-item> 
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-button @click="createConfig" type="primary">{{this.formMode == 'create' ? '생성' : '수정'}}</el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name: 'configVue',
  data(){
    return {
      targetHospital : {}, // 대상 병원DB
      configList : [], // 화면(Config) 목록
      formMode : 'create', // 'create': 등록, 'update': 수정, 'delete': 삭제
      formData : {
        allowStart : '0900',
        allowEnd : '1800',
        simpleJoinYn : true, 
      },
      ruleCreate : {
        hospitalCd: [{required : true, message: '요양기관코드는 필수 입니다.', trigger: 'change'}],
        name: [{required : true, message: '병원명은 필수 입니다.', trigger: 'blur'}],
        prefix: [{required : true, message: 'prefix는 필수 입니다.', trigger: 'blur'}],
        // description: [{required : true, message: '설명은 필수 입니다.', trigger: 'blur'}],
        locale: [{required : true, message: '국제화는 필수 입니다.', trigger: 'change'}],
        address: [{required : true, message: '주소는 필수 입니다.', trigger: 'blur'}],
        telno: [{required : true, message: '전화번호는 필수 입니다.', trigger: 'blur'}],
        displayType: [{required : true, message: 'Type은 필수 입니다.', trigger: 'blur'}],
        displayConfigJs: [{required : true, message: 'javascript는 필수 입니다.', trigger: 'blur'}],
        displayTheme: [{required : true, message: 'Theme는 필수 입니다.', trigger: 'blur'}],
        apiUrl: [{required : true, message: 'API URL은 필수 입니다.', trigger: 'blur'}],
        allowStart: [{required : true, message: '결제시작시간은 필수 입니다.', trigger: 'blur'}],
        allowEnd: [{required : true, message: '결제종료시간은 필수 입니다.', trigger: 'blur'}],
      },
    }
  },
  computed:{
    ...mapGetters({
      hospitals : 'getHospitals',
      isDrawOpen : 'isDrawOpen',
    }),
  },
  async fetch(){
    await this.$store.dispatch('loadHospitals');
  },
  methods : {
    getConfigList(){
      if (!this.targetHospital.hospitalCd) {
        // this.$message.error('대상 병원을 선택해 주세요.');
        this.configList = [];
        return false;
      }
      this.$customAxios(this.$apis.get_config_v1, {
        hospitalCd : this.targetHospital.hospitalCd
      }, this.setConfigList);
    },
    setConfigList(response){
      this.configList = response && Array.isArray(response) ? response.filter(d => d ? true : false) : [];
    },
    createConfig(){
      this.$refs.form.validate((valid) => {
        if (!valid){
          this.$message.error('필수 정보를 입력해 주세요.');
          return false;
        }
        this.$customAxios(this.formMode == 'create' ? this.$apis.post_config_v1 : this.$apis.put_config_v1, 
          {...this.formData}, 
          this.respAction);
      });
    },
    initConfig(){
      if (!this.targetHospital.hospitalCd) {
        this.$message.error('대상 병원을 선택해 주세요.');
        return false;
      }

      this.$noContentTypeAxios(this.$apis.post_config_initCache_v2, {hospitalCd : this.targetHospital.hospitalCd}, (response) => {
        this.$message({
          message: '화면(config) - 캐시를 초기화 하였습니다.',
          type: 'success'
        });
        this.getConfigList();
      });
    },
    // 수정 form 완료 이벤트
    respAction(response){
      this.$confirm(`화면(Config)을  ${this.formMode == 'update' ? '수정' : (this.formMode == 'delete' ? '삭제' : '등록')} 하였습니다.
      Redis 캐시를 초기화 할까요 ?`,
      `화면(Config) ${this.formMode == 'update' ? '수정' : (this.formMode == 'delete' ? '삭제' : '등록')} 완료`, {
        confirmButtonText: 'Redis 초기화',
        cancelButtonText: '취소',
        type: 'warning'
      }).then(() => {
        this.initConfig();
      }).catch(() => {
        this.getConfigList();
      });
      
      this.closeDrawer();
    },
    // 수정 form 이벤트
    handleEdit(cd, d){
      this.formMode = cd || '';
      if (this.formMode == 'create'){ // 등록
        this.formData.hospitalCd = this.targetHospital.hospitalCd;
        this.openDrawer();

      } else if (this.formMode == 'edit'){ // 편집
        Object.keys(d).forEach(key => {
          this.formData[key] = d[key];
        });
        console.debug(this.formData)
        this.openDrawer();

      } else if (this.formMode == 'delete'){ // 삭제 
        this.$customAxios(this.$apis.delete_config_v1, d, this.respAction);
      }

    },
    handleDrawer(close){
      this.formData = {
        allowStart : '0900',
        allowEnd : '1800',
        simpleJoinYn : true, 
      };
      this.$refs['form'].resetFields();
      this.closeDrawer();
      // close();
    },
    ...mapActions(['openDrawer', 'closeDrawer']),
  }
}
</script>
