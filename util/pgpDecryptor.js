var openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp
openpgp.initWorker({ path:'openpgp.worker.js' }) // set the relative web worker path
openpgp.config.aead_protect = true // activate fast AES-GCM mode (not yet OpenPGP standard)

var pubkey = '-----BEGIN PGP PUBLIC KEY BLOCK ... END PGP PUBLIC KEY BLOCK-----';
var privkey = '-----BEGIN PGP PRIVATE KEY BLOCK ... END PGP PRIVATE KEY BLOCK-----'; //encrypted private key
var passphrase = 'secret passphrase'; //what the privKey is encrypted with

var privKeyObj = openpgp.key.readArmored(privkey).keys[0];
privKeyObj.decrypt(passphrase);

var decryptData = function(encrypted){

    var options = {
        message: openpgp.message.readArmored(encrypted),     // parse armored message
        privateKey: privKeyObj // for decryption
    };

    openpgp.decrypt(options).then(function(plaintext) {
        return plaintext.data;
    });
}