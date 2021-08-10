/**
 * Lab 2: Transposition Cipher
 *
 * This module contains implementation of transposition module.
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    var _default_config = {key: "stock", pad: '-'};

    /**
     * Encrypts a plain text input using a given config.
     *
     * Exmaple:
     * p: atfoursurveillanceonenemycamp
     * k: maine
     * c: tsicnauvanyafuleemarenecorlomp
     *
     * @param config
     * @param inputPlainText
     * @returns {string}    output encrypted text
     */
    function encrypt(config, inputPlainText) {

        // append a pad character to make the array even in width and height
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

        // for each column append characters
        for (var idx = 0; idx < inputPlainText.length; idx++) {
            var col = idx % config.key.length;
            var ch = inputPlainText.charAt(idx);
            cipherModule.log("push ch=" + ch + " to col['" + keyCharLookup[col].ch + "']=" + ch);
            keyCharLookup[col].chars.push(ch);
        }

        printKeyObjects('enc before sort:', keyCharLookup);
        keyCharLookup.sort(sortByChar);
        printKeyObjects('enc after sort:', keyCharLookup);

        var result = "";
        for (var idx = 0; idx < keyCharLookup.length; idx++) {
            var colChars = keyCharLookup[idx].chars;
            result += colChars.join('');
        }

        return result;
    }


    /**
     * Decrypts a cipher text using given config.
     *
     * @param config    defines the key length and padding text.
     * @param inputCipherText   input cipher text
     * @returns {string}    output decrypted text
     */
    function decrypt(config, cipherText) {

        var keyChars = config.key.split('');
        var keyCharLookup = [];
        for (var idx = 0; idx < keyChars.length; idx++) {
            var keyObject = createKeyObject(idx, keyChars[idx]);
            keyCharLookup.push(keyObject);
        }

        keyCharLookup.sort(sortByChar);

        var maxItemsPerKey = Math.ceil(cipherText.length / config.key.length);
        for (var column = 0; column < config.key.length; column++) {
            var offset = maxItemsPerKey*column;
            var substr = cipherText.substring(offset, offset + maxItemsPerKey).split('');
            keyCharLookup[column].chars = substr;
        }

        printKeyObjects("dec before sprt:", keyCharLookup);
        keyCharLookup.sort(sortByColumn);
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


    /**
     * Creates an object which will contain the character of the key, its index position
     * in the key and the characters of the text in that column.
     *
     * @param idx
     * @param ch
     * @returns {{ch: *, col: *, chars: Array, toString: toString}}
     */
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
     * Creates transposition module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.transposition = function (config) {

        var _config = config || _default_config;

        if (_config.key == undefined) {
            _config.key = _default_config.key;
        }
        if (_config.pad == undefined) {
            _config.pad = _default_config.pad;
        }

        return {
            init: function(form) {
                _config.key = form.elements['transposition-cipher-key'].value;
                _config.pad = form.elements['transposition-cipher-pad'].value;
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
