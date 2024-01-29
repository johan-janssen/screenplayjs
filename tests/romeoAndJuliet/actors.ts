import { Character, Perform, Pattern } from "../../src/engine/character";
//import { ItemForCombat } from "./props";

export class A {

}

export class B extends A {

}

@Character('Test')
export class C extends B {

}

export class Human {

}

@Character('man')
export class Man extends Human {
    public currentLine: string;

    constructor(@Pattern(/of the house of ([a-zA-Z ]*)$/) public house: string, public weapon: A) {
        super()
    }

    @Perform('says {0} to {1}')
    public Talks(line: string, target: Man) {
        this.currentLine = line;
        console.log('talks', line, target)
    }

    @Perform()
    public Dialogue(line: string) {
        this.currentLine = line;
        console.log('talks', line)
    }

    public Wield() {}
}