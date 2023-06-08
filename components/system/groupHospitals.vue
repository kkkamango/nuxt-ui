<template>
  <div>
    <el-drawer :title="`그룹병원 관리`" 
        :visible.sync="isDrawOpen" direction="rtl" :before-close="handleDrawer" size="70%">

    <el-row :gutter="20">
      <el-col :span="12">
        <el-button @click="handleEdit('create')" type="primary">등록</el-button>
      </el-col>
    </el-row>
    <!-- 목록 -->
    <el-row class="last">
      <el-col :span="24">
        <el-table :data="groupHospitalList" height="500px" style="width: 100%">
          <el-table-column prop="seq" label="순서" width="110">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.seq" v-if="scope.row.edited"
                controls-position="right" size="small"></el-input-number>
              <span v-else>{{ scope.row.seq }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="hospital.hospitalCd" label="병원코드" width="120">
            <template slot-scope="scope">{{ scope.row.hospital.hospitalCd || '' }}</template>
          </el-table-column>
          
          <el-table-column prop="hospital.hospitalNm" label="병원명">
            <template slot-scope="scope">
              <el-select v-model="scope.row.hospital" filterable value-key="hospitalCd"
                v-if="!scope.row.id"
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
              <span v-else>{{ scope.row.hospital.hospitalNm }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="enabled" label="사용여부" width="100">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.edited" :content="scope.row.enabled ? '사용' : '미사용'">
                <el-switch v-model="scope.row.enabled"></el-switch>
              </el-tooltip>
              <el-tag v-else
                :type="scope.row.enabled ? 'primary' : 'info'"
                disable-transitions>{{scope.row.enabled ? '사용' : '미사용'}}</el-tag>
          </template>
          </el-table-column>
          <el-table-column prop="groupHospitalImg" label="병원이미지">
            <template slot-scope="scope">
              <el-input v-model="scope.row.groupHospitalImg" v-if="scope.row.edited"></el-input>
              <span v-else>{{ scope.row.groupHospitalImg }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="관리"
            width="150">
            <template slot-scope="scope">
              <el-button v-if="!scope.row.edited"
                size="mini"
                @click="handleEdit('edit', scope.row, scope.$index)">수정</el-button>
              <el-button v-if="scope.row.edited"
                size="mini" type="primary"
                @click="handleEdit('update', scope.row, scope.$index)">저장</el-button>

              <el-button
                size="mini" type="danger"
                @click="handleEdit('delete', scope.row, scope.$index)">삭제</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    </el-drawer>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name : 'groupHospitalVue',
  props : ['groupCd'],
  data(){
    return {
      groupHospitalList : [], // 그룹 하위 병원 목록
      formMode : 'create', // 'create': 등록, 'update': 수정, 'delete': 삭제
    }
  },
  async fetch(){
    await this.$store.dispatch('loadHospitals');
  },
  created(){
    this.getGroupHospitalList();
  },
  watch:{
    groupCd(value){
      this.getGroupHospitalList();
    }
  },
  computed:{
    ...mapGetters({
      hospitals : 'getHospitals',
      isDrawOpen : 'isDrawOpen',
    }),
  },
  methods :{
    getGroupHospitalList(){
      if (this.groupCd){
        this.$customAxios(this.$apis.get_group_hospitals_v1, {groupCd : this.groupCd}, this.setGroupHospitalList);
      }
    },
    setGroupHospitalList(response){
      this.groupHospitalList = response && Array.isArray(response) ? response.map(d => {
        d.edited = false;
        return d;
      }) : [];
    },
    // 수정 form 완료 이벤트
    respAction(response){
      this.$message({
        message: `그룹병원 정보를 ${this.formMode == 'update' ? '수정' : (this.formMode == 'delete' ? '삭제' : '등록')} 하였습니다.`,
        type: 'success'
      });
      this.getGroupHospitalList();
    },
    handleEdit(cd, d, i){
      console.debug(cd, d);
      if (cd == 'create'){ // 등록
        this.groupHospitalList.splice(0,0, {hospital : {}, enabled : true, edited : true});
      } else if (cd == 'edit'){ // 편집
        d.edited = true;

      } else if (cd == 'update'){// 수정
        const param = {...d};

        if (!d.id){
          // 등록
          this.formMode = 'create';
          param.id = {
            groupCd : this.groupCd,
            hospitalCd : d.hospital.hospitalCd
          };
          this.$customAxios(this.$apis.post_group_hospitals_v1, param, this.respAction);

        } else {
          // 수정 
          this.formMode = 'update';
          this.$customAxios(this.$apis.put_group_hospitals_v1, param, this.respAction);
        }
      } else if (cd == 'delete'){ // 삭제 

        if(!d.id){// 저장 안된 row 삭제
          this.groupHospitalList.splice(i, 1);
        } else {
          this.formMode = 'delete';
          this.$customAxios(this.$apis.delete_group_hospitals_v1, d, this.respAction);
        }

      }
    },
    handleDrawer(close){
      this.groupHospitalList = [];
      this.closeDrawer();
      // close();
    },
    // ...mapActions(['loadGroupHospitals']),
    ...mapActions(['openDrawer', 'closeDrawer']),
  },
}
</script>