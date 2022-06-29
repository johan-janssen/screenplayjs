import { Prop } from "../../src/engine/prop";

// 
@Prop('sword', ['[0]', '[1]'])
export class Weapon {
    constructor(public appearance: string, public sharpness: string) {}
}

@Prop('buckler')
export class Shield {

}