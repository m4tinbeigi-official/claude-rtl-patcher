const crypto = require('crypto');
const asar = require('@electron/asar');

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

module.exports = { computeAsarHeaderHash };
