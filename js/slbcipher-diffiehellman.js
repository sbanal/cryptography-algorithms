/**
 * Lab 8: Diffie-Hellman
 *
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    const MIN_P = 100;
    const MAX_P = 1000;

    /**
     * Generates random number in a given range.
     *
     * @param min
     * @param max
     * @return {number}
     */
    function generateRandomNumber(min, max) {
        return Math.floor(Math.random()*(max - min)) + 1;
    }

    /**
     * Generates keys.
     *
     * @param p
     * @param g
     * @return {{privateRandom: number, publicKey: number}}
     */
    function generatePublicKey(p, g) {
        var secret = generateRandomNumber(MIN_P, MAX_P);
        var publicKey = fastModularExponentiation(g, secret, p);
        return {privateRandom: secret, publicKey: publicKey};
    }

    /**
     * Computes private key.
     *
     * @param privateRandom
     * @param publicKey
     * @param p
     * @return {number}
     */
    function computePrivateKey(privateRandom, publicKey, p) {
        return fastModularExponentiation(publicKey, privateRandom, p);
    }

    /**
     * Fast Modular Exponentiation method.
     *
     * Implementation uses Right-to-Left Binary method.
     * Reference of algorithm: https://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method
     *
     * @param base
     * @param exponent
     * @param modulus
     * @return {number}
     */
    function fastModularExponentiation(base, exponent, modulus) {
        if (modulus == 1) {
            return 0;
        }
        var result = 1;
        var base = base % modulus;
        while (exponent > 0) {
            if (exponent % 2 == 1) {
                result = (result * base) % modulus;
            }
            exponent = exponent >> 1;
            base = (base * base) % modulus;
        }
        return result;
    }
    cipherModule.fastModularExponentiation = function(base, exponent, mod) {
        return fastModularExponentiation(base, exponent, mod);
    }

    /**
     * Creates cipher module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.diffiehellman = function (config) {

        var _config = {};

        return {
            init: function (form) {
                if (form == null) {
                    _config.publicPG = {p: 521, g: 10};
                    return;
                }
                var p = parseInt(form.elements['diffiehellman-cipher-init-p'].value);
                var g = parseInt(form.elements['diffiehellman-cipher-init-g'].value);
                _config.publicPG = {p: p, g: g};
                return false;
            },
            getP: function() {
                return _config.publicPG.p;
            },
            getG: function() {
                return _config.publicPG.g;
            },
            getPublicKey: function() {
                var keys = generatePublicKey(_config.publicPG.p, _config.publicPG.g);
                return {publicKey: keys.publicKey, privateRandom: keys.privateRandom};
            },
            getPrivateKey: function(privateKey, publicKey) {
                var privateKey = computePrivateKey(privateKey, publicKey, _config.publicPG.p);
                return privateKey;
            }
        };

    };

    return cipherModule;

})(slbcipher || {});
