const crypto = require('crypto');
const asar = require('@electron/asar');
const plist = require('plist');

// Electron does NOT hash the app.asar file when it validates
// Info.plist -> ElectronAsarIntegrity. It hashes the archive *header* — the
// JSON directory blob that sits right after the pickle size fields — so a
// SHA-256 of the whole file can never satisfy the check, and the app dies at
// launch with:
//
//   FATAL:asar_util.cc Integrity check failed for asar archive (<a> vs <b>)
//
// `getRawHeader()` is @electron/asar's own accessor for exactly those bytes,
// which keeps this in step with any future header format change.
function computeAsarHeaderHash(asarPath, readRawHeader = asar.getRawHeader) {
    const { headerString } = readRawHeader(asarPath);
    return crypto.createHash('sha256').update(headerString).digest('hex');
}

// Writes `hash` into ElectronAsarIntegrity -> <key> of an Info.plist document.
// Returns the new plist text, or null when the bundle carries no such entry —
// the caller needs that distinction: with an entry updated, Electron's
// integrity check passes and the security-weakening fuse flip can be skipped.
function setAsarIntegrityHash(plistText, hash, key = 'Resources/app.asar') {
    const parsed = plist.parse(plistText);
    if (!parsed || !parsed.ElectronAsarIntegrity || !parsed.ElectronAsarIntegrity[key]) {
        return null;
    }
    parsed.ElectronAsarIntegrity[key].hash = hash;
    return plist.build(parsed);
}

module.exports = { computeAsarHeaderHash, setAsarIntegrityHash };
