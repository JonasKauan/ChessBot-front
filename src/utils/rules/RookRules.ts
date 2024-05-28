import { Move, Piece, Position, isSamePosition } from "../constants";
import { isTileOccupiedByFriendlyPiece, isTileOccupiedByOpponent } from "./GeneralRules";

export const isRookMoveValid = (move: Move, board: Piece[]): boolean => {
    
    const rowsMoved = Math.abs(move.previousPosition.row - move.actualPosition.row);
    const columnsMoved = Math.abs(move.previousPosition.column - move.actualPosition.column);

    if(rowsMoved === columnsMoved) return false;

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

export const getPossibleRookMoves = (rook: Piece, board: Piece[]): Position[] => {
    return possibleRookMoves(rook).filter(move => isRookMoveValid(move, board)).map(move => move.actualPosition);
}

const possibleRookMoves = (rook: Piece): Move[] => {
    const possibleMoves: Move[] = [];
    const previousPosition = rook.position;

    [1, -1].forEach(direction => {

        for (let i = 1; i < 8; i++) {
            possibleMoves.push({
                previousPosition,
                actualPosition: {column: previousPosition.column + i * direction, row: previousPosition.row},
                piece: rook
            });

            possibleMoves.push({
                previousPosition,
                actualPosition: {column: previousPosition.column, row: previousPosition.row + i * direction},
                piece: rook
            });
        }
    });

    return possibleMoves;
}