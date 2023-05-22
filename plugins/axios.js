export default function ({$axios}, inject) {

  /**
   * 공통 axios - no header
   * @param {Obect} api 
   * @param {Obect} param 
   * @param {Function} callback 
   * @param {*} callbackParam 
   * @returns 
   */
  const customAxios = (api, param, callback, callbackParam) => {
    
    const axiosConfig = {
      method: api['method'] ? api['method'] : 'GET',
      url: api.url,
      data: param ? {...param} : {}
    };

    if (!api['url']){
      console.error('unknown API.');
      $nuxt.$message.error(`unknown API.`);
      return false;
    }

    if (api['isHeader']){
      if (!param['hospitalCd']){
        console.error('Bad Request.');
        $nuxt.$message.error(`Bad Request.`);
        return false;
      }
      axiosConfig.headers = {
        'hospitalCd': param.hospitalCd
      };
    }

    $axios(axiosConfig).then((response) => {
      if (response && callback){
        callback(response.data, callbackParam);
      }
    }).catch((error) => {
      $nuxt.$message.error(`${error} ${error.config.url}`);
    });
  }
  
  /**
   * 1개 API에 param.length 만큼 axios 요청 - with header
   * @param {Obect} api 
   * @param {Array<Obect>} param 
   * @param {Function} callback 
   * @param {*} callbackParam 
   * @returns 
   */
  const customHeaderAxiosAll = (api, param, callback, callbackParam) => {
    
    if (!api['url'] || !Array.isArray(param) || !param.every( d => d.hospitalCd)){
      console.error('Bad Request.');
      return false;
    }

    const requests = param.map(d => $axios({
        headers: { 'hospitalCd': d.hospitalCd },
        method: api['method'] ? api['method'] : 'GET',
        url: api.url,
        data: {...d}
      })
    );

    console.debug('requests', requests);
    (async function(array){
      await Promise.all(array)
          .then(response => {
            console.debug('response', response);
            if (response && callback){
              callback(response, callbackParam);
            }
          })
          .catch(error => {
            if (callback){
              callback(error, callbackParam);
            }
          });
    })(requests);
  }

  inject('customAxios', customAxios);
  inject('customHeaderAxiosAll', customHeaderAxiosAll);
}