import { Move, Piece, Position } from '../constants';
import { isTileOccupiedByFriendlyPiece } from './GeneralRules';

export const isKnightMoveValid = (move: Move, board: Piece[]): boolean => {
    const rowsMoved = Math.abs(move.actualPosition.row - move.previousPosition.row);
    const columnsMoved = Math.abs(move.actualPosition.column - move.previousPosition.column);
    
    const validMovement = (rowsMoved === 2 && columnsMoved === 1) || (rowsMoved === 1 && columnsMoved === 2);

    return validMovement && !isTileOccupiedByFriendlyPiece(move.actualPosition, move.piece.color, board);
}

export const getPossibleKnightMoves = (knight: Piece, board: Piece[]): Position[] => {
    return possibleKnightMoves(knight)
        .filter(move => isKnightMoveValid(move, board))
        .map(move => move.actualPosition);
}

const possibleKnightMoves = (knight: Piece): Move[] => {
    const previousPosition = knight.position;

    return [
        {
            previousPosition,
            actualPosition: {column: previousPosition.column + 2, row: previousPosition.row + 1},
            piece: knight
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column + 2, row: previousPosition.row - 1},
            piece: knight
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column - 2, row: previousPosition.row + 1},
            piece: knight
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column - 2, row: previousPosition.row - 1},
            piece: knight
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column + 1, row: previousPosition.row + 2},
            piece: knight
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column + 1, row: previousPosition.row - 2},
            piece: knight
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column - 1, row: previousPosition.row + 2},
            piece: knight
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column - 1, row: previousPosition.row - 2},
            piece: knight
        },
        
    ];
}