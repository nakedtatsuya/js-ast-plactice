import { parse, Comment } from 'acorn';
import * as fs from 'fs';
import { needConsole, needComment } from './rules/index';
import judgeConfig from './judgeConfig';
import { Result } from '../types';

fs.readFile('./inputs/source.js', 'utf-8', (err, source) => {
  if (err !== null) {
    return;
  }

  //----------------------------------------------------------------------
  // Parse
  //----------------------------------------------------------------------

  // const ast = parse(source, {comment: true, range: true, loc: true, tokens: true});
  const comments: Comment[] = [];

  const ast = parse(source, { ranges: true, locations: true, onComment: comments });
  //----------------------------------------------------------------------
  // Judge
  //----------------------------------------------------------------------
  let result: Result | undefined;
  const results: (Result | undefined)[] = judgeConfig.judgeList.map((judge) => {
    if (judge.type === 'needConsole') {
      result = needConsole(ast, judge);
    }
    if (judge.type === 'needComment') {
      // ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
      result = needComment(comments, judge);
    }
    return result;
  });

  //----------------------------------------------------------------------
  // Feedback
  //----------------------------------------------------------------------
  result = results.find((r) => r && r.error);
  if (result && result.error) {
    // file & line
    // result.loc && console.log(`./inputs/source.js:${result.loc.start.line}`);
    // range
    // result.range && console.log(`該当箇所: ${source.slice(result.range[0], result.range[1])}`);
    // error message
    console.log(result.message);
  } else {
    // clear message
    console.log('おめでとう！');
  }

  console.log(JSON.stringify(ast, null, 2));

  // console.log(escodegen.generate(ast)); if (!checkConsoleText(parent, text)) {
});
