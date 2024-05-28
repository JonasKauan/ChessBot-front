import { useEffect, useRef, useState } from "react";
import { Color, Move, Piece, PieceType, Position, isSamePosition } from "../../utils/constants";
import { Chessboard } from "../Chessboard/Chessboard";
import initialPieces from "../../utils/initialPieces";
import { getPossiblePawnMoves, isPawnMoveValid, isEnPassantMove } from "../../utils/rules/PawnRules";
import { getPossibleKnightMoves, isKnightMoveValid } from "../../utils/rules/KnightRules";
import { getPossibleBishopMoves, isBishopMoveValid } from "../../utils/rules/BishopRules";
import { getPossibleRookMoves, isRookMoveValid } from "../../utils/rules/RookRules";
import { getPossibleQueenMoves, isQueenMoveValid } from "../../utils/rules/QueenRules";
import { getPossibleKingMoves, isKingMoveValid } from "../../utils/rules/KingRules";

export const Referee = () => {
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const [pieces, setPieces] = useState<Piece[]>(initialPieces);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => updatePossibleMoves(), []);

    const updatePossibleMoves = () => {
        setPieces(currentPieces => {
            return currentPieces.map(piece => {
                piece.possibleMoves = getValidMoves(piece);
                return piece;
            })
        });
    };


    const playMove = (move: Move): boolean => {
        if (!isValidMove(move)) return false;

        let rowOffset = 0

        if (move.piece.type === PieceType.PAWN && isEnPassantMove(move, pieces))
            rowOffset = move.piece.color === Color.WHITE ? -1 : 1;

        const capturedPiecePosition: Position = {
            row: move.actualPosition.row + rowOffset,
            column: move.actualPosition.column
        }

        const updatedBoard = pieces.reduce((results, piece) => {
            if (isSamePosition(piece.position, capturedPiecePosition)) return results;

            if (isSamePosition(piece.position, move.piece.position)) {
                piece.enPassant = piece.type === PieceType.PAWN &&
                 Math.abs(move.actualPosition.row - move.previousPosition.row) === 2;

                piece.position.row = move.actualPosition.row;
                piece.position.column = move.actualPosition.column;
                results.push(piece);

                return results;
            }

            if (piece.type === PieceType.PAWN) piece.enPassant = false;

            let promotionRow = piece.color === Color.WHITE ? 7 : 0;

            if (move.actualPosition.row === promotionRow && move.piece.type === PieceType.PAWN) {
                modalRef.current?.classList.remove('hidden');
                setPromotionPawn(move.piece);
            }

            results.push(piece);
            return results;

        }, [] as Piece[]);

        setPieces(updatedBoard)
        return true;
    }

    const getValidMoves = (piece: Piece): Position[] => {
        switch(piece.type){
            case PieceType.PAWN: return getPossiblePawnMoves(piece, pieces);
            case PieceType.KNIGHT: return getPossibleKnightMoves(piece, pieces);
            case PieceType.BISHOP: return getPossibleBishopMoves(piece, pieces);
            case PieceType.ROOK: return getPossibleRookMoves(piece, pieces);
            case PieceType.QUEEN: return getPossibleQueenMoves(piece, pieces);
            case PieceType.KING: return getPossibleKingMoves(piece, pieces);
        }
    }

    const isValidMove = (move: Move): boolean => {
        switch(move.piece.type){
            case PieceType.PAWN: return isPawnMoveValid(move, pieces);
            case PieceType.KNIGHT: return isKnightMoveValid(move, pieces);
            case PieceType.BISHOP: return isBishopMoveValid(move, pieces);
            case PieceType.ROOK: return isRookMoveValid(move, pieces);
            case PieceType.QUEEN: return isQueenMoveValid(move, pieces)
            case PieceType.KING: return isKingMoveValid(move, pieces);
        }
    }

    
    const promotePawn = (type: PieceType) => {
        if (!promotionPawn) return;

        const updatedBoard = pieces.reduce((results, piece) => {
            if (isSamePosition(piece.position, promotionPawn.position)) {
                piece.type = type;
                piece.image = `assets/images/${type}_${piece.color}.png`;
            }

            results.push(piece);
            return results;

        }, [] as Piece[])

        setPieces(updatedBoard);
        modalRef.current?.classList.add('hidden');
    }

    return (
        <>
            <div id='pawn-promotion-modal' className='hidden' ref={modalRef}>
                <div className='modal-body'>
                    <img
                        onClick={() => promotePawn(PieceType.ROOK)}
                        src={`/assets/images/rook_${promotionPawn?.color}.png`}
                        alt=''
                    />
                    <img
                        onClick={() => promotePawn(PieceType.BISHOP)}
                        src={`/assets/images/bishop_${promotionPawn?.color}.png`}
                        alt=''
                    />
                    <img
                        onClick={() => promotePawn(PieceType.KNIGHT)}
                        src={`/assets/images/knight_${promotionPawn?.color}.png`}
                        alt=''
                    />
                    <img
                        onClick={() => promotePawn(PieceType.QUEEN)}
                        src={`/assets/images/queen_${promotionPawn?.color}.png`}
                        alt=''
                    />
                </div>
            </div>
            <Chessboard
                updatePossibleMoves = {updatePossibleMoves}
                playMove = {playMove}
                pieces = {pieces}
            />
        </>
    );
}