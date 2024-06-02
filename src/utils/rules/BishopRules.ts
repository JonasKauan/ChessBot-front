import { Position, Piece, Move, Board } from '../../models';
import { isValidMove, possibleSlidingPieceAttacks } from '../constants';
import { isTileOccupiedByFriendlyPiece, isTileOccupiedByOpponent } from './GeneralRules';

export const isBishopMoveValid = (move: Move, board: Piece[]): boolean => {
    const rowsMoved = Math.abs(move.piece.position.row - move.desiredPosition.row);
    const columnsMoved = Math.abs(move.piece.position.column - move.desiredPosition.column);

    if(rowsMoved !== columnsMoved) return false;

    const rowDirection = move.piece.position.row < move.desiredPosition.row ? 1 : -1;
    const columnDirection = move.piece.position.column < move.desiredPosition.column ? 1 : -1;

    let enemyPieceInTheWay = false;

    for(let i = 1; i < 8; i++){
        if(enemyPieceInTheWay) break;

        const actualDiagonal = new Position(
            move.piece.position.column + columnDirection * i,
            move.piece.position.row + rowDirection * i
        )

        if(isTileOccupiedByFriendlyPiece(actualDiagonal, move.piece.color, board)) break;
        if(isTileOccupiedByOpponent(actualDiagonal, move.piece.color, board)) enemyPieceInTheWay = true;
        if(actualDiagonal.samePosition(move.desiredPosition)) return true;
    }

    return false;
}

export const getPossibleBishopMoves = (bishop: Piece, board: Board): Position[] => {
    return possibleBishopMoves(bishop)
        .filter(move => isValidMove(move, board))
        .map(move => move.desiredPosition);
}

export const getAttackedBishopSquares = (bishop: Piece, board: Piece[]): Position[] => {
    return possibleSlidingPieceAttacks(bishop, possibleBishopMoves(bishop), board);
}

const possibleBishopMoves = (bishop: Piece): Move[] => {
    const possibleMoves: Move[] = [];
    const previousPosition = bishop.position;


    [1, -1].forEach(direction => {
        for (let i = 1; i < 8; i++) {

            possibleMoves.push(
                new Move(
                    bishop,
                    new Position(previousPosition.column + direction * i, previousPosition.row + i)
                )
            );
    
            possibleMoves.push(
                new Move(
                    bishop,
                    new Position(previousPosition.column - direction * i, previousPosition.row - i)
                )
            );
        }
    })


    return possibleMoves;
}