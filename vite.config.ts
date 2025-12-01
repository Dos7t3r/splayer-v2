import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import viteCompression from "vite-plugin-compression";
import wasm from "vite-plugin-wasm";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const webPort = Number(env.VITE_WEB_PORT || 14558);

    return {
        define: {
            __ADMIN_KEY__: JSON.stringify(env.ADMIN_KEY || ""),
        },
        plugins: [
            vue(),
            AutoImport({
                imports: [
                    "vue",
                    "vue-router",
                    "@vueuse/core",
                    {
                        "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"],
                    },
                ],
                eslintrc: {
                    enabled: true,
                    filepath: "./auto-eslint.mjs",
                },
            }),
            Components({
                resolvers: [NaiveUiResolver()],
            }),
            viteCompression(),
            wasm(),
        ],
        resolve: {
            alias: {
                "@": resolve(__dirname, "src/"),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ["legacy-js-api"],
                },
            },
        },
        server: {
            port: webPort,
            proxy: {
                "/api/netease": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/netease/, ""),
                },
                "/api/unblock": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/unblock/, "/unblock"),
                },
            },
        },
        build: {
            minify: "terser",
            rollupOptions: {
                output: {
                    manualChunks: {
                        stores: ["src/stores/data.ts", "src/stores/index.ts"],
                    },
                },
            },
            terserOptions: {
                compress: {
                    pure_funcs: ["console.log"],
                },
            },
        },
    };
});
