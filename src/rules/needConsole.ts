import * as estraverse from 'estraverse';
import * as ESTree from 'estree';
import { Result } from '../../types';

const judge = (node: ESTree.Node, parent: ESTree.Node, config: any) => {
  const result: Result = {
    error: false,
    message: '',
    loc: null,
    range: null,
  };

  //----------------------------------------------------------------------
  // Util functions
  //----------------------------------------------------------------------

  //----------------------------------------------------------------------
  // Common judge
  //----------------------------------------------------------------------
  if (parent.type !== 'CallExpression') {
    result.error = true;
    result.message = '()でconsole.logを呼び出してください';
    result.loc = node.loc;
    result.range = node.range;
    return result;
  }
  if (parent.arguments.length === 0) {
    result.error = true;
    result.message = '引数に出力する値を渡してください';
    result.loc = node.loc;
    result.range = node.range;
    return result;
  }
  if (parent.arguments[0].type === 'Literal' && !parent.arguments[0].value) {
    result.error = true;
    result.message = '定義されていない値が引数に渡されています';
    result.loc = node.loc;
    result.range = node.range;
    return result;
  }

  //----------------------------------------------------------------------
  // Custom judge
  //----------------------------------------------------------------------

  // 期待した出力と違う
  if (parent.arguments[0].type === 'Literal' && parent.arguments[0].value !== config.value) {
    result.error = true;
    result.message = `文字列「${config.value}」を出力してください`;
    return result;
  }

  return result;
};

const needConsole = (ast: ESTree.Node, config: any) => {
  let result: Result = {};
  let isExist = false;
  estraverse.traverse(ast, {
    leave: (node, parent) => {
      if (node.type === 'MemberExpression' && node.object.type === 'Identifier' && node.property.type === 'Identifier' && node.object.name === 'console' && node.property.name === 'log') {
        isExist = true;
        if (!parent) return;
        result = judge(node, parent, config);
      }
    },
  });
  if (!isExist) {
    result.error = true;
    result.message = 'console.logがありません';
  }
  return result;
};

export default needConsole;
