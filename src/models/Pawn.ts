import { Color, PieceType } from "../utils/constants";
import { Piece, Position } from "./";

export class Pawn extends Piece{
    enPassant: boolean

    constructor(position: Position, color: Color, possibleMoves: Position[], attackedSquares: Position[]){
        super(position, PieceType.PAWN, color, possibleMoves, attackedSquares);
        this.enPassant = false;
    }
}