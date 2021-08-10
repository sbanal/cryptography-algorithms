/**
 * Lab 11: Left Shift Feedback Register (LFSR) - 3-Valued
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    /**
     * Default IV value.
     */
    const INITIALIZATION_BIT_VECTOR = "012";
    /**
     * Default LF value.
     */
    const LF_BIT_VECTOR = "021";
    /**
     * Number of bits or digits used in the computation.
     */
    const REGISTER_BIT_VECTOR_SIZE = 3;
    /**
     * Flag to enable debugging.
     * @type {boolean}
     */
    const DEBUG = false;

    /**
     * Calculates the product of two 3-valued vectors of same length.
     *
     * @param value1
     * @param value2
     * @return {string}
     */
    function valuesProduct(value1, value2) {
        var result = "";
        for(var i = 0; i < value1.length; i++) {
            var a = parseInt(value1.charAt(i));
            var b = parseInt(value2.charAt(i));
            result = Number(a * b).toString(10) + result;
        }
        return result;
    }

    function calculateModValue(value) {
        var sum = 0;
        for(var i = 0; i < value.length; i++) {
            sum += parseInt(value.charAt(i));
        }
        return Number(sum % value.length).toString();
    }

    /**
     * Generates a pseudo-random value LFSR 3-Value string
     * @param _config
     * @return {string}
     */
    function randomValue(_config) {

        var sr = (_config.sr == undefined) ? _config.iv : _config.sr;
        var logRecords = [];
        var result = "";

        for(var i = 0; i < _config.resultBitCount; i++) {
            var srTmp = valuesProduct(sr, _config.lf);
            var fbBit = calculateModValue(srTmp);
            sr = fbBit + sr.slice(0, _config.bitVectorSize - 1);
            result = result + fbBit;
        }
        _config.sr = sr;

        if(DEBUG) {
            console.log("records:" + JSON.stringify(logRecords));
        }

        return result;
    }

    /**
     * LFSR module
     *
     */
    cipherModule.lfsr3 = function (config) {

        var _config = config || {};

        _config.bitVectorSize = REGISTER_BIT_VECTOR_SIZE;
        if (isNaN(_config.iv)) {
            _config.iv = INITIALIZATION_BIT_VECTOR;
        }
        if (isNaN(_config.lf)) {
            _config.lf = LF_BIT_VECTOR;
        }
        _config.resultBitCount = Math.pow(3, _config.bitVectorSize);

        return {
            init: function (form) {
                return false;
            },
            getBitResultCount: function() {
                return _config.resultBitCount;
            },
            setParams: function(iv, lf) {
                _config.iv = iv;
                _config.lf = lf;
            },
            random: function () {
                return randomValue(_config);
            }
        };
    };

    cipherModule.lfsr3ValuesProduct  = function(value1, value2) { return valuesProduct(value1, value2); };
    cipherModule.lfsr3CalculateModValue  = function(value) { return calculateModValue(value); };
    cipherModule.lfsr3RandomValue = function(_config) { return randomValue(_config); };

    return cipherModule;

})(slbcipher || {});
