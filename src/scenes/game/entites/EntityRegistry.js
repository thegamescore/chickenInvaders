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

    removeProjectTile(index){
        this.projectTiles.splice(index, 1);
    }

    removeInvadersProjectTile(index){
        this.invadersProjectTile.splice(index, 1)
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