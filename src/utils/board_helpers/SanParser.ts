import { Board, Move, Position } from "../../models";
import { PieceType } from "../constants";

export const parseSanToMove = (san: string, board: Board): Move | null => {
    const movePortion = getMovePositionSan(san);

    if(!movePortion) {
        return null;
    }
    
    const sanPieceType = sanPieceLookup(san[0]);
    const isCapture = san.includes('x');

    if(sanPieceType === PieceType.PAWN && isCapture) {
        // deixa a dor de cabeça pra depois kk
    }

    const columnIndex = movePortion[0].charCodeAt(0) % 'a'.charCodeAt(0);
    const rowIndex = Number(movePortion[1]);

    const desiredPosition = new Position(columnIndex, rowIndex - 1);
    const possiblePieces = board.pieces.filter(piece => piece.type === sanPieceType && piece.canMoveToPosition(desiredPosition));

    if(possiblePieces.length > 1) {
        // caso hajam duas do mesmo tipo, olhar melhor a notação san (se isso n tiver no back eu to fudido kk)
    }

    return new Move(possiblePieces[0], desiredPosition);
}

const getMovePositionSan = (san: string): string | null => {
    const desiredPosition = san.match(/[a-h][1-8](?=\b)/);
    return desiredPosition ? desiredPosition[0] : null;
}

const sanPieceLookup = (char: string): PieceType => {
    switch(char) {
        case 'K': 
            return PieceType.KING;
        case 'B':
            return PieceType.BISHOP;
        case 'Q': 
            return PieceType.QUEEN;
        case 'R': 
            return PieceType.ROOK;
        case 'N':
            return PieceType.KNIGHT;
        default:
            return PieceType.PAWN;
    }
}