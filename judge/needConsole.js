const estraverse = require('estraverse');

const judge = (node, parent, config) => {
    let result = {
        error: false,
        message: null,
        loc: null,
        range: null,
    }

    //----------------------------------------------------------------------
    // Util functions
    //----------------------------------------------------------------------
  
    //----------------------------------------------------------------------
    // Common judge
    //----------------------------------------------------------------------
    if(parent.type !== 'CallExpression') {
        result.error = true
        result.message = `()でconsole.logを呼び出してください`
        result.loc = node.loc
        result.range = node.range
        return result
    }
    if(parent.arguments.length === 0) {
        result.error = true
        result.message = `引数に出力する値を渡してください`
        result.loc = node.loc
        result.range = node.range
        return result
    }
    if(!parent.arguments[0].value) {
        result.error = true
        result.message = `定義されていない値が引数に渡されています`
        result.loc = node.loc
        result.range = node.range
        return result
    }

    //----------------------------------------------------------------------
    // Custom judge
    //----------------------------------------------------------------------

    // 期待した出力と違う
    if (parent.arguments[0].value !== config.value) {
        result.error = true
        result.message = `文字列「${config.value}」を出力してください`
        return result
    }
        
    return result
}

module.exports = (ast, config) => {
    let result = {};
    let count = 0;
    estraverse.traverse(ast, {
        leave: function (node, parent) {
            if(node.type === 'MemberExpression' && node.object.name === 'console' && node.property.name === 'log') {
                count++
                result = judge(node, parent, config)
                if(!result.error) return this.break()
            }
        }
    });
    if(count === 0) {
        result.error = true
        result.message = `console.logがありません`
    }
    return result
}