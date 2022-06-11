import Plugboard from './enigma/plugboard';
import rotors from './enigma/rotor';
import Reflector from './enigma/reflector';
import promptSync from 'prompt-sync';
import plugboard from './enigma/plugboard';

const [RotorI, RotorII, RotorIII] = rotors();
const prompt = promptSync();

class EnigmaMachine {
	constructor() {
		this.plugboard = Plugboard;
		this.rotorI = RotorI;
		this.rotorII = RotorII;
		this.rotorIII = RotorIII;
		this.reflector = Reflector;
	}

	encode(letter) {
		let encodedLetter;

		encodedLetter = this.plugboard.encode(letter);
		encodedLetter = this.rotorI.encode(encodedLetter);
		encodedLetter = this.rotorII.encode(encodedLetter);
		encodedLetter = this.rotorIII.encode(encodedLetter);
		encodedLetter = this.reflector.encode(encodedLetter);
		encodedLetter = this.rotorIII.reverseEncode(encodedLetter);
		encodedLetter = this.rotorII.reverseEncode(encodedLetter);
		encodedLetter = this.rotorI.reverseEncode(encodedLetter);
		encodedLetter = this.plugboard.encode(encodedLetter);

		this.rotorI.shift();

		return encodedLetter;
	}

	encodeMultiple(text) {
		let encodedText = '';

		for (let i = 0; i < text.length; i++) {
			encodedText += this.encode(text[i]);
		}

		return encodedText;
	}

	draw() {
		console.log(`${'---'.repeat(10)}\n`);
		console.log(`
		| | | | | |
		> |${this.rotorIII.currentLetter}| |${this.rotorII.currentLetter}| |${this.rotorI.currentLetter}|
		| | | | | |
		`.replace(/^\s+/gm, '').replace(/^(?!>)/gm, '  '));

		console.log('\nPlugs: \n');
		for (let [key, value] of Object.entries(this.plugboard.plugs)) {
			console.log(`${key} -> ${value}`);
		}
		if (Object.entries(this.plugboard.plugs).length === 0) {
			console.log('No plugs');
		}

		console.log(`\n${'---'.repeat(10)}`);
	}
}

class UI {
	constructor() {
		this.enigma = new EnigmaMachine();
		this.exit = false;
	}

	menu() {
		this.setLetters();

		let exit = false;

		while (!exit) {
			console.clear();
			console.log(`${'---'.repeat(10)}\n`);
			console.log('1. Add plug');
			console.log('2. Encode menu');
			console.log(`\n${'---'.repeat(10)}`);

			let choice = prompt();

			switch (choice) {
				case '1': {
					console.clear();
					console.log(`${'---'.repeat(10)}\n`);
					let letter1 = prompt('1st letter (A-Z): ');
					let letter2 = prompt('2nd letter (A-Z): ');

					letter1 = letter1.toUpperCase();
					letter2 = letter2.toUpperCase();

					if (letter1.charCodeAt(0) < 65 || letter1.charCodeAt(0) > 90) {
						console.log('Invalid letter');
					}
					if (letter2.charCodeAt(0) < 65 || letter2.charCodeAt(0) > 90) {
						console.log('Invalid letter');
					}

					this.enigma.plugboard.addPlug(letter1, letter2);
					break;
				}
				case '2': {
					exit = true;
					break;
				}
				default: {
					console.log('Invalid choice');
				}
			}
		}

		console.clear();
		this.enigma.draw();
		console.log('Enter string to encode or decode');
		console.log(`${'---'.repeat(10)}`);
		let str = prompt();

		str = str.toUpperCase();

		if (str.length === 0) {
			console.log('Invalid string');
		}
		for (let i = 0; i < str.length; i++) {
			if (str.charCodeAt(i) < 65 || str.charCodeAt(i) > 90) {
				console.log('Invalid string');
			}
		}

		console.clear();

		console.log(`${'---'.repeat(10)}`);
		console.log(`${this.enigma.encodeMultiple(str)}\n`);
		console.log('Press enter to continue');
		console.log('Press any letter and enter to exit');
		console.log(`${'---'.repeat(10)}`);
		let choice = prompt();

		if (choice.length != 0) {
			this.exit = true;
		}
	}

	setLetters() {
		console.clear();
		let firstLetter = prompt('1st rotor position (A-Z): ');
		let secondLetter = prompt('2nd rotor position (A-Z): ');
		let thirdLetter = prompt('3rd rotor position (A-Z): ');

		firstLetter = firstLetter.toUpperCase();
		secondLetter = secondLetter.toUpperCase();
		thirdLetter = thirdLetter.toUpperCase();

		if (firstLetter.charCodeAt(0) < 65 || firstLetter.charCodeAt(0) > 90) {
			console.log('Invalid 1st rotor position');
			return;
		}
		if (secondLetter.charCodeAt(0) < 65 || secondLetter.charCodeAt(0) > 90) {
			console.log('Invalid 2nd rotor position');
			return;
		}
		if (thirdLetter.charCodeAt(0) < 65 || thirdLetter.charCodeAt(0) > 90) {
			console.log('Invalid 3rd rotor position');
			return;
		}

		this.enigma.rotorI.setCurrentLetter(firstLetter);
		this.enigma.rotorII.setCurrentLetter(secondLetter);
		this.enigma.rotorIII.setCurrentLetter(thirdLetter);
	}
}



while (true) {
	const ui = new UI();
	ui.menu();
	if (ui.exit) {
		break;
	}
	plugboard.removeAllPlugs();
}