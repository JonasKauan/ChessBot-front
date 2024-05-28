import { Position } from "../models"
import { Piece } from "../models/Piece"

export interface Move{
    piece: Piece
    desiredPosition: Position
}

export enum PieceType{
    PAWN = 'pawn',
    BISHOP = 'bishop',
    KNIGHT = 'knight',
    ROOK = 'rook',
    QUEEN = 'queen',
    KING = 'king'
}

export enum Color{
    WHITE = 'w',
    BLACK = 'b'
}