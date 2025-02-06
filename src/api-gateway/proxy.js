import { createProxyMiddleware } from "http-proxy-middleware";

// Forward all HTTP requests that start with /api/movies
export const setupProxy = (app) => {
  app.use(
    "/api/movies",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
    })
  );
};
