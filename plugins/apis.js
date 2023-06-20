const mcareServer = {
  admin : '/admin-api',
  // pay : '/pay-api',
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
  put_group_v2 : {url : mcareServer.admin + '/api/group/v2/{groupCd}', method : 'put', isHeader : false},
  // 그룹 병원 매핑
  get_group_hospitals_v1 : {url : mcareServer.admin + '/api/group/hospitals/v1?groupCd={groupCd}', method : 'GET', isHeader : false},
  post_group_hospitals_v1 : {url : mcareServer.admin + '/api/group/hospitals/v1', method : 'POST', isHeader : false},
  put_group_hospitals_v1 : {url : mcareServer.admin + '/api/group/hospitals/v1', method : 'PUT', isHeader : false},
  delete_group_hospitals_v1 : {url : mcareServer.admin + '/api/group/hospitals/v1', method : 'DELETE', isHeader : false},

  // 화면(Config)
  get_config_v1 : {url : mcareServer.admin + '/api/config/v1/{hospitalCd}', method : 'GET', isHeader : false},
  post_config_v1 : {url : mcareServer.admin + '/api/config/v1', method : 'POST', isHeader : false},
  put_config_v1 : {url : mcareServer.admin + '/api/config/v1/{seq}', method : 'PUT', isHeader : false},
  delete_config_v1 : {url : mcareServer.admin + '/api/config/v1/{seq}', method : 'DELETE', isHeader : false},
  
  // 메뉴
  get_menu_v2 : {url : mcareServer.admin + '/api/menus/v2/search?pageable={pageable}&size={size}&page={page}&nameKey={nameKey}&enabled={enabled}&disabled={disabled}', method : 'GET', isHeader : false},
  post_menu_v2 : {url : mcareServer.admin + '/api/menus/v2', method : 'POST', isHeader : false},
  put_menu_v2 : {url : mcareServer.admin + '/api/menus/v2/{id}', method : 'PUT', isHeader : false},
  delete_menu_v2 : {url : mcareServer.admin + '/api/menus/v2/{id}', method : 'DELETE', isHeader : false},
  // 메뉴명 조회
  get_message_v2 : {url : mcareServer.admin + '/api/messages/v2', method : 'GET', isHeader : false},

  // Redis Cache 
  post_menutrees_initCache_v2 : {url : mcareServer.admin + '/api/menutrees/v2/initCache', method : 'POST', isHeader : true},
  post_config_initCache_v2 : {url : mcareServer.admin + '/api/config/v2/initCache', method : 'POST', isHeader : false},
  post_alimtalk_initCache : {url : mcareServer.admin + '/api/config/alimtalk/initCache', method : 'POST', isHeader : true},

  // 관리자
  // 관리자 > 권한
  get_admins_role_v2 : {url : mcareServer.admin + '/api/roles/v2', method : 'GET', isHeader : false},
  get_admins_search_v3 : {url : mcareServer.admin + '/api/admins/v3/search?size={size}&page={page}&roleTypes={roleTypes}&searchName={searchName}', method : 'GET', isHeader : true},
  post_admins_v2 : {url : mcareServer.admin + '/api/admins/v2', method : 'POST', isHeader : true},
  put_admins_v2 : {url : mcareServer.admin + '/api/admins/v2/{id}', method : 'PUT', isHeader : true},
  put_admins_resetPw_v2 : {url : mcareServer.admin + '/api/admins/resetPassword/v2/{id}', method : 'PUT', isHeader : true},


  // pay-api ------------------------------------------------------------------------------------------------- //
  // /apis/pay/cat/v1/KICC/11100800
}

export default ({}, inject) => {

  inject('apis', restApis);

}