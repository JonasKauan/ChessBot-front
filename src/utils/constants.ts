
export interface Piece {
    image: string
    position: Position
    type: PieceType
    color: Color
    enPassant?: boolean,
    possibleMoves?: Position[] 
}

export interface Move{
    previousPosition: Position
    actualPosition: Position
    piece: Piece
}

export enum PieceType{
    PAWN = 'pawn',
    BISHOP = 'bishop',
    KNIGHT = 'knight',
    ROOK = 'rook',
    QUEEN = 'queen',
    KING = 'king'
}

export interface Position {
    row: number,
    column: number
}

export enum Color{
    WHITE = 'w',
    BLACK = 'b'
}

export const isSamePosition = (firstPosition: Position, secondPosition: Position): boolean => {
    return firstPosition.row === secondPosition.row && firstPosition.column === secondPosition.column;
}