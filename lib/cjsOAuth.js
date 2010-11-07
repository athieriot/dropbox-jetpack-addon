/**
 *  @license
 *  jsOAuth version 0.7.1RC1
 *  Copyright (c) 2010 Rob Griffiths (http://bytespider.eu)
 *  jsOAuth is freely distributable under the terms of an MIT-style license.
 */

var window = {};
    /** @const */ var OAUTH_VERSION = '1.0';
    
    /**
     * OAuth
     * @constructor
     */
    function OAuth(options) {
	if (window === this) {
	    return new OAuth(options);
	}
	
	return this.init(options);
    }
    
    OAuth.prototype = {
	init: function (options) {
	    var oauth = {
		debug: options.debug || false,
		consumerKey: options.consumerKey,
		consumerSecret: options.consumerSecret,
		accessTokenSecret: options.accessTokenSecret || '',
		signatureMethod: options.signatureMethod || 'HMAC-SHA1'
	    };
	    
	    this.request = function (options) {
		var method, url, data, headers, success, failure, xhr, i,
		    headerParams, signatureMethod, signatureString, signature,
		    query;
		
		method = options.method || 'GET';
		url = options.url;
		data = options.data || {};
		headers = options.headers || {};
		success = options.success || function (data) {};
		failure = options.failure || function () {};
		
		if (oauth.debug) {
		    netscape.security.PrivilegeManager
			    .enablePrivilege("UniversalBrowserRead UniversalBrowserWrite");
		}
		
		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
		    if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			success(xhr.responseText);
		    } else if(xhr.readyState == 4 && xhr.status != 200 && xhr.status != 0) {
			failure();
		    }
		};
		
		
		for(i in data) {
		    query.push(i + '=' + data[i]);
		}
		
		headerParams = {
		    'oauth_callback': 'oob',
		    'oauth_consumer_key': oauth.consumerKey,
		    'oauth_token': oauth.accessTokenSecret,
		    'oauth_signature_method': oauth.signatureMethod,
		    'oauth_timestamp': getTimestamp(),
		    'oauth_nonce': getNonce(),
		    'oauth_verifier': oauth.verifier || '',
		    'oauth_version': OAUTH_VERSION
		};
		
		signatureMethod = oauth.signatureMethod;
		signatureString = toSignatureBaseString(method, url, headerParams, query);
		signature = OAuth['signatureMethod'][signatureMethod](oauth.consumerSecret, oauth.accessTokenSecret, signatureString);
	
		
	
		headerParams.oauth_signature = signature;
		
		query = query.join('&');
		if(method == 'GET') {
		    if (query) {
			url += '?' + query;
		    }
		    query = null;
		} else {
		    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		
		xhr.open(method, url, true);
		
		xhr.setRequestHeader('Authorization', 'OAuth ' + toHeaderString(headerParams));
		xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
		for (i in headers) {
		    xhr.setRequestHeader(i, headers[i]);
		}
		
		xhr.send(query);
	    }
	},
	
	authenticate: function (options) {},
	deauthenticate: function (options) {},
	
	request: '',
	
	get: function (url, success, failure) {
	    this.request({'url': url, 'success': success, 'failure': failure});
	},
	post: function (url, success, failure) {
	    this.request({'method': 'POST', 'url': url, 'success': success, 'failure': failure});
	},
	getJSON: function (url, success, failure) {
	    this.get(url, function (json) {
		success(JSON.parse(json));
	    } , failure);
	},
	getXML: function (url, success, failure) {/* noop */}
    };
    
    OAuth.signatureMethod = {
	'HMAC-SHA1': function (consumer_secret, token_secret, signature_base) {
	    var passphrase, signature;
	    
	    consumer_secret = OAuth.urlEncode(consumer_secret);
	    token_secret = OAuth.urlEncode(token_secret || '');
	    
	    passphrase = consumer_secret + '&' + token_secret;
	    signature = HMAC(SHA1(), passphrase, signature_base);
	    console.log(passphrase  + ' - ' + signature_base); 
	    
	    return btoa(signature);
	}
    };


///

var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // add Base64 encode, but only if we need it
    function btoa(string) {
        var i, len = string.length, byte1, byte2, byte3,
            en1, en2, en3, en4, output = '';

        for (i = 0; i < len; i+=3) {
            byte1 = string.charCodeAt(i);
                        byte2 = string.charCodeAt(i+1);
                        byte3 = string.charCodeAt(i+2);

            en1 = byte1 >> 2;
                        en2 = ((byte1 & 3) << 4) | (byte2 >> 4); 
                        en3 = ((byte2 & 15) << 2) | (byte3 >> 6); 
                        en4 = byte3 & 63; 

            if (isNaN(byte2)) {
                                encode3 = encode4 = 64; 
                        } else if (isNaN(byte3)) {
                                encode4 = 64; 
                        }   

            output += b64.charAt(en1) + b64.charAt(en2) + b64.charAt(en3) + b64.charAt(en4);
        }   

        return output
    };  


///
    
    function toHeaderString(params) {
	var arr = [], i;
	for (i in params) {
            if (params[i] && params[i] != undefined && params[i] != '') {
		arr.push(i + '="' + OAuth.urlEncode(params[i]) + '"');
            }
	}
		
	return arr.join(', ');
    }
    
    function toSignatureBaseString(method, url, header_parms, query_params) {
	var arr = [], i;
		
	for (i in header_parms) {
	    if (header_parms[i] && header_parms[i] != undefined) {
		arr.push(OAuth.urlEncode(i) + '=' + OAuth.urlEncode(header_parms[i]+''));
	    }
	}
	for (i in query_params) {
	    if (query_params[i] && query_params[i] != undefined) {
		if (!oauth_header_params[i]) {
		    arr.push(OAuth.urlEncode(i) + '=' + OAuth.urlEncode(query_params[i]+''));
		}
	    }
	}
		
        return [
            method, 
            OAuth.urlEncode(url), 
            OAuth.urlEncode(arr.sort().join('&'))
        ].join('&');
    }
    
    function getTimestamp() {
        return parseInt(+new Date / 1000, 10); // use short form of getting a timestamp
    };
    
    function getNonce(key_length) {
        key_length = key_length || 64;
        
        var key_bytes = key_length / 8, value = '', key_iter = key_bytes / 4,
	    key_remainder = key_bytes % 4, i,
	    chars = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', 
                     '2A', '2B', '2C', '2D', '2E', '2F', '30', '31', '32', '33', 
                     '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D', 
                     '3E', '3F', '40', '41', '42', '43', '44', '45', '46', '47', 
                     '48', '49', '4A', '4B', '4C', '4D', '4E', '4F', '50', '51', 
                     '52', '53', '54', '55', '56', '57', '58', '59', '5A', '5B', 
                     '5C', '5D', '5E', '5F', '60', '61', '62', '63', '64', '65', 
                     '66', '67', '68', '69', '6A', '6B', '6C', '6D', '6E', '6F', 
                     '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', 
                     '7A', '7B', '7C', '7D', '7E'];
        
        for (i = 0; i < key_iter; i++) {
            value += chars[rand()] + chars[rand()] + chars[rand()]+ chars[rand()];
        }
        
        // handle remaing bytes
        for (i = 0; i < key_remainder; i++) {
            value += chars[rand()];
        }
	
	function rand() {
	    return Math.floor(Math.random() * chars.length);
	}
	
	return value;
    };
    
    OAuth.urlEncode = function (string) {
	if (!string) return '';
	
	string = string + '';
	var reserved_chars = / |!|\*|"|'|\(|\)|;|:|@|&|=|\+|\$|,|\/|\?|%|#|\[|\]|<|>|{|}|\||\\|`|\^/, 
        str_len = string.length, i, string_arr = string.split('');
                          
	for (i = 0; i < str_len; i++) {
	    if (string_arr[i].match(reserved_chars)) {
		string_arr[i] = '%' + (string_arr[i].charCodeAt(0)).toString(16).toUpperCase();
	    }
	}
    
	return string_arr.join('');
    };

    OAuth.urlDecode = function (string){
	if (!string) return '';
    
	return string.replace(/%[a-fA-F0-9]{2}/ig, function (match) {
	    return String.fromCharCode(parseInt(match.replace('%', ''), 16));
	});
    };    function SHA1(message) {
	if (window === this) {
	    return new SHA1(message);
	}
	if (arguments.length > 0 && message != undefined) {
	    var m = message, crypto, digest;
	    if (m.constructor === String) {
		m = stringToByteArray(m);
	    }
	    
	    crypto = new SHA1();
	    digest = crypto.hash(m);
	    
	    return byteArrayToHex(digest);
	}
	return this;
    }
    
    SHA1.prototype = new SHA1();
    SHA1.prototype.blocksize = 64;
    SHA1.prototype.hash = function (m) {
	var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],
	    K = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],
	    l, pad, ml, blocks, b, block, bl, w, i, A, B, C, D, E, t, n, TEMP;
	
	
	if (m.constructor === String) {
	    m = stringToByteArray(m);
	}
	
	l = m.length;
	
	pad = (Math.ceil((l + 9) / this.blocksize) * this.blocksize) - (l + 9);
	
	/*ml = [
	    ((l * 8) << 24) & 0xFF,
	    ((l * 8) << 16) & 0xFF,
	    ((l * 8) << 8) & 0xFF,
	    (l * 8) & 0xFF
	];*/
	
	ml = [0, 0, 0, (l * 8)];
	
	m = m.concat([0x80], zeroPad(pad), [0, 0, 0, 0], ml);
    
	blocks = Math.ceil(m.length / this.blocksize);
	
	for (b = 0; b < blocks; b++) {
	    block = m.slice(b * this.blocksize, (b+1) * this.blocksize);
	    bl = block.length;
	    
	    w = [];
	    
	    for (i = 0; i < bl; i++) {
		w[i >>> 2] |= block[i] << (24 - (i - ((i >> 2) * 4)) * 8);
	    }
	    
	    A = H[0];
	    B = H[1];
	    C = H[2];
	    D = H[3];
	    E = H[4];
	    
	    for (t=0; t < 80; t++) {
		if (t >= 16) {
		    w[t] = leftrotate(w[t-3] ^ w[t-8] ^ w[t-14] ^ w[t-16], 1);
		}
		
		n = Math.floor(t / 20);
		TEMP = leftrotate(A, 5) + fn(n, B, C, D) + E + K[n] + w[t];
		
		E = D;
		D = C;
		C = leftrotate(B, 30);
		B = A;
		A = TEMP;
	    }
	    
	    H[0] += A;
	    H[1] += B;
	    H[2] += C;
	    H[3] += D;
	    H[4] += E;
	}
	
	function fn(t, B, C, D) {
	    switch (t) {
		case 0: 
		    return (B & C) | ((~B) & D);
		case 1: 
		case 3:
		    return B ^ C ^ D;
		case 2: 
		    return (B & C) | (B & D) | (C & D);
	    }
	    
	    return -1;
	}
	
	return wordsToByteArray(H);
    }
    
    function HMAC(fn, key, message){
/////

    fn.blocksize = 64;
    fn.hash = function (m) {
	var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],
	    K = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],
	    l, pad, ml, blocks, b, block, bl, w, i, A, B, C, D, E, t, n, TEMP;
	
	
	if (m.constructor === String) {
	    m = stringToByteArray(m);
	}
	
	l = m.length;
	
	pad = (Math.ceil((l + 9) / this.blocksize) * this.blocksize) - (l + 9);
	
	/*ml = [
	    ((l * 8) << 24) & 0xFF,
	    ((l * 8) << 16) & 0xFF,
	    ((l * 8) << 8) & 0xFF,
	    (l * 8) & 0xFF
	];*/
	
	ml = [0, 0, 0, (l * 8)];
	
	m = m.concat([0x80], zeroPad(pad), [0, 0, 0, 0], ml);
    
	blocks = Math.ceil(m.length / this.blocksize);
	
	for (b = 0; b < blocks; b++) {
	    block = m.slice(b * this.blocksize, (b+1) * this.blocksize);
	    bl = block.length;
	    
	    w = [];
	    
	    for (i = 0; i < bl; i++) {
		w[i >>> 2] |= block[i] << (24 - (i - ((i >> 2) * 4)) * 8);
	    }
	    
	    A = H[0];
	    B = H[1];
	    C = H[2];
	    D = H[3];
	    E = H[4];
	    
	    for (t=0; t < 80; t++) {
		if (t >= 16) {
		    w[t] = leftrotate(w[t-3] ^ w[t-8] ^ w[t-14] ^ w[t-16], 1);
		}
		
		n = Math.floor(t / 20);
		TEMP = leftrotate(A, 5) + fn(n, B, C, D) + E + K[n] + w[t];
		
		E = D;
		D = C;
		C = leftrotate(B, 30);
		B = A;
		A = TEMP;
	    }
	    
	    H[0] += A;
	    H[1] += B;
	    H[2] += C;
	    H[3] += D;
	    H[4] += E;
	}
	
	function fn(t, B, C, D) {
	    switch (t) {
		case 0: 
		    return (B & C) | ((~B) & D);
		case 1: 
		case 3:
		    return B ^ C ^ D;
		case 2: 
		    return (B & C) | (B & D) | (C & D);
	    }
	    
	    return -1;
	}
	
	return wordsToByteArray(H);
};
/////

	var k = stringToByteArray(key), m = stringToByteArray(message),
	    l = k.length, byteArray, oPad, iPad, i;
        
        if (l > fn.blocksize) {
            k = fn.hash(k);
            l = k.length;
        }
       
        k = k.concat(zeroPad(fn.blocksize - l));
        
        oPad = k.slice(0); // copy
        iPad = k.slice(0); // copy       
        
        for (i = 0; i < fn.blocksize; i++) {
            oPad[i] ^= 0x5C;
            iPad[i] ^= 0x36;            
        }
        
        byteArray = fn.hash(oPad.concat(fn.hash(iPad.concat(m))));
        return byteArrayToString(byteArray);
    }
    
    function zeroPad(length) {
	return new Array(length + 1).join(0).split('');
    };
    
    function stringToByteArray(str) {
	var bytes = [], i, code, byteA, byteB, byteC, byteD;
	for(i = 0; i < str.length; i++) {
	    code = str.charCodeAt(i);
	    byteA = (code >>> 24);
	    byteB = (code >>> 16);
	    byteC = (code >>> 8);
	    byteD = code & 0xFF;
	    
	    if (byteA > 0) {
		bytes.push(byteA);
	    }
	    if (byteB > 0) {
		bytes.push(byteB);
	    }
	    if (byteC > 0) {
		bytes.push(byteC);
	    }
	    if (byteD > 0) {
		bytes.push(byteD);
	    }
	}
	return bytes;
    };
    
    function wordsToByteArray(words) {
	var bytes = [], i;
	for (i = 0; i < words.length * 32; i += 8) {
	    bytes.push((words[i >>> 5] >>> (24 - i % 32)) & 0xFF);
	}
	return bytes;
    };
    
    function byteArrayToHex(byteArray) {
	var hex = [], l = byteArray.length, i;
	for (i = 0; i < l; i++) {
	    hex.push((byteArray[i] >>> 4).toString(16));
	    hex.push((byteArray[i] & 0xF).toString(16));
	}
	return hex.join('');
    };
    
    function byteArrayToString(byteArray) {
	var string = '', l = byteArray.length, i;
	for (i = 0; i < l; i++) {
	    string += String.fromCharCode(byteArray[i]);
	}
	return string;
    };
    
    function leftrotate(value, shift) {
	return (value << shift) | (value >>> (32 - shift));
    };
    exports.OAuth = OAuth;
    exports.OAuth.prototype = OAuth.prototype;
    exports.OAuth.signatureMethod = OAuth.signatureMethod;
    exports.OAuth.urlEncode = OAuth.urlEncode;
    exports.OAuth.version = OAUTH_VERSION;
    exports.toHeaderString = toHeaderString; 
    exports.toSignatureBaseString = toSignatureBaseString;
    exports.getTimestamp = getTimestamp;
    exports.getNonce = getNonce;
    exports.SHA1 = SHA1;
    exports.SHA1.prototype = SHA1.prototype;
    exports.SHA1.prototype.blocksize = SHA1.prototype.blocksize;
    exports.SHA1.prototype.hash = SHA1.prototype.hash;
