import { Position } from '../../models';
import { Piece } from '../../models/Piece';
import { Color } from '../constants';

export const getPieceFromBoard = (position: Position, board: Piece[]) =>{
    return board.find(p => position.samePosition(p.position));
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