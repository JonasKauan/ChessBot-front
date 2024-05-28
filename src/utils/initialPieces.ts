import { Position, Piece } from '../models';
import { PieceType, Color } from './constants'

const initialPieces: Piece[] = [];

Object.values(Color).forEach(color => {
    const row = color === Color.BLACK ? 7 : 0

    initialPieces.push(new Piece(new Position(0, row), PieceType.ROOK, color));
    initialPieces.push(new Piece(new Position(1, row), PieceType.KNIGHT, color));
    initialPieces.push(new Piece(new Position(2, row), PieceType.BISHOP, color));
    initialPieces.push(new Piece(new Position(3, row), PieceType.QUEEN, color));
    initialPieces.push(new Piece(new Position(4, row), PieceType.KING, color))
    initialPieces.push(new Piece(new Position(5, row), PieceType.BISHOP, color))
    initialPieces.push(new Piece(new Position(6, row), PieceType.KNIGHT, color))
    initialPieces.push(new Piece(new Position(7, row), PieceType.ROOK, color))

    for(let j = 0; j < 8; j++){
        initialPieces.push(new Piece(
            new Position(j, color === Color.BLACK ? row - 1 : row + 1),
            PieceType.PAWN,
            color
        ));
    }
})

export default initialPieces;