/**
 * Lab 3: Affine Cipher
 *
 * This module contains implementation of Affine cipher module.
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {


    function charIndex(config, inputChar) {
        const firstLetterIdx = config.indexMap[config.characters.charAt(0)];
        return config.indexMap[inputChar] - firstLetterIdx;
    }

    /**
     * Encrypts a plain text input using a given config.
     *
     * @param config
     * @param inputPlainText
     * @returns {string}    output encrypted text
     */
    function encrypt(config, inputPlainText) {
        var result = "";
        cipherModule.log('enc affine input:' + inputPlainText);
        for (var i = 0; i < inputPlainText.length; i++) {
            var p = config.charSet.indexMap[inputPlainText.charAt(i)];
            var c = (config.key1 * p + config.key2) % config.charSet.zLen;
            cipherModule.log('p:' + p + ',c='+ c);
            result += config.charSet.characters.charAt(c);
        }
        return result;
    }

    function modularInverse(a, mod) {
        for (var i = 0; i < mod; i++) {
            if ((a*i % mod) == 1) {
                return i;
            }
        }
        return -1;
    }


    /**
     * Decrypts a cipher text using given config.
     *
     * @param config    defines the key length and padding text.
     * @param inputCipherText   input cipher text
     * @returns {string}    output decrypted text
     */
    function decrypt(config, cipherText) {
        var result = "";
        cipherModule.log('enc affine input:' + cipherText);
        var k1ModInv = modularInverse(config.key1, config.charSet.zLen);
        for (var i = 0; i < cipherText.length; i++) {
            var c = config.charSet.indexMap[cipherText.charAt(i)];
            var p = k1ModInv*(c - config.key2) % config.charSet.zLen;
            if (p < 0) {
                p = p + config.charSet.zLen; // convert to positive index, basically moving from the head back to tail
            }
            result += config.charSet.characters.charAt(p);
        }
        return result;
    }

    /**
     * Creates transposition module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.affine = function (config) {

        var _default_config = {
            charSet: cipherModule.createCharSet('abcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()-_=+{}[]|\\:;\'"<>,.?/ '),
            key1: 5,
            key2: 3
        };
        var _config = config || _default_config;
        if (_config.charSet == undefined) {
            _config.charSet = _default_config.charSet;
        } else {
            if (_config.charSet.zLen == undefined) {
                _config.charSet = cipherModule.createCharSet(_config.charSet);
            }
        }
        if (isNaN(_config.key1)) {
            _config.key1 = _default_config.key1;
        }
        if (isNaN(_config.key2)) {
            _config.key2 = _default_config.key2;
        }

        return {
            init: function (form) {
                _config.key1 = parseInt(form.elements['affine-cipher-key1'].value);
                _config.key2 = parseInt(form.elements['affine-cipher-key2'].value);
                if (slbcipher.gcd(_config.key1, _config.charSet.zLen) != 1) {
                    throw "Invalid key1 value. value is not a prime of 26";
                }
                if (_config.key1 <= 0 && _config.key1 >= _config.charSet.zLen) {
                    throw "Invalid key1 value. value is not a within range min=0, max="  + _config.charSet.zLen;
                }
                if (_config.key2 <= 0 && _config.key2 >= _config.charSet.zLen) {
                    throw "Invalid key2 value. value is not a within range min=0, max="  + _config.charSet.zLen;
                }
                cipherModule.log('hill cipher using key1:' + _config.key1 + ',key2:' + _config.key2);
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
