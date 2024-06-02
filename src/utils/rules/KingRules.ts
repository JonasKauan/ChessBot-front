import { Position, Piece, Move, Board } from '../../models';
import { Color, isTileThreatened, isValidMove } from '../constants';
import { isTileOccupiedByFriendlyPiece } from './GeneralRules';

export const isKingMoveValid = (move: Move, board: Piece[]): boolean => {
    const rowsMoved = Math.abs(move.piece.position.row - move.desiredPosition.row);
    const columnsMoved = Math.abs(move.piece.position.column - move.desiredPosition.column);

    const validMovePattern = (
        rowsMoved === 1 &&
        columnsMoved === 0
    ) ||
    (
        rowsMoved === 0 &&
        columnsMoved === 1
    ) ||
    (rowsMoved === columnsMoved);
    
    const emptyOrOccupiedByEnemy = !isTileOccupiedByFriendlyPiece(move.desiredPosition, move.piece.color, board);
    const threatenedSquare = isTileThreatened(move.desiredPosition, move.piece.color, board);
    return validMovePattern && emptyOrOccupiedByEnemy && !threatenedSquare;
}

export const getPossibleKingMoves = (king: Piece, board: Board): Position[] => {
    return possibleKingMoves(king)
        .filter(move => isValidMove(move, board))
        .map(move => move.desiredPosition);
}

export const getAttackedKingSquares = (king: Piece): Position[] => {
    return possibleKingMoves(king)
        .filter(move => move.isWithinBounds)
        .map(move => move.desiredPosition);
}

const possibleKingMoves = (king: Piece): Move[] => {
    const possibleMoves: Move[] = [];
    const previousPosition = king.position;

    [1, -1].forEach(direction => {

        possibleMoves.push(
            new Move(
                king,
                new Position(previousPosition.column + direction, previousPosition.row + direction)
            )
        );

        possibleMoves.push(
            new Move(
                king,
                new Position(previousPosition.column + direction, previousPosition.row)
            )
        );

        possibleMoves.push(
            new Move(
                king,
                new Position(previousPosition.column, previousPosition.row + direction)
            )
        );

        possibleMoves.push(
            new Move(
                king,
                new Position(previousPosition.column - direction, previousPosition.row + direction)
            )
        );
        
    })

    return possibleMoves;
}