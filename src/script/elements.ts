interface IElement {

}

interface ISection {
    readonly heading: string;
    readonly lines: Array<string>;
}

interface IAttribute {
    references: Array<IReference>;
}

interface IReference {
    element: IElement
    index: number;
    length: number;
}

interface IDescriptionElement {
    readonly name: string;
    readonly type: string;
    readonly attributes: Array<IAttribute>;
}

export class PropSection implements ISection {
    public readonly lines: Array<string> = [];
    public readonly heading = '';
    public props = new Map<string, PropDescription>();
}

export class ObjectDescription {}

export class PropDescription implements IDescriptionElement {
    public readonly attributes: Array<IAttribute> = [];
    constructor(public readonly line: string, public readonly name: string, public readonly type: string, public readonly properties: string) {}
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
    public readonly attributes: Array<IAttribute> = [];
    constructor(public readonly line: string, public readonly name: string, public readonly type: string, public readonly properties: Array<string>) {}
}

export class CharacterCue implements ISection {
    public readonly lines: Array<string> = [];
    constructor(public readonly line: string, public heading: string, public readonly character: CharacterDescription) {
    }
}