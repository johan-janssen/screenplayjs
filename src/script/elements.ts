export interface INamedElement {
    readonly name: string;
}

export class ScriptElement {
    constructor(public readonly line: string) {}
}

export class ParentElement<SubElementTypes> extends ScriptElement {
    readonly lines: Array<string> = [];
    readonly children: Array<SubElementTypes> = [];

    constructor(line: string, public readonly subTypes: Array<any>) {
        super(line);
    }

    //public GetChildren<T extends SubElementTypes>(typeT: new (...params : any[]) => T| (new (...params : any[]) => SubElementTypes)[]) {
    public GetChildren<T extends SubElementTypes>(...typeT: (new (...params : any[]) => SubElementTypes)[]) {
        if (typeT instanceof Array) {
            const r = [];
            this.children.forEach(c => {
                for (let i=0; i<typeT.length; i++) {
                    const t = typeT[i];
                    if (c instanceof t) {
                        r.push(c);
                        break;
                    }
                }
            });
            return r;
        }
        else {
            return this.children.filter(c => c instanceof typeT) as Array<T>;
        }
    }
    
    public IsAllowedSubType(t: Object) {
        for (let i=0; i<this.subTypes.length; i++) {
            if (t instanceof this.subTypes[i]) {
                return true;
            }
        }
        return false;
    }
}

export class Attribute {
    constructor(public readonly line: string, public readonly references: Array<Reference>) {}
}

export class Reference {
    constructor(public readonly element: INamedElement, public readonly index: number, public readonly length: number) {
    }
}

export class Screenplay extends ParentElement<SceneSection|SetSection|PropSection> {
    constructor() {
        super('', [ScriptElement]);
    }
}

export class PropSection extends ParentElement<Description> {
    constructor(line: string) {
        super(line, [Description, Empty, Unknown]);
    }
}

export class SetSection extends ParentElement<Description> {
    constructor(line: string, public readonly name: string) {
        super(line, [Description, Empty, Unknown]);
    }
}

export class ObjectDescription {}

export class Description extends ScriptElement {
    constructor(line: string, public readonly name: string, public readonly type: string, public readonly attributes: Array<Attribute>) {
        super(line);
    }
}

export class SceneSection extends ParentElement<CharacterCue|Action|Transition|Description> {
    constructor(line: string, public readonly heading: string) {
        super(line, [CharacterCue, Action, Transition, Description, Empty, Unknown]);
    }
}

export class Performance extends ScriptElement {
    constructor (public readonly line: string, public readonly references: Array<Reference>) {
        super(line);
    }
}

export class Dialogue extends Performance {
    constructor (line: string, references: Array<Reference>) {
        super(line, references);
    }
}

export class Parenthical extends Performance {
    constructor (line: string, references: Array<Reference>) {
        super(line, references);
    }
}

export class Action extends Performance {
    constructor (line: string, public readonly text: string, references: Array<Reference>) {
        super(line, references);
    }
}

export class Transition extends ScriptElement {
    constructor (line: string, public readonly text, public readonly references: Array<Reference>) {
        super(line);
    }
}

export class CharacterCue extends ParentElement<Dialogue|Parenthical> {
    constructor(line: string, public readonly name: string, public readonly character: Description) {
        super(line, [Dialogue, Parenthical, Empty, Unknown]);
    }
}

export class Unknown extends ScriptElement {
    constructor(line: string) {
        super(line);
    }
}

export class Empty extends ScriptElement {
    constructor(line: string) {
        super(line);
    }
}