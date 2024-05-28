import { Color, Piece, Position, isSamePosition } from '../constants';

export const getPieceFromBoard = (position: Position, board: Piece[]) =>{
    return board.find(p => isSamePosition(p.position, position));
}

export const isEmptyTile = (position: Position, board: Piece[]): boolean => {
    return !getPieceFromBoard(position, board);
}

export const isTileOccupiedByOpponent = (position: Position, color: Color, board: Piece[]): boolean => {
    const pieceInTile = getPieceFromBoard(position, board);
    return pieceInTile !== undefined && pieceInTile.color !== color;
}

export const isTileOccupiedByFriendlyPiece = (position: Position, color: Color, board: Piece[]): boolean => {
    return !isEmptyTile(position, board) && !isTileOccupiedByOpponent(position, color, board);
}