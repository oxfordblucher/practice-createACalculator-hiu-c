document.addEventListener('DOMContentLoaded', () => {

    let history = document.querySelector('div.history');
    let displayed = document.querySelector('input[name="current"]');
    let current = "";
    let adjust = "";
    let operation = null;
    let decimal = false;

    const cleanUp = () => {
        adjust = "";
        operation = null;
        decimal = false;
        displayed.value = current;
        if (document.querySelector('button.active')) document.querySelector('button.active').classList.remove('active');
    }

    const clearInputs = () => {
        if (displayed.value !== "" && displayed.value !== "0") {
            if (adjust !== "" && adjust !== "0") {
                adjust = "";
            } else {
                current = "";
                operation = null;
            }
            displayed.value = "";
        } else {
            current = "";
            adjust = "";
            operation = null;
        }
        decimal = false;
        if (document.querySelector('button.active')) document.querySelector('button.active').classList.remove('active');
    }

    const addDecimal = () => {
        if (!decimal) {
            if (!operation) {
                current = current + ".";
                displayed.value = current;
            } else {
                adjust = adjust + ".";
                displayed.value = adjust;
            }
            decimal = true;
        }
    }

    const numInput = (char) => {
        if (!operation) {
            current += char;
            displayed.value = current;
        } else {
            if (adjust === "0" && adjust === "") {
                adjust = char;
            } else {
                adjust += char;
            }
            displayed.value = adjust;
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
            if (adjust !== "0" && adjust !== "") {
                adjust = adjust.slice(0, -1);
            }
            displayed.value = adjust;
        } else {
            current = current.slice(0, -1);
            displayed.value = current;
        }
    }

    const minMax = (dir) => {
        const nums = displayed.value.split(",");
        history.textContent = `The ${dir} of ${nums} is`
        if (dir === "max") {
            current = Math.max(...nums);
        } else {
            current = Math.min(...nums);
        }
        cleanUp();
    }

    const solve = () => {
        let newNum = 0;
        let symbol = "";
        current = parseFloat(current.replaceAll(",", ""));
        adjust = parseFloat(current.replaceAll(",", ""));
        switch (operation) {
            case "add":
                newNum = current + adjust;
                symbol = "+";
                break;
            case "subtract":
                newNum = current - adjust;
                symbol = "-";
                break;
            case "multiply":
                newNum = current * adjust;
                symbol = "*";
                break;
            case "divide":
                newNum = current / adjust;
                symbol = "/";
                break;
            case "rand":
                let min = Math.ceil(Math.min(current, adjust));
                let max = Math.floor(Math.max(current, adjust));
                newNum = Math.floor(Math.random() * (max - min) + min);
                symbol = "...?..."
                break;
            case "exp":
                newNum = current ** adjust;
                symbol = "^";
                break;
            default:
                newNum = current;
        }
        if (! Number.isInteger(newNum)) newNum = newNum.toFixed(10);
        history.textContent = `${current} ${symbol} ${adjust} =`;
        current = newNum.toString();
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
            if (operatorBtn.id === "subtract" && !operation && !current) {
                current += "-";
                displayed.value = current;
            } else if (operatorBtn.id === "subtract" && operation && !adjust) {
                adjust += "-";
                displayed.value = adjust;
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
        history.textContent = `The absolute value of ${current} is`;
        current = Math.abs(parseFloat(current));
        cleanUp();
    })

    document.querySelector('button.round').addEventListener('click', (e) => {
        e.preventDefault();
        history.textContent = `${current} rounds to`;
        current = Math.round(parseFloat(current)).toString();
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
        const nums = new Set(['0','1','2','3','4','5','6','7','8','9']);
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
            current += e.key;
            displayed.value = current;
        } else if (e.key === "Backspace") {
            backspace();
        } else if (e.key === "-") {
            if (!current && !operation) {
                current += e.key;
                displayed.value = current;
            } else if (operation && !adjust) {
                adjust += e.key;
                displayed.value = adjust;
            } else {
                chooseOp('subtract');
            }
        }
    })
})