import { Prop, Pattern } from "../../src/engine/prop";

// 
@Prop('sword')
export class Weapon {
    constructor(
        @Pattern(/(shiny|rusty)/)
        public appearance: string, 
        @Pattern(/(sharp|dull|pointy)/)
        public sharpness: string) {}
}

@Prop('buckler')
export class Shield {

}