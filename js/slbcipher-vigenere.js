/**
 * Lab 4: Vigenere Cipher
 *
 * This module contains implementation of Vigenere cipher module.
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    var _default_config = {key: "venus", charSet: 'abcdefghijklmnopqrstuvwxyz' };

    function createPaddedKey(key, input) {
        // append a pad character to make the array even in width and length
        var keyPadded = key;
        if (keyPadded.length > input.length) {
            keyPadded = keyPadded.substring(0, input.length);
        }
        while(keyPadded.length < input.length) {
            keyPadded += keyPadded;
        }
        if (keyPadded.length > input.length) {
            keyPadded = keyPadded.substring(0, input.length);
        }
        return keyPadded;
    }

    /**
     * Encrypts a plain text input using a given config.
     *
     * @param config
     * @param inputPlainText
     * @returns {string}    output encrypted text
     */
    function encrypt(config, inputPlainText) {

        // append a pad character to make the array even in width and length
        var keyPadded = createPaddedKey(config.key, inputPlainText);
        var charSetMap = cipherModule.createCharSet(config.charSet);

        var result = "";
        for (var i = 0; i < inputPlainText.length; ++i) {
            var keyIdx = i % keyPadded.length;
            var keyChar = keyPadded.charAt(keyIdx);
            var inputChar = inputPlainText.charAt(i);
            var vigSqrIdx = (charSetMap.indexMap[inputChar] + charSetMap.indexMap[keyChar]) % charSetMap.zLen;
            result += charSetMap.characters.charAt(vigSqrIdx);
        }

        return result;
    }


    /**
     * Decrypts a cipher text using given config.
     * ex.
     * attackatdawn
     * lxfopvefrnhr
     *
     * @param config    defines the key length and padding text.
     * @param inputCipherText   input cipher text
     * @returns {string}    output decrypted text
     */
    function decrypt(config, cipherText) {

        var keyPadded = createPaddedKey(config.key, cipherText);
        var charSetMap = cipherModule.createCharSet(config.charSet);

        var result = "";
        for (var i = 0; i < cipherText.length; ++i) {
            var keyIdx = i % keyPadded.length;
            var keyChar = keyPadded.charAt(keyIdx);
            var inputChar = cipherText.charAt(i);
            var vigSqrIdx = (charSetMap.indexMap[inputChar] - charSetMap.indexMap[keyChar]) % charSetMap.zLen;
            if (vigSqrIdx < 0) {
                vigSqrIdx += charSetMap.zLen;
            }
            var plainChar = charSetMap.characters.charAt(vigSqrIdx);
            cipherModule.log("dec: input='" + inputChar + "'=>'" + charSetMap.indexMap[inputChar] +
                "',keyChar='" + plainChar + "'=> '" + charSetMap.indexMap[keyChar] + "'");
            result += plainChar;
        }

        return result;

    }

    /**
     * Creates Vigenere module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.vigenere = function (config) {

        var _config = config || _default_config;

        if (_config.key == undefined) {
            _config.key = _default_config.key;
        }
        if (_config.charSet == undefined) {
            _config.charSet = _default_config.charSet;
        }

        return {
            init: function(form) {
                _config.key = form.elements['vigenere-cipher-key'].value;
                _config.charSet = form.elements['vigenere-cipher-charset'].value;
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
