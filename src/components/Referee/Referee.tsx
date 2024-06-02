import { useEffect, useRef, useState } from "react";
import { Color, PieceType, isValidMove, parseFenToBoard } from "../../utils/constants";
import { Chessboard } from "../Chessboard/Chessboard";
import { Piece, Board, Move } from "../../models";
import { isEnPassantMove } from '../../utils/rules/index'

const INITIAL_POSITION_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const Referee = () => {
    const [board, setBoard] = useState<Board>(parseFenToBoard(INITIAL_POSITION_FEN, 1));
    const [promotionPawn, setPromotionPawn] = useState<Piece>();

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => updatePossibleMoves(), []);

    const updatePossibleMoves = () => {
        board.updatePiecesPossibleMoves();
    };

    const flipBoard = () => {
        board.flipBoard();

        setBoard(previousBoard => {
            return board.copy();
        });
    }

    const playMove = (move: Move): boolean => {
        if (!isValidMove(move, board)) return false;
        if(move.desiredPosition.samePosition(move.piece.position)) return false
        
        updatePossibleMoves();
        
        const rowOffset = move.piece.type === PieceType.PAWN && isEnPassantMove(move, board.pieces)
            ? -1 : 0;

        board.updateBoardOnMove(rowOffset, move);
        
        setBoard(previousBoard => {
            return board.copy();
        });

        if (move.desiredPosition.row === 7 && move.piece.isPawn) {
            modalRef.current?.classList.remove('hidden');
            setPromotionPawn(move.piece);
        }

        return true;
    }

    const promotePawn = (type: PieceType) => {
        if (!promotionPawn) return;

        setBoard(previousBoard => {
            board.pieces = board.pieces.reduce((results, piece) => {
                if (piece.position.samePosition(promotionPawn.position))
                    piece = new Piece(
                        piece.position,
                        type,
                        piece.color,
                        board.getValidMoves(piece),
                        board.getAttackedSquares(piece)
                    );
    
                results.push(piece);
                return results;
    
            }, [] as Piece[])

            return board.copy();
        });

        modalRef.current?.classList.add('hidden');
    }

    return (
        <>
            <p>{board.turns}</p>
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
                flipBoard={flipBoard}
            />
        </>
    );
}