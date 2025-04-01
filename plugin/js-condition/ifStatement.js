var astUtil = require("./utils/ast");
var conditionalUtil = require("./utils/conditional");

var ELEMENTS = {
  IF: "If",
  ELSE: "Else"
};

function getBlocks(ifNodes) {
  var result = {
    ifBlock: [],
    elseBlock: null
  };
  var currentBlock = result.ifBlock;
  ifNodes.forEach(function(node) {
      currentBlock.push(node);
  });
  return result;
}

function getElseChildren(types, node) {
  const children = astUtil.getChildren(types, node);
  return children.filter(child => astUtil.isTag(child, ELEMENTS.ELSE));
}

module.exports = function ifStatement(babel) {
  /** babel参数包含Babel编译的核心API
   * types: AST节点类型和操作工具
   * template: 用于从字符串模板创建AST
   * traverse: 遍历和修改AST的工具
   * parse: 将代码字符串解析成AST的功能
   * generate: 将AST转换回代码字符串的功能
   */
  var types = babel.types;

  return function(node, file, path) {
    var ifBlock;
    var elseBlock;
    var errorInfos = {node: node, file: file, element: ELEMENTS.IF};
    /** 
     * 获取condition属性 
     * 如果If标签没有condition属性, 则抛出错误
     * */
    var condition = conditionalUtil.getConditionExpression(node, errorInfos);
    var key = astUtil.getKey(node);
    var ifChildren = astUtil.getChildren(types, node);
    var blocks = getBlocks(ifChildren);
    ifBlock = astUtil.getSanitizedExpressionForContent(types, blocks.ifBlock, key);
    /** types.nullLiteral - 创建null字面量 */
    elseBlock = blocks.elseBlock ? astUtil.getSanitizedExpressionForContent(types, blocks.elseBlock, key) : types.nullLiteral();
    /** 创建条件表达式（三元运算符） */
    return types.ConditionalExpression(condition, ifBlock, elseBlock);
  };
};