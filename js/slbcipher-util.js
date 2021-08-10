/**
 * slbciper util
 *
 * This module defines common functions used by different cipher implementations.
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    var _debug = false;

    cipherModule.enableDebug = function (flag) {
        "use strict";
        this._debug = flag;
    };

    cipherModule.padRight = function (str, len, ch) {
        while (len > 0) {
            str += ch;
            len--;
        }
        return str;
    };

    cipherModule.padRightToLen = function (str, len, ch) {
        while (str.length < len) {
            str += ch;
        }
        return str;
    };

    cipherModule.padLeft = function (str, len, ch) {
        while (len > 0) {
            str = ch + str;
            len--;
        }
        return str;
    };

    /**
     * Checks if a given string value is a valid binary string of given length.
     *
     * @param value
     * @param length
     * @return {boolean}
     */
    cipherModule.isValidBinary = function(value, length, minLen) {
        if (minLen == undefined) {
            minLen = 0;
        }
        var bitPattern = new RegExp("^[01]{" + minLen + "," + length + "}$");
        return bitPattern.test(value);
    };

    /**
     * Formats a number value to binary and pads with zero on the left up-to given length.
     */
    cipherModule.toBinaryValue = function(value, length) {
        return cipherModule.padLeftToLen(Number(value).toString(2), length, "0");
    };

    cipherModule.padLeftToLen = function (str, len, ch) {
        while (str.length < len) {
            str = ch + str;
        }
        return str;
    };

    cipherModule.createModule = function (default_config, config, encrypt, decrypt) {

        var _config = config || default_config;

        if (_config.key == undefined) {
            _config.key = default_config.key;
        }
        if (isNaN(_config.pad)) {
            _config.pad = default_config.pad;
        }

        return {
            encrypt: function (plainText) {
                "use strict";
                return encrypt(_config, plainText);
            }
            ,
            decrypt: function (cipherText) {
                "use strict";
                return decrypt(_config, cipherText);
            }
        };

    };

    cipherModule.printArray = function (inputArray) {

        var result = "[";

        for (var i = 0; i < inputArray.length; i++) {
            // if (inputArray[i].hasOwnProperty('toString')) {
            //     result += inputArray[i].toString() + ",";
            //     continue;
            // }
            if (inputArray[i].length > 0) {
                result += "[";
                for (var j = 0; j < inputArray[i].length; j++) {
                    result += inputArray[i][j] + ",";
                }
                result += "]\r\n";
            } else {
                result += inputArray[i] + ",";
            }
        }
        result += "]";

        cipherModule.log(result);
    }

    cipherModule.printMap = function (keys, mapObject) {

        var result = "[\r\n";
        for (var i = 0; i < keys.length; i++) {
            result += "  [" + keys[i] + " -> ";
            if (mapObject[keys[i]] != undefined && typeof mapObject[keys[i]] == 'array' > 0) {
                result += "[";
                for (var j = 0; j < mapObject[keys[i]].length; j++) {
                    result += mapObject[keys[i]][j] + ",";
                }
                result += "]\r\n";
            } else {
                result += "[" + mapObject[keys[i]] + "]";
            }
        }
        result += "]";

        cipherModule.log(result);
    }


    cipherModule.gcd = function(k, mod) {
        if (mod == 0) {
            return k;
        }
        return cipherModule.gcd(mod, k % mod);
    }

    cipherModule.log = function (msg) {
        if (this._debug) {
            console.log(msg);
        }
    }

    cipherModule.createCharSet = function (charSetStr) {
        var charArray = charSetStr.split('');
        var charSet = {indexMap: {}, characters: charSetStr, zLen: charSetStr.length};
        for (var i = 0; i < charArray.length; i++) {
            charSet.indexMap[charArray[i]] = i;
        }
        return charSet;
    }

    // SO resource
    cipherModule.matrixMultiply = function (m1, m2, elementFunction) {
        var result = [];
        for (var i = 0; i < m1.length; i++) {
            result[i] = [];
            for (var j = 0; j < m2[0].length; j++) {
                var sum = 0;
                for (var k = 0; k < m1[0].length; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
                if (typeof elementFunction == "function") {
                    result[i][j] = elementFunction(sum);
                } else {
                    result[i][j] = sum;
                }
            }
        }
        return result;
    }

    cipherModule.findDeterminant = function(a, mod) {
        for (var i = 0; i < mod; i++) {
            if ((a*i % mod) == 1) {
                return i;
            }
        }
        return 0;
    }

    // assumes m1 is a 2x2 matrix
    cipherModule.inverseMatrix = function (m1, determinantMax, elementFunction) {
        if (typeof elementFunction != "function") {
            elementFunction = function (val) {
                return val;
            }
        }
        var result = [];
        var determinant = m1[0][0] * m1[1][1] - m1[0][1] * m1[1][0];
        determinant = (determinantMax == -1 ) ? (1/determinant) : cipherModule.findDeterminant(elementFunction(determinant), determinantMax);
        var inverse = [
            [elementFunction(m1[1][1]), elementFunction(-1 * m1[0][1])],
            [elementFunction(-1 * m1[1][0]), elementFunction(m1[0][0])]
        ];
        for (var row = 0; row < m1.length; row++) {
            for (var col = 0; col < m1[0].length; col++) {
                inverse[row][col] = elementFunction(determinant*inverse[row][col]);
            }
        }
        return inverse;
    }

    return cipherModule;

})(slbcipher || {});
