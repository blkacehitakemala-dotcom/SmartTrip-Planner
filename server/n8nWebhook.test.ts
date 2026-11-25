import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractN8nReplyText,
  isBlockedIpAddress,
  validateWebhookUrlStructure,
} from './n8nWebhook';

test('isBlockedIpAddress blocks loopback, private, link-local, and metadata IPs', () => {
  assert.equal(isBlockedIpAddress('127.0.0.1'), true);
  assert.equal(isBlockedIpAddress('10.0.0.1'), true);
  assert.equal(isBlockedIpAddress('172.16.5.10'), true);
  assert.equal(isBlockedIpAddress('192.168.1.25'), true);
  assert.equal(isBlockedIpAddress('169.254.169.254'), true);
  assert.equal(isBlockedIpAddress('::1'), true);
  assert.equal(isBlockedIpAddress('::ffff:127.0.0.1'), true);
  assert.equal(isBlockedIpAddress('fe80::1'), true);
  assert.equal(isBlockedIpAddress('fc00::1'), true);

  assert.equal(isBlockedIpAddress('8.8.8.8'), false);
  assert.equal(isBlockedIpAddress('104.21.45.12'), false);
  assert.equal(isBlockedIpAddress('2606:4700:4700::1111'), false);
});

test('validateWebhookUrlStructure allows valid public HTTPS URLs and rejects unsafe schemes/hosts', () => {
  const valid = validateWebhookUrlStructure('https://smarttrip.app.n8n.cloud/webhook/chat-assistant');
  assert.equal(valid.valid, true);

  assert.equal(validateWebhookUrlStructure('http://smarttrip.app.n8n.cloud/webhook/chat').valid, false);
  assert.equal(validateWebhookUrlStructure('https://localhost:5678/webhook/test').valid, false);
  assert.equal(validateWebhookUrlStructure('https://127.0.0.1/webhook/test').valid, false);
  assert.equal(validateWebhookUrlStructure('https://169.254.169.254/latest/meta-data').valid, false);
  assert.equal(validateWebhookUrlStructure('https://metadata.google.internal/computeMetadata').valid, false);
  assert.equal(validateWebhookUrlStructure('https://user:pass@example.com/webhook').valid, false);
  assert.equal(validateWebhookUrlStructure('javascript:alert(1)').valid, false);
});

test('extractN8nReplyText parses common n8n AI Agent and Webhook node payloads', () => {
  assert.equal(extractN8nReplyText({ output: 'Halo! Mau ke mana?' }), 'Halo! Mau ke mana?');
  assert.equal(extractN8nReplyText([{ output: 'Dari array n8n' }]), 'Dari array n8n');
  assert.equal(extractN8nReplyText({ reply: 'Balasan kustom' }), 'Balasan kustom');
  assert.equal(extractN8nReplyText({ text: 'Plain text field' }), 'Plain text field');
  assert.equal(extractN8nReplyText({ data: { message: 'Nested message' } }), 'Nested message');
  assert.equal(extractN8nReplyText('Direct string reply'), 'Direct string reply');
  assert.equal(extractN8nReplyText({}), null);
});
