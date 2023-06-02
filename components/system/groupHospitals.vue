<template>
  <div>
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
              <el-input-number v-model="scope.row.seq" :readonly="!scope.row.edited" 
                controls-position="right" size="small"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="hospital.hospitalCd" label="병원코드" width="120">
            <template slot-scope="scope" v-if="scope.row.id">{{ scope.row.hospital.hospitalCd || '' }}</template>
          </el-table-column>
          <el-table-column prop="hospital.hospitalNm" label="병원명">
            <!-- <template slot-scope="scope" v-if="scope.row.id">{{ scope.row.hospital.hospitalNm || '' }}</template> -->
            <template slot-scope="scope">
              <el-select v-model="scope.row.hospital.hospitalCd" filterable value-key="hospitalCd"
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
              <!-- <el-descriptions -->
              <el-descriptions-item>{{ scope.row.hospital.hospitalNm || '' }}</el-descriptions-item>
            </template>
          </el-table-column>
          <el-table-column prop="enabled" label="사용여부" width="100">
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.edited"
                :type="scope.row.enabled ? 'primary' : 'info'"
                disable-transitions>{{scope.row.enabled ? '사용' : '미사용'}}</el-tag>
              <el-tooltip v-else :content="scope.row.enabled ? '사용' : '미사용'">
                <el-switch v-model="scope.row.enabled"></el-switch>
              </el-tooltip>
          </template>
          </el-table-column>
          <el-table-column prop="groupHospitalImg" label="병원이미지">
            <template slot-scope="scope">
              <el-input v-model="scope.row.groupHospitalImg" :readonly="!scope.row.edited"></el-input>
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
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name : 'groupHospitalVue',
  props : ['groupCd'],
  data(){
    return {
      groupHospitalList : [], // 그룹 하위 병원 목록
      dummy : 'test'
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
    }),
  },
  methods :{
    getGroupHospitalList() {
      console.debug(this.groupCd);
      this.$customAxios(this.$apis.get_group_hospitals_v2, {groupCd : this.groupCd}, this.setGroupHospitalList);
    },
    setGroupHospitalList(response){
      this.groupHospitalList = response && Array.isArray(response) ? response.map(d => {
        d.edited = false;
        return d;
      }) : [];
    },
    handleEdit(cd, d, i){
      console.debug(cd, d);
      if (cd == 'create'){ // 등록
        this.groupHospitalList.splice(0,0, {hospital : {}, enabled : true, edited : true});
        // console.debug(this.groupHospitalList);
      } else if (cd == 'edit'){ // 편집
        d.edited = true;
      } else if (cd == 'update'){// 수정
        // this.groupHospitalList.splice(0,0, {enabled : true, edited : true});
        d.edited = false;
      } else if (cd == 'delete'){ // 삭제

        if(!d.id){// 저장 안된 row 삭제
          this.groupHospitalList.splice(i, 1);
        }

      }
    }
  },
}
</script>