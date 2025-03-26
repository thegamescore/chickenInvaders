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


    resetPresents(){
        this.presents = []
    }
}