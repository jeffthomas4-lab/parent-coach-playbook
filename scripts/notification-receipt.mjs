export function validateNotificationReceipt(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['receipt must be an object'], valid: false, received: false };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (!['pending', 'received'].includes(value.state)) errors.push('state must be pending or received');
  for (const field of ['channel_class', 'event_class', 'created_at']) {
    if (typeof value[field] !== 'string' || !value[field].trim()) errors.push(`${field} is required`);
  }
  const received = value.state === 'received';
  if (received) {
    for (const field of ['sent_at', 'received_at', 'recipient_role', 'provider_event_id', 'acknowledgement_reference']) {
      if (typeof value[field] !== 'string' || !value[field].trim()) errors.push(`${field} is required when received`);
    }
    if (Date.parse(value.received_at) < Date.parse(value.sent_at)) errors.push('received_at cannot precede sent_at');
    if (value.approved_by !== 'Jeff Thomas') errors.push('received drill requires Jeff Thomas approval');
  }
  if (value.contains_requester_content !== false) errors.push('receipt must not contain requester content');
  if (value.contains_secret_material !== false) errors.push('receipt must not contain secret material');
  return { errors, valid: errors.length === 0, received: received && errors.length === 0 };
}
