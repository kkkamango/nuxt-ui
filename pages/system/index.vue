<template>
  <div>
    <h1>병원 기본 정보 관리</h1>
    <el-row>
      <el-col>
        <el-button @click="handleEdit" type="primary">등록</el-button>
      </el-col>
    </el-row>
    <el-row class="last">
      <el-table :data="hospitalList" height="500px" style="width: 100%">
        <el-table-column prop="hospitalCd" label="병원코드" width="150"></el-table-column>
        <el-table-column prop="hospitalNm" label="병원명"></el-table-column>
        <el-table-column prop="url" label="URL"></el-table-column>
        <el-table-column prop="enabled" label="사용여부" width="150">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.enabled ? 'primary' : 'info'"
              disable-transitions>{{scope.row.enabled ? '사용' : '미사용'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sso_yn" label="Data Source" width="150">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.sso_yn ? 'primary' : 'danger'"
              disable-transitions>{{scope.row.sso_yn ? '생성' : '생성전'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="관리"
          width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">수정</el-button>
            <!-- <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Delete</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-drawer :title="formCreateMode ? '병원 기본 정보 등록' : '병원 기본 정보 수정'" 
        :visible.sync="isDrawOpen" direction="rtl" :before-close="handleDrawer" size="50%">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form :model="formData" :rules="ruleCreate" ref="form" label-width="30%">
            <el-form-item label="병원코드" prop="hospitalCd">
              <el-input v-model="formData.hospitalCd"></el-input>
            </el-form-item>
            <el-form-item label="병원이름" prop="hospitalNm">
              <el-input v-model="formData.hospitalNm"></el-input>
            </el-form-item>
            <el-form-item label="URL" prop="url">
              <el-input v-model="formData.url" placeholder="http://wwww.hospital.kr">
                <template slot="prepend">http://</template>
              </el-input>
            </el-form-item>
            <el-form-item label="병원 이미지" prop="imgUrl">
              <el-input v-model="formData.imgUrl"></el-input>
            </el-form-item>
            <el-form-item label="검색 키워드" prop="keyword">
              <el-input v-model="formData.keyword"></el-input>
            </el-form-item>
            <el-form-item label="Push Key" prop="accKey">
              <el-input v-model="formData.accKey" readonly placeholder="등록시 자동으로 생성됩니다."></el-input>
            </el-form-item>
            <el-form-item label="사용여부" prop="enabled">
              <el-switch v-model="formData.enabled"
                active-text="사용" inactive-text="미사용">
              </el-switch>
            </el-form-item>
            <el-form-item label="Data Source 생성여부" prop="sso_yn">
              <el-switch v-model="formData.sso_yn"
                active-text="생성" inactive-text="생성전">
              </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-button @click="createHospital" type="primary">{{formCreateMode ? '병원생성' : '병원수정'}}</el-button>
        </el-col>
      </el-row>
    </el-drawer>
    
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name : 'hospitalVue',
  data(){
    return {
      formCreateMode : true, // true:등록, false:수정
      formData : {
        hospitalNm : '',
        hospitalCd : '',
        url : 'http://127.0.0.1',
        imgUrl : '',
        keyword : '',
        accKey : '',
        enabled : true,
        sso_yn : false,
      },
      ruleCreate : {
        hospitalNm: [{required : true, message: '병원이름은 필수 입니다.', trigger: 'blur'}],
        hospitalCd: [{required : true, message: '병원코드은 필수 입니다.', trigger: 'blur'}],
        url: [{required : true, message: 'URL은 필수 입니다.', trigger: 'blur'},
              {max:50, message: '최대 50자 까지 입력할 수 있습니다.', trigger: 'blur'}], // url 패턴 추가(pattern:/\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*/,)
        imgUrl: [{max:1000, message: '최대 1000자 까지 입력할 수 있습니다.', trigger: 'blur'}],
        keyword: [{max:2000, message: '최대 2000자 까지 입력할 수 있습니다.', trigger: 'blur'}],
      },
    }
  },
  computed:{
    ...mapGetters({
      hospitalList : 'getHospitals',
      isDrawOpen : 'isDrawOpen',
    })
  },
  async fetch(){
    await this.$store.dispatch('loadHospitals');
  },
  methods: {
    createHospital(){

      this.$refs.form.validate((valid) => {
        if (!valid){
          this.$message.error('필수 정보를 입력해 주세요.');
          return false;
        }

        this.$customAxios(this.formCreateMode ? this.$apis.post_hospitals_v2 : this.$apis.put_hospitals_v2, 
          {...this.formData}, 
          this.respAction);
      });
    },
    // 수정 form 완료 이벤트
    respAction(response){
      this.$message({
        message: this.formCreateMode ? '병원을 등록 하였습니다.' :'병원을 수정 하였습니다.',
        type: 'success'
      });

      this.$refs['form'].resetFields();
      this.reloadHospitals(); // 변경된 병원정보 갱신
      this.closeDrawer();
    },
    ...mapActions(['reloadHospitals', 'openDrawer', 'closeDrawer']),
    // 수정 form 이벤트
    handleEdit(i, d){
      if (d){
        Object.keys(d).forEach(key => {
          this.formData[key] = d[key];
        });
        // this.formData['originCd'] = d.hospitalCd; // 병원코드 수정할 경우 사용
        this.formCreateMode = false;
      } else {
        if (this.$refs['form']){
          this.$refs['form'].resetFields();
        }
        this.formCreateMode = true;
      }

      this.openDrawer();
    },
    handleDrawer(close){
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
      });
      this.closeDrawer();
      // close();
    },
  }
};
</script>
