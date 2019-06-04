exports.isBalanced = (parenthesis) => {
    let isBalanced = true;
    let stack = []
    inputArray = parenthesis.split('');
    if(inputArray[0] == '}' || inputArray[0] == ')' || inputArray[0] == ']'){
        return false
    }
    
    for(i=0;i<inputArray.length;i++){
        switch(inputArray[i]){
          case '{' :
          case '[' :
          case '(' :
                stack.push(inputArray[i]);
                break;
          case '}':
            if(stack[stack.length-1] == '{'){
                stack.pop();
            } else {
                isBalanced = false;
            }
            break;
          case ']':
            if(stack[stack.length-1] == '['){
                stack.pop();
            } else {
                isBalanced = false;
            }
            break;
          case ')':
            if(stack[stack.length-1] == '('){
                stack.pop();
            } else {
                isBalanced = false;
            }
            break;
          default:
                break;
        }
        
        if(!isBalanced){
          break
        }
      }

      if(stack.length){
            return false;
      }
      return isBalanced; 
}