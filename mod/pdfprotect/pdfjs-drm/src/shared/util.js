'use strict';
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('pdfjs/shared/util', ['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.pdfjsSharedUtil = {}));
    }
}(this, function(exports) {
    var globalScope = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : (typeof self !== 'undefined') ? self : this;
    var FONT_IDENTITY_MATRIX = [0.001, 0, 0, 0.001, 0, 0];
    var TextRenderingMode = {
        FILL                    : 0,
        STROKE                  : 1,
        FILL_STROKE             : 2,
        INVISIBLE               : 3,
        FILL_ADD_TO_PATH        : 4,
        STROKE_ADD_TO_PATH      : 5,
        FILL_STROKE_ADD_TO_PATH : 6,
        ADD_TO_PATH             : 7,
        FILL_STROKE_MASK        : 3,
        ADD_TO_PATH_FLAG        : 4
    };
    var ImageKind = {GRAYSCALE_1BPP : 1, RGB_24BPP : 2, RGBA_32BPP : 3};
    var AnnotationType = {
        TEXT           : 1,
        LINK           : 2,
        FREETEXT       : 3,
        LINE           : 4,
        SQUARE         : 5,
        CIRCLE         : 6,
        POLYGON        : 7,
        POLYLINE       : 8,
        HIGHLIGHT      : 9,
        UNDERLINE      : 10,
        SQUIGGLY       : 11,
        STRIKEOUT      : 12,
        STAMP          : 13,
        CARET          : 14,
        INK            : 15,
        POPUP          : 16,
        FILEATTACHMENT : 17,
        SOUND          : 18,
        MOVIE          : 19,
        WIDGET         : 20,
        SCREEN         : 21,
        PRINTERMARK    : 22,
        TRAPNET        : 23,
        WATERMARK      : 24,
        THREED         : 25,
        REDACT         : 26
    };
    var AnnotationFlag = {
        INVISIBLE      : 0x01,
        HIDDEN         : 0x02,
        PRINT          : 0x04,
        NOZOOM         : 0x08,
        NOROTATE       : 0x10,
        NOVIEW         : 0x20,
        READONLY       : 0x40,
        LOCKED         : 0x80,
        TOGGLENOVIEW   : 0x100,
        LOCKEDCONTENTS : 0x200
    };
    var AnnotationBorderStyleType = {SOLID : 1, DASHED : 2, BEVELED : 3, INSET : 4, UNDERLINE : 5};
    var StreamType = {UNKNOWN : 0, FLATE : 1, LZW : 2, DCT : 3, JPX : 4, JBIG : 5, A85 : 6, AHX : 7, CCF : 8, RL : 9};
    var FontType = {
        UNKNOWN       : 0,
        TYPE1         : 1,
        TYPE1C        : 2,
        CIDFONTTYPE0  : 3,
        CIDFONTTYPE0C : 4,
        TRUETYPE      : 5,
        CIDFONTTYPE2  : 6,
        TYPE3         : 7,
        OPENTYPE      : 8,
        TYPE0         : 9,
        MMTYPE1       : 10
    };
    var VERBOSITY_LEVELS = {errors : 0, warnings : 1, infos : 5};
    var OPS = {
        dependency                   : 1,
        setLineWidth                 : 2,
        setLineCap                   : 3,
        setLineJoin                  : 4,
        setMiterLimit                : 5,
        setDash                      : 6,
        setRenderingIntent           : 7,
        setFlatness                  : 8,
        setGState                    : 9,
        save                         : 10,
        restore                      : 11,
        transform                    : 12,
        moveTo                       : 13,
        lineTo                       : 14,
        curveTo                      : 15,
        curveTo2                     : 16,
        curveTo3                     : 17,
        closePath                    : 18,
        rectangle                    : 19,
        stroke                       : 20,
        closeStroke                  : 21,
        fill                         : 22,
        eoFill                       : 23,
        fillStroke                   : 24,
        eoFillStroke                 : 25,
        closeFillStroke              : 26,
        closeEOFillStroke            : 27,
        endPath                      : 28,
        clip                         : 29,
        eoClip                       : 30,
        beginText                    : 31,
        endText                      : 32,
        setCharSpacing               : 33,
        setWordSpacing               : 34,
        setHScale                    : 35,
        setLeading                   : 36,
        setFont                      : 37,
        setTextRenderingMode         : 38,
        setTextRise                  : 39,
        moveText                     : 40,
        setLeadingMoveText           : 41,
        setTextMatrix                : 42,
        nextLine                     : 43,
        showText                     : 44,
        showSpacedText               : 45,
        nextLineShowText             : 46,
        nextLineSetSpacingShowText   : 47,
        setCharWidth                 : 48,
        setCharWidthAndBounds        : 49,
        setStrokeColorSpace          : 50,
        setFillColorSpace            : 51,
        setStrokeColor               : 52,
        setStrokeColorN              : 53,
        setFillColor                 : 54,
        setFillColorN                : 55,
        setStrokeGray                : 56,
        setFillGray                  : 57,
        setStrokeRGBColor            : 58,
        setFillRGBColor              : 59,
        setStrokeCMYKColor           : 60,
        setFillCMYKColor             : 61,
        shadingFill                  : 62,
        beginInlineImage             : 63,
        beginImageData               : 64,
        endInlineImage               : 65,
        paintXObject                 : 66,
        markPoint                    : 67,
        markPointProps               : 68,
        beginMarkedContent           : 69,
        beginMarkedContentProps      : 70,
        endMarkedContent             : 71,
        beginCompat                  : 72,
        endCompat                    : 73,
        paintFormXObjectBegin        : 74,
        paintFormXObjectEnd          : 75,
        beginGroup                   : 76,
        endGroup                     : 77,
        beginAnnotations             : 78,
        endAnnotations               : 79,
        beginAnnotation              : 80,
        endAnnotation                : 81,
        paintJpegXObject             : 82,
        paintImageMaskXObject        : 83,
        paintImageMaskXObjectGroup   : 84,
        paintImageXObject            : 85,
        paintInlineImageXObject      : 86,
        paintInlineImageXObjectGroup : 87,
        paintImageXObjectRepeat      : 88,
        paintImageMaskXObjectRepeat  : 89,
        paintSolidColorImageMask     : 90,
        constructPath                : 91
    };
    var verbosity = VERBOSITY_LEVELS.warnings;

    function setVerbosityLevel(level) {
        verbosity = level;
    }

    function getVerbosityLevel() {
        return verbosity;
    }

    function info(msg) {
        if (verbosity >= VERBOSITY_LEVELS.infos) {
        }
    }

    function warn(msg) {
        if (verbosity >= VERBOSITY_LEVELS.warnings) {
        }
    }

    function deprecated(details) {
    }

    function error(msg) {
        if (verbosity >= VERBOSITY_LEVELS.errors) {
        }
        throw new Error(msg);
    }

    function backtrace() {
        try {
            throw new Error();
        } catch (e) {
            return e.stack ? e.stack.split('\n').slice(2).join('\n') : '';
        }
    }

    function assert(cond, msg) {
        if (!cond) {
            error(msg);
        }
    }

    var UNSUPPORTED_FEATURES = {
        unknown        : 'unknown',
        forms          : 'forms',
        javaScript     : 'javaScript',
        smask          : 'smask',
        shadingPattern : 'shadingPattern',
        font           : 'font'
    };

    function isSameOrigin(baseUrl, otherUrl) {
        try {
            var base = new URL(baseUrl);
            if (!base.origin || base.origin === 'null') {
                return false;
            }
        } catch (e) {
            return false;
        }
        var other = new URL(otherUrl, base);
        return base.origin === other.origin;
    }

    function isValidUrl(url, allowRelative) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        var protocol = /^[a-z][a-z0-9+\-.]*(?=:)/i.exec(url);
        if (!protocol) {
            return allowRelative;
        }
        protocol = protocol[0].toLowerCase();
        switch (protocol) {
            case 'http':
            case 'https':
            case 'ftp':
            case 'mailto':
            case 'tel':
                return true;
            default:
                return false;
        }
    }

    function shadow(obj, prop, value) {
        Object.defineProperty(obj, prop, {value : value, enumerable : true, configurable : true, writable : false});
        return value;
    }

    function getLookupTableFactory(initializer) {
        var lookup;
        return function() {
            if (initializer) {
                lookup = Object.create(null);
                initializer(lookup);
                initializer = null;
            }
            return lookup;
        };
    }

    var PasswordResponses = {NEED_PASSWORD : 1, INCORRECT_PASSWORD : 2};
    var PasswordException = (function PasswordExceptionClosure() {
        function PasswordException(msg, code) {
            this.name = 'PasswordException';
            this.message = msg;
            this.code = code;
        }

        PasswordException.prototype = new Error();
        PasswordException.constructor = PasswordException;
        return PasswordException;
    })();
    var UnknownErrorException = (function UnknownErrorExceptionClosure() {
        function UnknownErrorException(msg, details) {
            this.name = 'UnknownErrorException';
            this.message = msg;
            this.details = details;
        }

        UnknownErrorException.prototype = new Error();
        UnknownErrorException.constructor = UnknownErrorException;
        return UnknownErrorException;
    })();
    var InvalidPDFException = (function InvalidPDFExceptionClosure() {
        function InvalidPDFException(msg) {
            this.name = 'InvalidPDFException';
            this.message = msg;
        }

        InvalidPDFException.prototype = new Error();
        InvalidPDFException.constructor = InvalidPDFException;
        return InvalidPDFException;
    })();
    var MissingPDFException = (function MissingPDFExceptionClosure() {
        function MissingPDFException(msg) {
            this.name = 'MissingPDFException';
            this.message = msg;
        }

        MissingPDFException.prototype = new Error();
        MissingPDFException.constructor = MissingPDFException;
        return MissingPDFException;
    })();
    var UnexpectedResponseException = (function UnexpectedResponseExceptionClosure() {
        function UnexpectedResponseException(msg, status) {
            this.name = 'UnexpectedResponseException';
            this.message = msg;
            this.status = status;
        }

        UnexpectedResponseException.prototype = new Error();
        UnexpectedResponseException.constructor = UnexpectedResponseException;
        return UnexpectedResponseException;
    })();
    var NotImplementedException = (function NotImplementedExceptionClosure() {
        function NotImplementedException(msg) {
            this.message = msg;
        }

        NotImplementedException.prototype = new Error();
        NotImplementedException.prototype.name = 'NotImplementedException';
        NotImplementedException.constructor = NotImplementedException;
        return NotImplementedException;
    })();
    var MissingDataException = (function MissingDataExceptionClosure() {
        function MissingDataException(begin, end) {
            this.begin = begin;
            this.end = end;
            this.message = 'Missing data [' + begin + ', ' + end + ')';
        }

        MissingDataException.prototype = new Error();
        MissingDataException.prototype.name = 'MissingDataException';
        MissingDataException.constructor = MissingDataException;
        return MissingDataException;
    })();
    var XRefParseException = (function XRefParseExceptionClosure() {
        function XRefParseException(msg) {
            this.message = msg;
        }

        XRefParseException.prototype = new Error();
        XRefParseException.prototype.name = 'XRefParseException';
        XRefParseException.constructor = XRefParseException;
        return XRefParseException;
    })();
    var NullCharactersRegExp = /\x00/g;

    function removeNullCharacters(str) {
        if (typeof str !== 'string') {
            warn('The argument for removeNullCharacters must be a string.');
            return str;
        }
        return str.replace(NullCharactersRegExp, '');
    }

    function bytesToString(bytes) {
        assert(bytes !== null && typeof bytes === 'object' && bytes.length !== undefined, 'Invalid argument for bytesToString');
        var length = bytes.length;
        var MAX_ARGUMENT_COUNT = 8192;
        if (length < MAX_ARGUMENT_COUNT) {
            return String.fromCharCode.apply(null, bytes);
        }
        var strBuf = [];
        for (var i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
            var chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
            var chunk = bytes.subarray(i, chunkEnd);
            strBuf.push(String.fromCharCode.apply(null, chunk));
        }
        return strBuf.join('');
    }

    function stringToBytes(str) {
        assert(typeof str === 'string', 'Invalid argument for stringToBytes');
        var length = str.length;
        var bytes = new Uint8Array(length);
        for (var i = 0; i < length; ++i) {
            bytes[i] = str.charCodeAt(i) & 0xFF;
        }
        return bytes;
    }

    function arrayByteLength(arr) {
        if (arr.length !== undefined) {
            return arr.length;
        }
        assert(arr.byteLength !== undefined);
        return arr.byteLength;
    }

    function arraysToBytes(arr) {
        if (arr.length === 1 && (arr[0] instanceof Uint8Array)) {
            return arr[0];
        }
        var resultLength = 0;
        var i, ii = arr.length;
        var item, itemLength;
        for (i = 0; i < ii; i++) {
            item = arr[i];
            itemLength = arrayByteLength(item);
            resultLength += itemLength;
        }
        var pos = 0;
        var data = new Uint8Array(resultLength);
        for (i = 0; i < ii; i++) {
            item = arr[i];
            if (!(item instanceof Uint8Array)) {
                if (typeof item === 'string') {
                    item = stringToBytes(item);
                } else {
                    item = new Uint8Array(item);
                }
            }
            itemLength = item.byteLength;
            data.set(item, pos);
            pos += itemLength;
        }
        return data;
    }

    function string32(value) {
        return String.fromCharCode((value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff);
    }

    function log2(x) {
        var n = 1, i = 0;
        while (x > n) {
            n <<= 1;
            i++;
        }
        return i;
    }

    function readInt8(data, start) {
        return (data[start] << 24) >> 24;
    }

    function readUint16(data, offset) {
        return (data[offset] << 8) | data[offset + 1];
    }

    function readUint32(data, offset) {
        return ((data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
    }

    function isLittleEndian() {
        var buffer8 = new Uint8Array(2);
        buffer8[0] = 1;
        var buffer16 = new Uint16Array(buffer8.buffer);
        return (buffer16[0] === 1);
    }

    function isEvalSupported() {
        try {
            new Function('');
            return true;
        } catch (e) {
            return false;
        }
    }

    var Uint32ArrayView = (function Uint32ArrayViewClosure() {
        function Uint32ArrayView(buffer, length) {
            this.buffer = buffer;
            this.byteLength = buffer.length;
            this.length = length === undefined ? (this.byteLength >> 2) : length;
            ensureUint32ArrayViewProps(this.length);
        }

        Uint32ArrayView.prototype = Object.create(null);
        var uint32ArrayViewSetters = 0;

        function createUint32ArrayProp(index) {
            return {
                get    : function() {
                    var buffer = this.buffer, offset = index << 2;
                    return (buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24)) >>> 0;
                }, set : function(value) {
                    var buffer = this.buffer, offset = index << 2;
                    buffer[offset] = value & 255;
                    buffer[offset + 1] = (value >> 8) & 255;
                    buffer[offset + 2] = (value >> 16) & 255;
                    buffer[offset + 3] = (value >>> 24) & 255;
                }
            };
        }

        function ensureUint32ArrayViewProps(length) {
            while (uint32ArrayViewSetters < length) {
                Object.defineProperty(Uint32ArrayView.prototype, uint32ArrayViewSetters, createUint32ArrayProp(uint32ArrayViewSetters));
                uint32ArrayViewSetters++;
            }
        }

        return Uint32ArrayView;
    })();
    exports.Uint32ArrayView = Uint32ArrayView;
    var IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];
    var Util = (function UtilClosure() {
        function Util() {
        }

        var rgbBuf = ['rgb(', 0, ',', 0, ',', 0, ')'];
        Util.makeCssRgb = function Util_makeCssRgb(r, g, b) {
            rgbBuf[1] = r;
            rgbBuf[3] = g;
            rgbBuf[5] = b;
            return rgbBuf.join('');
        };
        Util.transform = function Util_transform(m1, m2) {
            return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
        };
        Util.applyTransform = function Util_applyTransform(p, m) {
            var xt = p[0] * m[0] + p[1] * m[2] + m[4];
            var yt = p[0] * m[1] + p[1] * m[3] + m[5];
            return [xt, yt];
        };
        Util.applyInverseTransform = function Util_applyInverseTransform(p, m) {
            var d = m[0] * m[3] - m[1] * m[2];
            var xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
            var yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
            return [xt, yt];
        };
        Util.getAxialAlignedBoundingBox = function Util_getAxialAlignedBoundingBox(r, m) {
            var p1 = Util.applyTransform(r, m);
            var p2 = Util.applyTransform(r.slice(2, 4), m);
            var p3 = Util.applyTransform([r[0], r[3]], m);
            var p4 = Util.applyTransform([r[2], r[1]], m);
            return [Math.min(p1[0], p2[0], p3[0], p4[0]), Math.min(p1[1], p2[1], p3[1], p4[1]), Math.max(p1[0], p2[0], p3[0], p4[0]), Math.max(p1[1], p2[1], p3[1], p4[1])];
        };
        Util.inverseTransform = function Util_inverseTransform(m) {
            var d = m[0] * m[3] - m[1] * m[2];
            return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[4] * m[3]) / d, (m[4] * m[1] - m[5] * m[0]) / d];
        };
        Util.apply3dTransform = function Util_apply3dTransform(m, v) {
            return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
        };
        Util.singularValueDecompose2dScale = function Util_singularValueDecompose2dScale(m) {
            var transpose = [m[0], m[2], m[1], m[3]];
            var a = m[0] * transpose[0] + m[1] * transpose[2];
            var b = m[0] * transpose[1] + m[1] * transpose[3];
            var c = m[2] * transpose[0] + m[3] * transpose[2];
            var d = m[2] * transpose[1] + m[3] * transpose[3];
            var first = (a + d) / 2;
            var second = Math.sqrt((a + d) * (a + d) - 4 * (a * d - c * b)) / 2;
            var sx = first + second || 1;
            var sy = first - second || 1;
            return [Math.sqrt(sx), Math.sqrt(sy)];
        };
        Util.normalizeRect = function Util_normalizeRect(rect) {
            var r = rect.slice(0);
            if (rect[0] > rect[2]) {
                r[0] = rect[2];
                r[2] = rect[0];
            }
            if (rect[1] > rect[3]) {
                r[1] = rect[3];
                r[3] = rect[1];
            }
            return r;
        };
        Util.intersect = function Util_intersect(rect1, rect2) {
            function compare(a, b) {
                return a - b;
            }

            var orderedX = [rect1[0], rect1[2], rect2[0], rect2[2]].sort(compare),
                orderedY = [rect1[1], rect1[3], rect2[1], rect2[3]].sort(compare), result = [];
            rect1 = Util.normalizeRect(rect1);
            rect2 = Util.normalizeRect(rect2);
            if ((orderedX[0] === rect1[0] && orderedX[1] === rect2[0]) || (orderedX[0] === rect2[0] && orderedX[1] === rect1[0])) {
                result[0] = orderedX[1];
                result[2] = orderedX[2];
            } else {
                return false;
            }
            if ((orderedY[0] === rect1[1] && orderedY[1] === rect2[1]) || (orderedY[0] === rect2[1] && orderedY[1] === rect1[1])) {
                result[1] = orderedY[1];
                result[3] = orderedY[2];
            } else {
                return false;
            }
            return result;
        };
        Util.sign = function Util_sign(num) {
            return num < 0 ? -1 : 1;
        };
        var ROMAN_NUMBER_MAP = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
        Util.toRoman = function Util_toRoman(number, lowerCase) {
            assert(isInt(number) && number > 0, 'The number should be a positive integer.');
            var pos, romanBuf = [];
            while (number >= 1000) {
                number -= 1000;
                romanBuf.push('M');
            }
            pos = (number / 100) | 0;
            number %= 100;
            romanBuf.push(ROMAN_NUMBER_MAP[pos]);
            pos = (number / 10) | 0;
            number %= 10;
            romanBuf.push(ROMAN_NUMBER_MAP[10 + pos]);
            romanBuf.push(ROMAN_NUMBER_MAP[20 + number]);
            var romanStr = romanBuf.join('');
            return (lowerCase ? romanStr.toLowerCase() : romanStr);
        };
        Util.appendToArray = function Util_appendToArray(arr1, arr2) {
            Array.prototype.push.apply(arr1, arr2);
        };
        Util.prependToArray = function Util_prependToArray(arr1, arr2) {
            Array.prototype.unshift.apply(arr1, arr2);
        };
        Util.extendObj = function extendObj(obj1, obj2) {
            for (var key in obj2) {
                obj1[key] = obj2[key];
            }
        };
        Util.getInheritableProperty = function Util_getInheritableProperty(dict, name) {
            while (dict && !dict.has(name)) {
                dict = dict.get('Parent');
            }
            if (!dict) {
                return null;
            }
            return dict.get(name);
        };
        Util.inherit = function Util_inherit(sub, base, prototype) {
            sub.prototype = Object.create(base.prototype);
            sub.prototype.constructor = sub;
            for (var prop in prototype) {
                sub.prototype[prop] = prototype[prop];
            }
        };
        Util.loadScript = function Util_loadScript(src, callback) {
            var script = document.createElement('script');
            var loaded = false;
            script.setAttribute('src', src);
            if (callback) {
                script.onload = function() {
                    if (!loaded) {
                        callback();
                    }
                    loaded = true;
                };
            }
            document.getElementsByTagName('head')[0].appendChild(script);
        };
        return Util;
    })();
    var PageViewport = (function PageViewportClosure() {
        function PageViewport(viewBox, scale, rotation, offsetX, offsetY, dontFlip) {
            this.viewBox = viewBox;
            this.scale = scale;
            this.rotation = rotation;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            var centerX = (viewBox[2] + viewBox[0]) / 2;
            var centerY = (viewBox[3] + viewBox[1]) / 2;
            var rotateA, rotateB, rotateC, rotateD;
            rotation = rotation % 360;
            rotation = rotation < 0 ? rotation + 360 : rotation;
            switch (rotation) {
                case 180:
                    rotateA = -1;
                    rotateB = 0;
                    rotateC = 0;
                    rotateD = 1;
                    break;
                case 90:
                    rotateA = 0;
                    rotateB = 1;
                    rotateC = 1;
                    rotateD = 0;
                    break;
                case 270:
                    rotateA = 0;
                    rotateB = -1;
                    rotateC = -1;
                    rotateD = 0;
                    break;
                default:
                    rotateA = 1;
                    rotateB = 0;
                    rotateC = 0;
                    rotateD = -1;
                    break;
            }
            if (dontFlip) {
                rotateC = -rotateC;
                rotateD = -rotateD;
            }
            var offsetCanvasX, offsetCanvasY;
            var width, height;
            if (rotateA === 0) {
                offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
                offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
                width = Math.abs(viewBox[3] - viewBox[1]) * scale;
                height = Math.abs(viewBox[2] - viewBox[0]) * scale;
            } else {
                offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
                offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
                width = Math.abs(viewBox[2] - viewBox[0]) * scale;
                height = Math.abs(viewBox[3] - viewBox[1]) * scale;
            }
            this.transform = [rotateA * scale, rotateB * scale, rotateC * scale, rotateD * scale, offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY, offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY];
            this.width = width;
            this.height = height;
            this.fontScale = scale;
        }

        PageViewport.prototype = {
            clone                         : function PageViewPort_clone(args) {
                args = args || {};
                var scale = 'scale' in args ? args.scale : this.scale;
                var rotation = 'rotation' in args ? args.rotation : this.rotation;
                return new PageViewport(this.viewBox.slice(), scale, rotation, this.offsetX, this.offsetY, args.dontFlip);
            }, convertToViewportPoint     : function PageViewport_convertToViewportPoint(x, y) {
                return Util.applyTransform([x, y], this.transform);
            }, convertToViewportRectangle : function PageViewport_convertToViewportRectangle(rect) {
                var tl = Util.applyTransform([rect[0], rect[1]], this.transform);
                var br = Util.applyTransform([rect[2], rect[3]], this.transform);
                return [tl[0], tl[1], br[0], br[1]];
            }, convertToPdfPoint          : function PageViewport_convertToPdfPoint(x, y) {
                return Util.applyInverseTransform([x, y], this.transform);
            }
        };
        return PageViewport;
    })();
    var PDFStringTranslateTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2D8, 0x2C7, 0x2C6, 0x2D9, 0x2DD, 0x2DB, 0x2DA, 0x2DC, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2022, 0x2020, 0x2021, 0x2026, 0x2014, 0x2013, 0x192, 0x2044, 0x2039, 0x203A, 0x2212, 0x2030, 0x201E, 0x201C, 0x201D, 0x2018, 0x2019, 0x201A, 0x2122, 0xFB01, 0xFB02, 0x141, 0x152, 0x160, 0x178, 0x17D, 0x131, 0x142, 0x153, 0x161, 0x17E, 0, 0x20AC];

    function stringToPDFString(str) {
        var i, n = str.length, strBuf = [];
        if (str[0] === '\xFE' && str[1] === '\xFF') {
            for (i = 2; i < n; i += 2) {
                strBuf.push(String.fromCharCode((str.charCodeAt(i) << 8) | str.charCodeAt(i + 1)));
            }
        } else {
            for (i = 0; i < n; ++i) {
                var code = PDFStringTranslateTable[str.charCodeAt(i)];
                strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
            }
        }
        return strBuf.join('');
    }

    function stringToUTF8String(str) {
        return decodeURIComponent(escape(str));
    }

    function utf8StringToString(str) {
        return unescape(encodeURIComponent(str));
    }

    function isEmptyObj(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    function isBool(v) {
        return typeof v === 'boolean';
    }

    function isInt(v) {
        return typeof v === 'number' && ((v | 0) === v);
    }

    function isNum(v) {
        return typeof v === 'number';
    }

    function isString(v) {
        return typeof v === 'string';
    }

    function isArray(v) {
        return v instanceof Array;
    }

    function isArrayBuffer(v) {
        return typeof v === 'object' && v !== null && v.byteLength !== undefined;
    }

    function createPromiseCapability() {
        var capability = {};
        capability.promise = new Promise(function(resolve, reject) {
            capability.resolve = resolve;
            capability.reject = reject;
        });
        return capability;
    }

    (function PromiseClosure() {
        if (globalScope.Promise) {
            if (typeof globalScope.Promise.all !== 'function') {
                globalScope.Promise.all = function(iterable) {
                    var count = 0, results = [], resolve, reject;
                    var promise = new globalScope.Promise(function(resolve_, reject_) {
                        resolve = resolve_;
                        reject = reject_;
                    });
                    iterable.forEach(function(p, i) {
                        count++;
                        p.then(function(result) {
                            results[i] = result;
                            count--;
                            if (count === 0) {
                                resolve(results);
                            }
                        }, reject);
                    });
                    if (count === 0) {
                        resolve(results);
                    }
                    return promise;
                };
            }
            if (typeof globalScope.Promise.resolve !== 'function') {
                globalScope.Promise.resolve = function(value) {
                    return new globalScope.Promise(function(resolve) {
                        resolve(value);
                    });
                };
            }
            if (typeof globalScope.Promise.reject !== 'function') {
                globalScope.Promise.reject = function(reason) {
                    return new globalScope.Promise(function(resolve, reject) {
                        reject(reason);
                    });
                };
            }
            if (typeof globalScope.Promise.prototype.catch !== 'function') {
                globalScope.Promise.prototype.catch = function(onReject) {
                    return globalScope.Promise.prototype.then(undefined, onReject);
                };
            }
            return;
        }
        var STATUS_PENDING = 0;
        var STATUS_RESOLVED = 1;
        var STATUS_REJECTED = 2;
        var REJECTION_TIMEOUT = 500;
        var HandlerManager = {
            handlers                  : [],
            running                   : false,
            unhandledRejections       : [],
            pendingRejectionCheck     : false,
            scheduleHandlers          : function scheduleHandlers(promise) {
                if (promise._status === STATUS_PENDING) {
                    return;
                }
                this.handlers = this.handlers.concat(promise._handlers);
                promise._handlers = [];
                if (this.running) {
                    return;
                }
                this.running = true;
                setTimeout(this.runHandlers.bind(this), 0);
            },
            runHandlers               : function runHandlers() {
                var RUN_TIMEOUT = 1;
                var timeoutAt = Date.now() + RUN_TIMEOUT;
                while (this.handlers.length > 0) {
                    var handler = this.handlers.shift();
                    var nextStatus = handler.thisPromise._status;
                    var nextValue = handler.thisPromise._value;
                    try {
                        if (nextStatus === STATUS_RESOLVED) {
                            if (typeof handler.onResolve === 'function') {
                                nextValue = handler.onResolve(nextValue);
                            }
                        } else if (typeof handler.onReject === 'function') {
                            nextValue = handler.onReject(nextValue);
                            nextStatus = STATUS_RESOLVED;
                            if (handler.thisPromise._unhandledRejection) {
                                this.removeUnhandeledRejection(handler.thisPromise);
                            }
                        }
                    } catch (ex) {
                        nextStatus = STATUS_REJECTED;
                        nextValue = ex;
                    }
                    handler.nextPromise._updateStatus(nextStatus, nextValue);
                    if (Date.now() >= timeoutAt) {
                        break;
                    }
                }
                if (this.handlers.length > 0) {
                    setTimeout(this.runHandlers.bind(this), 0);
                    return;
                }
                this.running = false;
            },
            addUnhandledRejection     : function addUnhandledRejection(promise) {
                this.unhandledRejections.push({promise : promise, time : Date.now()});
                this.scheduleRejectionCheck();
            },
            removeUnhandeledRejection : function removeUnhandeledRejection(promise) {
                promise._unhandledRejection = false;
                for (var i = 0; i < this.unhandledRejections.length; i++) {
                    if (this.unhandledRejections[i].promise === promise) {
                        this.unhandledRejections.splice(i);
                        i--;
                    }
                }
            },
            scheduleRejectionCheck    : function scheduleRejectionCheck() {
                if (this.pendingRejectionCheck) {
                    return;
                }
                this.pendingRejectionCheck = true;
                setTimeout(function rejectionCheck() {
                    this.pendingRejectionCheck = false;
                    var now = Date.now();
                    for (var i = 0; i < this.unhandledRejections.length; i++) {
                        if (now - this.unhandledRejections[i].time > REJECTION_TIMEOUT) {
                            var unhandled = this.unhandledRejections[i].promise._value;
                            var msg = 'Unhandled rejection: ' + unhandled;
                            if (unhandled.stack) {
                                msg += '\n' + unhandled.stack;
                            }
                            warn(msg);
                            this.unhandledRejections.splice(i);
                            i--;
                        }
                    }
                    if (this.unhandledRejections.length) {
                        this.scheduleRejectionCheck();
                    }
                }.bind(this), REJECTION_TIMEOUT);
            }
        };

        function Promise(resolver) {
            this._status = STATUS_PENDING;
            this._handlers = [];
            try {
                resolver.call(this, this._resolve.bind(this), this._reject.bind(this));
            } catch (e) {
                this._reject(e);
            }
        }

        Promise.all = function Promise_all(promises) {
            var resolveAll, rejectAll;
            var deferred = new Promise(function(resolve, reject) {
                resolveAll = resolve;
                rejectAll = reject;
            });
            var unresolved = promises.length;
            var results = [];
            if (unresolved === 0) {
                resolveAll(results);
                return deferred;
            }

            function reject(reason) {
                if (deferred._status === STATUS_REJECTED) {
                    return;
                }
                results = [];
                rejectAll(reason);
            }

            for (var i = 0, ii = promises.length; i < ii; ++i) {
                var promise = promises[i];
                var resolve = (function(i) {
                    return function(value) {
                        if (deferred._status === STATUS_REJECTED) {
                            return;
                        }
                        results[i] = value;
                        unresolved--;
                        if (unresolved === 0) {
                            resolveAll(results);
                        }
                    };
                })(i);
                if (Promise.isPromise(promise)) {
                    promise.then(resolve, reject);
                } else {
                    resolve(promise);
                }
            }
            return deferred;
        };
        Promise.isPromise = function Promise_isPromise(value) {
            return value && typeof value.then === 'function';
        };
        Promise.resolve = function Promise_resolve(value) {
            return new Promise(function(resolve) {
                resolve(value);
            });
        };
        Promise.reject = function Promise_reject(reason) {
            return new Promise(function(resolve, reject) {
                reject(reason);
            });
        };
        Promise.prototype = {
            _status             : null,
            _value              : null,
            _handlers           : null,
            _unhandledRejection : null,
            _updateStatus       : function Promise__updateStatus(status, value) {
                if (this._status === STATUS_RESOLVED || this._status === STATUS_REJECTED) {
                    return;
                }
                if (status === STATUS_RESOLVED && Promise.isPromise(value)) {
                    value.then(this._updateStatus.bind(this, STATUS_RESOLVED), this._updateStatus.bind(this, STATUS_REJECTED));
                    return;
                }
                this._status = status;
                this._value = value;
                if (status === STATUS_REJECTED && this._handlers.length === 0) {
                    this._unhandledRejection = true;
                    HandlerManager.addUnhandledRejection(this);
                }
                HandlerManager.scheduleHandlers(this);
            },
            _resolve            : function Promise_resolve(value) {
                this._updateStatus(STATUS_RESOLVED, value);
            },
            _reject             : function Promise_reject(reason) {
                this._updateStatus(STATUS_REJECTED, reason);
            },
            then                : function Promise_then(onResolve, onReject) {
                var nextPromise = new Promise(function(resolve, reject) {
                    this.resolve = resolve;
                    this.reject = reject;
                });
                this._handlers.push({
                    thisPromise : this,
                    onResolve   : onResolve,
                    onReject    : onReject,
                    nextPromise : nextPromise
                });
                HandlerManager.scheduleHandlers(this);
                return nextPromise;
            },
            catch               : function Promise_catch(onReject) {
                return this.then(undefined, onReject);
            }
        };
        globalScope.Promise = Promise;
    })();
    var StatTimer = (function StatTimerClosure() {
        function rpad(str, pad, length) {
            while (str.length < length) {
                str += pad;
            }
            return str;
        }

        function StatTimer() {
            this.started = Object.create(null);
            this.times = [];
            this.enabled = true;
        }

        StatTimer.prototype = {
            time        : function StatTimer_time(name) {
                if (!this.enabled) {
                    return;
                }
                if (name in this.started) {
                    warn('Timer is already running for ' + name);
                }
                this.started[name] = Date.now();
            }, timeEnd  : function StatTimer_timeEnd(name) {
                if (!this.enabled) {
                    return;
                }
                if (!(name in this.started)) {
                    warn('Timer has not been started for ' + name);
                }
                this.times.push({'name' : name, 'start' : this.started[name], 'end' : Date.now()});
                delete this.started[name];
            }, toString : function StatTimer_toString() {
                var i, ii;
                var times = this.times;
                var out = '';
                var longest = 0;
                for (i = 0, ii = times.length; i < ii; ++i) {
                    var name = times[i]['name'];
                    if (name.length > longest) {
                        longest = name.length;
                    }
                }
                for (i = 0, ii = times.length; i < ii; ++i) {
                    var span = times[i];
                    var duration = span.end - span.start;
                    out += rpad(span['name'], ' ', longest) + ' ' + duration + 'ms\n';
                }
                return out;
            }
        };
        return StatTimer;
    })();
    var createBlob = function createBlob(data, contentType) {
        if (typeof Blob !== 'undefined') {
            return new Blob([data], {type : contentType});
        }
        var bb = new MozBlobBuilder();
        bb.append(data);
        return bb.getBlob(contentType);
    };
    var createObjectURL = (function createObjectURLClosure() {
        var digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        return function createObjectURL(data, contentType, forceDataSchema) {
            if (!forceDataSchema && typeof URL !== 'undefined' && URL.createObjectURL) {
                var blob = createBlob(data, contentType);
                return URL.createObjectURL(blob);
            }
            var buffer = 'data:' + contentType + ';base64,';
            for (var i = 0, ii = data.length; i < ii; i += 3) {
                var b1 = data[i] & 0xFF;
                var b2 = data[i + 1] & 0xFF;
                var b3 = data[i + 2] & 0xFF;
                var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
                var d3 = i + 1 < ii ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
                var d4 = i + 2 < ii ? (b3 & 0x3F) : 64;
                buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
            }
            return buffer;
        };
    })();

    function MessageHandler(sourceName, targetName, comObj) {
        this.sourceName = sourceName;
        this.targetName = targetName;
        this.comObj = comObj;
        this.callbackIndex = 1;
        this.postMessageTransfers = true;
        var callbacksCapabilities = this.callbacksCapabilities = Object.create(null);
        var ah = this.actionHandler = Object.create(null);
        this._onComObjOnMessage = function messageHandlerComObjOnMessage(event) {
            var data = event.data;
            if (data.targetName !== this.sourceName) {
                return;
            }
            if (data.isReply) {
                var callbackId = data.callbackId;
                if (data.callbackId in callbacksCapabilities) {
                    var callback = callbacksCapabilities[callbackId];
                    delete callbacksCapabilities[callbackId];
                    if ('error' in data) {
                        callback.reject(data.error);
                    } else {
                        callback.resolve(data.data);
                    }
                } else {
                    error('Cannot resolve callback ' + callbackId);
                }
            } else if (data.action in ah) {
                var action = ah[data.action];
                if (data.callbackId) {
                    var sourceName = this.sourceName;
                    var targetName = data.sourceName;
                    Promise.resolve().then(function() {
                        return action[0].call(action[1], data.data);
                    }).then(function(result) {
                        comObj.postMessage({
                            sourceName : sourceName,
                            targetName : targetName,
                            isReply    : true,
                            callbackId : data.callbackId,
                            data       : result
                        });
                    }, function(reason) {
                        if (reason instanceof Error) {
                            reason = reason + '';
                        }
                        comObj.postMessage({
                            sourceName : sourceName,
                            targetName : targetName,
                            isReply    : true,
                            callbackId : data.callbackId,
                            error      : reason
                        });
                    });
                } else {
                    action[0].call(action[1], data.data);
                }
            } else {
                error('Unknown action from worker: ' + data.action);
            }
        }.bind(this);
        comObj.addEventListener('message', this._onComObjOnMessage);
    }

    MessageHandler.prototype = {
        on                 : function messageHandlerOn(actionName, handler, scope) {
            var ah = this.actionHandler;
            if (ah[actionName]) {
                error('There is already an actionName called "' + actionName + '"');
            }
            ah[actionName] = [handler, scope];
        }, send            : function messageHandlerSend(actionName, data, transfers) {
            var message = {
                sourceName : this.sourceName,
                targetName : this.targetName,
                action     : actionName,
                data       : data
            };
            this.postMessage(message, transfers);
        }, sendWithPromise : function messageHandlerSendWithPromise(actionName, data, transfers) {
            var callbackId = this.callbackIndex++;
            var message = {
                sourceName : this.sourceName,
                targetName : this.targetName,
                action     : actionName,
                data       : data,
                callbackId : callbackId
            };
            var capability = createPromiseCapability();
            this.callbacksCapabilities[callbackId] = capability;
            try {
                this.postMessage(message, transfers);
            } catch (e) {
                capability.reject(e);
            }
            return capability.promise;
        }, postMessage     : function(message, transfers) {
            if (transfers && this.postMessageTransfers) {
                this.comObj.postMessage(message, transfers);
            } else {
                this.comObj.postMessage(message);
            }
        }, destroy         : function() {
            this.comObj.removeEventListener('message', this._onComObjOnMessage);
        }
    };

    function loadJpegStream(id, imageUrl, objs) {
        var img = new Image();
        img.onload = (function loadJpegStream_onloadClosure() {
            objs.resolve(id, img);
        });
        img.onerror = (function loadJpegStream_onerrorClosure() {
            objs.resolve(id, null);
            warn('Error during JPEG image loading');
        });
        img.src = imageUrl;
    }

    (function checkURLConstructor(scope) {
        var hasWorkingUrl = false;
        try {
            if (typeof URL === 'function' && typeof URL.prototype === 'object' && ('origin' in URL.prototype)) {
                var u = new URL('b', 'http://a');
                u.pathname = 'c%20d';
                hasWorkingUrl = u.href === 'http://a/c%20d';
            }
        } catch (e) {
        }
        if (hasWorkingUrl) ;
        return;
        var relative = Object.create(null);
        relative['ftp'] = 21;
        relative['file'] = 0;
        relative['gopher'] = 70;
        relative['http'] = 80;
        relative['https'] = 443;
        relative['ws'] = 80;
        relative['wss'] = 443;
        var relativePathDotMapping = Object.create(null);
        relativePathDotMapping['%2e'] = '.';
        relativePathDotMapping['.%2e'] = '..';
        relativePathDotMapping['%2e.'] = '..';
        relativePathDotMapping['%2e%2e'] = '..';

        function isRelativeScheme(scheme) {
            return relative[scheme] !== undefined;
        }

        function invalid() {
            clear.call(this);
            this._isInvalid = true;
        }

        function IDNAToASCII(h) {
            if ('' == h) {
                invalid.call(this)
            }
            return h.toLowerCase()
        }

        function percentEscape(c) {
            var unicode = c.charCodeAt(0);
            if (unicode > 0x20 && unicode < 0x7F && [0x22, 0x23, 0x3C, 0x3E, 0x3F, 0x60].indexOf(unicode) == -1) {
                return c;
            }
            return encodeURIComponent(c);
        }

        function percentEscapeQuery(c) {
            var unicode = c.charCodeAt(0);
            if (unicode > 0x20 && unicode < 0x7F && [0x22, 0x23, 0x3C, 0x3E, 0x60].indexOf(unicode) == -1) {
                return c;
            }
            return encodeURIComponent(c);
        }

        var EOF = undefined, ALPHA = /[a-zA-Z]/, ALPHANUMERIC = /[a-zA-Z0-9\+\-\.]/;

        function parse(input, stateOverride, base) {
            function err(message) {
                errors.push(message)
            }

            var state = stateOverride || 'scheme start', cursor = 0, buffer = '', seenAt = false, seenBracket = false,
                errors = [];
            loop: while ((input[cursor - 1] != EOF || cursor == 0) && !this._isInvalid) {
                var c = input[cursor];
                switch (state) {
                    case 'scheme start':
                        if (c && ALPHA.test(c)) {
                            buffer += c.toLowerCase();
                            state = 'scheme';
                        } else if (!stateOverride) {
                            buffer = '';
                            state = 'no scheme';
                            continue;
                        } else {
                            err('Invalid scheme.');
                            break loop;
                        }
                        break;
                    case 'scheme':
                        if (c && ALPHANUMERIC.test(c)) {
                            buffer += c.toLowerCase();
                        } else if (':' == c) {
                            this._scheme = buffer;
                            buffer = '';
                            if (stateOverride) {
                                break loop;
                            }
                            if (isRelativeScheme(this._scheme)) {
                                this._isRelative = true;
                            }
                            if ('file' == this._scheme) {
                                state = 'relative';
                            } else if (this._isRelative && base && base._scheme == this._scheme) {
                                state = 'relative or authority';
                            } else if (this._isRelative) {
                                state = 'authority first slash';
                            } else {
                                state = 'scheme data';
                            }
                        } else if (!stateOverride) {
                            buffer = '';
                            cursor = 0;
                            state = 'no scheme';
                            continue;
                        } else if (EOF == c) {
                            break loop;
                        } else {
                            err('Code point not allowed in scheme: ' + c);
                            break loop;
                        }
                        break;
                    case 'scheme data':
                        if ('?' == c) {
                            this._query = '?';
                            state = 'query';
                        } else if ('#' == c) {
                            this._fragment = '#';
                            state = 'fragment';
                        } else {
                            if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
                                this._schemeData += percentEscape(c);
                            }
                        }
                        break;
                    case 'no scheme':
                        if (!base || !(isRelativeScheme(base._scheme))) {
                            err('Missing scheme.');
                            invalid.call(this);
                        } else {
                            state = 'relative';
                            continue;
                        }
                        break;
                    case 'relative or authority':
                        if ('/' == c && '/' == input[cursor + 1]) {
                            state = 'authority ignore slashes';
                        } else {
                            err('Expected /, got: ' + c);
                            state = 'relative';
                            continue
                        }
                        break;
                    case 'relative':
                        this._isRelative = true;
                        if ('file' != this._scheme) ;
                        this._scheme = base._scheme;
                        if (EOF == c) {
                            this._host = base._host;
                            this._port = base._port;
                            this._path = base._path.slice();
                            this._query = base._query;
                            this._username = base._username;
                            this._password = base._password;
                            break loop;
                        } else if ('/' == c || '\\' == c) {
                            if ('\\' == c) ;
                            err('\\ is an invalid code point.');
                            state = 'relative slash';
                        } else if ('?' == c) {
                            this._host = base._host;
                            this._port = base._port;
                            this._path = base._path.slice();
                            this._query = '?';
                            this._username = base._username;
                            this._password = base._password;
                            state = 'query';
                        } else if ('#' == c) {
                            this._host = base._host;
                            this._port = base._port;
                            this._path = base._path.slice();
                            this._query = base._query;
                            this._fragment = '#';
                            this._username = base._username;
                            this._password = base._password;
                            state = 'fragment';
                        } else {
                            var nextC = input[cursor + 1];
                            var nextNextC = input[cursor + 2];
                            if ('file' != this._scheme || !ALPHA.test(c) || (nextC != ':' && nextC != '|') || (EOF != nextNextC && '/' != nextNextC && '\\' != nextNextC && '?' != nextNextC && '#' != nextNextC)) {
                                this._host = base._host;
                                this._port = base._port;
                                this._username = base._username;
                                this._password = base._password;
                                this._path = base._path.slice();
                                this._path.pop();
                            }
                            state = 'relative path';
                            continue;
                        }
                        break;
                    case 'relative slash':
                        if ('/' == c || '\\' == c) {
                            if ('\\' == c) {
                                err('\\ is an invalid code point.');
                            }
                            if ('file' == this._scheme) {
                                state = 'file host';
                            } else {
                                state = 'authority ignore slashes';
                            }
                        } else {
                            if ('file' != this._scheme) {
                                this._host = base._host;
                                this._port = base._port;
                                this._username = base._username;
                                this._password = base._password;
                            }
                            state = 'relative path';
                            continue;
                        }
                        break;
                    case 'authority first slash':
                        if ('/' == c) {
                            state = 'authority second slash';
                        } else {
                            err("Expected '/', got: " + c);
                            state = 'authority ignore slashes';
                            continue;
                        }
                        break;
                    case 'authority second slash':
                        state = 'authority ignore slashes';
                        if ('/' != c) {
                            err("Expected '/', got: " + c);
                            continue;
                        }
                        break;
                    case 'authority ignore slashes':
                        if ('/' != c && '\\' != c) {
                            state = 'authority';
                            continue;
                        } else {
                            err('Expected authority, got: ' + c);
                        }
                        break;
                    case 'authority':
                        if ('@' == c) {
                            if (seenAt) {
                                err('@ already seen.');
                                buffer += '%40';
                            }
                            seenAt = true;
                            for (var i = 0; i < buffer.length; i++) {
                                var cp = buffer[i];
                                if ('\t' == cp || '\n' == cp || '\r' == cp) {
                                    err('Invalid whitespace in authority.');
                                    continue;
                                }
                                if (':' == cp && null === this._password) {
                                    this._password = '';
                                    continue;
                                }
                                var tempC = percentEscape(cp);
                                (null !== this._password) ? this._password += tempC : this._username += tempC;
                            }
                            buffer = '';
                        } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
                            cursor -= buffer.length;
                            buffer = '';
                            state = 'host';
                            continue;
                        } else {
                            buffer += c;
                        }
                        break;
                    case 'file host':
                        if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
                            if (buffer.length == 2 && ALPHA.test(buffer[0]) && (buffer[1] == ':' || buffer[1] == '|')) {
                                state = 'relative path';
                            } else if (buffer.length == 0) {
                                state = 'relative path start';
                            } else {
                                this._host = IDNAToASCII.call(this, buffer);
                                buffer = '';
                                state = 'relative path start';
                            }
                            continue;
                        } else if ('\t' == c || '\n' == c || '\r' == c) {
                            err('Invalid whitespace in file host.');
                        } else {
                            buffer += c;
                        }
                        break;
                    case 'host':
                    case 'hostname':
                        if (':' == c && !seenBracket) {
                            this._host = IDNAToASCII.call(this, buffer);
                            buffer = '';
                            state = 'port';
                            if ('hostname' == stateOverride) {
                                break loop;
                            }
                        } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
                            this._host = IDNAToASCII.call(this, buffer);
                            buffer = '';
                            state = 'relative path start';
                            if (stateOverride) {
                                break loop;
                            }
                            continue;
                        } else if ('\t' != c && '\n' != c && '\r' != c) {
                            if ('[' == c) {
                                seenBracket = true;
                            } else if (']' == c) {
                                seenBracket = false;
                            }
                            buffer += c;
                        } else {
                            err('Invalid code point in host/hostname: ' + c);
                        }
                        break;
                    case 'port':
                        if (/[0-9]/.test(c)) {
                            buffer += c;
                        } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c || stateOverride) {
                            if ('' != buffer) {
                                var temp = parseInt(buffer, 10);
                                if (temp != relative[this._scheme]) {
                                    this._port = temp + '';
                                }
                                buffer = '';
                            }
                            if (stateOverride) {
                                break loop;
                            }
                            state = 'relative path start';
                            continue;
                        } else if ('\t' == c || '\n' == c || '\r' == c) {
                            err('Invalid code point in port: ' + c);
                        } else {
                            invalid.call(this);
                        }
                        break;
                    case 'relative path start':
                        if ('\\' == c) ;
                        err("'\\' not allowed in path.");
                        state = 'relative path';
                        if ('/' != c && '\\' != c) {
                            continue;
                        }
                        break;
                    case 'relative path':
                        if (EOF == c || '/' == c || '\\' == c || (!stateOverride && ('?' == c || '#' == c))) {
                            if ('\\' == c) {
                                err('\\ not allowed in relative path.');
                            }
                            var tmp;
                            if (tmp = relativePathDotMapping[buffer.toLowerCase()]) {
                                buffer = tmp;
                            }
                            if ('..' == buffer) {
                                this._path.pop();
                                if ('/' != c && '\\' != c) {
                                    this._path.push('');
                                }
                            } else if ('.' == buffer && '/' != c && '\\' != c) {
                                this._path.push('');
                            } else if ('.' != buffer) {
                                if ('file' == this._scheme && this._path.length == 0 && buffer.length == 2 && ALPHA.test(buffer[0]) && buffer[1] == '|') {
                                    buffer = buffer[0] + ':';
                                }
                                this._path.push(buffer);
                            }
                            buffer = '';
                            if ('?' == c) {
                                this._query = '?';
                                state = 'query';
                            } else if ('#' == c) {
                                this._fragment = '#';
                                state = 'fragment';
                            }
                        } else if ('\t' != c && '\n' != c && '\r' != c) {
                            buffer += percentEscape(c);
                        }
                        break;
                    case 'query':
                        if (!stateOverride && '#' == c) {
                            this._fragment = '#';
                            state = 'fragment';
                        } else if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
                            this._query += percentEscapeQuery(c);
                        }
                        break;
                    case 'fragment':
                        if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
                            this._fragment += c;
                        }
                        break;
                }
                cursor++;
            }
        }

        function clear() {
            this._scheme = '';
            this._schemeData = '';
            this._username = '';
            this._password = null;
            this._host = '';
            this._port = '';
            this._path = [];
            this._query = '';
            this._fragment = '';
            this._isInvalid = false;
            this._isRelative = false;
        }

        function jURL(url, base) {
            if (base !== undefined && !(base instanceof jURL)) ;
            base = new jURL(String(base));
            this._url = url;
            clear.call(this);
            var input = url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '');
            parse.call(this, input, null, base);
        }

        jURL.prototype = {
            toString : function() {
                return this.href;
            }, get href() {
                if (this._isInvalid) ;
                return this._url;
                var authority = '';
                if ('' != this._username || null != this._password) {
                    authority = this._username + (null != this._password ? ':' + this._password : '') + '@';
                }
                return this.protocol + (this._isRelative ? '//' + authority + this.host : '') + this.pathname + this._query + this._fragment;
            }, set href(href) {
                clear.call(this);
                parse.call(this, href);
            }, get protocol() {
                return this._scheme + ':';
            }, set protocol(protocol) {
                if (this._isInvalid) ;
                return;
                parse.call(this, protocol + ':', 'scheme start');
            }, get host() {
                return this._isInvalid ? '' : this._port ? this._host + ':' + this._port : this._host;
            }, set host(host) {
                if (this._isInvalid || !this._isRelative) ;
                return;
                parse.call(this, host, 'host');
            }, get hostname() {
                return this._host;
            }, set hostname(hostname) {
                if (this._isInvalid || !this._isRelative) ;
                return;
                parse.call(this, hostname, 'hostname');
            }, get port() {
                return this._port;
            }, set port(port) {
                if (this._isInvalid || !this._isRelative) ;
                return;
                parse.call(this, port, 'port');
            }, get pathname() {
                return this._isInvalid ? '' : this._isRelative ? '/' + this._path.join('/') : this._schemeData;
            }, set pathname(pathname) {
                if (this._isInvalid || !this._isRelative) ;
                return;
                this._path = [];
                parse.call(this, pathname, 'relative path start');
            }, get search() {
                return this._isInvalid || !this._query || '?' == this._query ? '' : this._query;
            }, set search(search) {
                if (this._isInvalid || !this._isRelative) ;
                return;
                this._query = '?';
                if ('?' == search[0]) search = search.slice(1);
                parse.call(this, search, 'query');
            }, get hash() {
                return this._isInvalid || !this._fragment || '#' == this._fragment ? '' : this._fragment;
            }, set hash(hash) {
                if (this._isInvalid) ;
                return;
                this._fragment = '#';
                if ('#' == hash[0]) ;
                hash = hash.slice(1);
                parse.call(this, hash, 'fragment');
            }, get origin() {
                var host;
                if (this._isInvalid || !this._scheme) {
                    return '';
                }
                switch (this._scheme) {
                    case 'data':
                    case 'file':
                    case 'javascript':
                    case 'mailto':
                        return 'null';
                }
                host = this.host;
                if (!host) {
                    return '';
                }
                return this._scheme + '://' + host;
            }
        };
        var OriginalURL = scope.URL;
        if (OriginalURL) {
            jURL.createObjectURL = function(blob) {
                return OriginalURL.createObjectURL.apply(OriginalURL, arguments);
            };
            jURL.revokeObjectURL = function(url) {
                OriginalURL.revokeObjectURL(url);
            };
        }
        scope.URL = jURL;
    })(globalScope);
    exports.FONT_IDENTITY_MATRIX = FONT_IDENTITY_MATRIX;
    exports.IDENTITY_MATRIX = IDENTITY_MATRIX;
    exports.OPS = OPS;
    exports.VERBOSITY_LEVELS = VERBOSITY_LEVELS;
    exports.UNSUPPORTED_FEATURES = UNSUPPORTED_FEATURES;
    exports.AnnotationBorderStyleType = AnnotationBorderStyleType;
    exports.AnnotationFlag = AnnotationFlag;
    exports.AnnotationType = AnnotationType;
    exports.FontType = FontType;
    exports.ImageKind = ImageKind;
    exports.InvalidPDFException = InvalidPDFException;
    exports.MessageHandler = MessageHandler;
    exports.MissingDataException = MissingDataException;
    exports.MissingPDFException = MissingPDFException;
    exports.NotImplementedException = NotImplementedException;
    exports.PageViewport = PageViewport;
    exports.PasswordException = PasswordException;
    exports.PasswordResponses = PasswordResponses;
    exports.StatTimer = StatTimer;
    exports.StreamType = StreamType;
    exports.TextRenderingMode = TextRenderingMode;
    exports.UnexpectedResponseException = UnexpectedResponseException;
    exports.UnknownErrorException = UnknownErrorException;
    exports.Util = Util;
    exports.XRefParseException = XRefParseException;
    exports.arrayByteLength = arrayByteLength;
    exports.arraysToBytes = arraysToBytes;
    exports.assert = assert;
    exports.bytesToString = bytesToString;
    exports.createBlob = createBlob;
    exports.createPromiseCapability = createPromiseCapability;
    exports.createObjectURL = createObjectURL;
    exports.deprecated = deprecated;
    exports.error = error;
    exports.getLookupTableFactory = getLookupTableFactory;
    exports.getVerbosityLevel = getVerbosityLevel;
    exports.globalScope = globalScope;
    exports.info = info;
    exports.isArray = isArray;
    exports.isArrayBuffer = isArrayBuffer;
    exports.isBool = isBool;
    exports.isEmptyObj = isEmptyObj;
    exports.isInt = isInt;
    exports.isNum = isNum;
    exports.isString = isString;
    exports.isSameOrigin = isSameOrigin;
    exports.isValidUrl = isValidUrl;
    exports.isLittleEndian = isLittleEndian;
    exports.isEvalSupported = isEvalSupported;
    exports.loadJpegStream = loadJpegStream;
    exports.log2 = log2;
    exports.readInt8 = readInt8;
    exports.readUint16 = readUint16;
    exports.readUint32 = readUint32;
    exports.removeNullCharacters = removeNullCharacters;
    exports.setVerbosityLevel = setVerbosityLevel;
    exports.shadow = shadow;
    exports.string32 = string32;
    exports.stringToBytes = stringToBytes;
    exports.stringToPDFString = stringToPDFString;
    exports.stringToUTF8String = stringToUTF8String;
    exports.utf8StringToString = utf8StringToString;
    exports.warn = warn;
}));