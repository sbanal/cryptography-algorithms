/**
 * Lab 4: German ADFGVX Cipher
 *
 * This module contains implementation of German ADFGVX module.
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    var _default_config = {key: "SECURITY"};

    var keyChars = "ADFGVX";
    var substitutionMatrix = [
        ['K', 'Z', 'W', 'R', 'I', 'F'],
        ['9', 'B', '6', 'C', 'L', '5'],
        ['Q', '7', 'J', 'P', 'G', 'X'],
        ['E', 'V', 'Y', '3', 'A', 'N'],
        ['8', 'O', 'D', 'H', '0', '2'],
        ['U', '4', '1', 'S', 'T', 'M']
    ];

    /**
     * Converts character to a ADFGVX substitution pair.
     *
     * @param inputChar
     * @returns {string}
     */
    function charToSubstitutionPair(inputChar) {
        for (var row = 0 ; row < substitutionMatrix.length; ++row) {
            for (var col = 0; col < substitutionMatrix[row].length; ++col) {
                if (substitutionMatrix[row][col] == inputChar.toUpperCase()) {
                    return keyChars.charAt(row) + keyChars.charAt(col);
                }
            }
        }
        throw new Error("Input char='" + inputChar + "',ascii='" + inputChar.charCodeAt(0) + " has no valid substitution pair");
    }

    /**
     * Converts a pair of ADFGVX to the corresponding character mapped.
     *
     * @param charPair a string containing chracters of length 2 from ADFGVX character set
     * @returns char  character mapped to the input charPair
     */
    function substitutionPairToChar(charPair) {
        var str = charPair.toUpperCase();
        var rowChar = str.charAt(0);
        var colChar = str.charAt(1);
        var rowIndex = keyChars.indexOf(rowChar);
        var colIndex = keyChars.indexOf(colChar);
        if (rowIndex == -1 || colIndex == -1) {
            throw "Char not found in in keys";
        }
        return substitutionMatrix[rowIndex][colIndex];
    }

    /**
     * Encrypts a plain text input using a given config.
     *
     * sample:
     * cryptography
     * dgaggffgxvvdfvaggvfgvggf
     * GGDFGAFGFVXADVVGVVGGGFGF
     *
     * @param config
     * @param inputPlainText
     * @returns {string}    output encrypted text
     */
    function encrypt(config, inputPlainText) {
        var mappedPlainText = "";
        for (var i = 0; i < inputPlainText.length; ++i) {
            mappedPlainText += charToSubstitutionPair(inputPlainText.charAt(i));
        }
        cipherModule.log('mapped text:' + mappedPlainText);
        var transpositionText = mappedPlainText.toLowerCase();
        var transpoConfig = {key: config.key.toLowerCase(), pad: '-'};
        var cipherText = transPositionEncrypt(transpoConfig, transpositionText);
        cipherModule.log('cipherText text:' + cipherText);
        return cipherText;
    }

    /**
     * Decrypts a cipher text using given config.
     *
     * @param config    defines the key length and padding text.
     * @param inputCipherText   input cipher text
     * @returns {string}    output decrypted text
     */
    function decrypt(config, cipherText) {

        var transpoConfig = {key: config.key.toLowerCase(), pad: '-'};
        var mappedPlainText = transPositionDecrypt(transpoConfig, cipherText);
        var result = "";
        for (var i = 0; i < mappedPlainText.length; i += 2) {
            result += substitutionPairToChar(mappedPlainText.substr(i, 2));
        }

        return result.toLowerCase();
    }


    /**
     * Transposition cipher encrypt.
     *
     * @param config
     * @param inputPlainText
     * @returns {string}
     */
    function transPositionEncrypt(config, inputPlainText) {

        // append a pad character to make the array even in width and length
        var padLen = 0;
        if ((inputPlainText.length % config.key.length) > 0) {
            padLen = config.key.length - inputPlainText.length % config.key.length;
        }
        inputPlainText = cipherModule.padRight(inputPlainText, padLen, config.pad);

        var keyCharLookup = [];
        var keyCharacters = config.key.split('');
        for (var idx = 0; idx < keyCharacters.length; idx++) {
            var keyObject = createKeyObject(idx, keyCharacters[idx]);
            keyCharLookup.push(keyObject);
        }

        keyCharLookup.sort(sortByChar);

        for (var idx = 0; idx < inputPlainText.length; idx++) {
            var col = idx % config.key.length;
            var ch = inputPlainText.charAt(idx);
            keyCharLookup[col].chars.push(ch);
        }

        printKeyObjects('enc before sort:', keyCharLookup);
        keyCharLookup.sort(sortByColumn);
        printKeyObjects('enc after sort:', keyCharLookup);

        var result = "";
        for (var row = 0; row < keyCharLookup[0].chars.length; row++) {
            for (var column = 0; column < keyCharLookup.length; column++) {
                result += keyCharLookup[column].chars[row];
            }
        }

        return result;
    }

    /**
     * Transposition cipher decrypt.
     *
     * @param config
     * @param inputPlainText
     * @returns {string}
     */
    function transPositionDecrypt(config, cipherText) {

        var keyChars = config.key.split('');
        var keyCharLookup = [];
        for (var idx = 0; idx < keyChars.length; idx++) {
            var keyObject = createKeyObject(idx, keyChars[idx]);
            keyCharLookup.push(keyObject);
        }

        var maxItemsPerKey = Math.ceil(cipherText.length / config.key.length);
        for (var column = 0; column < config.key.length; column++) {
            var keyObject = keyCharLookup[column];
            for (var row = 0; row < maxItemsPerKey; row++) {
                var ch = cipherText.charAt(column + row * config.key.length);
                keyObject.chars.push(ch);
            }
        }

        printKeyObjects("dec before sprt:", keyCharLookup);
        keyCharLookup.sort(sortByChar);
        printKeyObjects("dec after sort:", keyCharLookup);

        var result = "";
        for (var row = 0; row < maxItemsPerKey; row++) {
            for (var column = 0; column < keyCharLookup.length; column++) {
                result += (keyCharLookup[column].chars[row] == config.pad) ? '' : keyCharLookup[column].chars[row];
            }
        }

        return result;
    }

    function sortByChar(a, b) {
        "use strict";
        if (a.ch < b.ch) {
            return -1;
        } else if (a.ch > b.ch) {
            return 1;
        } else {
            return 0;
        }
    }

    function sortByColumn(a, b) {
        "use strict";
        if (a.col < b.col) {
            return -1;
        } else if (a.col > b.col) {
            return 1;
        } else {
            return 0;
        }
    }

    function printKeyObjects(msg, keyObjects) {
        cipherModule.log(msg);
        cipherModule.printArray(keyObjects);
        for (var i = 0; i < keyObjects.length; i++) {
            cipherModule.printArray(keyObjects[i].chars);
        }
    }

    function createKeyObject(idx, ch) {
        return {
            ch: ch,
            col: idx,
            chars: [],
            toString: function (a) {
                "use strict";
                return "[ch: " + this.ch + ", col: " + this.col + "]";
            }
        };
    }

    /**
     * Creates German ADFGVX cipher module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.adfgvx = function (config) {

        var _config = config || _default_config;

        return {
            init: function(form) {
                _config.key = form.elements['adfgvx-cipher-key'].value;
                if (_config.key == undefined) {
                    throw "Key not valid. please enter a valid key";
                }
                _config.key = _config.key.toUpperCase();
                _config.transpositionObjConfig = {key:_config.key.toLowerCase()};
                _config.transpositionObj = cipherModule.transposition(_config.transpositionObjConfig);
            },
            encrypt: function (plainText) {
                "use strict";
                return encrypt(_config, plainText);
            },
            decrypt: function (cipherText) {
                "use strict";
                return decrypt(_config, cipherText);
            }
        };

    };

    return cipherModule;

})(slbcipher || {});
