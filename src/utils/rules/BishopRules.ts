import { Move, Piece, Position, isSamePosition } from '../constants';
import { isTileOccupiedByFriendlyPiece, isTileOccupiedByOpponent } from './GeneralRules';

export const isBishopMoveValid = (move: Move, board: Piece[]): boolean => {
    const rowsMoved = Math.abs(move.previousPosition.row - move.actualPosition.row);
    const columnsMoved = Math.abs(move.previousPosition.column - move.actualPosition.column);

    if(rowsMoved !== columnsMoved) return false;

    const rowDirection = move.previousPosition.row < move.actualPosition.row ? 1 : -1;
    const columnDirection = move.previousPosition.column < move.actualPosition.column ? 1 : -1;

    let enemyPieceInTheWay = false;

    for(let i = 1; i < 8; i++){
        if(enemyPieceInTheWay) break;

        const actualDiagonal: Position = {
            row: move.previousPosition.row + rowDirection * i,
            column: move.previousPosition.column + columnDirection * i
        }

        if(isTileOccupiedByFriendlyPiece(actualDiagonal, move.piece.color, board)) break;
        if(isTileOccupiedByOpponent(actualDiagonal, move.piece.color, board)) enemyPieceInTheWay = true;
        if(isSamePosition(move.actualPosition, actualDiagonal)) return true;
    }

    return false;
}

export const getPossibleBishopMoves = (bishop: Piece, board: Piece[]): Position[] => {
    return possibleBishopMoves(bishop)
        .filter(move => isBishopMoveValid(move, board))
        .map(move => move.actualPosition);
}

const possibleBishopMoves = (bishop: Piece): Move[] => {
    const possibleMoves: Move[] = [];
    const previousPosition = bishop.position;


    [1, -1].forEach(direction => {
        for (let i = 1; i < 8; i++) {
            possibleMoves.push({
                previousPosition,
                actualPosition: {column: previousPosition.column + direction * i, row: previousPosition.row + i},
                piece: bishop
            });
    
            possibleMoves.push({
                previousPosition,
                actualPosition: {column: previousPosition.column - direction * i, row: previousPosition.row - i},
                piece: bishop
            });
        }
    })


    return possibleMoves;
}