class Plugboard {
	constructor() {
		this.plugs = {};
	}

	addPlug(from, to) {
		this.plugs[from] = to;
		this.plugs[to] = from;
	}

	removePlug(from) {
		delete this.plugs[from];
		delete this.plugs[this.plugs[from]];
	}

	removeAllPlugs() {
		this.plugs = {};
	}

	encode(letter) {
		return this.plugs[letter] || letter;
	}
}

const plugboard = new Plugboard();

export default plugboard;