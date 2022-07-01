// https://www.studiobinder.com/blog/brilliant-script-screenplay-format/

import { NamedElementsBag } from "./collection";
import { ScriptElement, Attribute, CharacterCue, PropSection, SceneSection, SetSection, Dialogue, Parenthical, Action, Transition, ParentElement, Screenplay, Description, Unknown, Empty } from "./elements";
import { IFormat, ScreenplayFormat } from "./format";

interface IElementConstructor {
    regex: RegExp;
    index: number;
    func: (line: string, match: RegExpExecArray, namedElements: NamedElementsBag) => PropSection|SetSection|SceneSection|Dialogue|CharacterCue|Parenthical|Action|Transition|Description
}

export class Loader {
    constructor(public readonly format: IFormat=new ScreenplayFormat()) {}

    public Load(script: string): Screenplay {
        const lines = script.split('\n');
        const namedElements = new NamedElementsBag();

        const constructors: Array<IElementConstructor> = [
            {
                regex: this.format.propsHeader,
                index: this.format.order.indexOf(this.format.propsHeader),
                func: (line: string) => {
                    return new PropSection(line);
                }
            },
            {
                regex: this.format.setHeader,
                index: this.format.order.indexOf(this.format.setHeader),
                func: (line: string, match: RegExpExecArray) => {
                    return new SetSection(line, match.groups.name);
                }
            },
            {
                regex: this.format.sceneHeader,
                index: this.format.order.indexOf(this.format.sceneHeader),
                func: (line: string, match: RegExpExecArray) => {
                    return new SceneSection(line, match.groups.heading);
                }
            },
            {
                regex: this.format.dialogue,
                index: this.format.order.indexOf(this.format.dialogue),
                func: (line: string, match: RegExpExecArray, namedElements: NamedElementsBag) => {
                    return new Dialogue(match.groups.line, namedElements.Find(line));
                }
            },
            {
                regex: this.format.characterCue,
                index: this.format.order.indexOf(this.format.characterCue),
                func: (line: string, match: RegExpExecArray, namedElements: NamedElementsBag) => {
                    return new CharacterCue(line, match.groups.name, namedElements.Get(match.groups.name) as Description);
                }
            },
            {
                regex: this.format.parenthical,
                index: this.format.order.indexOf(this.format.parenthical),
                func: (line: string, match: RegExpExecArray, namedElements: NamedElementsBag) => {
                    return new Parenthical(line, namedElements.Find(match.groups.line));
                }
            },
            {
                regex: this.format.action,
                index: this.format.order.indexOf(this.format.action),
                func: (line: string, match: RegExpExecArray, namedElements: NamedElementsBag) => {
                    return new Action(line, match.groups.line, namedElements.Find(match.groups.line));
                }
            },
            {
                regex: this.format.transition,
                index: this.format.order.indexOf(this.format.transition),
                func: (line: string, match: RegExpExecArray, namedElements: NamedElementsBag) => {
                    return new Transition(line, match.groups.line, namedElements.Find(match.groups.line));
                }
            },
            {
                regex: this.format.description,
                index: this.format.order.indexOf(this.format.description),
                func: (line: string, match: RegExpExecArray, namedElements: NamedElementsBag) => {
                    const attributes = this.SplitAttributes(match.groups.attributes);
                    return new Description(line, match.groups.name, match.groups.type, this.BuildAttributes(attributes, namedElements));
                }
            }
        ];

        constructors.forEach(c => {
            if (c.index == -1) c.index = Infinity;
        });
        constructors.sort((a, b) => a.index - b.index);
        const screenplay = new Screenplay();
        this.BuildRecursively(lines, 0, screenplay, constructors, namedElements);
        return screenplay;
    }

    private BuildRecursively(lines: Array<string>, idx: number, parent: ParentElement<Object>, constructors: Array<IElementConstructor>, namedElements: NamedElementsBag): number {
        let i=idx
        for (; i<lines.length; i++) {
            const line = lines[i];
            const newElement = this.ConstructElement(line, constructors, namedElements);
            if (parent.IsAllowedSubType(newElement)) {
                parent.lines.push(line);
                parent.children.push(newElement);

                if (newElement instanceof Description || newElement instanceof SetSection) {
                    namedElements.Add(newElement);
                }

                if (newElement instanceof ParentElement) {
                    i = this.BuildRecursively(lines, i+1, newElement, constructors, namedElements);
                    parent.lines.push(...newElement.lines);
                }
            }
            else {
                return i - 1;
            }
        }
        return i;
    }

    private ConstructElement(line: string, constructors: Array<IElementConstructor>, namedElements: NamedElementsBag): ScriptElement {
        if (line == '') {
            return new Empty(line);
        }

        for (let j=0; j<constructors.length; j++) {
            const c = constructors[j];
            const match = c.regex.exec(line);
            if (match) {

                return c.func(line, match, namedElements);
            }
        }
        return new Unknown(line);
    }

    // private OnError(message: string) {
    //     console.log(message);
    // }

    // private BuildProps(section: PropSection, namedElements: NamedElementsBag) {
    //     const expectedElements: Array<{regex: string, func: (line: string, match: RegExpMatchArray)=>any}> = [
    //         {
    //             regex: Parsing.characterDescription, 
    //             func: (line: string, match: RegExpMatchArray) => { 
    //                 const attributes = this.SplitAttributes(match.groups.properties);
    //                 const description = new PropDescription(
    //                     line,
    //                     match.groups.name,
    //                     match.groups.type,
    //                     this.BuildAttributes(attributes, namedElements));
    //                     namedElements.Add(description);
    //                     return description;
    //                 }
    //         }
    //     ];
    //     this.MatchElements(section.lines, expectedElements, (matchedElement) => {
    //         if (matchedElement instanceof PropDescription) {
    //             section.props.set(matchedElement.name, matchedElement);
    //         }
    //     });
    // }

    // private ParseScene(scene: SceneSection, namedElementsOuterScope: NamedElementsBag) {
    //     const namedElements = new NamedElementsBag(namedElementsOuterScope);
    //     const expectedElements: Array<{regex: string, func: (line: string, match: RegExpMatchArray)=>any}> = [
    //         {
    //             regex: Parsing.characterDescription, 
    //             func: (line: string, match: RegExpMatchArray) => {
    //                 const attributes = this.SplitAttributes(match.groups.properties);
    //                 const descr = new CharacterDescription(
    //                     line,
    //                     match.groups.name,
    //                     match.groups.type,
    //                     this.BuildAttributes(attributes, namedElements)
    //                     );
    //                     namedElements.Add(descr);
    //                     return descr;
    //                 }
    //         },
    //         {
    //             regex: Parsing.characterCue, 
    //             func: (line: string, match: RegExpMatchArray) => {
    //                 const name = match.groups.name;
    //                 const character = namedElements.Get(name) as CharacterDescription;
    //                 if (!character || !(character instanceof CharacterDescription)) {
    //                     this.OnError('Character ' + name + 'not defined')
    //                 }
    //                 return new CharacterCue(line, name, character);
    //             }
    //         },
    //     ];

    //     this.MatchElements(scene.lines, expectedElements, (matchedElement) => {
    //         scene.actions.push(matchedElement);
    //         if (matchedElement instanceof CharacterCue) {
    //             matchedElement.lines.forEach(line => {
    //                 const performance = new Performance(line, namedElements.Find(line));
    //                 matchedElement.performances.push(performance);
    //             });
    //         }
    //     });
    // }

    private SplitAttributes(line: string): Array<string> {
        if (!line) {
            return [];
        }
        const properties = line.split(/[,.]/);
        return properties.map(p => p.trim());
    }

    private BuildAttributes(attributes: Array<string>, namedElements: NamedElementsBag): Array<Attribute> {
        return attributes.map(a => this.BuildAttribute(a, namedElements));
    }

    private BuildAttribute(attribute: string, namedElements: NamedElementsBag): Attribute {
        const references = namedElements.Find(attribute);
        return new Attribute(attribute, references);
    }

    // private MatchElements(lines: Array<string>, 
    //     expectedElements: Array<{regex: string, func: (line: string, match: RegExpMatchArray)=>any}>,
    //     onNewElement: (element: any) => void) {
    //     let currentElement: any = null;

    //     for (let i=0; i<lines.length; i++) {
    //         const line = lines[i];
    //         if (this.IsEmptyLine(line)) {
    //             if (currentElement && currentElement.lines) {
    //                 currentElement.lines.push(line);
    //             }
    //             continue;
    //         }

    //         let newElement = null;
    //         for (let expectedElementIndex=0; expectedElementIndex<expectedElements.length; expectedElementIndex++) 
    //         {
    //             const expectedElement = expectedElements[expectedElementIndex];
    //             const match = line.match(expectedElement.regex);
    //             if (match) {
    //                 newElement = expectedElement.func(line, match);
    //                 break;
    //             }
    //         }

    //         if (newElement) {
    //             if (currentElement) {
    //                 onNewElement(currentElement);
    //             }
    //             currentElement = newElement;
    //         }
    //         else {
    //             if (currentElement && currentElement.lines) {
    //                 currentElement.lines.push(line);
    //             }
    //             else {
    //                 this.OnError('Cannot add line to multiline element: ' + line);
    //             }
    //         }
    //     }

    //     if (currentElement) {
    //         onNewElement(currentElement);
    //     }
    // }

    // private IsEmptyLine(line: string) {
    //     return line.trim() == '';
    // }
}