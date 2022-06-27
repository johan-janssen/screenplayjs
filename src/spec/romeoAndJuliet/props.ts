import { Prop } from "../../engine/prop";

@Prop('sword', {appearance: '{0}', sharpness: '{1}'})
export class Sword {
    constructor(public appearance, public sharpness) {}
}

@Prop('bucker')
export class Buckler {

}