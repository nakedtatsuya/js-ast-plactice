const esprima = require('esprima');
const fs = require('fs');
const {needConsole, needComment} = require('./judge');
const judgeConfig = require('./judgeConfig');




fs.readFile('./inputs/source.js', 'utf-8', function (err, source) {
    if (err !== null) {
        return;
    }


    //----------------------------------------------------------------------
    // Parse
    //----------------------------------------------------------------------
    var ast = esprima.parse(source, {comment: true, range: true, loc: true, tokens: true});

    //----------------------------------------------------------------------
    // Judge
    //----------------------------------------------------------------------
    let result = {}
    const results = judgeConfig.judgeList.map(judge => {
        if(judge.type === 'needConsole') {
            result = needConsole(ast, judge)
            
        }
        if(judge.type === 'needComment') {
            // ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
            result = needComment(ast, judge)
        }
        return result
    })

    //----------------------------------------------------------------------
    // Feedback
    //----------------------------------------------------------------------
    result = results.find(result => result.error);
    if(result && result.error) {
        // file & line
        result.loc && console.log(`./inputs/source.js:${result.loc.start.line}`)
        // range
        result.range && console.log(`該当箇所: ${source.slice(result.range[0], result.range[1])}`)
        // error message
        console.log(result.message)
    } else {
        // clear message
        console.log("おめでとう！")
    }

    
    
    // console.log(JSON.stringify(ast, null, 2));

    // console.log(escodegen.generate(ast)); if (!checkConsoleText(parent, text)) {
});




// /* HTML parser */
// fs.readFile('./index.html', 'utf-8', function (err, source) {
//     if (err !== null) {
//         return;
//     }
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(source, 'text/html');
//     // console.log(doc)
// });

// /* HTML parser */
// fs.readFile('./index.css', 'utf-8', function (err, source) {
//     if (err !== null) {
//         return;
//     }
//     var ast = css.parse(source);
//     // var cssStr = css.stringify(ast);
//     // var result = css.stringify(cssStr, { sourcemap: true });
//     // console.log(JSON.stringify(ast, null , 2))
// });

// "body": [
//     {
//       "type": "ExpressionStatement",
//       "expression": {
//         "type": "MemberExpression",
//         "computed": false,
//         "object": {
//           "type": "Identifier",
//           "name": "console"
//         },
//         "property": {
//           "type": "Identifier",
//           "name": "log"
//         }
//       }
//     }
//   ],

// "body": [
//     {
//       "type": "ExpressionStatement",
//       "expression": {
//         "type": "CallExpression",
//         "callee": {
//           "type": "MemberExpression",
//           "computed": false,
//           "object": {
//             "type": "Identifier",
//             "name": "console"
//           },
//           "property": {
//             "type": "Identifier",
//             "name": "log"
//           }
//         },
//         "arguments": []
//       }
//     }
//   ],