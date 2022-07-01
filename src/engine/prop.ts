import { GlobalRegistry } from "./registry"
export { Property, Pattern } from './decorators';

export function Prop(type: string, isUnique: boolean=false) {
    return function(target) {
        GlobalRegistry.RegisterType(type, isUnique, target);
    }
}