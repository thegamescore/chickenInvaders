export class PresentsRegistry {
    constructor() {
        this.presents = []
    }

    appendPresent(present){
        this.presents.push(present)
    }

    getPresents(){
        return this.presents
    }

    removePresent(index){
        this.presents.splice(index, 1)
    }

    resetPresents(){
        this.presents = []
    }
}