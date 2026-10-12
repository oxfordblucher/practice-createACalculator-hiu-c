document.addEventListener('DOMContentLoaded', () => {

    const history = document.querySelector('div.history');
    const displayed = document.querySelector('input[name="current"]');
    let accumulator = "";
    let pending = "";
    let operation = null;

    const ops = {
        add: { fn: (a, b) => a + b, symbol: '+' },
        subtract: { fn: (a, b) => a - b, symbol: '-' },
        multiply: { fn: (a, b) => a * b, symbol: '*' },
        divide: { fn: (a, b) => a / b, symbol: '/' },
        rand: {
            fn: (a, b) => {
                const min = Math.ceil(Math.min(a, b)), max = Math.min(Math.max(a, b));
                return Math.floor(Math.random() * (max - min) + min);
            }, symbol: '...?...'
        },
        exp: { fn: (a, b) => a ** b, symbol: '^' },
        round: {
            fn: (a, b) => {
                const multiplier = 10 ** b;
                return Math.round(a * multiplier) / multiplier;
            }, symbol: 'rounded to'
        }
    }

    const cleanUp = () => {
        pending = "";
        operation = null;
        displayed.value = accumulator;
        if (document.querySelector('button.active')) document.querySelector('button.active').classList.remove('active');
    }

    const clearInputs = () => {
        if (displayed.value !== "" && displayed.value !== "0") {
            if (pending !== "" && pending !== "0") {
                pending = "";
            } else {
                accumulator = "";
                operation = null;
            }
            displayed.value = "";
        } else {
            accumulator = "";
            pending = "";
            operation = null;
        }
        if (document.querySelector('button.active')) document.querySelector('button.active').classList.remove('active');
    }

    const addDecimal = () => {
        if (!operation) {
            if (!accumulator.includes('.')) {
                accumulator = accumulator + ".";
                displayed.value = accumulator;
            }
        } else {
            if (!pending.includes('.')) {
                pending = pending + ".";
                displayed.value = pending;
            }
        }
    }

    const numInput = (char) => {
        if (!operation) {
            accumulator += char;
            displayed.value = accumulator;
        } else {
            if (pending === "0" || pending === "") {
                pending = char;
            } else {
                pending += char;
            }
            displayed.value = pending;
        }
    }

    const chooseOp = (op) => {
        if (operation === op) return;
        operation = op;
        if (document.querySelector("button.operator.active")) document.querySelector("button.operator.active").classList.remove("active");
        document.getElementById(op).classList.add("active");
        decimal = false;
    }

    const backspace = () => {
        if (operation !== null) {
            if (pending !== "0" && pending !== "") {
                pending = pending.slice(0, -1);
            }
            displayed.value = pending;
        } else {
            accumulator = accumulator.slice(0, -1);
            displayed.value = accumulator;
        }
    }

    const minMax = (dir) => {
        const nums = displayed.value.split(",");
        history.textContent = `The ${dir} of ${nums} is`
        if (dir === "max") {
            accumulator = Math.max(...nums);
        } else {
            accumulator = Math.min(...nums);
        }
        cleanUp();
    }

    const solve = () => {
        accumulator = parseFloat(accumulator.replaceAll(",", ""));
        pending = parseFloat(pending.replaceAll(",", ""));
        let newNum = ops[operation].fn(accumulator, pending);
        let symbol = ops[operation].symbol;
        if (!Number.isInteger(newNum)) newNum = newNum.toFixed(10);
        history.textContent = `${accumulator} ${symbol} ${pending} =`;
        accumulator = newNum.toString();
        cleanUp();
    }

    document.querySelector('button.clear').addEventListener('click', (e) => {
        e.preventDefault();
        clearInputs();
    })

    document.querySelector('button.decimal').addEventListener('click', (e) => {
        e.preventDefault();
        addDecimal();
    })

    document.querySelectorAll('button.num').forEach((numBtn) => {
        numBtn.addEventListener('click', (e) => {
            e.preventDefault();
            numInput(numBtn.textContent);
        })
    })

    document.querySelectorAll('button.operator').forEach((operatorBtn) => {
        operatorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (operatorBtn.id === "subtract" && !operation && !accumulator) {
                accumulator += "-";
                displayed.value = accumulator;
            } else if (operatorBtn.id === "subtract" && operation && !pending) {
                pending += "-";
                displayed.value = pending;
            } else {
                chooseOp(operatorBtn.id);
            }
        })
    })

    document.querySelector('button.back').addEventListener('click', (e) => {
        e.preventDefault();
        backspace();
    })

    document.querySelector('button.solve').addEventListener('click', (e) => {
        e.preventDefault();
        solve();
    })

    document.querySelector('button.abs').addEventListener('click', (e) => {
        e.preventDefault();
        history.textContent = `The absolute value of ${accumulator} is`;
        accumulator = Math.abs(parseFloat(accumulator));
        cleanUp();
    })

    document.querySelector('button.max').addEventListener('click', (e) => {
        e.preventDefault();
        minMax('max');
    })

    document.querySelector('button.min').addEventListener('click', (e) => {
        e.preventDefault();
        minMax('min');
    })

    displayed.addEventListener('keydown', (e) => {
        e.preventDefault();
        console.log(e.key);
        const nums = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
        const ops = new Set(['+', '*', '/', '^']);
        let op = "";
        if (nums.has(e.key)) {
            numInput(e.key);
        } else if (ops.has(e.key)) {
            switch (e.key) {
                case "+":
                    op = 'add';
                    break;
                case "*":
                    op = 'multiply';
                    break;
                case "/":
                    op = 'divide';
                    break;
                case "^":
                    op = 'exp';
                    break;
                default:
                    op = e.key.toLowerCase();
            }
            chooseOp(op);
        } else if (e.key === "Enter") {
            solve();
        } else if (e.key === "." || e.key === "Decimal") {
            addDecimal();
        } else if (e.key === ",") {
            accumulator += e.key;
            displayed.value = accumulator;
        } else if (e.key === "Backspace") {
            backspace();
        } else if (e.key === "-") {
            if (!accumulator && !operation) {
                accumulator += e.key;
                displayed.value = accumulator;
            } else if (operation && !pending) {
                pending += e.key;
                displayed.value = pending;
            } else {
                chooseOp('subtract');
            }
        }
    })
})