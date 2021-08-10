/**
 * Lab 2: Scytale Cipher.
 *
 * This module defines the Scytale cipher module.
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 *
 */

var slbcipher = (function (cipherModule) {

    var _default_config = {key: 5, pad: '-'};

    /**
     * Encrypts a plain text input using a given config.
     *
     * Example:
     *  p: meetatthreepmtodayattheusuallocation
     *  k: 6
     *  c: mtmascehttuaerotattedhliaeaelotpyuon
     *
     * @param config
     * @param inputPlainText
     * @returns {string}    output encrypted text
     */
    function encrypt(config, inputPlainText) {
        var rows = Math.ceil(inputPlainText.length / config.key);
        var padLen = config.key - (inputPlainText.length % config.key);
        var plainText = cipherModule.padRight(inputPlainText, padLen, config.pad);
        var columns = config.key;
        var result = "";
        cipherModule.log('enc rows:' + rows + ',columns:' + columns + ',text:"' + plainText + '"');
        for (var c = 0; c < columns; c++) {
            for (var r = 0; r < rows; r++) {
                var idx = c + r * columns;
                var chRead = plainText.charAt(idx);
                cipherModule.log('enc read:[' + r + '][' + c + '] = at['+ idx + '] = ' + chRead);
                result += chRead;
            }
        }
        return result;
    }

    /**
     * Decrypts a cipher text using give config.
     *
     * Example:
     *   p: atelevensurveillanceonfrontlines
     *   k: 4
     *   c: aeseaooitvuinnnneerlcftelnvlerls
     *
     *
     * @param config    defines the key length and padding text.
     * @param inputCipherText   input cipher text
     * @returns {string}    output decrypted text
     */
    function decrypt(config, inputCipherText) {
        var rows = config.key;
        var columns = Math.ceil(inputCipherText.length / config.key);
        var result = "";
        cipherModule.log('dec rows:' + rows + ',columns:' + columns + ',text:"' + inputCipherText + '"');
        for (var c = 0; c < columns; c++) {
            for (var r = 0; r < rows; r++) {
                var idx = r * columns + c;
                var chRead = (inputCipherText.charAt(idx) == config.pad) ? '' : inputCipherText.charAt(idx);
                cipherModule.log('dec read:[' + r + '][' + c + '] = at['+ idx + '] = ' + chRead);
                result += chRead;
            }
        }
        return result;
    }

    /**
     * Creates scytale module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.scytale = function (config) {

        var _config = config || _default_config;

        if (isNaN(_config.key)) {
            _config.key = _default_config.key;
        }
        if (isNaN(_config.pad)) {
            _config.pad = _default_config.pad;
        }

        return {
            init: function(form) {
                _config.key = form.elements["scytale-input-key"].value;
                _config.pad = form.elements["scytale-input-pad"].value;
                if (_config.pad == undefined) {
                    _config.pad = '-';
                }
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
