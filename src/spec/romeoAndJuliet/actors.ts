import { Action, Character, Property } from "src/engine/character";
import { Sword } from "./props";

@Character('man', [/of the house of ([a-zA-Z ]*)$/])
export class Man {
    @Property('prop')
    public weapon: Sword;

    constructor(public house: string) {

    }

    @Action('says {0} to {1}')
    public Talks(line: string, target: Man) {console.log('talks', line, target)}

    @Action()
    public Dialogue(line: string) {console.log('talks', line)}

    public Wield() {}
}