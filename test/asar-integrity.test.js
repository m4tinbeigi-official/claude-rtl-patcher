const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const asar = require('@electron/asar');
const { computeAsarHeaderHash } = require('../lib/asar-integrity');

async function buildFixtureAsar() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'asar-integrity-test-'));
    const src = path.join(dir, 'src');
    fs.mkdirSync(src, { recursive: true });
    fs.writeFileSync(path.join(src, 'renderer.js'), 'console.log("hello");\n');
    fs.writeFileSync(path.join(src, 'styles.css'), 'body { color: red; }\n');
    const archive = path.join(dir, 'app.asar');
    await asar.createPackage(src, archive);
    return { dir, archive };
}

test('hashes the archive header, matching what Electron validates', async () => {
    const { dir, archive } = await buildFixtureAsar();
    try {
        const expected = crypto.createHash('sha256')
            .update(asar.getRawHeader(archive).headerString)
            .digest('hex');

        assert.equal(computeAsarHeaderHash(archive), expected);
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

test('is NOT the hash of the whole app.asar file (regression guard)', async () => {
    const { dir, archive } = await buildFixtureAsar();
    try {
        const wholeFile = crypto.createHash('sha256')
            .update(fs.readFileSync(archive))
            .digest('hex');

        // Writing `wholeFile` into Info.plist is what makes Electron abort with
        // "Integrity check failed for asar archive" at launch.
        assert.notEqual(computeAsarHeaderHash(archive), wholeFile);
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

test('reads the header through the injected accessor', () => {
    const calls = [];
    const fakeReader = (p) => {
        calls.push(p);
        return { headerString: '{"files":{}}' };
    };

    const expected = crypto.createHash('sha256').update('{"files":{}}').digest('hex');

    assert.equal(computeAsarHeaderHash('/nowhere/app.asar', fakeReader), expected);
    assert.deepEqual(calls, ['/nowhere/app.asar']);
});

const { setAsarIntegrityHash } = require('../lib/asar-integrity');

const PLIST_WITH_ENTRY = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Claude</string>
  <key>ElectronAsarIntegrity</key>
  <dict>
    <key>Resources/app.asar</key>
    <dict>
      <key>algorithm</key><string>SHA256</string>
      <key>hash</key><string>0000000000000000000000000000000000000000000000000000000000000000</string>
    </dict>
  </dict>
</dict>
</plist>`;

const PLIST_WITHOUT_ENTRY = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Claude</string>
</dict>
</plist>`;

test('writes the hash into an existing ElectronAsarIntegrity entry', () => {
    const updated = setAsarIntegrityHash(PLIST_WITH_ENTRY, 'abc123');
    assert.ok(updated, 'expected updated plist text');

    const parsed = require('plist').parse(updated);
    assert.equal(parsed.ElectronAsarIntegrity['Resources/app.asar'].hash, 'abc123');
    // Everything else survives the round-trip.
    assert.equal(parsed.CFBundleName, 'Claude');
    assert.equal(parsed.ElectronAsarIntegrity['Resources/app.asar'].algorithm, 'SHA256');
});

test('reports "nothing to update" when the bundle has no integrity entry', () => {
    // This is the only case where flipping the fuse is still warranted.
    assert.equal(setAsarIntegrityHash(PLIST_WITHOUT_ENTRY, 'abc123'), null);
});
