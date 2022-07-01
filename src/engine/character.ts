import 'reflect-metadata';
import { GlobalRegistry } from './registry';
export { Property, Pattern } from './decorators';

export function Character(type: string, isUnique: boolean=true) {
    return function(target) {
        GlobalRegistry.RegisterType(type, isUnique, target);
    }
}

export function Perform(pattern: string=null) {
    return function(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        GlobalRegistry.RegisterMethod(pattern, target, propertyKey);
        return descriptor
    }
}