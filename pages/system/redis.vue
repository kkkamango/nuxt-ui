<template>
  <div>
    <h1>Redis 캐시 초기화</h1>
    <el-button @click="initMenuTree" type="primary">메뉴 트리</el-button>
    <el-button @click="initConfig" type="primary">화면(config)</el-button>
    <el-button @click="initAlimtalk" type="primary">알림톡 설정</el-button>
    <el-button @click="initAll" type="warning">전체</el-button>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name : 'redisVue',
  data(){
    return {
      // hospitalList: [],
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
    initMenuTree(){
      this.$customHeaderAxiosAll(this.$apis.post_menutrees_initCache_v2, this.hospitalList, (response) => {
        // console.log('initMenuTree', response);
        this.$message({
          message: '메뉴트리 - 캐시를 초기화 하였습니다.',
          type: 'success'
        });
      });
    },
    initConfig(){
      this.$customHeaderAxiosAll(this.$apis.post_config_initCache_v2, this.hospitalList, (response) => {
        // console.log('initConfig', response);
        this.$message({
          message: '화면(config) - 캐시를 초기화 하였습니다.',
          type: 'success'
        });
      });
    },
    initAlimtalk(){
      this.$customHeaderAxiosAll(this.$apis.post_alimtalk_initCache, this.hospitalList, (response) => {
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
    setHospitalList(response){
      this.hospitalList = response.body ? response.body : [];
      // this.hospitalList = response.body ? response.body.filter(d => d.hospitalCd == '31100767' || d.hospitalCd == '12345678' ) : [];
    },
  }
};
</script>
