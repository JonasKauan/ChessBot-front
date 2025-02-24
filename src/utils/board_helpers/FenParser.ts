import { Board, Piece, Position } from "../../models"
import { Color, PieceType } from "../constants";

export const parseFenToBoard = (fenString: string, turns: number): Board => {
    const pieces: Piece[] = [];

    const processedFen = fenString.split(' ')[0].replaceAll('/','');
    let fenIndex = 0;

    for(let i = 7; i >= 0; i--){
        for(let j = 0; j < 8; j++){
            const char = processedFen.charAt(fenIndex++);
            const num = parseInt(char, 10);

            if(isNaN(num)) {
                const piece = getPieceFromChar(char, new Position(j, i));
                piece && pieces.push(piece);
                continue;
            }
            
            j += num - 1;
        }
    }
    
    return new Board(pieces, turns);
};

const getPieceFromChar = (letter: string, position: Position): Piece | null => {
    const type = getPieceType(letter);

    if(!type) return null;

    return new Piece(position, type, /[A-Z]/.test(letter) ? Color.WHITE : Color.BLACK, [], []);
};

const getPieceType = (letter: string): PieceType | undefined => {
    switch(letter.toLowerCase()){
        case 'r': return PieceType.ROOK;
        case 'n': return PieceType.KNIGHT;
        case 'b': return PieceType.BISHOP;
        case 'q': return PieceType.QUEEN;
        case 'k': return PieceType.KING;
        case 'p': return PieceType.PAWN;
        default: return undefined;
    }
};