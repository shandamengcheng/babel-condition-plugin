const transformFor = require("./forStatement");
const transformIf = require("./ifStatement");
const transformChoose = require("./chooseStatement");
const transformWith = require("./withStatement");
// const transformSwitch = require("./switchStatement");
const transformSwitch = require("./mySwitch");


module.exports = function jcsPlugin(babel) {
  const nodeHandlers = {
    For: transformFor(babel),
    If: transformIf(babel),
    Else: transformIf(babel),
    Choose: transformChoose(babel),
    With: transformWith(babel),
    Switch: transformSwitch(babel),
  };

  const visitor = {
    JSXElement: function(path) {
      
      /** openingElement 是开始标签的信息 */
      // if (!path.node || !path.node.openingElement || !path.node.openingElement.name) {
      //   return;
      // }
      /** openingElement.name 是一个对象, 包含类型, 名称, 位置等信息 */
      const nodeName = path.node.openingElement.name.name;
      if (!nodeName) {
        return;
      }
      const handler = nodeHandlers[nodeName];
      if (handler) {
        const result = handler(path.node, path.hub.file, path);
        if (babel.types.isExpression(result)) {
          /** 
           * 如果result是一个表达式, 则将result包装成一个jsxExpressionContainer
           * */
          path.replaceWith(
            babel.types.jsxExpressionContainer(result)
          );
        }
      }
    }
  };

  return {
    visitor: visitor
  };
};