import { script as script1 } from './romeoAndJuliet/script';
import { Loader } from '../src/script/loader'
import {  Builder, Director } from '../src/engine/builder';
import { Set } from '../src/engine/set';
import { GlobalRegistry } from '../src/engine/registry';
import { Man } from './romeoAndJuliet/actors';
import * as should from 'should';

describe("Director directs script1", () =>{
    let director: Director = null;
    let set: Set = new Set();
    let builder = new Builder(GlobalRegistry);
    GlobalRegistry.Register(Man);

    before(() => {
        const loader = new Loader();
        const screenPlay = loader.Load(script1)
        director = new Director(screenPlay, set, builder);
    });

    it("start directing", () =>{
        console.log(GlobalRegistry);
        director.start();

        should(director.next()).eql(true);
    });
});