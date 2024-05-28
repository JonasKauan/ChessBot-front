import { Color, PieceType } from "../utils/constants";
import { Piece, Position } from "./";

export class Pawn extends Piece{
    enPassant: boolean

    constructor(position: Position, type: PieceType, color: Color){
        super(position, type, color);
        this.enPassant = false;
    }
}