'use strict';
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('pdfjs/display/font_loader', ['exports', 'pdfjs/shared/util'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('../shared/util.js'));
    } else {
        factory((root.pdfjsDisplayFontLoader = {}), root.pdfjsSharedUtil);
    }
}(this, function(exports, sharedUtil) {
    var assert = sharedUtil.assert;
    var bytesToString = sharedUtil.bytesToString;
    var string32 = sharedUtil.string32;
    var shadow = sharedUtil.shadow;
    var warn = sharedUtil.warn;

    function FontLoader(docId) {
        this.docId = docId;
        this.styleElement = null;
        this.nativeFontFaces = [];
        this.loadTestFontId = 0;
        this.loadingContext = {requests : [], nextRequestId : 0};
    }

    FontLoader.prototype = {
        insertRule              : function fontLoaderInsertRule(rule) {
            var styleElement = this.styleElement;
            if (!styleElement) {
                styleElement = this.styleElement = document.createElement('style');
                styleElement.id = 'PDFJS_FONT_STYLE_TAG_' + this.docId;
                document.documentElement.getElementsByTagName('head')[0].appendChild(styleElement);
            }
            var styleSheet = styleElement.sheet;
            styleSheet.insertRule(rule, styleSheet.cssRules.length);
        }, clear                : function fontLoaderClear() {
            var styleElement = this.styleElement;
            if (styleElement) {
                styleElement.parentNode.removeChild(styleElement);
                styleElement = this.styleElement = null;
            }
            this.nativeFontFaces.forEach(function(nativeFontFace) {
                document.fonts.delete(nativeFontFace);
            });
            this.nativeFontFaces.length = 0;
        }, get loadTestFont() {
            return shadow(this, 'loadTestFont', atob('T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQAFQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAAALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgAAAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACMAooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4DIP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAAAAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUAAQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgABAAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABYAAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAAAC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQACAQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTjFQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA=='));
        }, addNativeFontFace    : function fontLoader_addNativeFontFace(nativeFontFace) {
            this.nativeFontFaces.push(nativeFontFace);
            document.fonts.add(nativeFontFace);
        }, bind                 : function fontLoaderBind(fonts, callback) {
            var rules = [];
            var fontsToLoad = [];
            var fontLoadPromises = [];
            var getNativeFontPromise = function(nativeFontFace) {
                return nativeFontFace.loaded.catch(function(e) {
                    warn('Failed to load font "' + nativeFontFace.family + '": ' + e);
                });
            };
            for (var i = 0, ii = fonts.length; i < ii; i++) {
                var font = fonts[i];
                if (font.attached || font.loading === false) {
                    continue;
                }
                font.attached = true;
                if (FontLoader.isFontLoadingAPISupported) {
                    var nativeFontFace = font.createNativeFontFace();
                    if (nativeFontFace) {
                        this.addNativeFontFace(nativeFontFace);
                        fontLoadPromises.push(getNativeFontPromise(nativeFontFace));
                    }
                } else {
                    var rule = font.createFontFaceRule();
                    if (rule) {
                        this.insertRule(rule);
                        rules.push(rule);
                        fontsToLoad.push(font);
                    }
                }
            }
            var request = this.queueLoadingCallback(callback);
            if (FontLoader.isFontLoadingAPISupported) {
                Promise.all(fontLoadPromises).then(function() {
                    request.complete();
                });
            } else if (rules.length > 0 && !FontLoader.isSyncFontLoadingSupported) {
                this.prepareFontLoadEvent(rules, fontsToLoad, request);
            } else {
                request.complete();
            }
        }, queueLoadingCallback : function FontLoader_queueLoadingCallback(callback) {
            function LoadLoader_completeRequest() {
                assert(!request.end, 'completeRequest() cannot be called twice');
                request.end = Date.now();
                while (context.requests.length > 0 && context.requests[0].end) {
                    var otherRequest = context.requests.shift();
                    setTimeout(otherRequest.callback, 0);
                }
            }

            var context = this.loadingContext;
            var requestId = 'pdfjs-font-loading-' + (context.nextRequestId++);
            var request = {
                id       : requestId,
                complete : LoadLoader_completeRequest,
                callback : callback,
                started  : Date.now()
            };
            context.requests.push(request);
            return request;
        }, prepareFontLoadEvent : function fontLoaderPrepareFontLoadEvent(rules, fonts, request) {
            function int32(data, offset) {
                return (data.charCodeAt(offset) << 24) | (data.charCodeAt(offset + 1) << 16) | (data.charCodeAt(offset + 2) << 8) | (data.charCodeAt(offset + 3) & 0xff);
            }

            function spliceString(s, offset, remove, insert) {
                var chunk1 = s.substr(0, offset);
                var chunk2 = s.substr(offset + remove);
                return chunk1 + insert + chunk2;
            }

            var i, ii;
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            var ctx = canvas.getContext('2d');
            var called = 0;

            function isFontReady(name, callback) {
                called++;
                if (called > 30) {
                    warn('Load test font never loaded.');
                    callback();
                    return;
                }
                ctx.font = '30px ' + name;
                ctx.fillText('.', 0, 20);
                var imageData = ctx.getImageData(0, 0, 1, 1);
                if (imageData.data[3] > 0) {
                    callback();
                    return;
                }
                setTimeout(isFontReady.bind(null, name, callback));
            }

            var loadTestFontId = 'lt' + Date.now() + this.loadTestFontId++;
            var data = this.loadTestFont;
            var COMMENT_OFFSET = 976;
            data = spliceString(data, COMMENT_OFFSET, loadTestFontId.length, loadTestFontId);
            var CFF_CHECKSUM_OFFSET = 16;
            var XXXX_VALUE = 0x58585858;
            var checksum = int32(data, CFF_CHECKSUM_OFFSET);
            for (i = 0, ii = loadTestFontId.length - 3; i < ii; i += 4) {
                checksum = (checksum - XXXX_VALUE + int32(loadTestFontId, i)) | 0;
            }
            if (i < loadTestFontId.length) {
                checksum = (checksum - XXXX_VALUE + int32(loadTestFontId + 'XXX', i)) | 0;
            }
            data = spliceString(data, CFF_CHECKSUM_OFFSET, 4, string32(checksum));
            var url = 'url(data:font/opentype;base64,' + btoa(data) + ');';
            var rule = '@font-face { font-family:"' + loadTestFontId + '";src:' + url + '}';
            this.insertRule(rule);
            var names = [];
            for (i = 0, ii = fonts.length; i < ii; i++) {
                names.push(fonts[i].loadedName);
            }
            names.push(loadTestFontId);
            var div = document.createElement('div');
            div.setAttribute('style', 'visibility: hidden;width: 10px; height: 10px;position: absolute; top: 0px; left: 0px;');
            for (i = 0, ii = names.length; i < ii; ++i) {
                var span = document.createElement('span');
                span.textContent = 'Hi';
                span.style.fontFamily = names[i];
                div.appendChild(span);
            }
            document.body.appendChild(div);
            isFontReady(loadTestFontId, function() {
                document.body.removeChild(div);
                request.complete();
            });
        }
    };
    FontLoader.isFontLoadingAPISupported = typeof document !== 'undefined' && !!document.fonts;
    Object.defineProperty(FontLoader, 'isSyncFontLoadingSupported', {
        get           : function() {
            if (typeof navigator === 'undefined') {
                return shadow(FontLoader, 'isSyncFontLoadingSupported', true);
            }
            var supported = false;
            var m = /Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(navigator.userAgent);
            if (m && m[1] >= 14) {
                supported = true;
            }
            return shadow(FontLoader, 'isSyncFontLoadingSupported', supported);
        }, enumerable : true, configurable : true
    });
    var IsEvalSupportedCached = {
        get value() {
            return shadow(this, 'value', sharedUtil.isEvalSupported());
        }
    };
    var FontFaceObject = (function FontFaceObjectClosure() {
        function FontFaceObject(translatedData, options) {
            this.compiledGlyphs = Object.create(null);
            for (var i in translatedData) {
                this[i] = translatedData[i];
            }
            this.options = options;
        }

        FontFaceObject.prototype = {
            createNativeFontFace  : function FontFaceObject_createNativeFontFace() {
                if (!this.data) {
                    return null;
                }
                if (this.options.disableFontFace) {
                    this.disableFontFace = true;
                    return null;
                }
                var nativeFontFace = new FontFace(this.loadedName, this.data, {});
                if (this.options.fontRegistry) {
                    this.options.fontRegistry.registerFont(this);
                }
                return nativeFontFace;
            }, createFontFaceRule : function FontFaceObject_createFontFaceRule() {
                if (!this.data) {
                    return null;
                }
                if (this.options.disableFontFace) {
                    this.disableFontFace = true;
                    return null;
                }
                var data = bytesToString(new Uint8Array(this.data));
                var fontName = this.loadedName;
                var url = ('url(data:' + this.mimetype + ';base64,' + btoa(data) + ');');
                var rule = '@font-face { font-family:"' + fontName + '";src:' + url + '}';
                if (this.options.fontRegistry) {
                    this.options.fontRegistry.registerFont(this, url);
                }
                return rule;
            }, getPathGenerator   : function FontFaceObject_getPathGenerator(objs, character) {
                if (!(character in this.compiledGlyphs)) {
                    var cmds = objs.get(this.loadedName + '_path_' + character);
                    var current, i, len;
                    if (this.options.isEvalSupported && IsEvalSupportedCached.value) {
                        var args, js = '';
                        for (i = 0, len = cmds.length; i < len; i++) {
                            current = cmds[i];
                            if (current.args !== undefined) {
                                args = current.args.join(',');
                            } else {
                                args = '';
                            }
                            js += 'c.' + current.cmd + '(' + args + ');\n';
                        }
                        this.compiledGlyphs[character] = new Function('c', 'size', js);
                    } else {
                        this.compiledGlyphs[character] = function(c, size) {
                            for (i = 0, len = cmds.length; i < len; i++) {
                                current = cmds[i];
                                if (current.cmd === 'scale') {
                                    current.args = [size, -size];
                                }
                                c[current.cmd].apply(c, current.args);
                            }
                        };
                    }
                }
                return this.compiledGlyphs[character];
            }
        };
        return FontFaceObject;
    })();
    exports.FontFaceObject = FontFaceObject;
    exports.FontLoader = FontLoader;
}));