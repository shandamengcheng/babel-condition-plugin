/**
 * 实现一个switch能力
 */
var astUtil = require("./utils/ast");
var errorUtil = require("./utils/error");

var ELEMENTS = {
  SWITCH: "Switch",
  CASE: "Case",
  DEFAULT: "Default"
}

function getBlocks(types, nodes, errorInfos, key) {
  var result = {
    cases: [],
    default: null
  };
  nodes.forEach(node => {
    if (astUtil.isTag(node, ELEMENTS.DEFAULT)) {
      if (result.default) {
        errorInfos.node = node;
        errorInfos.element = ELEMENTS.DEFAULT;
        errorUtil.throwSwitchWithMultipleDefault(errorInfos);
      }
      result.default = astUtil.getSanitizedExpressionForContent(types, astUtil.getChildren(types, node), key);
    }

    if (astUtil.isTag(node, ELEMENTS.CASE)) {
      // 校验Case是否在Default后面  
      if (result.default) {
        errorInfos.node = node;
        errorInfos.element = ELEMENTS.CASE;
        errorUtil.throwSwitchDefaultNotLast(errorInfos);
      }
      const caseValue = astUtil.getAttributeValue(node, "value");
      if (!caseValue) {
        errorInfos.node = node;
        errorInfos.element = ELEMENTS.CASE;
        errorUtil.throwNoValueAttribute(errorInfos);
      }
      result.cases.push({
        value: caseValue,
        children: astUtil.getSanitizedExpressionForContent(types, astUtil.getChildren(types, node), key)
      });
    }
  });
  return result;
}

module.exports = function switchPlugin(babel) {
  const { types: t } = babel;

  return function switchPlugin(node, file) {
    var errorInfos = { node: node, file: file, element: ELEMENTS.SWITCH };
    const value = astUtil.getAttributeValue(node, "value");
    //  Switch上面需要设置value属性
    if (!value) {
      errorInfos.node = node;
      errorUtil.throwNoValueAttribute(errorInfos);
    }
    const children = astUtil.getChildren(t, node);
    var key = astUtil.getKey(node);
    var { cases, default: d } = getBlocks(t, children, errorInfos, key);

    // 边界场景校验
    if (cases.length === 0) {
      errorInfos.node = node;
      errorUtil.throwSwitchWithoutCase(errorInfos);
    }
    // 生成Switch的AST
    var expression = d || t.nullLiteral();
    cases.reverse().forEach(c => {
      expression = t.ConditionalExpression(
        t.binaryExpression(
          "===",
          value,
          c.value
        ),
        c.children,
        expression
      );
    })
    return expression;
  }
}