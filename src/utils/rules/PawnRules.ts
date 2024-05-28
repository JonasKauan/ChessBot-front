import { Color, Move, Piece, PieceType, Position } from "../constants";
import { getPieceFromBoard, isEmptyTile, isTileOccupiedByFriendlyPiece, isTileOccupiedByOpponent } from "./GeneralRules";

export const isEnPassantMove = (move: Move, board: Piece[]): boolean =>{
    const rowOffset = move.piece.color === Color.WHITE ? -1 : 1;

    const pawnPosition: Position = {
        row: move.actualPosition.row + rowOffset,
        column: move.actualPosition.column
    }

    const piece = getPieceFromBoard(pawnPosition, board);
    
    if(!piece || isTileOccupiedByFriendlyPiece(pawnPosition, move.piece.color, board)) return false;

    return piece.type === PieceType.PAWN && (piece.enPassant ?? false); 
}

const isPawnCaptureValid = (move: Move, board: Piece[]): boolean =>{
    return isEnPassantMove(move, board) ||
        isTileOccupiedByOpponent(move.actualPosition, move.piece.color, board);
}

export const isPawnMoveValid = (move: Move, board: Piece[]) =>{
        
    if(move.previousPosition.column !==  move.actualPosition.column) {
        if(Math.abs(move.actualPosition.column - move.previousPosition.column) > 1) return false;
        return isPawnCaptureValid(move, board);
    }

    const firstRow = move.piece.color === Color.WHITE ? 1 : 6;
    const rowOffset = move.piece.color === Color.WHITE ? -1 : 1;
    const rowsMoved = Math.abs(move.actualPosition.row - move.previousPosition.row);
    const emptyTyle = isEmptyTile(move.actualPosition, board);
    
    if(move.previousPosition.row === firstRow) {
        if(rowsMoved > 2) return false;

        if(rowsMoved === 2) 
            return emptyTyle && isEmptyTile(
                {
                    row: move.actualPosition.row + rowOffset,
                    column: move.actualPosition.column
                },
                board
            );

        return emptyTyle;
    }

    return rowsMoved === 1 && emptyTyle;
}

export const getPossiblePawnMoves = (pawn: Piece, board: Piece[]): Position[] => {
    return possiblePawnMoves(pawn)
        .filter(move => isPawnMoveValid(move, board))
        .map(move => move.actualPosition);
}

const possiblePawnMoves = (pawn: Piece): Move[] => {
    const rowOffset = pawn.color === Color.WHITE ? 1 : -1;
    const previousPosition: Position = pawn.position;  

    return [
        {
            previousPosition,
            actualPosition: {column: previousPosition.column, row: previousPosition.row + rowOffset},
            piece: pawn
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column, row: previousPosition.row + rowOffset * 2},
            piece: pawn
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column + rowOffset, row: previousPosition.row + rowOffset},
            piece: pawn
        },
        {
            previousPosition,
            actualPosition: {column: previousPosition.column - rowOffset, row: previousPosition.row + rowOffset},
            piece: pawn
        }
    ];
}