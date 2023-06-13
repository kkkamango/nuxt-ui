<template>
  <el-container class="h-100vh">
    <menuVue/>
    <el-container direction="vertical">
      <headerVue/>
      <el-main>
        <Nuxt />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import menuVue from "../components/menu.vue";
import headerVue from "../components/header.vue";

export default{
  components : {menuVue, headerVue}
}
</script>

<style>
.el-row {margin-bottom: 20px;}
.el-row.last {margin-bottom: 0;}
.el-form{max-width: 684px;}
</style>