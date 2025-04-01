var astUtil = require("./ast");
var errorUtil = require("./error");


var ATTRIBUTES = {
  CONDITION: "condition"
};

exports.getConditionExpression = function(node, errorInfos) {
  var condition = astUtil.getAttributeMap(node)[ATTRIBUTES.CONDITION];

  if (!condition) {
    errorUtil.throwNoAttribute(ATTRIBUTES.CONDITION, errorInfos);
  }
  /** 
   * 如果condition属性不是表达式容器, 则抛出错误
   * */
  if (!astUtil.isExpressionContainer(condition)) {
    errorUtil.throwNotExpressionType(ATTRIBUTES.CONDITION, errorInfos);
  }

  /** 
   * 返回condition属性的表达式
   * */
  return astUtil.getExpression(condition);
};