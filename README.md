# CORS-PROXY-SERVER

## Description
브라우저에서 교차 출처 정책에 의해 블락되는 상황을 위해 만든 프로젝트입니다.

프록시 된 요청에 CORS헤더를 추가해주는 Node.js 기반의 프록시입니다.

## Example
```javascript
await axios({
  method: "get",
  url: `http://{YOUR-SERVER-DOMAIN}/api`,
  headers: {
    'target-url': 'API-URL',
  },
});
```


[![Anurag's GitHub stats](https://github-readme-stats.vercel.app/api?username=anuraghazra)](https://github.com/anuraghazra/github-readme-stats)
