import { Piece, Position } from "../../models";
import { Move } from "../constants";
import { isTileOccupiedByFriendlyPiece, isTileOccupiedByOpponent } from "./GeneralRules";

export const isQueenMoveValid = (move: Move, board: Piece[]): boolean => { 
    const rowDirection = move.piece.position.row === move.desiredPosition.row 
        ? 0 
        : move.piece.position.row < move.desiredPosition.row ? 1 : -1;
    
    const columnDirection = move.piece.position.column === move.desiredPosition.column 
        ? 0 
        : move.piece.position.column < move.desiredPosition.column ? 1 : -1;

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

export const getPossibleQueenMoves = (queen: Piece, board: Piece[]): Position[] => {
    return possibleQueenMoves(queen)
        .filter(move => isQueenMoveValid(move, board))
        .map(move => move.desiredPosition);
}

const possibleQueenMoves = (queen: Piece): Move[] => {
    const possibleMoves: Move[] = [];
    const previousPosition = queen.position;

    [1, -1].forEach(direction => {
        for(let i = 1; i < 8; i++){
            possibleMoves.push({
                desiredPosition: new Position(
                    previousPosition.column + i * direction,
                    previousPosition.row + i * direction
                ),
                piece: queen
            });

            possibleMoves.push({
                desiredPosition: new Position(
                    previousPosition.column - i * direction,
                    previousPosition.row + i * direction
                ),
                piece: queen
            });

            possibleMoves.push({
                desiredPosition: new Position(
                    previousPosition.column,
                    previousPosition.row + i * direction
                ),
                piece: queen
            });

            possibleMoves.push({
                desiredPosition: new Position(
                    previousPosition.column + i * direction,
                    previousPosition.row
                ),
                piece: queen
            });
        }
    });

    return possibleMoves;
}