# Getting Started with Create React App

### 配置文件相关文章
- [dotfiles相关](https://zhuanlan.zhihu.com/p/104742911)
    - .gitignore
    - .editorconfig
    - .nvmrc
    - .npmrc
    - LICENSE - MIT
    - package.json
    - .vscode/settings.jsonc
    - .vscode/extensions.json
    
    
- [linters 和 formatter相关](https://zhuanlan.zhihu.com/p/105038375)
    - eslint: 配置生成器命令 `npx eslint --init`
        > Find and fix problems in your JavaScript code
    - stylelint:
        > A mighty, modern linter that helps you avoid errors and enforce conventions in your styles

    - prettier 代码格式化
        [配置参数详解](https://juejin.cn/post/6970267363845341220)
        [官网参数解析](https://prettier.io/docs/en/options.html)

    - linters 和 prettier 的冲突
        [官方文档](https://prettier.io/docs/en/integrating-with-linters.html)
        安装 `eslint-config-prettier`, 这个插件会禁用所有会和 prettier 起冲突的规则。
        添加 'prettier' 到extends 配置：
        ``` json
        // .eslintrc.js
        {
            extends: [
                'airbnb',
                'airbnb/hooks',
                'plugin:eslint-comments/recommended',
                'plugin:import/typescript',
                'plugin:react/recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:unicorn/recommended',
                'prettier',
            ],
        }
        ```
        这里注意要把 prettier 放最后面，因为这样才能让 prettier 有机会禁用前面所有的 extends 中配置的会起冲突的规则。

    - lint-staged
        每次提交代码都要对代码先进行 lint 和格式化，确保团队的代码风格统一

- [webpack相关配置](https://blog.csdn.net/qq_39523606/article/details/104408796?spm=1001.2014.3001.5502)
