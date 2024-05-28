import { Position } from '../../models';
import { Piece } from '../../models/Piece';
import { Move } from '../constants';
import { isTileOccupiedByFriendlyPiece } from './GeneralRules';

export const isKingMoveValid = (move: Move, board: Piece[]): boolean => {
    const rowsMoved = Math.abs(move.piece.position.row - move.desiredPosition.row);
    const columnsMoved = Math.abs(move.piece.position.column - move.desiredPosition.column);

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

    return validMove && !isTileOccupiedByFriendlyPiece(move.desiredPosition, move.piece.color, board);
}

export const getPossibleKingMoves = (king: Piece, board: Piece[]): Position[] => {
    return possibleKingMoves(king).filter(move => isKingMoveValid(move, board)).map(move => move.desiredPosition);
}

const possibleKingMoves = (king: Piece): Move[] => {
    const possibleMoves: Move[] = [];
    const previousPosition = king.position;

    [1, -1].forEach(direction => {
        possibleMoves.push({
            desiredPosition: new Position(previousPosition.column + direction, previousPosition.row + direction),
            piece: king
        });

        possibleMoves.push({
            desiredPosition: new Position(previousPosition.column + direction, previousPosition.row),
            piece: king
        });

        possibleMoves.push({
            desiredPosition: new Position(previousPosition.column, previousPosition.row + direction),
            piece: king
        });

        possibleMoves.push({
            desiredPosition: new Position(previousPosition.column - direction, previousPosition.row + direction),
            piece: king
        });
        
    })

    return possibleMoves;
}