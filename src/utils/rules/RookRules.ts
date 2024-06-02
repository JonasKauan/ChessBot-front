import { Piece, Position, Move, Board } from "../../models";
import { isValidMove, possibleSlidingPieceAttacks } from "../constants";
import { isTileOccupiedByFriendlyPiece, isTileOccupiedByOpponent } from "./GeneralRules";

export const isRookMoveValid = (move: Move, board: Piece[]): boolean => {
    
    const rowsMoved = Math.abs(move.piece.position.row - move.desiredPosition.row);
    const columnsMoved = Math.abs(move.piece.position.column - move.desiredPosition.column);

    if(rowsMoved === columnsMoved) return false;

    const rowDirection = move.piece.position.row === move.desiredPosition.row 
        ? 0 
        : move.piece.position.row < move.desiredPosition.row ? 1 : -1;
    
    const columnDirection = move.piece.position.column === move.desiredPosition.column 
        ? 0 
        : move.piece.position.column < move.desiredPosition.column ? 1 : -1;

    let enemyPieceInTheWay = false;

    for(let i = 1; i < 8; i++){
        if(enemyPieceInTheWay) break;

        const actualPosition = new Position(
            move.piece.position.column + columnDirection * i,
            move.piece.position.row + rowDirection * i
        );

        if(isTileOccupiedByFriendlyPiece(actualPosition, move.piece.color, board)) break;
        if(isTileOccupiedByOpponent(actualPosition, move.piece.color, board)) enemyPieceInTheWay = true;
        if(actualPosition.samePosition(move.desiredPosition)) return true;
    }

    return false;
}

export const getPossibleRookMoves = (rook: Piece, board: Board): Position[] => {
    return possibleRookMoves(rook)
        .filter(move => isValidMove(move, board))
        .map(move => move.desiredPosition);
}

export const getAttackedRookSquares = (rook: Piece, board: Piece[]): Position[] => {
    return possibleSlidingPieceAttacks(rook, possibleRookMoves(rook), board);
}

const possibleRookMoves = (rook: Piece): Move[] => {
    const possibleMoves: Move[] = [];
    const previousPosition = rook.position;

    [1, -1].forEach(direction => {

        for (let i = 1; i < 8; i++) {
            possibleMoves.push(
                new Move(
                    rook,
                    new Position(previousPosition.column + i * direction, previousPosition.row)
                )
            );

            possibleMoves.push(
                new Move(
                    rook,
                    new Position(previousPosition.column, previousPosition.row + i * direction)
                )
            );
        }
    });

    return possibleMoves;
}