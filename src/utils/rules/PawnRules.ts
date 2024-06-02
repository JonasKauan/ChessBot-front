import { Pawn, Piece, Position, Move, Board } from "../../models";
import { Color, isValidMove } from "../constants";
import { isEmptyTile, isTileOccupiedByFriendlyPiece, isTileOccupiedByOpponent } from "./GeneralRules";

export const isEnPassantMove = (move: Move, board: Piece[]): boolean =>{
    //const rowOffset = move.piece.color === Color.WHITE ? -1 : 1;

    //const pawnPosition = new Position(move.desiredPosition.column, move.desiredPosition.row + rowOffset)
    const pawnPosition = new Position(move.desiredPosition.column, move.desiredPosition.row - 1)

    const piece = board.find(piece => pawnPosition.samePosition(piece.position));
    
    if(!piece || isTileOccupiedByFriendlyPiece(pawnPosition, move.piece.color, board)) return false;

    return piece.isPawn && (piece as Pawn).enPassant; 
}

const isPawnCaptureValid = (move: Move, board: Piece[]): boolean =>{
    return isEnPassantMove(move, board) ||
        isTileOccupiedByOpponent(move.desiredPosition, move.piece.color, board);
}

export const isPawnMoveValid = (move: Move, board: Piece[]) =>{
        
    if(move.piece.position.column !==  move.desiredPosition.column) {
        if(Math.abs(move.desiredPosition.column - move.piece.position.column) > 1) return false;
        return isPawnCaptureValid(move, board);
    }

    // const firstRow = move.piece.color === Color.WHITE ? 1 : 6;
    // const rowOffset = move.piece.color === Color.WHITE ? -1 : 1;
    const rowsMoved = Math.abs(move.desiredPosition.row - move.piece.position.row);
    const emptyTyle = isEmptyTile(move.desiredPosition, board);
    
    if(move.piece.position.row === 1) {
        if(rowsMoved > 2) return false;
        
        if(rowsMoved === 2){
            const destinedTile = new Position(move.desiredPosition.column, move.desiredPosition.row - 1);
            return emptyTyle && isEmptyTile(destinedTile, board);
        }

        return emptyTyle;
    }

    return rowsMoved === 1 && emptyTyle;
}

export const getPossiblePawnMoves = (pawn: Piece, board: Board): Position[] => {
    return possiblePawnMoves(pawn)
        .filter(move => isValidMove(move, board))
        .map(move => move.desiredPosition);
}

export const getAttackedPawnSquares = (pawn: Piece): Position[] => {
    return possiblePawnMoves(pawn)
        .filter(move => move.isWithinBounds && move.desiredPosition.column !== pawn.position.column)
        .map(move => move.desiredPosition);
}

const possiblePawnMoves = (pawn: Piece): Move[] => {
    //const rowOffset = pawn.color === Color.WHITE ? 1 : -1;
    const previousPosition: Position = pawn.position;  

    // return [
    //     new Move(pawn, new Position(previousPosition.column, previousPosition.row + rowOffset)),
    //     new Move(pawn, new Position(previousPosition.column, previousPosition.row + rowOffset * 2)),
    //     new Move(pawn, new Position(previousPosition.column + rowOffset, previousPosition.row + rowOffset)),
    //     new Move(pawn, new Position(previousPosition.column - rowOffset, previousPosition.row + rowOffset))
    // ];
    return [
        new Move(pawn, new Position(previousPosition.column, previousPosition.row + 1)),
        new Move(pawn, new Position(previousPosition.column, previousPosition.row + 2)),
        new Move(pawn, new Position(previousPosition.column + 1, previousPosition.row + 1)),
        new Move(pawn, new Position(previousPosition.column - 1, previousPosition.row + 1))
    ];
}