## 解密 Vue2
> 了解架构与过程，熟悉核心如何实现
* 1: 架构设计
* 2: 创建Vue实例时做了什么
* 3: 变化侦测做了什么
* 4: 模板编译做了什么
* 5: 异步更新做了什么

### 一：架构设计
* 架构设计
### 二：创建Vue实例时做了什么
* 初始化阶段 [ new Vue() => created() ]
    * initLifecycle() => 初始化实例属性 vm.$parent、vm.$root、vm.$children、vm.$refs...
    * initEvents() => 初始化事件 v-on...
    * initRender() => 初始化渲染函数 vm.$createElement...
    * <font color="#bbb">callHook('beforeCreated') => 生命周期beforeCreated</font>
    * initState() => 初始化状态 props、methods、data、computed、watch...
    * <font color="#bbb">callHook('created') => 生命周期created</font>
* 模板编译阶段（只存在于完整版）[ create() => beforeMount() ]
    * parser => 解析器 生成AST
    * optimize => 优化器 找出所有静态节点并标记
    * generate => 代码生成器 通过AST生成代码字符串
* 挂载阶段 [ beforeMount() => mount() ]
    * patch
* <font color="#bbb">已挂载 [ beforeUpdate() => update() ]</font>
    * patch
* 卸载阶段 [ beforeDestroy() => destroy() ]
### 三：变化侦测做了什么
* 什么是变化侦测
* 变化侦测的原理（对象、数组）
* 如何收集依赖
* 依赖收集在哪里
### 四：模板编译做了什么
* parser => 解析器 生成AST
    * 解析方式 开始标签开始、开始标签结束、文本、结束标签
    * 推入、推出栈 来维护层级关系（保证每当触发钩子函数start时，栈的最后一个节点就是当前构建的节点的父节点）
* optimize => 优化器 找出所有静态节点并标记
* generate => 代码生成器 通过AST生成渲染函数
### 五：异步更新做了什么
* patch
    * 渲染函数 To 虚拟DOM
    * 虚拟DOM diff
        ```
        规则：
        1. 平级diff
        2. 深度遍历
        ```
    * patch
        ```
        规则：
        1. 创建新增节点
            a. 旧的没有，新的有，执行新增
            b. 旧的和新的不是同一个，新增新的，删除旧的
        2. 删除废弃节点
            a. 删除旧的
        3. 更新已有节点
            a. 都是静态节点则跳过
            b. 有文本属性，比较更新
            c. 没有文本属性，递归比较子节点
        ```