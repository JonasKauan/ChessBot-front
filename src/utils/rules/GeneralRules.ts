import { Position } from '../../models';
import { Piece } from '../../models/Piece';
import { Color } from '../constants';

export const isEmptyTile = (desiredPosition: Position, board: Piece[]): boolean => {
    return !board.find(piece => desiredPosition.samePosition(piece.position));
}

export const isTileOccupiedByOpponent = (desiredPosition: Position, color: Color, board: Piece[]): boolean => {
    const pieceInTile = board.find(piece => desiredPosition.samePosition(piece.position));
    return pieceInTile !== undefined && pieceInTile.color !== color;
}

export const isTileOccupiedByFriendlyPiece = (position: Position, color: Color, board: Piece[]): boolean => {
    return !isEmptyTile(position, board) && !isTileOccupiedByOpponent(position, color, board);
}