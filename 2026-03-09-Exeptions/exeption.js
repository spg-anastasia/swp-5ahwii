
// Exception Stil

function divideException(a, b) {
    if (b === 0) {
        throw new Error("Division durch 0 ist nicht erlaubt!");
    }
    return a / b;
}

try {
    console.log("10 / 2 =", divideException(10, 2)); 
    console.log("10 / 0 =", divideException(10, 0));  
} catch (error) {
    console.error("Fehler (Exception-Stil):", error.message);
}


//Result Stil

function divideResult(a, b) {
    if (b === 0) {
        return { ok: false, data: null, error: "Division durch 0 ist nicht erlaubt!" };
    }
    return { ok: true, data: a / b, error: null };
}

const result1 = divideResult(10, 2);
if (result1.ok) {
    console.log("10 / 2 =", result1.data);
} else {
    console.error("Fehler (Result-Stil):", result1.error);
}

const result2 = divideResult(10, 0);
if (result2.ok) {
    console.log("10 / 0 =", result2.data);
} else {
    console.error("Fehler (Result-Stil):", result2.error);
}
