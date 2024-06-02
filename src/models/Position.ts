export class Position {
    row: number;
    column: number;

    constructor(column: number, row: number){
        this.row = row;
        this.column = column;
    }

    samePosition(secondPosition: Position): boolean{
        return this.row === secondPosition.row &&
            this.column === secondPosition.column;
    }

    clone(): Position {
        return new Position(this.column, this.row);
    }
}