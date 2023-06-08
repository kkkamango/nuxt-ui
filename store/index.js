export const state = () => ({
  hospital_list : [],// 병원정보
  admin_role_list : [], // 관리자 권한 정보

  // group_cd : '', // 그룹코드
  // group_hospital_list : [], // 그룹병원정보

  is_open_drawer : false, // 수정, 조회 Drawer
})

export const getters = {
  getHospitals: (state) =>{
    return state.hospital_list || [];
  },
  getRoles:(state) =>{
    return state.admin_role_list || [];
  },

  // getGroupCd: (state) => {
  //   return state.groupCd || '';
  // },
  // getGroupHospitals: (state) => {
  //   return state.group_hospital_list || [];
  // },

  isDrawOpen:(state) =>{
    return state.is_open_drawer;
  },
}

export const actions = {
  // -- 병원정보 --
  // 최초 1회 API 요청
  async loadHospitals({commit, state}){
    if (state.hospital_list.length == 0){
      this.$customAxios(this.$apis.get_hospitals_v2, {}, (response) =>{
        commit('setHospitals', response.body);
      });
    }
  },
  async reloadHospitals({commit}){
    console.debug('reloadHospitals');
    this.$customAxios(this.$apis.get_hospitals_v2, {}, (response) =>{
      commit('setHospitals', response.body);
    });
  },

  // -- 권한정보 --
  async loadRoles({commit, state}){
    if (state.admin_role_list.length == 0){
      this.$customAxios(this.$apis.get_admins_role_v2, {}, (response) =>{
        commit('setRoles', response.body);
      });
    }
  },

  // // -- 그룹병원정보 --
  // async loadGroupHospitals({commit, state}){
  //   if (state.group_cd){
  //     this.$customAxios(this.$apis.get_group_hospitals_v1, {groupCd : state.group_cd}, (response) =>{
  //       commit('setGroupHospitals', response);
  //     });
  //   }
  // },

  // -- 수정, 조회 Drawer --
  openDrawer({commit, state}){
    commit('setDrawerForm', true);
  },
  closeDrawer({commit, state}){
    commit('setDrawerForm', false);
  },
}

export const mutations = {
  setHospitals(state, response){
    state.hospital_list = response;
  },
  setRoles(state, response){
    state.admin_role_list = response;
  },

  // setGroupCd(state, response){
  //   state.group_cd = response || '';
  // },
  // setGroupHospitals(state, response){
  //     state.group_hospital_list = response && Array.isArray(response) ? response : [];
  // },
  
  setDrawerForm(state, isOpen){
    state.is_open_drawer = isOpen;
  },
}
