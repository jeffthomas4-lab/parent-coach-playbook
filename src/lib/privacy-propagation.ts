import { nextRetryAt, validateCascadeDisposition, type PrivacyDisposition } from './privacy-lifecycle';

export interface PrivacyCascadeWorkItem {
  id: string;
  requestId: string;
  systemCode: string;
  disposition: PrivacyDisposition;
  holdState: 'clear' | 'held' | 'review';
  legalBasisCode?: string | null;
  retentionUntil?: string | null;
  attemptCount: number;
  checkpoint?: string | null;
}

export interface PrivacyPropagationReceipt {
  state: 'confirmed' | 'accepted' | 'rejected' | 'timeout' | 'ambiguous';
  providerReference?: string;
  checkpoint?: string;
  verificationReference?: string;
  retryable: boolean;
  errorCode?: string;
}

export interface PrivacyPropagationAdapter {
  readonly systemCode: string;
  execute(item: Readonly<PrivacyCascadeWorkItem>): Promise<PrivacyPropagationReceipt>;
  verify(item: Readonly<PrivacyCascadeWorkItem>, receipt: Readonly<PrivacyPropagationReceipt>): Promise<boolean>;
}

export type PrivacyPropagationOutcome =
  | { state: 'verified'; verificationReference: string; providerReference?: string; checkpoint?: string }
  | { state: 'retry_wait'; nextAttemptAt: string; errorCode: string; checkpoint?: string }
  | { state: 'dead_letter'; errorCode: string; checkpoint?: string }
  | { state: 'blocked'; errorCode: string };

export async function executePrivacyPropagation(input: {
  item: PrivacyCascadeWorkItem;
  adapter: PrivacyPropagationAdapter;
  now: Date;
  maxAttempts?: number;
}): Promise<PrivacyPropagationOutcome> {
  const dispositionFailures = validateCascadeDisposition(input.item);
  if (dispositionFailures.length) return { state: 'blocked', errorCode: dispositionFailures[0] };
  if (input.item.holdState !== 'clear') return { state: 'blocked', errorCode: 'hold_or_review_blocks_execution' };
  if (input.adapter.systemCode !== input.item.systemCode) return { state: 'blocked', errorCode: 'adapter_scope_mismatch' };

  let receipt: PrivacyPropagationReceipt;
  try {
    receipt = await input.adapter.execute(input.item);
  } catch {
    receipt = { state: 'ambiguous', retryable: false, errorCode: 'adapter_outcome_unknown' };
  }

  if (receipt.state === 'confirmed') {
    const verified = await input.adapter.verify(input.item, receipt).catch(() => false);
    if (verified && receipt.verificationReference) {
      return { state: 'verified', verificationReference: receipt.verificationReference, providerReference: receipt.providerReference, checkpoint: receipt.checkpoint };
    }
    receipt = { ...receipt, state: 'ambiguous', retryable: false, errorCode: 'verification_failed' };
  }

  const retry = nextRetryAt({ attemptCount: input.item.attemptCount + 1, now: input.now, retryable: receipt.retryable, maxAttempts: input.maxAttempts });
  const errorCode = receipt.errorCode ?? `provider_${receipt.state}`;
  return retry.state === 'retry_wait'
    ? { state: 'retry_wait', nextAttemptAt: retry.at, errorCode, checkpoint: receipt.checkpoint }
    : { state: 'dead_letter', errorCode, checkpoint: receipt.checkpoint };
}
