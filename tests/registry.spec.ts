import * as should from 'should';
import { GlobalRegistry } from '../src/engine/registry';
import { Man } from './romeoAndJuliet/actors';

describe("Registry registers actors and props", () =>{

    before(() => {
        
    });

    it("Has registered man", () =>{
        GlobalRegistry.Register(Man);
        should(GlobalRegistry.GetTypeByName('man').types.map(t => t.name)).containEql('man')
        should(GlobalRegistry.GetTypeByName('man').ctor).eql(Man.prototype.constructor)
    });

    it("Has registered actions of man", () =>{
        const man = GlobalRegistry.GetTypeByName('man');
        should(man.methods).lengthOf(2);
        should(man.methods.map(a => a.name)).containEql('Talks');
        should(man.methods.map(a => a.name)).containEql('Dialogue');
    });
});