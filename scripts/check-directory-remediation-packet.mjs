#!/usr/bin/env node
import { loadAndValidateDirectoryRemediationPacket } from './directory-remediation-packet.mjs';

const { validation, sha256 } = await loadAndValidateDirectoryRemediationPacket({
  packetPath: 'coordination/directory-remediation-proposals-2026-07-16.json',
  queuePath: 'coordination/directory-remediation-queue-2026-07-16.json',
});
console.log(JSON.stringify({ ...validation, sha256 }, null, 2));
if (!validation.ok) process.exitCode = 1;
