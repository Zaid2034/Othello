/* eslint-disable no-unused-vars */
function solveDiagonalLU(row,col,board,i,j,turn,count,direction,newBoard){
    if(i>=board.length || j>=board.length || i<0 || j<0)return false
   
    if(board[i][j].turn==turn){
        if(count>0){
            return true;
        }
        return false;
    }
    if(board[i][j].turn==-1 || board[i][j].turn==-2){
        return false;
    }
    if(turn==0){
        if(board[i][j].turn==1)count+=1;
    }else{
        if(board[i][j].turn==0)count+=1;
    }
    if(direction==="DLU"){
        let originValue=null
        if(newBoard!=null){
            originValue=newBoard[i][j].turn
            newBoard[i][j].turn=turn
        }
        const ansBool=solveDiagonalLU(row,col,board,i-1,j-1,turn,count,direction,newBoard)
        if(!ansBool && originValue!=null){
            newBoard[i][j].turn=originValue
        }
        return ansBool
    }
    
    if(direction==="U"){
        let originValue=null
        if(newBoard!=null){
            originValue=newBoard[i][j].turn
            newBoard[i][j].turn=turn
        }
        const ansBool=solveDiagonalLU(row,col,board,i-1,j,turn,count,direction,newBoard)
        if(!ansBool && originValue!=null)newBoard[i][j].turn=originValue
        return ansBool

    }
    
    if(direction==="DRD"){
        let originValue=null
        if(newBoard!=null){
            originValue=newBoard[i][j].turn
            newBoard[i][j].turn=turn
        }
        const ansBool=solveDiagonalLU(row,col,board,i+1,j+1,turn,count,direction,newBoard)
        if(!ansBool && originValue!=null)newBoard[i][j].turn=originValue
        return ansBool

    }
    
    if(direction==="DRU"){
        let originValue=null
        if(newBoard!=null){
            originValue=newBoard[i][j].turn
            newBoard[i][j].turn=turn
        }
        const ansBool=solveDiagonalLU(row,col,board,i-1,j+1,turn,count,direction,newBoard)
        if(!ansBool && originValue!=null)newBoard[i][j].turn=originValue
        return ansBool
    }
    
    if(direction==="L"){
        let originValue=null
        if(newBoard!=null){
            originValue=newBoard[i][j].turn
            newBoard[i][j].turn=turn
        }
        const ansBool=solveDiagonalLU(row,col,board,i,j-1,turn,count,direction,newBoard)
        if(!ansBool && originValue!=null)newBoard[i][j].turn=originValue
        return ansBool
    }
    
    if(direction==="R"){
        let originValue=null
        if(newBoard!=null){
            originValue=newBoard[i][j].turn
            newBoard[i][j].turn=turn
        }
        const ansBool=solveDiagonalLU(row,col,board,i,j+1,turn,count,direction,newBoard)
        if(!ansBool && originValue!=null)newBoard[i][j].turn=originValue
        return ansBool
    }
    
    if(direction==="DLD"){
        let originValue=null
        if(newBoard!=null){
            originValue=newBoard[i][j].turn
            newBoard[i][j].turn=turn
        }
        const ansBool=solveDiagonalLU(row,col,board,i+1,j-1,turn,count,direction,newBoard)
        if(!ansBool && originValue!=null)newBoard[i][j].turn=originValue
        return ansBool
    }
    
    if(direction==="D"){
        let originValue=null
        if(newBoard!=null){
            originValue=newBoard[i][j].turn
            newBoard[i][j].turn=turn
        }
        const ansBool=solveDiagonalLU(row,col,board,i+1,j,turn,count,direction,newBoard)
        if(!ansBool && originValue!=null)newBoard[i][j].turn=originValue
        return ansBool
        
    }
    
}
export function checkPosition(row,col,board,i,j,turn,count,newBoard){
    const ans1=solveDiagonalLU(row,col,board,i-1,j-1,turn,count,"DLU",newBoard)
    const ans2 = solveDiagonalLU(row, col, board, i - 1, j, turn,count,"U",newBoard);
    const ans3 = solveDiagonalLU (row, col, board, i + 1, j+1, turn,count,"DRD",newBoard);
    const ans4 = solveDiagonalLU (row, col, board, i - 1, j+1,turn, count,"DRU",newBoard);
    const ans5 = solveDiagonalLU (row, col, board, i, j-1,turn, count,"L",newBoard);
    const ans6 = solveDiagonalLU(row, col, board, i, j+1,turn, count,"R",newBoard);
    const ans7 = solveDiagonalLU(row, col, board, i + 1, j-1, turn,count,"DLD",newBoard);
    const ans8 = solveDiagonalLU(row, col, board, i+1, j, turn,count,"D",newBoard);

    return ans1||ans2||ans3||ans4||ans5||ans6||ans7||ans8;


}
export function checkLose(board,turn){
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(checkPosition(i,j,board,i,j,turn,0,null)){
                return true;
            }
        }
    }
    return false;

}
export function showValidPos(board,turn){
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(board[i][j].turn==-2){
                board[i][j].turn=-1  
            }
        }
    }
    const newBoard2=[...board]
    const coord=[]
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(checkPosition(i,j,newBoard2,i,j,turn,0,null) && board[i][j].turn==-1){
                coord.push({i,j})
            }
        }
    }
    coord.forEach(cord=>{
        newBoard2[cord.i][cord.j].turn=-2
    })
    board=newBoard2

}
