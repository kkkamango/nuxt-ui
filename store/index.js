export const state = () => ({
  hospital_list : [],// 병원정보
  admin_role_list : [], // 관리자 권한 정보
})

export const getters = {
  getHospitals: (state) =>{
    return state.hospital_list || [];
  },
  getRoles:(state) =>{
    return state.admin_role_list || [];
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
}

export const mutations = {
  setHospitals(state, response){
      state.hospital_list = response;
  },
  setRoles(state, response){
    state.admin_role_list = response;
  },
}
