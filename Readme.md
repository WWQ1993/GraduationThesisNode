# 项目使用
## 所需文件
1. [node.js v5.4.0](http://nodejs.org/dist/v5.4.0/node-v5.4.0.tar.gz)
2. MYSQL5.6
3. firefight0806.sql

## 使用方法
### 数据库相关
1. 安装MYSQL5.6
2. 创建数据库firefight0806,执行firefight0806.sql
### node.js环境相关
1. 安装node.js
    * 下载[node.js v5.4.0](http://nodejs.org/dist/v5.4.0/node-v5.4.0.tar.gz)并以默认安装node.js
2. 安装supervisor
    * 控制台中键入命令: npm -g install supervisor
3. 运行项目
    * 在本项目路径下(myapp/)下执行：supervisor ./bin/www

