import { GlobalRegistry } from "./registry";

export function Pattern(patternOrIndex: string|RegExp|number) {
    return function(target: any, propertyKey: string, argumentIndex: number) {
        GlobalRegistry.RegisterArgument(target, propertyKey, argumentIndex, patternOrIndex);
        console.log(patternOrIndex, target, propertyKey, argumentIndex)
    }
}

export function Property(type: string) {
    return function(target: any, propertyKey: string) {
        GlobalRegistry.RegisterProperty([type, target, propertyKey]);
    }
}