import * as should from 'should';
import { GlobalRegistry } from '../engine/registry';
import { Man } from './romeoAndJuliet/actors';

describe("Registry registers actors and props", () =>{
    GlobalRegistry.Register(Man);

    before(() => {
        
    });

    it("Has registered man", () =>{
        should(GlobalRegistry.getCharactersByPrototype(Man)).lengthOf(1)
        should(GlobalRegistry.getCharactersByPrototype(Man)[0].type).eql('man')
    });
});