/**
 * Lab 1 - Guess a number and Calculate Multiplication and Division
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    /**
     * Computes multiplicative inverse of 'a'.
     *
     * @param a
     * @param mod
     * @returns {number}
     */
    function generateNumber() {
        var value = Math.floor(Math.random()*10) + 1;
        return value;
    }

    /**
     * Euclidean algorithm.
     *
     * @param k
     * @param mod
     * @returns {*}
     */
    function calculate(a, b, operation) {
        if (operation == 'x') {
            return a * b;
        } else if (operation == '/') {
            return a / b;
        } else {
            throw new Error("Invalid operation");
        }
    }

    /**
     * Creates cipher module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.lab1 = function (config) {

        var _config = { guess: generateNumber() };

        return {
            init: function(form) {
                return false;
            },
            calculate: function (a, b, operation) {
                return calculate(a, b, operation)
            },
            generateNumber: function() {
                _config.guess = generateNumber();
            },
            getGuessAnswer: function() {
                return _config.guess;
            }
        };

    };

    return cipherModule;

})(slbcipher || {});
