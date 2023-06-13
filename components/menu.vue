<template>
  <el-aside :span="4"  v-bind:style='{"width": (isCollapse? "64px" : "300px" )}' class="el-aside-nav">
    
    <el-menu default-active="active" :collapse="isCollapse" :collapse-transition="true"
        :router="true"
        class="el-menu-nav"
        text-color="#BDC0C3"
        active-text-color="#0AB29A"
        background-color="#313A46">
        <!-- <el-menu-item @click="isCollapse = !isCollapse">
          <i class="el-icon-menu"></i>
          <span slot="title">메뉴</span>
        </el-menu-item> -->

        <!-- <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">홈</span>
        </el-menu-item> -->
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>통합 관리</span>
        </template>
        <el-menu-item index="/system">병원 기본 정보 관리</el-menu-item>
        <el-menu-item index="/system/group">병원 그룹 관리</el-menu-item>
        <el-menu-item index="/system/menu">통합 메뉴 관리</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>병원별 관리</span>
        </template>
        <el-menu-item index="/hospital">통합 관리자 생성</el-menu-item>
        <el-menu-item index="/hospital/redis">Redis 캐시 초기화</el-menu-item>        
      </el-submenu>
    </el-menu>

    <el-footer class="el-footer-nav">
      <el-switch v-model="isCollapse"
          :content="'메뉴 펼치기'" placement="right"
          ></el-switch>
    </el-footer>
  </el-aside>
</template>

<script>
export default{
  name: 'menuVue',
  created(){
    if(window.innerWidth > 788){
      this.isCollapse = false;
    }
  },
  data() {
    return {
      isCollapse: true,
    };
  },
  computed:{
      active(){
          return this.$route.path;
      }
    },
}
</script>
