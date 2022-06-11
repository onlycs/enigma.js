const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Rotor {
	constructor(wireSet) {
		this.wires = {};
		this.reverseWires = {};
		this.nextRotor = null;
		this.turnoverCountdown = 26;
		this.wireSet = wireSet;

		this.resetWires();
	}

	resetWires() {
		for (let i = 0; i < 26; i++) {
			this.wires[letters[i]] = this.wireSet[i];
		}
		this.turnoverCountdown = 26;

		this.updateReverseWires();
	}

	setNextRotor(nextRotor) {
		this.nextRotor = nextRotor;
	}

	setCurrentLetter(letter) {
		let nextRotor = this.nextRotor;
		this.nextRotor = null;

		this.resetWires();
		let index = letters.indexOf(letter);
		for (let i = 0; i < index; i++) this.shift();
		this.nextRotor = nextRotor;
	}

	shift() {
		this.turnoverCountdown--;
		this.updateNextRotor();
		this.shiftWires();
		this.updateReverseWires();
	}

	updateReverseWires() {
		for (let i = 0; i < 26; i++) {
			this.reverseWires[this.wires[letters[i]]] = letters[i];
		}
	}

	shiftWires() {
		let newWires = {};

		for (let i = 0; i < 26; i++) {
			let input = letters[i];
			let output = this.wires[letters[(i + 1) % 26]];
			newWires[input] = output;
		}

		this.wires = newWires;
	}

	updateNextRotor() {
		if (this.turnoverCountdown === 0) {
			this.turnoverCountdown = 26;

			if (this.nextRotor) {
				this.nextRotor.shift();
			}
		}
	}

	encode(letter) {
		return this.wires[letter];
	}

	reverseEncode(letter) {
		return this.reverseWires[letter];
	}

	get currentLetter() {
		return letters[26 - this.turnoverCountdown];
	}
}

const RotorI = new Rotor('DOKMRGLASIYXQZNBFPHVWTEJCU');
const RotorII = new Rotor('KVIWFMRJGXYZENHQTDPBLOSACU');
const RotorIII = new Rotor('GRTLYDZKNOWABMCQUEVSIPXHJF');

RotorI.setNextRotor(RotorII);
RotorII.setNextRotor(RotorIII);

const rotors = () => [RotorI, RotorII, RotorIII];

export default rotors;