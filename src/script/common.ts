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