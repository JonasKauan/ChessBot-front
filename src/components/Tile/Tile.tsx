import './Tile.css'

interface Props {
    tileIndex: number
    image?: string,
    highlight: boolean
}

export const Tile = ({tileIndex, image, highlight}: Props) => {

    const className: string = [
        'tile',
        tileIndex % 2 === 0 && 'black-tile',
        tileIndex % 2 !== 0 && 'white-tile',
        highlight && 'tile-highlight',
        image && 'chess-piece-tile'
    ].filter(Boolean).join(' ');

    return (
        <div className={className}>
            {image && <div style={{backgroundImage: `url(${image})`}} className='chess-piece'></div>}
        </div>
    )
}