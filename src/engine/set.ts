export class PropMaster {

}

export class Set {
    private readonly characters = new Map();

    public Add(name, character) {
        this.characters.set(name, character);
    }
}