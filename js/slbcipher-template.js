/**
 * [Cipher name] Cipher
 *
 * This is a template js file of any of cipher module i will be implementing.
 * NOTE:
 * - replace prpoerty name "yourmodulename" in JS below with your cipher module name (e.g. scytale)
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
        var result = "";
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
        return result;
    }

    /**
     * Creates cipher module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.yourmodulename = function (config) {

        //TODO: implement constructor initialization method

        return {
            init: function (form) {
                //TODO: implement init method, this is called to fill up any user specified parameters like keys etc.
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
