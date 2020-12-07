const estraverse = require('estraverse');

const judge = (node, config) => {
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
    
    //----------------------------------------------------------------------
    // Custom judge
    //----------------------------------------------------------------------

    // 期待した出力と違う
    if (node.value.trim() !== config.value) {
        result.error = true
        result.message = `「${config.value}」のコメントがありません`
        return result
    }
        
    return result
}

module.exports = (ast, config) => {
    let result = {};
    let count = 0;
    ast.comments.forEach(comment => {
        if(comment.type === 'Line') {
            count++
            result = judge(comment, config)
        }
    });
            
    if(count === 0) {
        result.error = true
        result.message = `コメントがありません`
    }
    return result
}