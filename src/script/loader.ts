// https://www.studiobinder.com/blog/brilliant-script-screenplay-format/

import { ActSection, CharacterCue, CharacterDescription, PropDescription, PropSection, SceneSection, SetDefinition } from "./elements";



export class ScreenPlay {
    constructor(public readonly acts: Array<ActSection>, public readonly sets: Array<SetDefinition>, public readonly props: PropSection) {}
}

export class Parsing {
    public static readonly nameCharacters = '[A-Z \\-0-9]+';
    public static readonly nameGroup = '(?<name>' + Parsing.nameCharacters + ')';
    public static readonly propsDefinition = 'PROPS$';
    public static readonly setDefinition = 'SET ' + Parsing.nameGroup;
    public static readonly actDefinition = 'ACT (?<name>.*)';
    public static readonly sceneDefinition = 'SCENE (?<name>.*)';
    public static readonly characterDescription = Parsing.nameGroup + ', [a|an] (?<type>[^,]+)[, ]*(?<properties>.*)?'
    public static readonly characterCue = Parsing.nameGroup + '$'
}

export class NamedElementsBag {
    private allStuff = new Map<string, {name}>();

    constructor(joinWith: NamedElementsBag=null) {
        if (joinWith) {
            joinWith.forEach((v) => this.Add(v));
        }
    }

    public forEach(callbackfn: (value: {name}, key: string, map: Map<string, {name}>) => void): void {
        return this.allStuff.forEach(callbackfn);
    }

    public Add(thing: {name} ) {
        const name = thing.name;
        if (this.allStuff.has(name)) {
            throw 'Bag already has element: ' + name;
        }
        this.allStuff.set(name, thing);
    }

    public Find(line: string) {
        if (!line) {
            return [];
        }
        const foundStuff = [];
        this.allStuff.forEach((v, k) => {
            const matches = line.match(k);
            if (matches) {
                foundStuff.push(v);
            }
        });
        return foundStuff;
    }
}

export class Loader {
    public Load(script: string): ScreenPlay {
        const lines = script.split('\n');
        const acts: Array<ActSection> = [];
        const sets: Array<SetDefinition> = [];
        let propSection: PropSection= null;
        const stuff = new NamedElementsBag();

        const topLevelElements: Array<{regex: string, func: (line: string, match: RegExpMatchArray)=>any}> = [
            {
                regex: Parsing.setDefinition, 
                func: (line: string, match: RegExpMatchArray) => {
                    const set = new SetDefinition(line, match.groups.name);
                    sets.push(set);
                    return set;
                }
            },
            {
                regex: Parsing.actDefinition, 
                func: (line: string, match: RegExpMatchArray) => {
                    const act = new ActSection(line, match.groups.name);
                    acts.push(act)
                    return act;
                }
            },
            {
                regex: Parsing.propsDefinition,
                func: () => {
                    propSection = new PropSection();
                    return propSection;
                }
            }
        ];

        this.MatchElements(lines, topLevelElements, () => {});


        const characters = new Map<string, CharacterDescription>();

        acts.forEach(act => {
            const actElements: Array<{regex: string, func: (line: string, match: RegExpMatchArray)=>any}> = [
                {
                    regex: Parsing.sceneDefinition, 
                    func: (line: string, match: RegExpMatchArray) => {
                        const scene = new SceneSection(line, match.groups.name);
                        act.scenes.push(scene);
                        return scene;
                    }
                }
            ];

            this.MatchElements(act.lines, actElements, () => {});
        });

        acts.forEach(act => {
            act.scenes.forEach(scene => {
                this.ParseScene(scene, characters);
            });
        });

        if (propSection) {
            this.ParseProps(propSection);
        }

        characters.forEach((v) => stuff.Add(v));
        propSection.props.forEach((v) => stuff.Add(v));
        
        //characters.forEach((v) => stuff.Find(v.properties));

        return new ScreenPlay(acts, sets, propSection);
    }

    private OnError(message: string) {
        console.log(message);
    }

    private ParseProps(section: PropSection) {
        const expectedElements: Array<{regex: string, func: (line: string, match: RegExpMatchArray)=>any}> = [
            {
                regex: Parsing.characterDescription, 
                func: (line: string, match: RegExpMatchArray) => { 
                    return new PropDescription(
                        line,
                        match.groups.name,
                        match.groups.type,
                        match.groups.properties);
                    }
            }
        ];
        this.MatchElements(section.lines, expectedElements, (matchedElement) => {
            if (matchedElement instanceof PropDescription) {
                section.props.set(matchedElement.name, matchedElement);
            }
        });
    }

    private ParseScene(scene: SceneSection, characters: Map<string, CharacterDescription>) {
        const expectedElements: Array<{regex: string, func: (line: string, match: RegExpMatchArray)=>any}> = [
            {
                regex: Parsing.characterDescription, 
                func: (line: string, match: RegExpMatchArray) => { 
                    return new CharacterDescription(
                        line,
                        match.groups.name,
                        match.groups.type,
                        this.SplitProperties(match.groups.properties));
                    }
            },
            {
                regex: Parsing.characterCue, 
                func: (line: string, match: RegExpMatchArray) => {
                    const name = match.groups.name;
                    if (!characters.has(name)) {
                        this.OnError('Character ' + name + 'not defined')
                    }
                    return new CharacterCue(line, name, characters.get(name));
                }
            },
        ];

        this.MatchElements(scene.lines, expectedElements, (matchedElement) => {
            if (matchedElement instanceof CharacterDescription) {
                characters.set(matchedElement.name, matchedElement);
            }
            scene.actions.push(matchedElement);
        });
    }

    private SplitProperties(line: string): Array<string> {
        if (!line) {
            return [];
        }
        const properties = line.split(/[,.]/);
        return properties.map(p => p.trim());
    }

    private MatchElements(lines: Array<string>, 
        expectedElements: Array<{regex: string, func: (line: string, match: RegExpMatchArray)=>any}>,
        onNewElement: (element: any) => void) {
        let currentElement: any = null;

        for (let i=0; i<lines.length; i++) {
            const line = lines[i];
            if (this.IsEmptyLine(line)) {
                if (currentElement && currentElement.lines) {
                    currentElement.lines.push(line);
                }
                continue;
            }

            let newElement = null;
            for (let expectedElementIndex=0; expectedElementIndex<expectedElements.length; expectedElementIndex++) 
            {
                const expectedElement = expectedElements[expectedElementIndex];
                const match = line.match(expectedElement.regex);
                if (match) {
                    newElement = expectedElement.func(line, match);
                    break;
                }
            }

            if (newElement) {
                if (currentElement) {
                    onNewElement(currentElement);
                }
                currentElement = newElement;
            }
            else {
                if (currentElement && currentElement.lines) {
                    currentElement.lines.push(line);
                }
                else {
                    this.OnError('Cannot add line to multiline element: ' + line);
                }
            }
        }

        if (currentElement) {
            onNewElement(currentElement);
        }
    }

    private IsEmptyLine(line: string) {
        return line.trim() == '';
    }
}