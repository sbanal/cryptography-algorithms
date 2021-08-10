/**
 * Lab 10: Left Shift Feedback Register (LFSR) - Binary
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    const INITIALIZATION_BIT_VECTOR = "001";
    const LF_BIT_VECTOR = "101";
    const REGISTER_BIT_VECTOR_SIZE = 3;
    const DEBUG = false;

    function logRecord(record, srAndLf, bit, sr) {
        record.push(
                {
                    srAndLf: cipherModule.toBinaryValue(srAndLf, 3),
                    bit: cipherModule.toBinaryValue(bit, 1),
                    sr: cipherModule.toBinaryValue(sr, 3),
                }
            );
    }

    function randomValue(_config) {

        var sr = (_config.sr == undefined) ? _config.iv : _config.sr;
        var logRecords = [];
        var result = 0;

        for(var i = _config.resultBitCount - 1; i >= 0; i--) {
            var srTmp = sr & _config.lf;
            var fbBit = xorBits(srTmp, _config.bitVectorSize);
            sr = (fbBit << _config.bitVectorSize - 1) | (sr >> 1);
            result = result | (fbBit << i);
            logRecord(logRecords, srTmp, fbBit, sr);
        }

        _config.sr = sr;

        if(DEBUG) {
            console.log("records:" + JSON.stringify(logRecords));
        }

        return result;
    }

    /**
     * XOR the bit values.
     *
     * @param value         value to xor
     * @param bitSize       number of bits
     * @return {number}     result
     */
    function xorBits(value, bitSize) {
        var result = -1;
        while(bitSize-- > 0) {
            if (result == -1) {
                result = (value & 0x01);
            } else {
                result = result ^ (value & 0x01);
            }
            value = value >> 1;
        }
        return result;
    }
    cipherModule.xorBits = function(value, bitSize) {
        return xorBits(value, bitSize);
    };

    /**
     * LFSR module
     *
     */
    cipherModule.lfsr = function (config) {

        var _config = config || {};

        _config.bitVectorSize = REGISTER_BIT_VECTOR_SIZE;
        if (isNaN(_config.iv)) {
            _config.iv = parseInt(INITIALIZATION_BIT_VECTOR, 2);
        }
        if (isNaN(_config.lf)) {
            _config.lf = parseInt(LF_BIT_VECTOR, 2);
        }
        _config.resultBitCount = Math.pow(2, _config.bitVectorSize);

        return {
            init: function (form) {
                return false;
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

    return cipherModule;

})(slbcipher || {});
