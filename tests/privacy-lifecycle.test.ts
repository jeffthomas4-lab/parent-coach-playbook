import {describe,expect,it} from 'vitest';
import {buildMinimalCompletionReceipt,canTransitionPrivacyRequest,completionBlockers,mayApprovePrivacyException,nextRetryAt,requirePrivacyTransition,validateCascadeDisposition,validateOwnershipScope} from '../src/lib/privacy-lifecycle';

describe('privacy lifecycle',()=>{
  it('permits only fail-closed forward transitions',()=>{
    expect(canTransitionPrivacyRequest('received','identity_pending')).toBe(true);
    expect(canTransitionPrivacyRequest('executing','completed')).toBe(true);
    expect(canTransitionPrivacyRequest('completed','executing')).toBe(false);
    expect(()=>requirePrivacyTransition('verified','completed')).toThrow('invalid privacy request transition');
  });
  it('enforces self and tenant ownership boundaries',()=>{
    expect(validateOwnershipScope({subjectRef:'u1',authenticatedSubjectRef:'u1',tenantRef:null,authorizedTenantRefs:[],ownershipScope:'self'})).toBe('authorized');
    expect(validateOwnershipScope({subjectRef:'u2',authenticatedSubjectRef:'u1',tenantRef:null,authorizedTenantRefs:[],ownershipScope:'self'})).toBe('denied');
    expect(validateOwnershipScope({subjectRef:'r1',authenticatedSubjectRef:'u1',tenantRef:'o1',authorizedTenantRefs:['o1'],ownershipScope:'authorized_tenant_record'})).toBe('authorized');
    expect(validateOwnershipScope({subjectRef:'r1',authenticatedSubjectRef:'u1',tenantRef:'o2',authorizedTenantRefs:['o1'],ownershipScope:'authorized_tenant_record'})).toBe('denied');
    expect(validateOwnershipScope({subjectRef:'r1',authenticatedSubjectRef:'u1',tenantRef:'o1',authorizedTenantRefs:['o1'],ownershipScope:'disputed'})).toBe('escalate');
  });
  it('requires retention authority and respects holds',()=>{
    expect(validateCascadeDisposition({disposition:'retain',holdState:'clear'})).toEqual(['retention_requires_legal_basis','retention_requires_review_date']);
    expect(validateCascadeDisposition({disposition:'delete',holdState:'held'})).toEqual(['legal_hold_blocks_destructive_disposition']);
    expect(validateCascadeDisposition({disposition:'retain',legalBasisCode:'finance',retentionUntil:'2033-01-01',holdState:'held'})).toEqual([]);
  });
  it('bounds retries and dead-letters exhaustion',()=>{
    const now=new Date('2026-07-16T12:00:00.000Z');
    expect(nextRetryAt({attemptCount:1,now,retryable:true})).toEqual({state:'retry_wait',at:'2026-07-16T12:15:00.000Z'});
    expect(nextRetryAt({attemptCount:5,now,retryable:true})).toEqual({state:'dead_letter',at:null});
    expect(nextRetryAt({attemptCount:1,now,retryable:false})).toEqual({state:'dead_letter',at:null});
    expect(()=>nextRetryAt({attemptCount:0,now,retryable:true})).toThrow('positive integer');
  });
  it('prevents self approval and agent approval of exceptions',()=>{
    expect(mayApprovePrivacyException({actorType:'agent',actorRef:'vera',proposedBy:'vera'})).toBe(false);
    expect(mayApprovePrivacyException({actorType:'staff',actorRef:'a',proposedBy:'a'})).toBe(false);
    expect(mayApprovePrivacyException({actorType:'staff',actorRef:'b',proposedBy:'a',priorApprover:'b'})).toBe(false);
    expect(mayApprovePrivacyException({actorType:'staff',actorRef:'c',proposedBy:'a',priorApprover:'b'})).toBe(true);
  });
  it('blocks false completion',()=>{
    expect(completionBlockers({status:'executing',identityVerified:true,deactivatedAt:'x',sessionsRevokedAt:'x',cascadeStates:['verified','excepted'],activeHoldCount:0,ambiguousProviderReceipts:0,exportRequired:true,exportVerified:true})).toEqual([]);
    expect(completionBlockers({status:'verified',identityVerified:false,deactivatedAt:null,sessionsRevokedAt:null,cascadeStates:['dead_letter'],activeHoldCount:1,ambiguousProviderReceipts:1,exportRequired:true,exportVerified:false})).toEqual(['identity_not_verified','access_not_deactivated','sessions_not_revoked','cascade_incomplete','active_legal_hold','provider_outcome_ambiguous','export_not_verified','invalid_completion_source_state']);
  });
  it('produces deterministic payload-minimal completion evidence',()=>{
    expect(buildMinimalCompletionReceipt({requestId:'p1',cascadeVersion:'v1',verifiedAt:'now',dispositionCounts:{delete:3,retain:1},exceptionRefs:['b','a']})).toEqual({requestId:'p1',cascadeVersion:'v1',verifiedAt:'now',dispositionCounts:{delete:3,anonymize:0,retain:1,detach:0,review:0},exceptionRefs:['a','b']});
  });
});
