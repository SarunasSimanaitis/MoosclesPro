export default {
  fetch(request: Request) {
    return Response.json({
      method: request.method,
      url: request.url,
      works: true,
    });
  },
};