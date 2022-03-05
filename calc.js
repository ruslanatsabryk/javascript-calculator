class Calculator {
    constructor(screenTopElement, screenBottomElement) {
        this.screenTop = screenTopElement;
        this.screenBottom = screenBottomElement;
        this.result = 0;
        this.calcString = '';
        this.pressedBefore = null;
        this.operationSet = {
            addition: {
                sign: '+',
                compute: function (firstOperand, secondOperand) {
                    return +firstOperand + +secondOperand;
                }
            },
            subtraction: {
                sign: '-',
                compute: function (firstOperand, secondOperand) {
                    return +firstOperand - +secondOperand;
                }
            },
            multiplication: {
                sign: '*',
                compute: function (firstOperand, secondOperand) {
                    return +firstOperand * +secondOperand;
                }
            },
            division: {
                sign: '/',
                compute: function (firstOperand, secondOperand) {
                    return +firstOperand / +secondOperand;
                } 
            }    
        }
        
        this.signSet = '';
        for (let s in this.operationSet) {
            this.signSet += this.operationSet[s].sign;
        }
    }

    calculate() {
        return +eval(this.calcString).toFixed(10);
    }

    setTopScreen(value) {
        this.screenTop.innerHTML = value;
    }

    setBottomScreen(value) {
        this.screenBottom.innerHTML = value;
    }
    
    pressClear() {
        this.calcString = '';
        this.setTopScreen('');
        this.setBottomScreen('');
        this.pressedBefore = 'clear';
    }

    pressBackSpace() {
        this.calcString = this.calcString.slice(0, -1);
        if (this.calcString.length == 1 && this.signSet.includes(this.calcString[0])) {
            this.calcString = this.calcString.slice(0, -1);
        }
        this.setTopScreen(this.calcString);
        this.setBottomScreen('');
        this.pressedBefore = 'backspace';
    }

    pressDigit(digit) {
        if (this.pressedBefore == 'equals' || this.pressedBefore == 'inversion') {
            this.calcString = '';
            this.setBottomScreen('');
        }
        this.calcString += digit;
        this.setTopScreen(this.calcString);
        this.pressedBefore = 'digit';
    }

    pressOperation(operation) {
        if (this.pressedBefore == 'operation' || this.pressedBefore == 'backspace') {
            this.calcString = this.calcString.slice(0, -1)
        }
        if (this.pressedBefore == 'equals') {
            this.calcString = `${this.result}`;
            this.setBottomScreen('');
        }
        this.calcString += this.operationSet[operation].sign;
        this.setTopScreen(this.calcString);
        this.pressedBefore = 'operation';
    }

    pressEquals() {
        let lastChar = this.calcString[this.calcString.length - 1];
        if (this.signSet.includes(lastChar)) {
            this.calcString = this.calcString.slice(0, -1);
        }
        this.result = this.calculate();
        this.setBottomScreen(this.result);
        this.setTopScreen(this.calcString + "=");
        this.pressedBefore = 'equals';
    }

    pressInversion() {
        if(this.pressedBefore == 'operation') {
            this.calcString = this.calcString.slice(0, -1);
        }
        if (this.pressedBefore == 'equals') {
            this.calcString = `${this.result}`;
        }        
        if (isNaN(this.calcString)) {
            this.result = this.calculate();
            this.calcString = `${this.result}`;
        }
        this.calcString = `${-this.calculate()}`;
        this.setTopScreen(this.calcString);
        this.setBottomScreen('');
        this.pressedBefore = 'inversion';
    }
}

let screen = document.querySelector('.screen');
let screenTopText = document.querySelector('.screen-top-text');
let screenBottom = document.querySelector('.screen-bottom');
let calc = new Calculator(screenTopText, screenBottom);
let initialTopFontSize = +window.getComputedStyle(screenTopText).fontSize.replace('px', '');
let topFontSize = initialTopFontSize;


document.addEventListener('click', event => {
    let button = event.target;
    if (button.dataset.clear != undefined) {
        calc.pressClear();
    }
    if (button.dataset.backspace != undefined) {
        calc.pressBackSpace();
    }
    if (button.dataset.digit) {
        calc.pressDigit(button.dataset.digit);
    }
    if (button.dataset.operation) {
        calc.pressOperation(button.dataset.operation);
    }
    if (button.dataset.equals != undefined) {
        calc.pressEquals();
    }    
    if (button.dataset.inversion != undefined) {
        calc.pressInversion()
    }
    pressed();
})

// Screen font size adaptation
function pressed() {
    console.log('Button pressed');
    let screenWidth = screen.clientWidth;
    let screenTopTextWidth = screenTopText.clientWidth;
    let screenProportion = screenTopTextWidth / screenWidth;
    
    console.log(screenProportion, topFontSize);
    
    if (screenProportion == 0) {
        topFontSize = initialTopFontSize;
        screenTopText.style.fontSize = `${topFontSize}px`;
    } else if (screenProportion < 0.8) {
        topFontSize = Math.min(topFontSize / 0.9, initialTopFontSize);
        screenTopText.style.fontSize = `${topFontSize}px`;
    } else if (screenProportion > 0.9) {
        topFontSize *= 0.9;
        screenTopText.style.fontSize = `${topFontSize}px`;
    } 
}
