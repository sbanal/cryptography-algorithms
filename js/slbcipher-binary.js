/**
 * Lab 2: String to ASCIi code and Decimal to Binary encoding
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    /**
     * Converts an input decimal value to a binary string
     *
     * @param inputText     decimal value
     * @return string       binary value of decimal value
     */
    function toBinary(inputText) {
        var param = Number(inputText);
        var result = "";
        var bitValue = 0;
        var sign = "";
        if (param == 0) {
            result = 0;
        } else {
            if (param < 0) {
                sign = "-";
                param = -1*param;
            }
            do {
                bitValue = param & 1;
                result = bitValue + result;
                param = param >> 1;
            } while(param > 0);
        }
        return sign + result;
    }


    /**
     * Coverts binary to decimal.
     *
     * @param binaryText    input binary value
     * @return string       output decimal value of binary string
     */
    function toDecimal(binaryText) {
        var sign = binaryText.charAt(0) == '-' ? -1 : 1;
        var param = (sign == -1) ? binaryText.substring(1) : binaryText;
        var result = 0;
        for(var i = 0; i < param.length; i++) {
            var bitChar = param.charAt(param.length - i - 1);
            if (bitChar != '1' && bitChar != '0') {
                throw "Invalid input"
            }
            var bitValue = param.charAt(param.length - i - 1) == '1' ? 1 : 0;
            result += Math.pow(2,i)*bitValue;
        }
        return sign*result;
    }

    /**
     * Converts string value to ascii code.
     *
     * @param value     input value to convert
     * @return {string} return value is a list of ascii codes space delimitted of each characters
     */
    function strToAsciiCode(value) {
        value = value.trim();
        var output = "";
        for (var i = 0; i < value.length; i++) {
            output += slbcipher.padLeftToLen("" + value.charCodeAt(i), 3, "0") + " ";
        }
        return output;
    }

    /**
     * Creates number to binary conversion module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.binary = function (config) {

        var _config = config || {};

        return {
            init: function(form) {
                return false;
            },
            strToAsciiCode: function(value) {
                return strToAsciiCode(value);
            },
            toDecimal: function (plainText) {
                return toDecimal(plainText);
            },
            toBinary: function (numberValue) {
                return toBinary(numberValue);
            }
        };

    };

    return cipherModule;

})(slbcipher || {});
