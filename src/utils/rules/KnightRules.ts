import { Position, Piece, Move } from '../../models';
import { isValidMove } from '../constants';
import { isTileOccupiedByFriendlyPiece } from './GeneralRules';

export const isKnightMoveValid = (move: Move, board: Piece[]): boolean => {
    const rowsMoved = Math.abs(move.desiredPosition.row - move.piece.position.row);
    const columnsMoved = Math.abs(move.desiredPosition.column - move.piece.position.column);
    const validMovement = (rowsMoved === 2 && columnsMoved === 1) || (rowsMoved === 1 && columnsMoved === 2);

    return validMovement && !isTileOccupiedByFriendlyPiece(move.desiredPosition, move.piece.color, board);
}

export const getPossibleKnightMoves = (knight: Piece, board: Piece[]): Position[] => {
    return possibleKnightMoves(knight)
        .filter(move => isValidMove(move, board))
        .map(move => move.desiredPosition);
}

export const getAttackedKnightSquares = (knight: Piece): Position[] => {
    return possibleKnightMoves(knight)
        .filter(move => move.isWithinBounds)
        .map(move => move.desiredPosition);
}

const possibleKnightMoves = (knight: Piece): Move[] => {
    const previousPosition = knight.position;
    const possibleMoves: Move[] = [];

    [1, -1].forEach(direction => {
        possibleMoves.push(
            new Move(
                knight,
                new Position(previousPosition.column + 2 * direction, previousPosition.row + direction)
            )
        );

        possibleMoves.push(
            new Move(
                knight,
                new Position(previousPosition.column + 2 * direction, previousPosition.row - direction)
            )
        );

        possibleMoves.push(
            new Move(
                knight,
                new Position(previousPosition.column + direction, previousPosition.row + 2 * direction)
            )
        );

        possibleMoves.push(
            new Move(
                knight,
                new Position(previousPosition.column + direction, previousPosition.row - 2 * direction)
            )
        );
    });

    return possibleMoves;
}