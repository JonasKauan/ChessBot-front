import { Color, PieceType } from "../utils/constants"
import { Position } from "./Position"

export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    color: Color;
    possibleMoves: Position[];
    attackedSquares: Position[];

    constructor(
        position: Position,
        type: PieceType,
        color: Color,
        possibleMoves: Position[],
        attackedSquares: Position[]
    ) {
        this.image = `/assets/images/${type}_${color}.png`;
        this.position = position;
        this.type = type;
        this.color = color;
        this.possibleMoves = possibleMoves;
        this.attackedSquares = attackedSquares;
    }

    get isPawn(): boolean {
        return this.type === PieceType.PAWN
    }

    get isBishop(): boolean {
        return this.type === PieceType.BISHOP
    }

    get isKnight(): boolean {
        return this.type === PieceType.KNIGHT
    }

    get isRook(): boolean {
        return this.type === PieceType.ROOK
    }

    get isQueen(): boolean {
        return this.type === PieceType.QUEEN
    }

    get isKing(): boolean {
        return this.type === PieceType.KING
    }

    canMoveToPosition(position: Position) {
        for(const p of this.possibleMoves) {
            if(p.samePosition(position)) return true;
        }

        return false;
    }

    clone(): Piece {
        return new Piece(this.position, this.type, this.color, this.possibleMoves, this.attackedSquares);
    }
}