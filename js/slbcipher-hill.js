/**
 * Lab 3: Hill Cipher
 *
 * This module contains implementation of Hill cipher module.
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    /**
     * Encrypts a plain text input using a given config.
     *
     * @param config
     * @param inputPlainText
     * @returns {string}    output encrypted text
     */
    function encrypt(config, inputPlainText) {
        var paddedInputText = cipherModule.padRight(inputPlainText, inputPlainText.length%config.keySize, config.padChar);
        var result = "";
        for(var i = 0; i < paddedInputText.length; i+= config.keySize) {
            var subChars = paddedInputText.substr(i, config.keySize).split('');
            var subCharsMatrix = [[]];
            for (var j = 0; j < subChars.length; j++) {
                subCharsMatrix[0].push(config.charSet.indexMap[subChars[j]]);
            }
            var encMatrix = cipherModule.matrixMultiply(subCharsMatrix, config.key, function(value) {
                if (value > 0) {
                    return value % config.charSet.zLen
                } else {
                    while(value < 0) {
                        value = value + config.charSet.zLen;
                    }
                    return value;
                }
            });
            cipherModule.printArray(encMatrix);
            for (var j = 0; j < encMatrix[0].length; j++) {
                result += config.charSet.characters.charAt(encMatrix[0][j]);
            }
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
        var result = "";
        for(var i = 0; i < cipherText.length; i+= config.keySize) {
            var subChars = cipherText.substr(i, config.keySize).split('');
            var subCharsMatrix = [[]];
            for (var j = 0; j < subChars.length; j++) {
                subCharsMatrix[0].push(config.charSet.indexMap[subChars[j]]);
            }
            var encMatrix = cipherModule.matrixMultiply(subCharsMatrix, config.keyInv,
                function(value) {
                    if (value > 0) {
                        return value % config.charSet.zLen
                    } else {
                        while(value < 0) {
                            value = value + config.charSet.zLen;
                        }
                        return value;
                    }
            });
            for (var j = 0; j < encMatrix[0].length; j++) {
                var charValue = config.charSet.characters.charAt(encMatrix[0][j]);
                result += (charValue == config.padChar) ? '' : charValue;
            }
        }
        return result;
    }

    /**
     * Creates transposition module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.hill = function (config) {

        var charSetObj = cipherModule.createCharSet('abcdefghijklmnopqrstuvwxyz -');
        var _default_key = [[11, 8], [3, 7]]
        var _inv_default_key = cipherModule.inverseMatrix(_default_key, charSetObj.zLen, function(value) {
            if (value > 0) {
                return value % charSetObj.zLen
            } else {
                while(value < 0) {
                    value = value + charSetObj.zLen;
                }
                return value;
            }
        });
        var _default_config = {
            charSet: charSetObj,
            key: _default_key,
            keyInv: _inv_default_key,
            keySize: _default_key[0].length,
            padChar: '-'
        };

        var _config = config || _default_config;
        if (_config.charSet == undefined) {
            _config.charSet = _default_config.charSet;
        }
        if (_config.padChar == undefined) {
            _config.padChar = '-';
        }
        if (_config.key == undefined) {
            _config.key = _default_key;
            _config.keyInv = _inv_default_key;
        }

        return {
            init: function(form) {
                _config.key = [
                    [parseInt(form.elements['hill-cipher-key00'].value), parseInt(form.elements['hill-cipher-key01'].value)],
                    [parseInt(form.elements['hill-cipher-key10'].value), parseInt(form.elements['hill-cipher-key11'].value)],
                ];
                _config.keyInv = cipherModule.inverseMatrix(_config.key, _config.charSet.zLen, function(value) {
                    if (value > 0) {
                        return value % _config.charSet.zLen
                    } else {
                        while(value < 0) {
                            value = value + _config.charSet.zLen;
                        }
                        return value;
                    }
                });
                var identityM = cipherModule.matrixMultiply(_config.key, _config.keyInv, function(value) {
                    if (value > 0) {
                        return value % _config.charSet.zLen
                    } else {
                        while(value < 0) {
                            value = value + _config.charSet.zLen;
                        }
                        return value;
                    }
                });
                cipherModule.log('hill cipher using identityM:');
                cipherModule.printArray(identityM);
                if (!(identityM[0][0] == 1 && identityM[1][1] == 1 &&
                    identityM[1][0] == 0 && identityM[0][1] == 0)) {
                    throw 'Invalid key matrix. Matrix has no inverse';
                }
                cipherModule.log('hill cipher using key:');
                cipherModule.printArray(_config.key);
                cipherModule.log('hill cipher using keyInv:');
                cipherModule.printArray(_config.keyInv);

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
