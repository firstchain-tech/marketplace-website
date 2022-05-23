### REACT-DOME-WEB

`技术栈：react、react-redux、redux、typescript、i18next、web3、styled-components`

`前端UI：react-lottie、react-select、antd`

#### 注意

本都运行: 使用的 `proxy` 代理 ，在`package.json`文件最后面

#### 调试

~~~
环境变量问题：dev对应开发环境、uat对应测试环境、prd对应正式环境
~~~



* `yarn start:dev``yarn start:uat``yarn start:prd`

本地运行

* `yarn test`

在交互式观察模式下启动测试运行器。 有关更多信息，请参阅有关 [运行测试](https://gitee.com/link?target=https%3A%2F%2Ffacebook.github.io%2Fcreate-react-app%2Fdocs%2Frunning-tests) 的部分。

* `yarn build:dev``yarn build:uat``yarn build:prd`

将用于生产的应用程序构建到 `build` 文件夹。 它在生产模式下正确地捆绑了 React 并优化了构建以获得最佳性能。

构建被缩小，文件名包括哈希值。 您的应用程序已准备好部署！

有关更多信息，请参阅有关 [deployment](https://gitee.com/link?target=https%3A%2F%2Ffacebook.github.io%2Fcreate-react-app%2Fdocs%2Fdeployment) 的部分。

* `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

如果您对构建工具和配置选择不满意，您可以随时“弹出”。 此命令将从您的项目中删除单个构建依赖项。

相反，它会将所有配置文件和可传递依赖项（webpack、Babel、ESLint 等）复制到您的项目中，以便您可以完全控制它们。 除了“eject”之外的所有命令仍然有效，但它们将指向复制的脚本，以便您可以调整它们。 在这一点上，你是靠自己的。

你不必使用 `eject`。 精选功能集适用于中小型部署，您不应该觉得有义务使用此功能。 但是我们知道，如果您在准备好时无法对其进行自定义，则此工具将没有用处。

#### 目录

~~~tsx
|-- react-dome-web
    |-- .gitignore      #git提交忽略配置
    |-- .prettierignore #prettier相关配置
    |-- .prettierrc     #prettier相关配置
    |-- craco.config.js #craco配置
    |-- package.json    #package.json 依赖
    |-- paths.json      #运行自定义 配置
    |-- README.md       #MD文档
    |-- tsconfig.json   #typescript 配置
    |-- yarn.lock       #yarn 依赖包
    |-- public          #静态资源
    |   |-- favicon.ico #favicon图标
    |   |-- index.html  #index.html
    |-- src             #源代码
        |-- App.less    #全局less
        |-- App.test.tsx          #test
        |-- App.tsx               #源代码入口
        |-- index.tsx             #全局入口
        |-- react-app-env.d.ts    #declare申明js方法
        |-- reportWebVitals.ts    #test配置
        |-- setupTests.ts         #test配置
        |-- api                   #api
        |   |-- index.ts
        |-- assets                #图片等静态资源
        |-- common                #公用配置common
        |   |-- data.d.ts         #全局变量声明
        |   |-- init.ts           #初始化文件
        |   |-- styled.ts         #公用styled配置
        |-- components            #全局组件
        |   |-- ConnectWallet     #链接钱包dome
        |   |-- Footer            #底部
        |   |-- GlobalTips        #全局提示
        |   |-- HooksProvider     #hooks异步
        |   |-- Loading           #loading
        |   |-- SelectNetWork     #切换网络配置
        |   |-- SideMenu          #menu
        |   |-- SideMenuH5        #menu h5
        |   |-- SwitchLanguage    #语言切换
        |   |-- TopBar            #topBar栏
        |   |-- Web3Provider      #web3入口
        |-- contracts             #合约配置
        |   |-- constant.dev.ts   #dev环境
        |   |-- constant.prd.ts   #prd环境
        |   |-- constant.ts       #合约入口
        |   |-- constant.uat.ts   #uat环境
        |   |-- constantInit.ts   #合约数据初始化
        |   |-- init.ts           #合约默认配置
        |   |-- abis              #abi文件
        |-- hooks                 #hooks
        |   |-- useChainIdHooks.ts#chainId入口
        |   |-- useDataHooks.ts   #合约数据初始化解析
        |   |-- useErrorHooks.ts  #调用合约报错解析
        |   |-- useWeb3Hooks.ts   #钱包链接监听
        |   |-- useWindowSizeHooks.ts  #Windows窗口变化监听
        |-- layout                     #全局页面样式入口
        |-- locales                    #国际化语言包
        |-- pages                      #所有页面
        |   |-- 404.tsx                #404
        |   |-- Home                   #首页
        |-- router                     #路由
        |-- store                      #redux
        |-- theme                      #styled 主题配置
        |-- utils                      #常用配置
            |-- i18n.tsx               #i18n
            |-- index.ts               #常用配置
            |-- request.ts             #request配置
~~~



#### Learn More
