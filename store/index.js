export const state = () => ({
  hospital_list : [],// 병원정보
})

export const getters = {
  getHospitals: (state) =>{
    return state.hospital_list || [];
  }
}

export const actions = {
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
}

export const mutations = {
  setHospitals(state, response){
      state.hospital_list = response;
  }
}
