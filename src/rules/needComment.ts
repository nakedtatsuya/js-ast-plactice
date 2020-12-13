import { Comment } from 'acorn';
import { Result } from '../../types';

// const judge = (comment: Comment, config: any) => {
//     let result: Result = {
//         error: false,
//         message: '',
//         loc: null,
//         range: null,
//     }

//     //----------------------------------------------------------------------
//     // Util functions
//     //----------------------------------------------------------------------

//     //----------------------------------------------------------------------
//     // Common judge
//     //----------------------------------------------------------------------

//     //----------------------------------------------------------------------
//     // Custom judge
//     //----------------------------------------------------------------------

//     // 期待した出力と違う
//     if (comment.value.trim() !== config.value) {
//         result.error = true
//         result.message = `「${config.value}」のコメントがありません`
//         return result
//     }

//     return result
// }

const needComment = (comments: Comment[], config: any) => {
  const result: Result = {};
  let isExist = false;

  // if(!ast.comments) return

  comments.forEach((comment) => {
    if (comment.type === 'Line') {
      isExist = true;
      if (comment.value.trim() !== config.value) {
        result.error = true;
        result.message = `「${config.value}」のコメントがありません`;
      }
    }
  });

  if (!isExist) {
    result.error = true;
    result.message = 'コメントがありません';
  }
  return result;
};

export default needComment;
