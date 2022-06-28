interface INamedElement {
    readonly name: string;
}

interface ISection {
    readonly heading: string;
    readonly lines: Array<string>;
}

export class Attribute {
    constructor(public readonly line: string, public readonly references: Array<Reference>) {}
}

export class Reference {
    constructor(public readonly element: INamedElement, public readonly index: number, public readonly length: number) {

    }
}

interface IDescriptionElement {
    readonly name: string;
    readonly type: string;
    readonly attributes: Array<Attribute>;
}

export class PropSection implements ISection {
    public readonly lines: Array<string> = [];
    public readonly heading = '';
    public props = new Map<string, PropDescription>();
}

export class ObjectDescription {}

export class PropDescription implements IDescriptionElement {
    constructor(public readonly line: string, public readonly name: string, public readonly type: string, public readonly attributes: Array<Attribute>) {}
}

export class SetDefinition implements ISection {
    public readonly lines: Array<string> = [];
    constructor(public readonly line: string, public readonly heading: string) {
    }
}

export class ActSection implements ISection {
    public readonly scenes: Array<SceneSection> = [];
    public readonly lines: Array<string> = [];

    constructor(public readonly line: string, public readonly heading: string) {
    }
}

export class SceneSection implements ISection {
    public readonly actions: Array<CharacterDescription | CharacterCue> = [];
    public readonly lines: Array<string> = [];

    constructor(public readonly line: string, public readonly heading: string) {
    }
}

export class CharacterDescription implements IDescriptionElement {
    constructor(public readonly line: string, public readonly name: string, public readonly type: string, public readonly attributes: Array<Attribute>) {}
}

export class CharacterCue implements ISection {
    public readonly lines: Array<string> = [];
    constructor(public readonly line: string, public heading: string, public readonly character: CharacterDescription) {
    }
}