import { Move, Piece, Position, isSamePosition } from "../constants";
import { isTileOccupiedByFriendlyPiece, isTileOccupiedByOpponent } from "./GeneralRules";

export const isQueenMoveValid = (move: Move, board: Piece[]): boolean => { 
    const rowDirection = move.previousPosition.row === move.actualPosition.row 
        ? 0 
        : move.previousPosition.row < move.actualPosition.row ? 1 : -1;
    
    const columnDirection = move.previousPosition.column === move.actualPosition.column 
        ? 0 
        : move.previousPosition.column < move.actualPosition.column ? 1 : -1;

    let enemyPieceInTheWay = false;

    for(let i = 1; i < 8; i++){
        if(enemyPieceInTheWay) break;

        const actualDirection: Position = {
            row: move.previousPosition.row + rowDirection * i,
            column: move.previousPosition.column + columnDirection * i
        }
        
        if(isTileOccupiedByFriendlyPiece(actualDirection, move.piece.color, board)) break;
        if(isTileOccupiedByOpponent(actualDirection, move.piece.color, board)) enemyPieceInTheWay = true;
        if(isSamePosition(move.actualPosition, actualDirection)) return true;
    }

    return false;
}

export const getPossibleQueenMoves = (queen: Piece, board: Piece[]): Position[] => {
    return possibleQueenMoves(queen)
        .filter(move => isQueenMoveValid(move, board))
        .map(move => move.actualPosition);
}

const possibleQueenMoves = (queen: Piece): Move[] => {
    const possibleMoves: Move[] = [];
    const previousPosition = queen.position;

    [1, -1].forEach(direction => {
        for(let i = 1; i < 8; i++){
            possibleMoves.push({
                previousPosition,
                actualPosition: {
                    column: previousPosition.column + i * direction,
                    row: previousPosition.row + i * direction
                },
                piece: queen
            });

            possibleMoves.push({
                previousPosition,
                actualPosition: {
                    column: previousPosition.column - i * direction,
                    row: previousPosition.row + i * direction
                },
                piece: queen
            });

            possibleMoves.push({
                previousPosition,
                actualPosition: {
                    column: previousPosition.column,
                    row: previousPosition.row + i * direction
                },
                piece: queen
            });

            possibleMoves.push({
                previousPosition,
                actualPosition: {
                    column: previousPosition.column + i * direction,
                    row: previousPosition.row
                },
                piece: queen
            });
        }
    });

    return possibleMoves;
}