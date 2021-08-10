/**
 * Lab 6: Implements Euclidean algorithm and multiplicative inverse of mod n.
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {


    /**
     * Computes multiplicative inverse of 'a'.
     *
     * @param a
     * @param mod
     * @returns {number}
     */
    function inverseMod(a, mod) {
        if (a < 0) {
            a = a + mod;
        }
        for (var i = 0; i < mod; i++) {
            if ((a*i % mod) == 1) {
                return i;
            }
        }
        return 0;
    }
    cipherModule.inverseMod = function(a, mod) { return inverseMod(a, mod); };

    /**
     * Euclidean algorithm.
     *
     * @param k
     * @param mod
     * @returns {*}
     */
    function gcd(k, mod) {
        if (k < 0) {
            k = k + mod;
        }
        if (mod == 0) {
            return k;
        }
        return gcd(mod, k % mod);
    }
    cipherModule.gcd = function(k, mod) { return gcd(k, mod); };

    /**
     * Creates cipher module.
     *
     * @param config
     * @returns {{encrypt: encrypt, decrypt: decrypt}}
     */
    cipherModule.lab6 = function (config) {

        //TODO: implement constructor initialization method

        return {
            init: function (form) {
                return false; // signal to disable encrypt/decrypt buttons
            },
            gcd: function (value) {
                "use strict";
                return gcd(value);
            },
            inverseMod: function (value, n) {
                "use strict";
                return inverseMod(value, n);
            }
        };

    };

    return cipherModule;

})(slbcipher || {});
