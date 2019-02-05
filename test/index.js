var chai,
	expect,
	unionizor,
	_;
if(typeof(window)==="undefined") {
	chai = require("chai");
	expect = chai.expect;
	switchcase = require("../index.js");
}

let sw1 = switchcase({
	1: "Case one, a literal",
	[(value) => value===2]: "Case two, a function",
	[/3/]: "Case three, a regular expression",
	[JSON.stringify({address: {city: "Seattle"}})]: ({name}) => console.log(`Case four, object pattern matching, name is ${name}`),
	default: "Defaulted"
}); 

describe("Test",function() {
	it("literal",function() {
		let sw = switchcase({
			1: "1"
		});
		expect(sw(1)).to.equal("1");
	});
	it("function",function() {
		let sw = switchcase({
			[(value) => value===1]: "1",
		});
		expect(sw(1)).to.equal("1");
	});
	it("RegExp",function() {
		let sw = switchcase({
			[/1/]: "1"
		});
		expect(sw(1)).to.equal("1");
	});
	it("pattern matching",function() {
		let sw = switchcase({
			[JSON.stringify({address: {city: "Seattle"}})]: ({name}) => name
		},{call:true});
		expect(sw({name:"joe",address:{city: "Seattle"}})).to.equal("joe");
	});
	it("default",function() {
		let sw = switchcase({
			[/1/]: "1",
			default: "1"
		});
		expect(sw(2)).to.equal("1");
	});
	it("case literal",function() {
		let sw = switchcase();
		sw.case(1,"1");
		expect(sw(1)).to.equal("1");
	});
	it("case pattern",function() {
		let sw = switchcase({});
		sw.case({address: {city: "Seattle"}},({name}) => name)
		expect(sw({name:"joe",address:{city: "Seattle"}},{call:true})).to.equal("joe");
	});
	it("case destructuring",function() {
		const sw = switchcase({
			[({address: {city}}) => city==="Seattle"]: ({name}) => name
		});
		expect(sw({name:"joe",address:{city: "Seattle"}},{call:true})).to.equal("joe");
	});
	it("case default",function() {
		let sw = switchcase({});
		sw.default("1");
		expect(sw(2)).to.equal("1");
	});
	it("continuation",function() {
		let logged,
			sw = switchcase({},{continuable:true});
		sw.case(()=>true,value => { logged=value; })
			.default("1");
		expect(sw(2)).to.equal("1");
		expect(logged).to.equal(2);
	})
});