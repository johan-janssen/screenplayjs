import { INamedElement, Reference } from "./elements";

export class NamedElementsBag {
    private allStuff = new Map<string, INamedElement>();

    constructor(joinWith: NamedElementsBag=null) {
        if (joinWith) {
            joinWith.forEach((v) => this.Add(v));
        }
    }

    public forEach(callbackfn: (value: INamedElement, key: string, map: Map<string, INamedElement>) => void): void {
        return this.allStuff.forEach(callbackfn);
    }

    public Add(thing: INamedElement ) {
        const name = thing.name;
        if (this.allStuff.has(name)) {
            throw 'Bag already has element: ' + name;
        }
        this.allStuff.set(name, thing);
    }

    public Get(name: string) {
        return this.allStuff.get(name);
    }

    public Find(line: string): Array<Reference> {
        const foundStuff: Array<Reference> = [];
        if (!line) {
            return [];
        }

        this.allStuff.forEach((v) => {
            this.FindByName(line, v).forEach(found => foundStuff.push(found));
        });

        this.RemoveOverlappingFoundItems(foundStuff);

        return foundStuff;
    }

    public RemoveOverlappingFoundItems(foundStuff: Array<Reference>) {
        foundStuff.sort((a, b) => { return a.index - b.index });

        let i = 0;
        while (i < (foundStuff.length - 1)) {
            const a = foundStuff[i];
            const b = foundStuff[i+1];
            if (a.index == b.index) {
                if (a.length < b.length) {
                    foundStuff.splice(i, 1)
                }
                else {
                    foundStuff.splice(i+1, 1)
                }
            }
            else if (a.index + a.length > b.index) {
                foundStuff.splice(i+1, 1)
            }
            else {
                i++;
            }
        }
    }

    public FindByName(line: string, element: INamedElement): Array<Reference> {
        if (!line) {
            return [];
        }

        const name = element.name;
        const foundStuff: Array<Reference> = [];
        const regexString = `([, \t\\.\\!\\?"':;]|^)(?<name>${name})([, \t\\.\\!\\?"':;]|$)`;
        const regex = new RegExp(regexString, 'g');
        const splits = line.split(regex);
        let idx = 0;
        splits.forEach(split => {
            if (split == name) {
                foundStuff.push(new Reference(element, idx, split.length));
            }
            idx += split.length;
        });
        return foundStuff;
    }
}