// RUN-CALCULATOR(inputLines)
function runCalculator(inputLines) {

    // symbolTable <- MAKE-SYMBOL-TABLE()
    let symbolTable = makeSymbolTable();

    // outputLines <- empty list
    let outputLines = [];

    // FOR each line in inputLines
    for (let line of inputLines) {

        // TRY
        try {

            // resultStack <- PROCESS-LINE(line, symbolTable)
            let resultStack = processLine(line, symbolTable);

            // displayText <- FORMAT-STACK(resultStack, symbolTable)
            let displayText = formatStack(resultStack, symbolTable);

            // APPEND displayText to outputLines
            outputLines.push(displayText);

        // CATCH error
        } catch (error) {

            // APPEND error message to outputLines
            outputLines.push("Error: " + error.message);
        }
    }

    // RETURN outputLines
    return outputLines;
}



// MAKE-SYMBOL-TABLE()
function makeSymbolTable() {

    // table <- new array[26]
    let table = new Array(26);

    // FOR i <- 0 TO 25
    for (let i = 0; i < 26; i++) {

        // table[i] <- NIL
        table[i] = null;
    }

    // RETURN table
    return table;
}



// PROCESS-LINE(line, symbolTable)
function processLine(line, symbolTable) {

    // stack <- empty stack
    let stack = [];

    // tokens <- SPLIT line by spaces
    let tokens;

    // IF line is empty after removing spaces
    if (line.trim() === "") {

        // tokens <- empty list
        tokens = [];

    // ELSE split the line into tokens
    } else {

        // tokens <- SPLIT line by one or more spaces
        tokens = line.trim().split(/\s+/);
    }

    // FOR each token in tokens
    for (let token of tokens) {

        // IF token is an empty string
        if (token === "") {

            // CONTINUE to next token
            continue;

        // ELSE IF IS-NUMBER(token)
        } else if (isNumber(token)) {

            // PUSH NUMBER(token) onto stack
            stack.push(Number(token));

        // ELSE IF IS-CONSTANT(token)
        } else if (isConstant(token)) {

            // value <- GET-CONSTANT-VALUE(token)
            let value = getConstantValue(token);

            // PUSH value onto stack
            stack.push(value);

        // ELSE IF IS-VARIABLE(token)
        } else if (isVariable(token)) {

            // PUSH token onto stack
            stack.push(token);

        // ELSE IF IS-BINARY-OPERATOR(token)
        } else if (isBinaryOperator(token)) {

            // result <- APPLY-BINARY-OPERATOR(token, stack, symbolTable)
            let result = applyBinaryOperator(token, stack, symbolTable);

            // PUSH result onto stack
            stack.push(result);

        // ELSE IF IS-UNARY-FUNCTION(token)
        } else if (isUnaryFunction(token)) {

            // result <- APPLY-UNARY-FUNCTION(token, stack, symbolTable)
            let result = applyUnaryFunction(token, stack, symbolTable);

            // PUSH result onto stack
            stack.push(result);

        // ELSE IF token = "="
        } else if (token === "=") {

            // ASSIGN-VARIABLE(stack, symbolTable)
            assignVariable(stack, symbolTable);

        // ELSE
        } else {

            // RAISE error "Invalid token"
            throw new Error("Invalid token");
        }
    }

    // RETURN stack
    return stack;
}



// APPLY-BINARY-OPERATOR(operator, stack, symbolTable)
function applyBinaryOperator(operator, stack, symbolTable) {

    // IF SIZE(stack) < 2
    if (stack.length < 2) {

        // RAISE error "Not enough operands"
        throw new Error("Not enough operands");
    }

    // rightToken <- POP(stack)
    let rightToken = stack.pop();

    // leftToken <- POP(stack)
    let leftToken = stack.pop();

    // rightValue <- RESOLVE-VALUE(rightToken, symbolTable)
    let rightValue = resolveValue(rightToken, symbolTable);

    // leftValue <- RESOLVE-VALUE(leftToken, symbolTable)
    let leftValue = resolveValue(leftToken, symbolTable);

    // IF operator = "+"
    if (operator === "+") {

        // RETURN leftValue + rightValue
        return leftValue + rightValue;

    // ELSE IF operator = "-"
    } else if (operator === "-") {

        // RETURN leftValue - rightValue
        return leftValue - rightValue;

    // ELSE IF operator = "*"
    } else if (operator === "*") {

        // RETURN leftValue * rightValue
        return leftValue * rightValue;

    // ELSE IF operator = "/"
    } else if (operator === "/") {

        // IF rightValue = 0
        if (rightValue === 0) {

            // RAISE error "Division by zero"
            throw new Error("Division by zero");
        }

        // RETURN leftValue / rightValue
        return leftValue / rightValue;

    // ELSE IF operator = "^"
    } else if (operator === "^") {

        // RETURN leftValue raised to the power of rightValue
        return Math.pow(leftValue, rightValue);

    // ELSE IF operator = "%"
    } else if (operator === "%") {

        // IF rightValue = 0
        if (rightValue === 0) {

            // RAISE error "Modulo by zero"
            throw new Error("Modulo by zero");
        }

        // RETURN leftValue modulo rightValue
        return leftValue % rightValue;
    }
}



// APPLY-UNARY-FUNCTION(functionName, stack, symbolTable)
function applyUnaryFunction(functionName, stack, symbolTable) {

    // IF SIZE(stack) < 1
    if (stack.length < 1) {

        // RAISE error "Not enough operands"
        throw new Error("Not enough operands");
    }

    // token <- POP(stack)
    let token = stack.pop();

    // value <- RESOLVE-VALUE(token, symbolTable)
    let value = resolveValue(token, symbolTable);

    // IF functionName = "neg"
    if (functionName === "neg") {

        // RETURN -value
        return -value;

    // ELSE IF functionName = "abs"
    } else if (functionName === "abs") {

        // RETURN absolute value of value
        return Math.abs(value);

    // ELSE IF functionName = "sqrt"
    } else if (functionName === "sqrt") {

        // IF value < 0
        if (value < 0) {

            // RAISE error "Square root of negative number"
            throw new Error("Square root of negative number");
        }

        // RETURN square root of value
        return Math.sqrt(value);

    // ELSE IF functionName = "cbrt"
    } else if (functionName === "cbrt") {

        // RETURN cube root of value
        return Math.cbrt(value);

    // ELSE IF functionName = "sin"
    } else if (functionName === "sin") {

        // radians <- DEGREES-TO-RADIANS(value)
        let radians = degreesToRadians(value);

        // RETURN sine of radians
        return Math.sin(radians);

    // ELSE IF functionName = "cos"
    } else if (functionName === "cos") {

        // radians <- DEGREES-TO-RADIANS(value)
        let radians = degreesToRadians(value);

        // RETURN cosine of radians
        return Math.cos(radians);

    // ELSE IF functionName = "tan"
    } else if (functionName === "tan") {

        // IF value is 90 degrees plus a multiple of 180 degrees
        if (isTangentUndefined(value)) {

            // RAISE error "Tangent is undefined"
            throw new Error("Tangent is undefined");
        }

        // radians <- DEGREES-TO-RADIANS(value)
        let radians = degreesToRadians(value);

        // RETURN tangent of radians
        return Math.tan(radians);

    // ELSE IF functionName = "asin"
    } else if (functionName === "asin") {

        // IF value < -1 OR value > 1
        if (value < -1 || value > 1) {

            // RAISE error "Inverse sine input outside valid range"
            throw new Error("Inverse sine input outside valid range");
        }

        // radians <- inverse sine of value
        let radians = Math.asin(value);

        // RETURN RADIANS-TO-DEGREES(radians)
        return radiansToDegrees(radians);

    // ELSE IF functionName = "acos"
    } else if (functionName === "acos") {

        // IF value < -1 OR value > 1
        if (value < -1 || value > 1) {

            // RAISE error "Inverse cosine input outside valid range"
            throw new Error("Inverse cosine input outside valid range");
        }

        // radians <- inverse cosine of value
        let radians = Math.acos(value);

        // RETURN RADIANS-TO-DEGREES(radians)
        return radiansToDegrees(radians);

    // ELSE IF functionName = "atan"
    } else if (functionName === "atan") {

        // radians <- inverse tangent of value
        let radians = Math.atan(value);

        // RETURN RADIANS-TO-DEGREES(radians)
        return radiansToDegrees(radians);

    // ELSE IF functionName = "ln"
    } else if (functionName === "ln") {

        // IF value <= 0
        if (value <= 0) {

            // RAISE error "Natural logarithm input must be positive"
            throw new Error("Natural logarithm input must be positive");
        }

        // RETURN natural logarithm of value
        return Math.log(value);

    // ELSE IF functionName = "log"
    } else if (functionName === "log") {

        // IF value <= 0
        if (value <= 0) {

            // RAISE error "Base-10 logarithm input must be positive"
            throw new Error("Base-10 logarithm input must be positive");
        }

        // RETURN base-10 logarithm of value
        return Math.log10(value);

    // ELSE IF functionName = "exp"
    } else if (functionName === "exp") {

        // RETURN e raised to the power of value
        return Math.exp(value);

    // ELSE IF functionName = "inv"
    } else if (functionName === "inv") {

        // IF value = 0
        if (value === 0) {

            // RAISE error "Cannot divide by zero"
            throw new Error("Cannot divide by zero");
        }

        // RETURN 1 / value
        return 1 / value;

    // ELSE IF functionName = "fact"
    } else if (functionName === "fact") {

        // IF value < 0
        if (value < 0) {

            // RAISE error "Factorial input cannot be negative"
            throw new Error("Factorial input cannot be negative");
        }

        // IF value is not an integer
        if (!Number.isInteger(value)) {

            // RAISE error "Factorial input must be an integer"
            throw new Error("Factorial input must be an integer");
        }

        // RETURN FACTORIAL(value)
        return factorial(value);
    }
}



// ASSIGN-VARIABLE(stack, symbolTable)
function assignVariable(stack, symbolTable) {

    // IF SIZE(stack) < 2
    if (stack.length < 2) {

        // RAISE error "Not enough values for assignment"
        throw new Error("Not enough values for assignment");
    }

    // valueToken <- POP(stack)
    let valueToken = stack.pop();

    // variableToken <- POP(stack)
    let variableToken = stack.pop();

    // IF NOT IS-VARIABLE(variableToken)
    if (!isVariable(variableToken)) {

        // RAISE error "Left side of assignment must be a variable"
        throw new Error("Left side of assignment must be a variable");
    }

    // value <- RESOLVE-VALUE(valueToken, symbolTable)
    let value = resolveValue(valueToken, symbolTable);

    // SET-VARIABLE-VALUE(variableToken, value, symbolTable)
    setVariableValue(variableToken, value, symbolTable);
}



// RESOLVE-VALUE(token, symbolTable)
function resolveValue(token, symbolTable) {

    // IF token is already a number
    if (typeof token === "number") {

        // RETURN token
        return token;

    // ELSE IF IS-NUMBER(token)
    } else if (isNumber(token)) {

        // RETURN NUMBER(token)
        return Number(token);

    // ELSE IF IS-CONSTANT(token)
    } else if (isConstant(token)) {

        // RETURN GET-CONSTANT-VALUE(token)
        return getConstantValue(token);

    // ELSE IF IS-VARIABLE(token)
    } else if (isVariable(token)) {

        // value <- GET-VARIABLE-VALUE(token, symbolTable)
        let value = getVariableValue(token, symbolTable);

        // IF value = NIL
        if (value === null) {

            // RAISE error "Variable has no assigned value"
            throw new Error("Variable has no assigned value");
        }

        // RETURN value
        return value;

    // ELSE
    } else {

        // RAISE error "Token cannot be resolved to a value"
        throw new Error("Token cannot be resolved to a value");
    }
}



// GET-VARIABLE-VALUE(variable, symbolTable)
function getVariableValue(variable, symbolTable) {

    // index <- LETTER-INDEX(variable)
    let index = letterIndex(variable);

    // RETURN symbolTable[index]
    return symbolTable[index];
}



// SET-VARIABLE-VALUE(variable, value, symbolTable)
function setVariableValue(variable, value, symbolTable) {

    // index <- LETTER-INDEX(variable)
    let index = letterIndex(variable);

    // symbolTable[index] <- value
    symbolTable[index] = value;
}



// LETTER-INDEX(variable)
function letterIndex(variable) {

    // RETURN ASCII(variable) - ASCII("A")
    return variable.charCodeAt(0) - "A".charCodeAt(0);
}



// IS-NUMBER(token)
function isNumber(token) {

    // IF token is not a string
    if (typeof token !== "string") {

        // RETURN FALSE
        return false;
    }

    // IF token is empty after removing spaces
    if (token.trim() === "") {

        // RETURN FALSE
        return false;
    }

    // RETURN TRUE if token can be converted to a finite number
    return Number.isFinite(Number(token));
}



// IS-VARIABLE(token)
function isVariable(token) {

    // IF token is not a string
    if (typeof token !== "string") {

        // RETURN FALSE
        return false;
    }

    // RETURN TRUE if token has length 1 AND token is between "A" and "Z"
    return token.length === 1 && token >= "A" && token <= "Z";
}



// IS-CONSTANT(token)
function isConstant(token) {

    // RETURN TRUE if token = "pi" OR token = "e"
    return token === "pi" || token === "e";
}



// GET-CONSTANT-VALUE(token)
function getConstantValue(token) {

    // IF token = "pi"
    if (token === "pi") {

        // RETURN 3.141592653589793
        return Math.PI;

    // ELSE IF token = "e"
    } else if (token === "e") {

        // RETURN 2.718281828459045
        return Math.E;
    }
}



// IS-BINARY-OPERATOR(token)
function isBinaryOperator(token) {

    // IF token = "+" OR token = "-" OR token = "*" OR token = "/" OR token = "^" OR token = "%"
    return token === "+" ||
           token === "-" ||
           token === "*" ||
           token === "/" ||
           token === "^" ||
           token === "%";
}



// IS-UNARY-FUNCTION(token)
function isUnaryFunction(token) {

    // IF token = "neg" OR token = "abs" OR token = "sqrt" OR token = "cbrt"
    if (token === "neg" || token === "abs" || token === "sqrt" || token === "cbrt") {

        // RETURN TRUE
        return true;

    // ELSE IF token = "sin" OR token = "cos" OR token = "tan"
    } else if (token === "sin" || token === "cos" || token === "tan") {

        // RETURN TRUE
        return true;

    // ELSE IF token = "asin" OR token = "acos" OR token = "atan"
    } else if (token === "asin" || token === "acos" || token === "atan") {

        // RETURN TRUE
        return true;

    // ELSE IF token = "ln" OR token = "log" OR token = "exp"
    } else if (token === "ln" || token === "log" || token === "exp") {

        // RETURN TRUE
        return true;

    // ELSE IF token = "inv" OR token = "fact"
    } else if (token === "inv" || token === "fact") {

        // RETURN TRUE
        return true;

    // ELSE
    } else {

        // RETURN FALSE
        return false;
    }
}



// DEGREES-TO-RADIANS(degrees)
function degreesToRadians(degrees) {

    // RETURN degrees * pi / 180
    return degrees * Math.PI / 180;
}



// RADIANS-TO-DEGREES(radians)
function radiansToDegrees(radians) {

    // RETURN radians * 180 / pi
    return radians * 180 / Math.PI;
}



// IS-TANGENT-UNDEFINED(degrees)
function isTangentUndefined(degrees) {

    // remainder <- absolute value of degrees modulo 180
    let remainder = Math.abs(degrees % 180);

    // tolerance <- very small number used for floating-point comparison
    let tolerance = 0.0000000001;

    // RETURN TRUE if remainder is very close to 90
    return Math.abs(remainder - 90) < tolerance;
}



// FACTORIAL(value)
function factorial(value) {

    // result <- 1
    let result = 1;

    // FOR i <- 2 TO value
    for (let i = 2; i <= value; i++) {

        // result <- result * i
        result = result * i;
    }

    // RETURN result
    return result;
}



// FORMAT-STACK(stack, symbolTable)
function formatStack(stack, symbolTable) {

    // values <- empty list
    let values = [];

    // FOR each item in stack from top to bottom
    for (let i = stack.length - 1; i >= 0; i--) {

        // value <- RESOLVE-VALUE(item, symbolTable)
        let value = resolveValue(stack[i], symbolTable);

        // roundedValue <- ROUND-FOR-DISPLAY(value)
        let roundedValue = roundForDisplay(value);

        // APPEND roundedValue to values
        values.push(roundedValue);
    }

    // RETURN values written inside square brackets
    return "[" + values.join(" ") + "]";
}



// ROUND-FOR-DISPLAY(value)
function roundForDisplay(value) {

    // tolerance <- very small number used for floating-point comparison
    let tolerance = 0.0000000001;

    // IF value is very close to an integer
    if (Math.abs(value - Math.round(value)) < tolerance) {

        // RETURN nearest integer
        return Math.round(value);

    // ELSE
    } else {

        // RETURN value rounded to 10 decimal places
        return Number(value.toFixed(10));
    }
}

let inputLines = [
    "2 3 ^",
    "10 3 %",
    "9 sqrt",
    "27 cbrt",
    "90 sin",
    "180 cos",
    "45 tan",
    "100 log",
    "e ln",
    "5 fact",
    "A 2 =",
    "B 3 =",
    "A B + sqrt"
];

let results = runCalculator(inputLines);

for (let result of results) {
    console.log(result);
}
