export class EntityRegistry {
    constructor() {
        this.projectTiles = [];
        this.invadersProjectTile = [];
    }

    appendProjectTile(projectTile){
        this.projectTiles.push(projectTile)
    }

    getProjectTiles(){
        return this.projectTiles
    }

    getInvadersProjectTile(){
        return this.invadersProjectTile
    }

    appendInvader(invader){
        this.invadersProjectTile.push(invader)
    }

    reset() {
        for (const key in this) {
            if (Array.isArray(this[key])) {
                this[key].length = 0;
            }
        }
    }
}