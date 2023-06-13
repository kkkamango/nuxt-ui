<template>
  <div>
    <h1>통합 메뉴 관리</h1>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button @click="handleEdit('create')" type="primary">등록</el-button>
      </el-col>
    </el-row>
    <!-- 목록 -->
    <el-row>
      <el-table :data="menuList" height="500px" style="width: 100%">
        <el-table-column prop="nameKey" label="메뉴명" width="200"></el-table-column>
        <el-table-column prop="urlKey" label="URL"></el-table-column>
        <el-table-column prop="imgUrlKey" label="이미지 URL"></el-table-column>
        <el-table-column prop="backUrlKey" label="Back URL"></el-table-column>
        <el-table-column prop="description" label="설명" width="150">
        </el-table-column>
        <el-table-column prop="enabled" label="사용여부" width="150">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.enabled ? 'primary' : 'info'"
              disable-transitions>{{scope.row.enabled ? '사용' : '미사용'}}</el-tag>
          </template>
        </el-table-column>
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
    <el-row type="flex" justify="center" class="last">
      <el-pagination
        layout="prev, pager, next" @current-change="setPage"
        :total="totalElements">
      </el-pagination>
    </el-row>

    <el-drawer :title="this.formMode == 'create' ? '통합 메뉴 등록' : '통합 메뉴 수정'" 
        :visible.sync="isDrawOpen" direction="rtl" :before-close="handleDrawer" size="50%">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form :model="formData" :rules="ruleCreate" ref="form" label-width="30%">
            
            <el-form-item label="메뉴명" prop="nameKey">
              <el-select v-model="formData.nameKey"
                filterable placeholder="선택하세요.">
                <el-option
                  v-for="item in menuMessageList"
                  :key="item.menu"
                  :label="item.menu"
                  :value="item.menu">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="URL" prop="urlKey">
              <el-select v-model="formData.urlKey"
                filterable placeholder="선택하세요.">
                <el-option
                  v-for="item in menuMessageList"
                  :key="item.menu_url"
                  :label="item.menu_url"
                  :value="item.menu_url">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="이미지 URL" prop="imgUrlKey">
              <el-select v-model="formData.imgUrlKey"
                filterable placeholder="선택하세요.">
                <el-option
                  v-for="item in menuMessageList"
                  :key="item.menu_imgUrl"
                  :label="item.menu_imgUrl"
                  :value="item.menu_imgUrl">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Back URL" prop="backUrlKey">
              <el-select v-model="formData.backUrlKey"
                filterable placeholder="선택하세요.">
                <el-option
                  v-for="item in menuMessageList"
                  :key="item.menu_backUrl"
                  :label="item.menu_backUrl"
                  :value="item.menu_backUrl">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="설명" prop="description">
              <el-input v-model="formData.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
            <el-form-item label="사용여부" prop="enabled">
              <el-switch v-model="formData.enabled"
                active-text="사용" inactive-text="미사용">
              </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-button @click="createMenu" type="primary">{{this.formMode == 'create' ? '메뉴 생성' : '메뉴 수정'}}</el-button>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name: 'MenuVue',
  data(){
    return {
      menuMessageList : [], // 메뉴명
      menuList : [], // 메뉴 목록
      totalElements : 0, // 메뉴 목록 갯수
      formCreateMode : true, // true:등록, false:수정
      formMode : 'create', // 'create': 등록, 'update': 수정, 'delete': 삭제
      formData : {},
      ruleCreate : {
        // hospitalCd: [{required : true, message: '대상 병원은 필수 입니다.', trigger: 'change'}],
        // roles: [{required : true, message: '관리자 권한은 필수 입니다.', trigger: 'change'}],
        // username: [{required : true, message: '계정은 필수 입니다.', trigger: 'blur'}],
        // fullname: [{required : true, message: '사용자 이름은 필수 입니다.', trigger: 'blur'}],
      },
    }
  },
  computed:{
    ...mapGetters({
      isDrawOpen : 'isDrawOpen',
    }),
  },
  created(){
    this.setPage(1);
    this.getMenuMessage();
  },
  methods : {
    getMenuMessage(){
      this.$customAxios(this.$apis.get_message_v2, {...this.formData}, this.setMenuMessage);
    },
    setMenuMessage(response){
      const regex = /(menu.*)\.(\S+)/i ;
      const menuMap = {};
      (response.body ? response.body : []).forEach(value => {
          if(regex.test(value)){
              const name = value.match(regex)[2] || "",
              type = value.match(regex)[1].replace(".","_");

              if(name){
                  let menuObj = null;
                  if(menuMap.hasOwnProperty(name)){
                      menuObj = menuMap[name];
                  }else{
                      menuObj = { menu: value, menu_url:"프로퍼티가 없습니다.", menu_imgUrl : "프로퍼티가 없습니다.", menu_backUrl:"프로퍼티가 없습니다."};
                  }
                  menuObj[type] = value;
                  menuMap[name] = menuObj;
              }
          }
      });
      this.menuMessageList = Object.values(menuMap);
    },
    getMenuList(response){
        this.menuList = response.body && response.body.content || [];
        this.totalElements = response.body.totalElements || 0;
    },
    setPage(page){
      this.$noContentTypeAxios(this.$apis.get_menu_v2, {
        pageable : true,
        size : 10,
        page : page-1, // 현재 페이지 -1
        nameKey : '',
        enabled : true,
        disabled : false,
      }, this.getMenuList);
    },
    createMenu(){
      this.$refs.form.validate((valid) => {
        if (!valid){
          this.$message.error('필수 정보를 입력해 주세요.');
          return false;
        }
        this.$customAxios(this.formMode == 'create' ? this.$apis.post_menu_v2 : this.$apis.put_menu_v2, 
          {...this.formData}, 
          this.respAction);
      });
    },
    // 수정 form 완료 이벤트
    respAction(response){
      this.$message({
        message: `통합 메뉴를  ${this.formMode == 'update' ? '수정' : (this.formMode == 'delete' ? '삭제' : '등록')} 하였습니다.`,
        type: 'success'
      });
      this.setPage(1);
      this.closeDrawer();
    },
    // 수정 form 이벤트
    handleEdit(cd, d){
      this.formMode = cd || '';
      if (this.formMode == 'create'){ // 등록
          // this.formCreateMode = true;
          this.openDrawer();

      } else if (this.formMode == 'edit'){ // 편집
        Object.keys(d).forEach(key => {
          this.formData[key] = d[key];
        });

        // this.formCreateMode = false;
        this.openDrawer();

      } else if (this.formMode == 'delete'){ // 삭제 
        this.$customAxios(this.$apis.delete_menu_v2, d, this.respAction);
      }

    },
    handleDrawer(close){
      this.formData = {};
      this.closeDrawer();
      // close();
    },
    ...mapActions(['openDrawer', 'closeDrawer']),
  }
}
</script>
