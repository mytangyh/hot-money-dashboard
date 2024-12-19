export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 处理静态资源
    if (url.pathname.startsWith('/assets/')) {
      const response = await fetch(request);
      const contentType = url.pathname.endsWith('.js') 
        ? 'application/javascript'
        : url.pathname.endsWith('.css')
        ? 'text/css'
        : response.headers.get('content-type');
        
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'content-type': contentType,
          'cache-control': 'public, max-age=31536000, immutable'
        }
      });
    }
    
    // 所有其他请求返回 index.html
    return fetch(`${url.origin}/index.html`);
  }
} 