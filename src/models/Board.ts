import { Color, PieceType } from "../utils/constants";
import { getAttackedBishopSquares, getAttackedKingSquares, getAttackedKnightSquares, getAttackedPawnSquares, getAttackedQueenSquares, getAttackedRookSquares, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "../utils/rules";
import { Move } from "./Move";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Board {
    pieces: Piece[];
    turns: number;

    constructor(pieces: Piece[], turns: number) {
        this.pieces = pieces;
        this.turns = turns;
    }

    get currentColorToMove(): Color {
        return this.turns % 2 === 0 ? Color.BLACK : Color.WHITE;
    }

    updatePiecesPossibleMoves() {
        for (const piece of this.pieces) {
            piece.possibleMoves = this.getValidMoves(piece);
            piece.attackedSquares = this.getAttackedSquares(piece);
        }
    }

    getValidMoves(piece: Piece): Position[] {
        switch (piece.type) {
            case PieceType.PAWN: return getPossiblePawnMoves(piece, this);
            case PieceType.KNIGHT: return getPossibleKnightMoves(piece, this);
            case PieceType.BISHOP: return getPossibleBishopMoves(piece, this);
            case PieceType.ROOK: return getPossibleRookMoves(piece, this);
            case PieceType.QUEEN: return getPossibleQueenMoves(piece, this);
            case PieceType.KING: return getPossibleKingMoves(piece, this);
        }
    }

    getAttackedSquares(piece: Piece) {
        switch (piece.type) {
            case PieceType.PAWN: return getAttackedPawnSquares(piece);
            case PieceType.KNIGHT: return getAttackedKnightSquares(piece);
            case PieceType.BISHOP: return getAttackedBishopSquares(piece, this.pieces);
            case PieceType.ROOK: return getAttackedRookSquares(piece, this.pieces);
            case PieceType.QUEEN: return getAttackedQueenSquares(piece, this.pieces);
            case PieceType.KING: return getAttackedKingSquares(piece);
        }
    }

    updateBoardOnMove(rowOffset: number, move: Move) {
        const capturedPiecePosition = new Position(
            move.desiredPosition.column,
            move.desiredPosition.row + rowOffset
        )

        this.pieces = this.pieces.reduce((results, piece) => {
            if (capturedPiecePosition.samePosition(piece.position)) return results;

            if (piece.position.samePosition(move.piece.position)) {

                if (piece.isPawn)
                    (piece as Pawn).enPassant = Math.abs(move.desiredPosition.row - move.piece.position.row) === 2;

                piece.position.row = move.desiredPosition.row;
                piece.position.column = move.desiredPosition.column;

                results.push(piece);
                return results;
            }

            if (piece.isPawn) (piece as Pawn).enPassant = false;

            results.push(piece);
            return results;

        }, [] as Piece[]);

        this.turns++;
    }

    flipBoard() {
        this.pieces = this.pieces.map(piece => {
            return new Piece(
                new Position(Math.abs(piece.position.column - 7), Math.abs(piece.position.row - 7)),
                piece.type,
                piece.color,
                this.getValidMoves(piece),
                this.getAttackedSquares(piece)
            );
        });
    }

    toFenString() {
        let fenString = '';

        for (let i = 7; i >= 0; i--) {
            for (let j = 0; j < 8; j++) {

            }
        }

        return fenString;
    }

    copy(): Board {
        return new Board(
            this.pieces.map(piece => piece.clone()),
            this.turns
        );
    }
}