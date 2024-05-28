import { Pawn, Piece, Position } from "../../models";
import { Color, Move } from "../constants";
import { getPieceFromBoard, isEmptyTile, isTileOccupiedByFriendlyPiece, isTileOccupiedByOpponent } from "./GeneralRules";

export const isEnPassantMove = (move: Move, board: Piece[]): boolean =>{
    const rowOffset = move.piece.color === Color.WHITE ? -1 : 1;

    const pawnPosition = new Position(move.desiredPosition.column, move.desiredPosition.row + rowOffset)

    const piece = getPieceFromBoard(pawnPosition, board);
    
    if(!piece || isTileOccupiedByFriendlyPiece(pawnPosition, move.piece.color, board)) return false;

    return piece.isPawn && ((piece as Pawn).enPassant ?? false); 
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

    const firstRow = move.piece.color === Color.WHITE ? 1 : 6;
    const rowOffset = move.piece.color === Color.WHITE ? -1 : 1;
    const rowsMoved = Math.abs(move.desiredPosition.row - move.piece.position.row);
    const emptyTyle = isEmptyTile(move.desiredPosition, board);
    
    if(move.piece.position.row === firstRow) {
        if(rowsMoved > 2) return false;
        
        if(rowsMoved === 2){
            const destinedTile = new Position(move.desiredPosition.column, move.desiredPosition.row + rowOffset);
            return emptyTyle && isEmptyTile(destinedTile, board);
        }

        return emptyTyle;
    }

    return rowsMoved === 1 && emptyTyle;
}

export const getPossiblePawnMoves = (pawn: Piece, board: Piece[]): Position[] => {
    return possiblePawnMoves(pawn)
        .filter(move => isPawnMoveValid(move, board))
        .map(move => move.desiredPosition);
}

const possiblePawnMoves = (pawn: Piece): Move[] => {
    const rowOffset = pawn.color === Color.WHITE ? 1 : -1;
    const previousPosition: Position = pawn.position;  

    return [
        {
            desiredPosition: new Position(previousPosition.column, previousPosition.row + rowOffset),
            piece: pawn
        },
        {
            desiredPosition: new Position(previousPosition.column, previousPosition.row + rowOffset * 2),
            piece: pawn
        },
        {
            desiredPosition: new Position(previousPosition.column + rowOffset, previousPosition.row + rowOffset),
            piece: pawn
        },
        {
            desiredPosition: new Position(previousPosition.column - rowOffset, previousPosition.row + rowOffset),
            piece: pawn
        }
    ];
}