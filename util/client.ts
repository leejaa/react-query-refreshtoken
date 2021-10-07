import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
// import * as Sentry from '@sentry/react';

const client = axios.create({
  // baseURL: BASE_URL,
  withCredentials: true,
});

const onFulfilled = (response: AxiosResponse) => response;

const retry = (errorConfig: AxiosRequestConfig<any>) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    errorConfig.data = `{"accessToken":"${token}"}`;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(client.request(errorConfig));
      }, 3000);
    });
  }
};

const onRejected = (error: AxiosError) => {
  if (error.response?.status === 401) {
    localStorage.setItem('accessToken', 'true');
    localStorage.setItem('refreshToken', 'true');
    const result = retry(error.config);
    return result;
  }

  return Promise.reject(error);
};

// brg에 적용한다면 ..
// const onRejected = (error: AxiosError) => {
//   if (error.config && error.response?.status === 401 && localStorage.getItem('keepLogin') === 'true' && localStorage.getItem('refreshToken')) {
//     return axios
//       .post('/api/login/renew', { refreshToken: localStorage.getItem('refreshToken') })
//       .then((res: AxiosResponse<any>) => {
//         if (res.data.data && res.data.data.refreshToken) {
//           localStorage.setItem('refreshToken', res.data.data.refreshToken);
//         } else {
//           const result = client.request(error.config);
//           console.log('resuit', result);
//           return result;
//         }
//       })
//       .catch();
//   } else if (error.response?.status === 401) {
//     alert('로그인 세션이 만료되었습니다.');
//     if (location.pathname == '/home') {
// home의 경우 로그인 창으로 이동시킬 필요가 없어서 바로 로그아웃 처리
//     axios.post('/api/logout');
//     localStorage.removeItem('prevLoginInfoContext');
//     localStorage.removeItem('keepLogin');
//     localStorage.removeItem('refreshToken');
//     return;
//   }

//     location.href = '/unauthorized';
//   } else if (error.response?.status === 500) {
//     console.error('internal server error');
//   } else if (error.response?.status === 404) {
//     location.href = '/notfound';
//   } else if (error.response?.status === 400) {
//     console.error(error.response);
//   } else {
//     console.error(`Unknown Error: ${error}`);
//   }
//   Sentry.captureException(error, { extra: error.response?.data });
//   return Promise.reject(error);
// };

client.interceptors.response.use(onFulfilled, onRejected);

export default client;
