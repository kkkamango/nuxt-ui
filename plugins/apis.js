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
  get_hospitals_v2 : {url : mcareServer.admin + '/api/hospitals/v2', method : 'GET', isHeader : false},
  post_hospitals_v2 : {url : mcareServer.admin + '/api/hospitals/v2', method : 'POST', isHeader : false},
  // put /admin-api/api/hospitals/v1/{hospitalCd} (권한 없는 API 필요)
  // 그룹정보
  // get /api/admins/groups (권한 없는 API 필요)
  // XXXXXXXXXXXXXXXXXXXXXXXXXXX // get 그룹 하위 병원 /api/group/v2 (기존 API 사용)
  post_group_v2 : {url : mcareServer.admin + '/api/group/v2', method : 'POST', isHeader : false},
  // put /api/group/v1/{groupCd} (권한 없는 API 필요)
  // XXXXXXXXXXXXXXXXXXXXXXXXXXX // put 그룹 하위 병원

  // Redis Cache 
  post_menutrees_initCache_v2 : {url : mcareServer.admin + '/api/menutrees/v2/initCache', method : 'POST', isHeader : true},
  post_config_initCache_v2 : {url : mcareServer.admin + '/api/config/v2/initCache', method : 'POST', isHeader : true},
  post_alimtalk_initCache : {url : mcareServer.admin + '/api/config/alimtalk/initCache', method : 'POST', isHeader : true},

  // 관리자
  // 관리자 > 권한
  // get /api/admins/v1/roles  (권한 없는 API 필요)
  // get /api/admins/v1/search  (권한 없는 API 필요)
  post_admins_v2 : {url : mcareServer.admin + '/api/admins/v2', method : 'POST', isHeader : true},
  // put /api/admins/v1/{id} (누적로그인 실패 횟수 초기화, 탈퇴처리)  (권한 없는 API 필요)
  // 비밀번호 초기화 put /api/admins/resetPassword/v1/{id} (권한 없는 API 필요)


  // pay-api ------------------------------------------------------------------------------------------------- //
  // /apis/pay/cat/v1/KICC/11100800
}

export default ({}, inject) => {

  inject('apis', restApis);

}