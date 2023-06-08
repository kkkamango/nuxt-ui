<template>
  <el-header class="white" style="box-shadow: 0 0 8px 4px rgba(0,0,0,0.1); z-index: 1">
    <div class="row flex-warp justify-space-between align-center h-100">
        
        <div>
            <el-image
                style="width: 180px;"
                :src="urlLogo"
                fit="fit"
            >
            </el-image>
            <div style="top: 14px;right: 15px;position: absolute;">
              <el-tag v-if="'dev' == $config.PROFILE" type="success">개발</el-tag>
              <el-tag v-if="'stage' == $config.PROFILE" type="warning">QA</el-tag>
            </div>
          </div>
          
    </div>
</el-header>
</template>

<script>
import urlLogo from 'static/lemon-logo.png'

export default {
  data () {
    return {
      urlLogo: urlLogo
    }
  },
}
</script>