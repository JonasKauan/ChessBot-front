import { Piece, PieceType, Color } from './constants'

const initialPieces: Piece[] = [];

Object.values(Color).forEach(color => {
    const row = color === Color.BLACK ? 7 : 0

    initialPieces.push({image: `assets/images/rook_${color}.png`, position:{column: 0, row}, type: PieceType.ROOK, color})
    initialPieces.push({image: `assets/images/knight_${color}.png`, position:{column: 1, row}, type: PieceType.KNIGHT, color})
    initialPieces.push({image: `assets/images/bishop_${color}.png`, position:{column: 2, row}, type: PieceType.BISHOP, color})
    initialPieces.push({image: `assets/images/queen_${color}.png`, position:{column: 3, row}, type: PieceType.QUEEN, color})
    initialPieces.push({image: `assets/images/king_${color}.png`, position:{column: 4, row}, type: PieceType.KING, color})
    initialPieces.push({image: `assets/images/bishop_${color}.png`, position:{column: 5, row}, type: PieceType.BISHOP, color})
    initialPieces.push({image: `assets/images/knight_${color}.png`, position:{column: 6, row}, type: PieceType.KNIGHT, color})
    initialPieces.push({image: `assets/images/rook_${color}.png`, position:{column: 7, row}, type: PieceType.ROOK, color})

    for(let j = 0; j < 8; j++){
        initialPieces.push(
            {
                image: `assets/images/pawn_${color}.png`,
                position: {
                    column: j,
                    row: color === Color.BLACK ? row - 1 : row + 1,
                },
                type: PieceType.PAWN,
                color
            }
        )
    }
})

export default initialPieces;