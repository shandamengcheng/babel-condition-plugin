var astUtil = require("./utils/ast");
var errorUtil = require("./utils/error");

const ELEMENTS = {
  SWITCH: "Switch",
  CASE: "Case",
  DEFAULT: "Default"
};

function getCaseBlocks(types, children, errorInfos, key) {
  var cases = [];
  var defaultCase = null;

  children.forEach(function(child) {
    if (child.openingElement.name.name === ELEMENTS.CASE) {
      var caseValue = astUtil.getAttributeValue(child, "value");
      if (!caseValue) {
        errorInfos.node = child;
        errorUtil.throwNoValueAttribute(errorInfos);
      }
      cases.push({
        value: caseValue,
        // 添加 key 属性
        children: astUtil.getSanitizedExpressionForContent(types, astUtil.getChildren(types, child), key)
      });
    } else if (child.openingElement.name.name === ELEMENTS.DEFAULT) {
      defaultCase = astUtil.getSanitizedExpressionForContent(types, astUtil.getChildren(types, child), key);
    }
  });

  return { cases, defaultCase };
}

module.exports = function(babel) {
  var types = babel.types;

  return function(node, file) {
    var errorInfos = { node: node, file: file, element: ELEMENTS.SWITCH };
    var children = astUtil.getChildren(types, node);
    var key = astUtil.getKey(node);
    var switchValue = astUtil.getAttributeValue(node, "value");

    if (!switchValue) {
      errorInfos.node = node;
      errorUtil.throwNoValueAttribute(errorInfos);
    }

    var { cases, defaultCase } = getCaseBlocks(types, children, errorInfos, key);
    
    if (!cases.length) {
      errorInfos.node = node;
      errorUtil.throwSwitchWithoutCase(errorInfos);
    }

    var expression = defaultCase || types.nullLiteral();

    cases.reverse().forEach(function(caseBlock) {
      expression = types.ConditionalExpression(
        types.binaryExpression(
          "===",
          switchValue,
          caseBlock.value
        ),
        caseBlock.children,
        expression
      );
    });

    return expression;
  };
};