import { useEffect, useRef, useState } from "react";
import { Color, Move, PieceType } from "../../utils/constants";
import { Chessboard } from "../Chessboard/Chessboard";
import { Piece, Position, Pawn, Board } from "../../models";
import {
    isEnPassantMove,
    isPawnMoveValid,
    isKnightMoveValid,
    isBishopMoveValid,
    isRookMoveValid,
    isQueenMoveValid,
    isKingMoveValid,
} from '../../utils/rules/index'

export const Referee = () => {
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const [board, setBoard] = useState<Board>(new Board());
    const [pieces, setPieces] = useState<Piece[]>(board.pieces);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => updatePossibleMoves(), []);

    const updatePossibleMoves = () => {
        board.updatePiecesPossibleMoves();
    };

    const playMove = (move: Move): boolean => {
        if (!isValidMove(move)) return false;

        const rowOffset = move.piece.isPawn && isEnPassantMove(move, board.pieces)
            ? move.piece.color === Color.WHITE ? -1 : 1
            : 0

        board.updateBoardOnMove(rowOffset, move);
        setPieces(board.pieces);

        const promotionRow = move.piece.color === Color.WHITE ? 7 : 0;

        if (move.desiredPosition.row === promotionRow && move.piece.isPawn) {
            modalRef.current?.classList.remove('hidden');
            setPromotionPawn(move.piece);
        }

        return true;
    }

    const isValidMove = (move: Move): boolean => {
        switch (move.piece.type) {
            case PieceType.PAWN: return isPawnMoveValid(move, board.pieces);
            case PieceType.KNIGHT: return isKnightMoveValid(move, board.pieces);
            case PieceType.BISHOP: return isBishopMoveValid(move, board.pieces);
            case PieceType.ROOK: return isRookMoveValid(move, board.pieces);
            case PieceType.QUEEN: return isQueenMoveValid(move, board.pieces)
            case PieceType.KING: return isKingMoveValid(move, board.pieces);
        }
    }


    const promotePawn = (type: PieceType) => {
        if (!promotionPawn) return;

        board.pieces = board.pieces.reduce((results, piece) => {
            if (piece.position.samePosition(promotionPawn.position))
                piece = new Piece(piece.position, type, piece.color)

            results.push(piece);
            return results;

        }, [] as Piece[])

        setPieces(board.pieces)
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
                updatePossibleMoves={updatePossibleMoves}
                playMove={playMove}
                pieces={board.pieces}
            />
        </>
    );
}