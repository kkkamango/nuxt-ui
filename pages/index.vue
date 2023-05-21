<template>
  <ul>
    <!-- <li><NuxtLink to="/">처음으로</NuxtLink></li>
    <li><NuxtLink to="/system">신규 병원 관리</NuxtLink></li> -->
  </ul>
</template>

<script>
export default {
  layout: 'default',
  created(){
    this.$router.push({path: '/system'})
  }
}
</script>