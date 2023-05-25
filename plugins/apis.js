const mcareServer = {
  admin : '/apis/admin',
  // pay : '/apis/pay',
}
/**
 * API 모음
 * isHeader : API header에 병원코드 셋팅 여부
 */
const restApis = {
  // admin-api ------------------------------------------------------------------------------------------------- //
  // 병원정보
  get_hospitals_v2 : {url : mcareServer.admin + '/api/hospitals/v2', method : 'GET', isHeader : false, test: '/sample_data/get_hospitals_v2.json'},
  post_hospitals_v2 : {url : mcareServer.admin + '/api/hospitals/v2', method : 'POST', isHeader : false},
  put_hospitals_v2 : {url : mcareServer.admin + '/api/hospitals/v2/{hospitalCd}', method : 'PUT', isHeader : false},
  
  // 그룹정보
  get_groups : {url : mcareServer.admin + '/api/admins/groups/v2', method : 'GET', isHeader : false},
  post_group_v2 : {url : mcareServer.admin + '/api/group/v2', method : 'POST', isHeader : false},
  put_group_v2 : {url : mcareServer.admin + '/api/group/v2/{groupCd}', method : 'POST', isHeader : false},
  // 그룹 병원 매핑
  get_group_hospitals_v2 : {url : mcareServer.admin + '/api/group/hospitals/v2', method : 'GET', isHeader : false},
  post_group_hospitals_v2 : {url : mcareServer.admin + '/api/group/hospitals/v2', method : 'POST', isHeader : false},
  delete_group_hospitals_v2 : {url : mcareServer.admin + '/api/group/hospitals/v2', method : 'DELETE', isHeader : false},

  // Redis Cache 
  post_menutrees_initCache_v2 : {url : mcareServer.admin + '/api/menutrees/v2/initCache', method : 'POST', isHeader : true},
  post_config_initCache_v2 : {url : mcareServer.admin + '/api/config/v2/initCache', method : 'POST', isHeader : true},
  post_alimtalk_initCache : {url : mcareServer.admin + '/api/config/alimtalk/initCache', method : 'POST', isHeader : true},

  // 관리자
  // 관리자 > 권한
  get_admins_role_v2 : {url : mcareServer.admin + '/api/roles/v2', method : 'GET', isHeader : false},
  get_admins_search_v3 : {url : mcareServer.admin + '/api/admins/v3/search?size={size}&page={page}&roleTypes={roleTypes}&searchName=', method : 'GET', isHeader : true},
  post_admins_v2 : {url : mcareServer.admin + '/api/admins/v2', method : 'POST', isHeader : true},
  put_admins_v2 : {url : mcareServer.admin + '/api/admins/v2/{id}', method : 'PUT', isHeader : true},
  put_admins_resetPw_v2 : {url : mcareServer.admin + '/api/admins/resetPassword/v2/{id}', method : 'PUT', isHeader : true},


  // pay-api ------------------------------------------------------------------------------------------------- //
  // /apis/pay/cat/v1/KICC/11100800
}

export default ({}, inject) => {

  inject('apis', restApis);

}