import { Position } from '../../models';
import { Piece } from '../../models/Piece';
import { Move } from '../constants';
import { isTileOccupiedByFriendlyPiece } from './GeneralRules';

export const isKnightMoveValid = (move: Move, board: Piece[]): boolean => {
    const rowsMoved = Math.abs(move.desiredPosition.row - move.piece.position.row);
    const columnsMoved = Math.abs(move.desiredPosition.column - move.piece.position.column);
    
    const validMovement = (rowsMoved === 2 && columnsMoved === 1) || (rowsMoved === 1 && columnsMoved === 2);

    return validMovement && !isTileOccupiedByFriendlyPiece(move.desiredPosition, move.piece.color, board);
}

export const getPossibleKnightMoves = (knight: Piece, board: Piece[]): Position[] => {
    return possibleKnightMoves(knight)
        .filter(move => isKnightMoveValid(move, board))
        .map(move => move.desiredPosition);
}

const possibleKnightMoves = (knight: Piece): Move[] => {
    const previousPosition = knight.position;

    return [
        {
            desiredPosition: new Position(previousPosition.column + 2, previousPosition.row + 1),
            piece: knight
        },
        {
            desiredPosition: new Position(previousPosition.column + 2, previousPosition.row - 1),
            piece: knight
        },
        {
         
            desiredPosition: new Position(previousPosition.column - 2, previousPosition.row + 1),
            piece: knight
        },
        {
          
            desiredPosition: new Position(previousPosition.column - 2, previousPosition.row - 1),
            piece: knight
        },
        {
          
            desiredPosition: new Position(previousPosition.column + 1, previousPosition.row + 2),
            piece: knight
        },
        {
        
            desiredPosition: new Position(previousPosition.column + 1, previousPosition.row - 2),
            piece: knight
        },
        {
         
            desiredPosition: new Position(previousPosition.column - 1, previousPosition.row + 2),
            piece: knight
        },
        {
            desiredPosition: new Position(previousPosition.column - 1, previousPosition.row - 2),
            piece: knight
        },
        
    ];
}