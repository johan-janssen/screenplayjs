import { NamedElementsBag } from '../src/script/collection';
import * as should from 'should';


describe("Named elements bag", () =>{
    let bag: NamedElementsBag = null

    beforeEach(() => {
        bag = new NamedElementsBag();
    });

    it('Add item', () => {
        bag.Add({name: 'ONE'});
        should(bag.Get('ONE')).not.null();
    });

    it("Finds stiuff", () =>{
        bag.Add({name: 'ONE'});
        bag.Add({name: 'TWO'});
        
        const found = bag.Find('I am the ONE that should be found');
        should(found).lengthOf(1);
        should(found[0].element.name).eql('ONE');
        should(found[0].index).eql(9);
        should(found[0].length).eql(3);
    });

    it("Finds stiuff at start and end of line", () =>{
        bag.Add({name: 'ONE'});
        
        const found = bag.Find('ONE and ONE');
        should(found).lengthOf(2);
        should(found[0].index).eql(0);
        should(found[1].index).eql(8);
    });

    it("Finds stuff twice", () =>{
        bag.Add({name: 'ONE'});
        bag.Add({name: 'TWO'});

        const found = bag.Find('I am the ONE that should be found, and ONE as well');
        should(found).lengthOf(2);
        should(found[0].index).eql(9);
        should(found[0].length).eql(3);
        should(found[1].index).eql(39);
        should(found[1].length).eql(3);
    });

    it("Takes into account overlaps", () =>{
        bag.Add({name: 'ONE'});
        bag.Add({name: 'ONE BETTER'});

        const found = bag.Find('I am the ONE BETTER that should be found');
        should(found).lengthOf(1);
        should(found[0].index).eql(9);
        should(found[0].length).eql(10);
    });

    it("Finds whole words only", () =>{
        bag.Add({name: 'ONE'});

        const found = bag.Find('The ONES are ONE');
        should(found).lengthOf(1);
        should(found[0].index).eql(13);
        should(found[0].length).eql(3);
    });

    it("Finds matches next to punctuation marks", () =>{
        bag.Add({name: 'ONE'});

        const found = bag.Find('ONE! ONE? ONE. ONE, "ONE", \'ONE\' ONE; ONE:');
        should(found).lengthOf(8);
    });
    
    it("Deals with ambiguous stuffs", () =>{
        bag.Add({name: 'ONE'});
        bag.Add({name: 'ONE ONE'});

        const found = bag.Find('The ONE ONE ONE is a bit ambigous, is it ONE ONE and ONE, or ONE and ONE ONE: The longer one takes precedence');
        should(found).lengthOf(6);
        should(found[0].index).eql(4);
        should(found[0].length).eql(7);
        should(found[1].index).eql(12);
        should(found[1].length).eql(3);
    });
});