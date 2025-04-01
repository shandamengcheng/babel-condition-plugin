# babel-condition-plugin
babel条件渲染组件插件

### 使用方式
```
<If condition={表达式}>xxx</If>

<Choose>
  // 可以有多个When, 但是只能有一个Otherwise
  <When condition={表达式}></When>
  <Otherwise></Otherwise>
</Choose>

<Switch value={xxx}>
  // 可以有多个Case, 但是只能有一个Default
  <Case value={xxx}></Case>
  <Default></Default>
</Switch>
```
