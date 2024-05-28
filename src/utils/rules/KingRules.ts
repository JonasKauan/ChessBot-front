import { Move, Piece, Position } from '../constants';
import { isTileOccupiedByFriendlyPiece } from './GeneralRules';

export const isKingMoveValid = (move: Move, board: Piece[]): boolean => {
    const rowsMoved = Math.abs(move.previousPosition.row - move.actualPosition.row);
    const columnsMoved = Math.abs(move.previousPosition.column - move.actualPosition.column);

    const validMove = (
        rowsMoved === 1 &&
        columnsMoved === 0
    ) ||
    (
        rowsMoved === 0 &&
        columnsMoved === 1
    ) ||
    (
        rowsMoved === columnsMoved
    );

    return validMove && !isTileOccupiedByFriendlyPiece(move.actualPosition, move.piece.color, board);
}

export const getPossibleKingMoves = (king: Piece, board: Piece[]): Position[] => {
    return possibleKingMoves(king).filter(move => isKingMoveValid(move, board)).map(move => move.actualPosition);
}

const possibleKingMoves = (king: Piece): Move[] => {
    const possibleMoves: Move[] = [];
    const previousPosition = king.position;

    [1, -1].forEach(direction => {
        possibleMoves.push({
            previousPosition,
            actualPosition: {column: previousPosition.column + direction, row: previousPosition.row + direction},
            piece: king
        });

        possibleMoves.push({
            previousPosition,
            actualPosition: {column: previousPosition.column + direction, row: previousPosition.row},
            piece: king
        });

        possibleMoves.push({
            previousPosition,
            actualPosition: {column: previousPosition.column, row: previousPosition.row + direction},
            piece: king
        });

        possibleMoves.push({
            previousPosition,
            actualPosition: {column: previousPosition.column - direction, row: previousPosition.row + direction},
            piece: king
        });
        
    })

    return possibleMoves;
}