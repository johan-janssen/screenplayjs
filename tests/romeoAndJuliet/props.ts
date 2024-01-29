import { Prop, Pattern } from "../../src/engine/prop";

export class ItemForCombat {}

@Prop('sword')
export class Weapon extends ItemForCombat {
    constructor(
        @Pattern(/(shiny|rusty)/)
        public appearance: string, 
        @Pattern(/(sharp|dull|pointy)/)
        public sharpness: string) {
            super();
        }
}

@Prop('buckler')
export class Shield extends ItemForCombat {

}