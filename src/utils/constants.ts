import { Board, Position } from "../models";
import { Move } from "../models/Move";
import { Piece } from "../models/Piece"
import {
    isBishopMoveValid,
    isKingMoveValid,
    isKnightMoveValid,
    isPawnMoveValid,
    isQueenMoveValid,
    isRookMoveValid,
    isTileOccupiedByFriendlyPiece
} from "./rules"

export enum PieceType {
    PAWN = 'pawn',
    BISHOP = 'bishop',
    KNIGHT = 'knight',
    ROOK = 'rook',
    QUEEN = 'queen',
    KING = 'king'
}

export enum Color {
    WHITE = 'w',
    BLACK = 'b'
}

export const isValidMove = (move: Move, board: Board): boolean => {
    if(board.currentColorToMove !== move.piece.color) return false;
   
    if (move.desiredPosition.row > 7 || move.desiredPosition.row < 0) return false;
    if (move.desiredPosition.column > 7 || move.desiredPosition.column < 0) return false;

    switch (move.piece.type) {
        case PieceType.PAWN: return isPawnMoveValid(move, board.pieces);
        case PieceType.KNIGHT: return isKnightMoveValid(move, board.pieces);
        case PieceType.BISHOP: return isBishopMoveValid(move, board.pieces);
        case PieceType.ROOK: return isRookMoveValid(move, board.pieces);
        case PieceType.QUEEN: return isQueenMoveValid(move, board.pieces)
        case PieceType.KING: return isKingMoveValid(move, board.pieces);
    }
}

export const isTileThreatened = (desiredPosition: Position, friendlyColor: Color, board: Piece[]): boolean => {
    for (const piece of board) {
        if (piece.color === friendlyColor) continue;
        if (piece.attackedSquares.some(position => desiredPosition.samePosition(position))) return true;
    }

    return false;
}

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
}

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
}

export const possibleSlidingPieceAttacks = (piece: Piece, possibleMoves: Move[], board: Piece[]): Position[] => {
    const attacks: Position[] = [];

    const validDirections = getValidDirectionsMap(piece);

    for (const move of possibleMoves) {
        if (!move.isWithinBounds) continue;

        let validDirection = true;

        for (const [condition, value] of validDirections.entries()) {
            if (condition(move.desiredPosition) && !value) {
                validDirection = false;
                break;
            }
        }

        if (!validDirection) continue;

        attacks.push(move.desiredPosition);

        if (isTileOccupiedByFriendlyPiece(move.desiredPosition, piece.color, board)) {
            for (const condition of validDirections.keys()) {
                if (condition(move.desiredPosition)) validDirections.set(condition, false);
            }
        }
    }

    return attacks;
}

const getValidDirectionsMap = (piece: Piece): Map<(position: Position) => boolean, boolean> => {
    const validDirections: Map<(position: Position) => boolean, boolean> = new Map();

    const right = (position: Position) => {
        return piece.position.row === position.row && piece.position.column < position.column;
    }

    const left = (position: Position) => {
        return piece.position.row === position.row && piece.position.column > position.column;
    }

    const up = (position: Position) => {
        return piece.position.row < position.row && piece.position.column === position.column;
    }

    const down = (position: Position) => {
        return piece.position.row > position.row && piece.position.column === position.column;
    }

    const upperRight = (position: Position) => {
        return piece.position.row > position.row && piece.position.column > position.column;
    }

    const upperLeft = (position: Position) => {
        return piece.position.row > position.row && piece.position.column < position.column;
    }

    const bottomRight = (position: Position) => {
        return piece.position.row < position.row && piece.position.column > position.column;
    }

    const bottomLeft = (position: Position) => {
        return piece.position.row < position.row && piece.position.column < position.column;
    }

    validDirections.set(right, true);
    validDirections.set(left, true);
    validDirections.set(up, true);
    validDirections.set(down, true);
    validDirections.set(upperRight, true);
    validDirections.set(upperLeft, true);
    validDirections.set(bottomRight, true);
    validDirections.set(bottomLeft, true);

    return validDirections;
}