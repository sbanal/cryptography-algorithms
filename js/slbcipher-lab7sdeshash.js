/**
 * Lab 7: Hash Function using Simple DES.
 *
 * Requirements:
 * (1) Input a string of message;
 * (2) Convert the message into a string of bits according to ASCII;
 * (3) Break the string of bits into 8-bit blocks;
 * (4) Make use of the Simplified DES implemented before;
 * (5) Hash the 8-bit blocks one-by-one to output 8-bit hash value in the end.
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    /**
     * Maximum ASCII value.
     */
    const MAX_ASCII_VALUE = 0xFF;

    /**
     * Validates if input text is an ASCII string.
     *
     * @param inputPlainText
     * @throws Error if at least one character is non-ASCII (charcode > 0xFF)
     */
    function validateAsciiInput(inputPlainText) {
        for (var i = 0; i < inputPlainText.length; i++) {
            if (inputPlainText.charCodeAt(i)> MAX_ASCII_VALUE) {
                throw Error("Invalid input. Input character " + inputPlainText.charAt(i) + " is not ASCII");
            }
        }
    }

    /**
     * Creates a hash of a given plain text string. Assumes all characters are ASCII characters only.
     *
     * @param config
     * @param inputPlainText
     * @returns {string}    output encrypted text
     */
    function createHash(config, inputPlainText) {

        validateAsciiInput(inputPlainText);

        // calculate first C1 = Ek(M1)
        var prevPlainTextXor = inputPlainText.charCodeAt(0);
        // calculate Ek[1]
        var prevCipherBlock = config.encryptBlock(inputPlainText.charCodeAt(0));
        console.info('c1='+ prevCipherBlock + ",ch=" + inputPlainText.charCodeAt(0));
        for (var i = 1; i < inputPlainText.length; ++i) {
            var charCode = inputPlainText.charCodeAt(i);
            // calculate M[i-1] xor M[i]
            prevPlainTextXor = prevPlainTextXor ^ charCode;
            // calculate M[i] xor C[i-1]
            var charCipherBlock = prevCipherBlock ^ charCode;
            // calculate Ek[i]
            prevCipherBlock = config.encryptBlock(charCipherBlock);
            console.info('c'+(i+1)+'='+ prevCipherBlock + ",ch=" + charCode);
        }

        // calculate CFk(M)
        var hashValue = config.encryptBlock(prevPlainTextXor ^ prevCipherBlock);

        return Number(hashValue).toString(10);
    }
    cipherModule.createHash = function(config, inputPlainText) {
        return createHash(config, inputPlainText);
    }

    /**
     * Creates cipher module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.lab7sdeshash = function (config) {

        // default key
        var _config = config || {key: 132, cipher:'sdes'};

        if (_config.cipher == 'affine') {
            _config.encryptBlock = function(m) {
                return (3*m + 5) % 26;
            }
        } else {
            _config.crpyto = cipherModule.simpledes(_config);
            _config.crpyto.setKey(_config.key);
            _config.encryptBlock = function(m) {
                return _config.crpyto.encryptBlock(m);
            }
        }

        return {
            init: function (form) {
                var keyValue = form.elements["lab7sdeshash-cipher-key"].value;
                _config.key = parseInt(keyValue);
                return false;
            },
            hash: function (plainText) {
                "use strict";
                return createHash(_config, plainText);
            }
        };

    };

    return cipherModule;

})(slbcipher || {});
