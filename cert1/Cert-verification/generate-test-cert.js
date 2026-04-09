const forge = require("node-forge");
const fs = require("fs");
const path = require("path");

// Generate a test certificate
const keys = forge.pki.rsa.generateKeyPair(2048);

const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = "01";

// Set subject and issuer
const attrs = [
  { name: "commonName", value: "Test Certificate" },
  { name: "organizationName", value: "Test Organization" },
  { name: "countryName", value: "US" },
];

cert.setSubject(attrs);
cert.setIssuer(attrs);

// Valid for 365 days
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1);

// Self-sign
cert.setExtensions([
  { name: "basicConstraints", cA: true },
  { name: "keyUsage", keyCertSign: true, digitalSignature: true },
  { name: "subjectAltName", altNames: [{ type: 2, value: "localhost" }] },
]);

cert.sign(keys.privateKey, forge.md.sha256.create());

// Convert to PEM
const certPem = forge.pki.certificateToPem(cert);
const keyPem = forge.pki.privateKeyToPem(keys.privateKey);

// Save to files
fs.writeFileSync(path.join(__dirname, "test-cert.pem"), certPem);
fs.writeFileSync(path.join(__dirname, "test-key.pem"), keyPem);

console.log("✅ Test certificate generated successfully!");
console.log("📁 Files created:");
console.log("   - test-cert.pem (certificate)");
console.log("   - test-key.pem (private key)");
console.log("\n💡 Use test-cert.pem to test the validator");
