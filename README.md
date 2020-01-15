### backend ###

#### 框架

Django

#### 安装

```bash
$ cd backend/
$ sudo pip install -r dev-requirements.txt
```

### frontend

#### 框架

React

#### 安装

```bash
$ cd frontend/
$ yarn config set registry https://registry.npm.taobao.org
$ yarn install
```

### 需求

+ 流式：展示当前流水线上的image，其feature map和class；持续一段时间直到下一块屏幕被检查
+ 静态：展示一段时间（日、月、年等）内所有的images，其feature maps和classes
+ 统计：明确该生产线上屏幕的次品率，某一段时间内所有屏幕的次品率

### 基本设计（暂定）

+ 使用React作为前端
+ 使用Antd作为UI
+ 使用Django作为后端
+ Django调用*训练好的模型*得到feature map和class
+ 使用Mysql作为数据库存储历史images