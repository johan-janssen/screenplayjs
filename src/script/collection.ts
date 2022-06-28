import { Reference } from "./elements";

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

    public Get(name: string) {
        return this.allStuff.get(name);
    }

    public Find(line: string): Array<Reference> {
        if (!line) {
            return [];
        }

        let foundStuff: Array<Reference> = [];
        this.allStuff.forEach((v, k) => {
            const regexString = `([, \t\\.\\!\\?"':;]|^)(?<name>${k})([, \t\\.\\!\\?"':;]|$)`;
            const regex = new RegExp(regexString, 'g');
            const splits = line.split(regex);
            let idx = 0;
            splits.forEach(split => {
                if (split == k) {
                    foundStuff.push(new Reference(v, idx, split.length));
                }
                idx += split.length;
            });
        });

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

        return foundStuff;
    }
}