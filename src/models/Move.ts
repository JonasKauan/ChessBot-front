import { Piece } from "./Piece"
import { Position } from "./Position"

export class Move {
    piece: Piece
    desiredPosition: Position

    constructor(piece: Piece, desiredPosition: Position){
        this.piece = piece;
        this.desiredPosition = desiredPosition;
    }

    get isWithinBounds(): boolean {
        return this.desiredPosition.column >= 0 && this.desiredPosition.column < 8 &&
            this.desiredPosition.row >= 0 && this.desiredPosition.row < 8 
    }
}