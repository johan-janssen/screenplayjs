export class PropMaster {

}

export class Set {
    private readonly characters = new Map();

    public Add(name, character) {
        this.characters.set(name, character);
    }

    public Has(name) {
        return this.characters.has(name);
    }

    public Get(name) {
        return this.characters.get(name);
    }
}