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

    if (!api || !api['url']){
      console.error('unknown API.');
      $nuxt.$message.error(`unknown API.`);
      return false;
    }
    
    const axiosConfig = {
      method: api['method'] ? api['method'] : 'GET',
      data: param ? {...param} : {}
    };
    
    axiosConfig.url = generateUrl(api.url, param);

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
      $nuxt.$message.error(`${error.response && error.response.data ? error.response.data : error}`);
    });
  }
  
  /**
   * 공통 axios - no Content-Type
   * @param {Obect} api 
   * @param {Obect} param 
   * @param {Function} callback 
   * @param {*} callbackParam 
   * @returns 
   */
  const noContentTypeAxios = (api, param, callback, callbackParam) => {

    const axiosConfig = {
      'Content-Type' : '',
      method: api['method'] ? api['method'] : 'GET',
      data: param ? {...param} : {}
    };
    
    if (!api['url']){
      console.error('unknown API.');
      $nuxt.$message.error(`unknown API.`);
      return false;
    }
    
    axiosConfig.url = generateUrl(api.url, param);

    if (api['isHeader']){
      if (!param['hospitalCd']){
        console.error('Bad Request.');
        $nuxt.$message.error(`Bad Request.`);
        return false;
      }
      axiosConfig.headers = {
        'hospitalCd': param.hospitalCd,
      };
    }

    $axios(axiosConfig).then((response) => {
      if (response && callback){
        callback(response.data, callbackParam);
      }
    }).catch((error) => {
      $nuxt.$message.error(`${error.response && error.response.data ? error.response.data : error}`);
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
  const customAxiosAll = (api, param, callback, callbackParam) => {
    
    if (!api['url'] || !Array.isArray(param) || !param.every( d => d.hospitalCd)){
      console.error('Bad Request.');
      return false;
    }

    const requests = param.map(d => $axios({
        headers: { 'hospitalCd': api['isHeader'] ? d.hospitalCd : '' },
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
            $nuxt.$message.error(`${error.response && error.response.data ? error.response.data : error}`);
          });
    })(requests);
  }

  const generateUrl = (url, param) => {
    try {
      let re = /{(.*?)}/gm;
      let matchItem = url.match(re); // {} 내용을 얻어온다
      if (matchItem == null) {
          return url;
      }
      matchItem.forEach((d, i) => { // {} 안에 있는 값을 뽑아온다
        matchItem[i] = d.replace(/\{|\}/gi, '');
        url = url.replace(new RegExp('\\{'+matchItem[i]+'\\}','gi'), function(value){
            let check = value.replace(/\{|\}/gi,'');
            return param[check];
        });
      });

      return url;
    } catch(error) {
      $nuxt.$message.error(`${error.response && error.response.data ? error.response.data : error}`);
    }

  }

  inject('customAxios', customAxios);
  inject('noContentTypeAxios', noContentTypeAxios);
  inject('customAxiosAll', customAxiosAll);
}