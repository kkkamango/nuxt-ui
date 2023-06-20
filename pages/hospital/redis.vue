<template>
  <div>
    <h1>Redis 캐시 초기화</h1>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-select v-model="targetHospital" filterable multiple value-key="hospitalCd"
          no-data-text="병원 정보 조회 실패" placeholder="대상 병원을 선택하세요." default-first-option>
          <el-option
            v-for="item in hospitalList"
            :key="item.hospitalCd"
            :label="item.hospitalNm"
            :value="item">
            <span class="fl-l">{{ item.hospitalNm }}</span>
            <span class="fl-r">{{ item.hospitalCd }}</span>
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row class="last">
      <el-button @click="initMenuTree" type="primary">메뉴 트리</el-button>
      <el-button @click="initConfig" type="primary">화면(config)</el-button>
      <el-button @click="initAlimtalk" type="primary">알림톡 설정</el-button>
      <el-button @click="initAll" type="warning">전체</el-button>
    </el-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name : 'redisVue',
  data(){
    return {
      targetHospital : [], // 대상 병원DB
    }
  },
  computed:{
    // 캐시 초기화 요청 파라미터
    requestParam(){
      return this.targetHospital.length > 0 ? this.targetHospital : this.hospitalList;
    },
    hospitalList(){
      // 등록시 DB 생성 여부 체크
      return this.hospitals.filter(d => d.sso_yn);
    },
    ...mapGetters({
      hospitals : 'getHospitals',
    })
  },
  async fetch(){
    await this.$store.dispatch('loadHospitals');
  },
  methods: {
    initMenuTree(){
      this.$customHeaderAxiosAll(this.$apis.post_menutrees_initCache_v2, this.requestParam, (response) => {
        // console.log('initMenuTree', response);
        this.$message({
          message: '메뉴트리 - 캐시를 초기화 하였습니다.',
          type: 'success'
        });
      });
    },
    initConfig(){
      this.$customHeaderAxiosAll(this.$apis.post_config_initCache_v2, this.requestParam, (response) => {
        // console.log('initConfig', response);
        this.$message({
          message: '화면(config) - 캐시를 초기화 하였습니다.',
          type: 'success'
        });
      });
    },
    initAlimtalk(){
      this.$customHeaderAxiosAll(this.$apis.post_alimtalk_initCache, this.requestParam, (response) => {
        // console.log('initAlimtalk', response);
        this.$message({
          message: '알림톡 설정 - 캐시를 초기화 하였습니다.',
          type: 'success'
        });
      });
    },
    initAll(){
      // console.log('initAll -> promiseAll');
      this.initMenuTree();
      this.initConfig();
      this.initAlimtalk();
    },
    // setHospitalList(response){
    //   this.hospitalList = response.body ? response.body : [];
    // },
  }
};
</script>
