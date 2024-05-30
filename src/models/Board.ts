import { Color, PieceType } from "../utils/constants";
import { getAttackedBishopSquares, getAttackedKingSquares, getAttackedKnightSquares, getAttackedPawnSquares, getAttackedQueenSquares, getAttackedRookSquares, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "../utils/rules";
import { Move } from "./Move";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Board {
    pieces: Piece[];
    turns: number;

    constructor() {
        this.pieces = [];

        Object.values(Color).forEach(color => {
            const row = color === Color.BLACK ? 7 : 0

            this.pieces.push(new Piece(new Position(0, row), PieceType.ROOK, color));
            this.pieces.push(new Piece(new Position(1, row), PieceType.KNIGHT, color));
            this.pieces.push(new Piece(new Position(2, row), PieceType.BISHOP, color));
            this.pieces.push(new Piece(new Position(3, row), PieceType.QUEEN, color));
            this.pieces.push(new Piece(new Position(4, row), PieceType.KING, color));
            this.pieces.push(new Piece(new Position(5, row), PieceType.BISHOP, color));
            this.pieces.push(new Piece(new Position(6, row), PieceType.KNIGHT, color));
            this.pieces.push(new Piece(new Position(7, row), PieceType.ROOK, color));

            for (let j = 0; j < 8; j++) {
                this.pieces.push(new Piece(
                    new Position(j, color === Color.BLACK ? row - 1 : row + 1),
                    PieceType.PAWN,
                    color
                ));
            }
        });

        this.turns = 1;
    }

    updatePiecesPossibleMoves() {
        for (const piece of this.pieces) {
            piece.possibleMoves = this.getValidMoves(piece);
            piece.attackedSquares = this.getAttackedSquares(piece);
        }
    }

    getValidMoves(piece: Piece): Position[] {
        switch (piece.type) {
            case PieceType.PAWN: return getPossiblePawnMoves(piece, this.pieces);
            case PieceType.KNIGHT: return getPossibleKnightMoves(piece, this.pieces);
            case PieceType.BISHOP: return getPossibleBishopMoves(piece, this.pieces);
            case PieceType.ROOK: return getPossibleRookMoves(piece, this.pieces);
            case PieceType.QUEEN: return getPossibleQueenMoves(piece, this.pieces);
            case PieceType.KING: return getPossibleKingMoves(piece, this.pieces);
        }
    }

    getAttackedSquares(piece: Piece){
        switch(piece.type){
            case PieceType.PAWN: return getAttackedPawnSquares(piece);
            case PieceType.KNIGHT: return getAttackedKnightSquares(piece);
            case PieceType.BISHOP: return getAttackedBishopSquares(piece, this.pieces);
            case PieceType.ROOK: return getAttackedRookSquares(piece, this.pieces);
            case PieceType.QUEEN: return getAttackedQueenSquares(piece, this.pieces);
            case PieceType.KING: return getAttackedKingSquares(piece);
        }
    }

    updateBoardOnMove(rowOffset: number, move: Move) {
        const capturedPiecePosition = new Position(move.desiredPosition.column, move.desiredPosition.row + rowOffset)

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
    }
}