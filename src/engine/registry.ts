export class Character {
    public readonly actions: Array<Action> = [];

    constructor(public readonly type: string, public readonly constructorPatterns: Array<string|RegExp>, public readonly ctor: any, public readonly ctorArguments: Array<any>) {

    }
}

export class Action {
    constructor(public readonly pattern: string, public readonly methodName: string, public parametertypes) {

    }
}

export class Registry {
    public readonly prototypeActionsMap = new Map<any, Array<Action>>();
    public readonly typeCharactersMap = new Map<string, Character>();
    public readonly prototypeCharactersMap = new Map<any, Array<Character>>();

    // @ts-ignore
    public Register(type) {}

    public RegisterCharacter(type: string, patterns: Array<string|RegExp>, target: any) {
        const paramtypes = Reflect.getMetadata('design:paramtypes', target);
        const character = new Character(type, patterns, target, paramtypes);
        const prototype = target.prototype;

        if (!this.prototypeCharactersMap.has(prototype)) {
            this.prototypeCharactersMap.set(prototype, [])
        }

        this.prototypeCharactersMap.get(prototype).push(character);
        character.actions.push(...this.getActions(prototype));
        this.typeCharactersMap.set(type, character);
    }

    public RegisterAction(pattern: string, target: any, methodName: string) {
        console.log(target);
        if (!this.prototypeActionsMap.has(target)) {
            this.prototypeActionsMap.set(target, [])
        }

        target[methodName]();
        const paramtypes = Reflect.getMetadata('design:paramtypes', target, methodName);
        const action = new Action(pattern, methodName, paramtypes);
        const characters = this.getCharactersByPrototype(target);

        characters.forEach(character => character.actions.push(action));
        this.prototypeActionsMap.get(target).push(action);
    }

    public getActions(target: any) : Array<Action> {
        const r = this.prototypeActionsMap.get(target);
        return r ? r : [];
    }

    public getCharactersByPrototype(target: any) : Array<Character> {
        const prototype = target.prototype ? target.prototype : target;

        const r = this.prototypeCharactersMap.get(prototype);
        return r ? r : [];
    }

    public getCharacterByName(type: string) : Character {
        const r = this.typeCharactersMap.get(type);
        return r;
    }

    // @ts-ignore
    public RegisterProperty(v) {
        //console.log('PROPERTY', v);
        //console.log(Reflect.getMetadataKeys(v[1], v[2]));
    }
}

export const GlobalRegistry = new Registry();