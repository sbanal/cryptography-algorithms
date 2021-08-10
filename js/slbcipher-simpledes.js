/**
 * Lab 5: Simple DES Cipher
 *
 * Simple DES cipher implementation module.
 *
 * @author Stephen Lou Banal (stephen.banal@gmail.com / s3629304@student.rmit.edu.au)
 */
var slbcipher = (function (cipherModule) {

    /**
     * We are only using a 10-bit key. Using this to check max value of input key and for masking.
     * @type {number}
     */
    const KEY_VALUE_MAX = 0x3FF;

    /**
     * Bit permutation function creates an integer value whose bits are copied from the source
     * value to the result value based on the position of a bit value specified in the table.
     *
     * The values in the permutation table is the position of the bit in the source value
     * while position of that value in the table is its position in the result value.
     * All table values are between 1 and bitSize, representing position of bits from source value.
     * The index in the table array represents the bit position from the left of the result value.
     *
     * For example, for table [1,3,5,7] and input value 10101010 and bitSize = 8
     * The output is expected to be 1111.
     *
     * @param permutationTable
     * @param input
     * @returns {number}
     */
    function bitPermutate(permutationTable, input, bitSize) {
        var result = 0;
        var FLAG = 0x01 << (bitSize - 1);
        for (var i = 0, tableIdx = permutationTable.length - 1; i < permutationTable.length; ++i, --tableIdx) {
            var flagValue = (FLAG >> (permutationTable[tableIdx] - 1));
            var bitValue = flagValue & input;
            var bitFlag = (bitValue > 0) ? 0x01 : 0x00;
            result = result | (bitFlag << i);
        }
        return result;
    }
    cipherModule.bitPermutate = function(table, input, bitSize) { return bitPermutate(table, input, bitSize); };

    /**
     * Initial permutation.
     *
     */
    function initialPermutation(input) {
        var permutationTable = [2, 6, 3, 1, 4, 8, 5, 7];
        return bitPermutate(permutationTable, input, 8);
    }
    cipherModule.initialPermutation = function(input) { return initialPermutation(input); };

    /**
     * Expansion permutation. Input is a 4Bit value.
     *
     */
    function expansionPermutation(input) {
        var permutationTable = [4, 1, 2, 3, 2, 3, 4, 1];
        return bitPermutate(permutationTable, input & 0x0F, 4);
    }
    cipherModule.expansionPermutation = function(input) { return expansionPermutation(input); };

    /**
     * P10 Permutation.
     *
     * @param input
     * @returns {*}
     */
    function p10Permutation(input) {
        var permutationTable = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
        return bitPermutate(permutationTable, input & KEY_VALUE_MAX, 10);
    }
    cipherModule.p10Permutation = function(input) { return p10Permutation(input); };

    /**
     * P8 Permutation.
     *
     * @param input
     * @returns {number}
     */
    function p8Permutation(input) {
        var permutationTable = [6, 3, 7, 4, 8, 5, 10, 9];
        return bitPermutate(permutationTable, input & KEY_VALUE_MAX, 10);
    }
    cipherModule.p8Permutation = function(input) { return p8Permutation(input); };

    /**
     * P4 permutation. Input is 4bit value from S0 and S1 output.
     *
     * @param input
     * @returns {number}
     */
    function p4Permutation(input) {
        var permutationTable = [2, 4, 3, 1];
        return bitPermutate(permutationTable, input, 4);
    }
    cipherModule.p4Permutation = function(input) { return p4Permutation(input); };

    /**
     * Inverse Init permutation.
     *
     * @param input
     * @returns {number}
     */
    function inverseInitPermutation(input) {
        var permutationTable = [4, 1, 3, 5, 7, 2, 8, 6];
        return bitPermutate(permutationTable, input, 8);
    }
    cipherModule.inverseInitPermutation = function(input) { return inverseInitPermutation(input); };

    /**
     * Rotates a 5 bit value to 1 position to the left.
     *
     * @param input
     * @returns {number}
     */
    function rotate4BitsToLeft1(input) {
        return (input & 0x10) >> 4 | (input & 0xF) << 0x01;
    }
    cipherModule.rotate4BitsToLeft1 = function(input) { return rotate4BitsToLeft1(input); }


    /**
     * Swaps the first 4 bits to the right and the last 4 bits to the left.
     * Basically swaps the 1st half bits with the 2nd half bits of an 8 bit value.
     *
     * @param input
     * @returns {number}
     */
    function swapBits(input) {
        var rightBits = input & 0xF;
        var leftBits = input & 0xF0;
        return (leftBits >> 4) | (rightBits << 4);
    }

    /**
     * Rotates a 5 bit value to 2 positions to the left.
     *
     * @param input
     * @returns {number}
     */
    function rotate4BitsToLeft2(input) {
        return (input & 0x18) >> 3 | (input & 0x7) << 0x02;
    }
    cipherModule.rotate4BitsToLeft2 = function(input) { return rotate4BitsToLeft2(input); }

    /**
     * Left Shift 1 on P10 output.
     *
     * @param input
     */
    function leftShift1(input) {
        var bitsRes1 = rotate4BitsToLeft1(input >> 5);
        var bitsRes2 = rotate4BitsToLeft1(input & 0x1F);
        return (bitsRes1 << 5) | bitsRes2;
    }

    /**
     * Left Shift 2 on P10 output.
     *
     * @param input
     */
    function leftShift2(input) {
        var bitsRes1 = rotate4BitsToLeft2(input >> 5);
        var bitsRes2 = rotate4BitsToLeft2(input & 0x1F);
        return (bitsRes1 << 5) | bitsRes2;
    }

    /**
     * Does a substitution bit calculation.
     * The input is a 4 bit value where the 1st bit and the 4th bit added
     * is the row value. While the 2nd and 3rd bit added is the column value.
     *
     * @param substitutionTable
     * @param input
     * @returns {*}
     */
    function substituteSBits(substitutionTable, input) {
        var row = (input & 0x08) >> 2 | (input & 0x01);
        var col = (input & 0x06) >> 1;
        // console.log("input = " + input +',bits=' + Number(input).toString(2)
        //     + ", table[" + row + "][" + col + "] = " + substitutionTable[row][col]);
        return substitutionTable[row][col];
    }

    /**
     * Executes an S0 substitution of a 4 bit value.
     *
     * @param input
     * @returns {*}
     */
    function substitutionBoxS0(input) {
        var substitutionMatrix = [
            [1, 0, 3, 2],
            [3, 2, 1, 0],
            [0, 2, 1, 3],
            [3, 1, 3, 2]
        ];
        return substituteSBits(substitutionMatrix, input);
    }
    cipherModule.substitutionBoxS0 = function(input) { return substitutionBoxS0(input); };

    /**
     * Executes an S1 substitution of a 4 bit value.
     *
     * @param input
     * @returns {*}
     */
    function substitutionBoxS1(input) {
        var substitutionMatrix = [
            [0, 1, 2, 3],
            [2, 0, 1, 3],
            [3, 0, 1, 0],
            [2, 1, 0, 3]
        ];
        return substituteSBits(substitutionMatrix, input);
    }
    cipherModule.substitutionBoxS1 = function(input) { return substitutionBoxS1(input); };

    /**
     * Generates a key based on an input 10 bit key.
     *
     * @param input 10-bit input key
     * @returns {{key1: *, key2: *}}
     */
    function generateKey(input) {
        if (isNaN(input)) {
            throw new Error("Key '" + input + "' is not a number");
        }
        if (input > KEY_VALUE_MAX) {
            throw new Error("Key '" + input + "' is to large. Enter a number > 0 and <= 1023");
        }
        var p10Result = p10Permutation(input);
        var ls1Bits04 = leftShift1(p10Result & 0x1F); // bits 0-4
        var ls2Bits59 = leftShift1((p10Result & 0x3E0) >> 5); // bits 5-9
        var key1 = p8Permutation((ls2Bits59 << 5) | ls1Bits04);

        var ls2Bits04 = leftShift2(ls1Bits04);
        var ls2Bits59 = leftShift2(ls2Bits59);
        var key2 = p8Permutation((ls2Bits59 << 5) | ls2Bits04);

        return { key1: key1, key2: key2 };
    }
    cipherModule.generateKey = function(input) { return generateKey(input); };

    /**
     * Encrypts/Decrypts an 8bit value. This is Fk in diagram.
     *
     * Executes
     * - Expansion Permutation (E/P)
     * - E/P Result xor with key
     * - S0 and S1
     * - S0 and S1 -> P4 permutation
     * - input 4 bits xor p4 result
     *
     * @param charCode
     */
    function Fk(input, key) {
        var epResult = expansionPermutation(input & 0xF);
        var xorResult = epResult ^ key;
        var s0Result = substitutionBoxS0(xorResult >> 4);
        var s1Result = substitutionBoxS1(xorResult & 0xF);
        var p4Result = p4Permutation((s0Result << 2) | s1Result);
        var leftBits = (input >> 4) ^ p4Result;
        var rightBits = (input & 0xF);
        return  (leftBits << 4) | rightBits;
    }
    cipherModule.Fk = function(input, key) { return Fk(input, key); };

    /**
     * Executes Simple DES pipeline processing of characters.
     * Used for both encryption and decryption.
     *
     * @param charCode
     * @param keys
     * @returns {number}
     */
    function doSimpleDesPipeline(charCode, keys) {
        var ipResult = initialPermutation(charCode);
        var phase1 = Fk(ipResult, keys.key1);
        var phase1Swap = swapBits(phase1);
        var phase2 = Fk(phase1Swap, keys.key2);
        var inverseIp = inverseInitPermutation(phase2);
        return inverseIp;
    }
    cipherModule.doSimpleDesPipeline = function(input, key) { return doSimpleDesPipeline(input, key); };

    /**
     * Encrypts a plain text input using a given config.
     *
     * @param config
     * @param inputPlainText
     * @returns {string}    output encrypted text
     */
    function encrypt(config, inputPlainText) {
        var keys = generateKey(config.key);
        var result = "";
        for (var i = 0; i < inputPlainText.length; ++i) {
            var charCode = inputPlainText.charCodeAt(i);
            var inverseIp = doSimpleDesPipeline(charCode, keys);
            cipherModule.log("enc: "
                + "char=" + inputPlainText.charAt(i) + ", "
                + "charCode=" + charCode + ", encCode=" + inverseIp + ","
                + "hexCode=" + Number(inverseIp).toString(16));
            result += cipherModule.padLeftToLen(Number(inverseIp).toString(16), 2, "0") + " ";
        }
        return result.trim();
    }

    /**
     * Decrypts a cipher text using given config.
     *
     * @param config    defines the key length and padding text.
     * @param inputCipherText   input cipher text
     * @returns {string}    output decrypted text
     */
    function decrypt(config, cipherText) {
        var keys = generateKey(config.key);
        var keysReversed = {key1: keys.key2, key2: keys.key1};
        var result = "";
        var hexCodes = cipherText.split(" ");
        for (var i = 0; i < hexCodes.length; ++i) {
            var charCode = parseInt(hexCodes[i], 16);
            var inverseIp = doSimpleDesPipeline(charCode, keysReversed);
            var charValue = String.fromCharCode(inverseIp);
            cipherModule.log("dec: "
                + "charCode=" + cipherText.charCodeAt(i) + ", decryptedCode=" + inverseIp + ","
                + "char=" + charValue);
            result += charValue;
        }
        return result;
    }

    /**
     * Creates Simple DES cipher module using default key.
     *
     */
    cipherModule.simpledes = function () {
        return cipherModule.simpledes(null);
    };

    /**
     * Creates Simple DES cipher module using provided config.
     *
     */
    cipherModule.simpledes = function (config) {

        var _config = config || {key: 132};

        return {
            init: function (form) {
                var keyValue = form.elements["simpledes-cipher-key"].value;
                if (keyValue == undefined) {
                    keyValue = _config.key; // use default key
                } else {
                    keyValue = parseInt(keyValue, 2);
                }
                this.setKey(keyValue);
            },
            getKeyMaxValue: function() {
                return KEY_VALUE_MAX;
            },
            setKey: function(key) {
                if (key == undefined || isNaN(key) ||  parseInt(key) > KEY_VALUE_MAX) {
                    throw new Error("Invalid key, value is empty or value is not a number or value is greater KEY_MAX_VALUE.");
                }
                _config.key = key; // must be 8bit, truncate the rest
                _config.generatedKeys = generateKey(_config.key);
            },
            generateKey: function(input) {
                return generateKey(input);
            },
            encryptBlock: function(input) {
                return doSimpleDesPipeline(input, _config.generatedKeys);
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
