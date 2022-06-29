import { Character, Action, Pattern } from "../../src/engine/character";
import { Weapon } from "./props";

@Character('man')
export class Man {
    public currentLine: string;

    constructor(@Pattern(/of the house of ([a-zA-Z ]*)$/) public house: string, public weapon: Weapon) {

    }

    @Action('says {0} to {1}')
    public Talks(line: string, target: Man) {
        this.currentLine = line;
        console.log('talks', line, target)
    }

    @Action()
    public Dialogue(line: string) {
        this.currentLine = line;
        console.log('talks', line)
    }

    public Wield() {}
}