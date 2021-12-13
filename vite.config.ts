import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

//当你使用unplugin-vue-components来引入ui库的时候 message, notification 等引入样式不生效 安装vite-plugin-style-import即可
// import styleImport, { AndDesignVueResolve } from "vite-plugin-style-import";

//自动引入src/components目录下组件配置
const autoImportComponentsConfig = {
  // relative paths to the directory to search for components.
  dirs: ["src/components"],
  // valid file extensions for components.
  extensions: ["vue"],
  // search for subdirectories
  deep: true,
  // generate `components.d.ts` global declarations,
  // also accepts a path for custom filename
  dts: "src/components.d.ts", // enabled by default if `typescript` is installed，

  // Allow subdirectories as namespace prefix for components.
  // 允许子目录作为组件的命名空间前缀。
  directoryAsNamespace: false,
  // Subdirectory paths for ignoring namespace prefixes
  // works when `directoryAsNamespace: true`
  globalNamespaces: [],
  // auto import for directives
  // default: `true` for Vue 3, `false` for Vue 2
  // Babel is needed to do the transformation for Vue 2, it's disabled by default for performance concerns.
  // To install Babel, run: `npm install -D @babel/parser @babel/traverse`
  directives: true,
  // filters for transforming targets
  include: [/\.vue$/, /\.vue\?vue/],
  exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
};

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    Components({
      // resolvers for custom components
      resolvers: [AntDesignVueResolver()],
      ...autoImportComponentsConfig,
    }),
    // styleImport({
    //   resolves: [
    //     AndDesignVueResolve(),
    //   ],
    //   // 自定义规则
    //   libs: [
    //     {
    //       libraryName: 'ant-design-vue',
    //       esModule: true,
    //       resolveStyle: (name) => {
    //         return `ant-design-vue/es/${name}/style/index`
    //       }
    //     }
    //   ]
    // })
  ],
  resolve: {
    alias: {
      "~@": new URL("./src", import.meta.url).pathname, //图片引入方式
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    cssTarget: "chrome61", // 针对非主流浏览器时，css中rgba不转16进制
  },
});
