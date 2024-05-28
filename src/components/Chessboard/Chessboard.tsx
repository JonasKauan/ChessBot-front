import './Chessboard.css'
import { Tile } from '../Tile/Tile';
import { useRef, useState } from 'react';
import { Piece, Position, Move, isSamePosition } from '../../utils/constants'
import { getPieceFromBoard } from '../../utils/rules/GeneralRules';

const GRID_SIZE = 62.5;

interface Props {
    updatePossibleMoves: () => void;
    playMove: (move: Move) => boolean;
    pieces: Piece[];
}

export const Chessboard = ({updatePossibleMoves, playMove, pieces}: Props) => {
    const [movingPiece, setMovingPiece] = useState<HTMLElement | null>(null)
    const [grabPosition, setGrabPosition] = useState<Position | null>(null);

    const chessRef = useRef<HTMLDivElement>(null);

    const grabPiece = (e: React.MouseEvent) => {
        updatePossibleMoves();

        const element = e.target as HTMLElement;

        const chessboard = chessRef.current;

        if (element.classList.contains('chess-piece') && chessboard) {

            setGrabPosition({
                row: Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - GRID_SIZE * 8) / GRID_SIZE)),
                column: Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE)
            });

            const x = e.clientX - 31.25;
            const y = e.clientY - 31.25;

            element.style.position = 'absolute';
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setMovingPiece(element);
        }
    }

    const movePiece = (e: React.MouseEvent) => {
        const chessboard = chessRef.current;

        if (movingPiece && chessboard && movingPiece.classList.contains('chess-piece')) {
            const minX = chessboard.offsetLeft - 15.625;
            const minY = chessboard.offsetTop - 15.625;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 46.875;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 46.875;

            const x = e.clientX - 31.25;
            const y = e.clientY - 31.25;

            movingPiece.style.position = 'absolute';

            if (x < minX) movingPiece.style.left = `${minX}px`;
            else if (x > maxX) movingPiece.style.left = `${maxX}px`;
            else movingPiece.style.left = `${x}px`;

            if (y < minY) movingPiece.style.top = `${minY}px`;
            else if (y > maxY) movingPiece.style.top = `${maxY}px`;
            else movingPiece.style.top = `${y}px`;
        }
    }

    const dropPiece = (e: React.MouseEvent) => {
        const chessboard = chessRef.current;

        if (movingPiece && chessboard) {
            if (!grabPosition) return;

            const actualPiece = getPieceFromBoard(grabPosition, pieces);

            if (!actualPiece) return;

            const actualColumn = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const actualRow = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - GRID_SIZE * 8) / GRID_SIZE));

            const move: Move = {
                previousPosition: grabPosition,

                actualPosition: {
                    row: actualRow,
                    column: actualColumn
                },

                piece: actualPiece
            }

            const valid = playMove(move);


            if(!valid){
                movingPiece.style.position = 'relative';
                movingPiece.style.removeProperty('top');
                movingPiece.style.removeProperty('left');
            }

            setMovingPiece(null);
        }
    }

    const board = [];

    for (let i = 7; i >= 0; i--) {
        for (let j = 0; j < 8; j++) {

            const actualPosition: Position = {
                row: i,
                column: j
            }

            let highlight = false;

            if (grabPosition) {
                const currentPiece = movingPiece !== null
                    ? pieces.find(p => isSamePosition(p.position, grabPosition))
                    : undefined;

                highlight = currentPiece?.possibleMoves
                    ? currentPiece.possibleMoves.some(p => isSamePosition(p, actualPosition))
                    : false
            }

            board.push(
                <Tile
                    key={`${i},${j}`}
                    tileIndex={i + j}
                    image={pieces.find(p => isSamePosition(p.position, actualPosition))?.image}
                    highlight={highlight}
                />
            )
        }
    }

    return (
        <>
            <div
                onMouseMove={e => movePiece(e)}
                onMouseDown={e => grabPiece(e)}
                onMouseUp={e => dropPiece(e)}
                id="chessboard"
                ref={chessRef}
            >
                {board}
            </div>
        </>
    )
}