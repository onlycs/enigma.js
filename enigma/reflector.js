class Reflector {
	constructor(reflectionTable) {
		this.wires = {};
		this.reflectionTable = reflectionTable;

		this.applyWires();
	}

	applyWires() {
		let inputs = this.reflectionTable.substring(0, this.reflectionTable.length / 2);
		let outputs = this.reflectionTable.substring(this.reflectionTable.length / 2);

		for (let i = 0; i < inputs.length; i++) {
			this.wires[inputs[i]] = outputs[i];
			this.wires[outputs[i]] = inputs[i];
		}
	}

	encode(letter) {
		return this.wires[letter] || this.reverseWires[letter];
	}
}

const reflectorI = new Reflector('MVBPCOSFEZLADTXKWNJHUYQGIR');

export default reflectorI;