export type PrivacyRequestStatus = 'received'|'identity_pending'|'verified'|'deactivated'|'recovery_window'|'executing'|'blocked'|'completed'|'denied'|'cancelled';
export type PrivacyActorType = 'requester'|'staff'|'service'|'agent'|'provider';
export type PrivacyDisposition = 'delete'|'anonymize'|'retain'|'detach'|'review';
const transitions: Record<PrivacyRequestStatus,readonly PrivacyRequestStatus[]> = {
  received:['identity_pending','verified','denied','cancelled'], identity_pending:['verified','denied','cancelled'],
  verified:['deactivated','denied','cancelled'], deactivated:['recovery_window','executing','blocked'],
  recovery_window:['executing','blocked','cancelled'], executing:['blocked','completed'],
  blocked:['recovery_window','executing','denied','cancelled'], completed:[], denied:[], cancelled:[],
};
export const canTransitionPrivacyRequest=(from:PrivacyRequestStatus,to:PrivacyRequestStatus)=>transitions[from].includes(to);
export function requirePrivacyTransition(from:PrivacyRequestStatus,to:PrivacyRequestStatus){if(!canTransitionPrivacyRequest(from,to))throw new Error(`invalid privacy request transition: ${from} -> ${to}`);}
export function validateOwnershipScope(input:{subjectRef:string;authenticatedSubjectRef:string;tenantRef:string|null;authorizedTenantRefs:readonly string[];ownershipScope:'self'|'authorized_tenant_record'|'disputed'}):'authorized'|'escalate'|'denied'{
  if(input.ownershipScope==='disputed')return'escalate';
  if(input.ownershipScope==='self')return input.subjectRef===input.authenticatedSubjectRef?'authorized':'denied';
  return input.tenantRef&&input.authorizedTenantRefs.includes(input.tenantRef)?'authorized':'denied';
}
export function validateCascadeDisposition(item:{disposition:PrivacyDisposition;legalBasisCode?:string|null;holdState:'clear'|'held'|'review';retentionUntil?:string|null}){
  const failures:string[]=[];
  if(item.disposition==='retain'&&!item.legalBasisCode?.trim())failures.push('retention_requires_legal_basis');
  if(item.disposition==='retain'&&!item.retentionUntil)failures.push('retention_requires_review_date');
  if(item.holdState==='held'&&!['retain','review'].includes(item.disposition))failures.push('legal_hold_blocks_destructive_disposition');
  return failures;
}
export function nextRetryAt(input:{attemptCount:number;now:Date;retryable:boolean;maxAttempts?:number}):{state:'retry_wait';at:string}|{state:'dead_letter';at:null}{
  const max=input.maxAttempts??5;if(!Number.isInteger(input.attemptCount)||input.attemptCount<1)throw new Error('attempt count must be a positive integer');
  if(!input.retryable||input.attemptCount>=max)return{state:'dead_letter',at:null};
  const minutes=Math.min(1440,2**(input.attemptCount-1)*15);return{state:'retry_wait',at:new Date(input.now.getTime()+minutes*60000).toISOString()};
}
export function mayApprovePrivacyException(input:{actorType:PrivacyActorType;actorRef:string;proposedBy:string;priorApprover?:string|null}){
  return input.actorType==='staff'&&input.actorRef!==input.proposedBy&&(!input.priorApprover||input.actorRef!==input.priorApprover);
}
export function completionBlockers(input:{status:PrivacyRequestStatus;identityVerified:boolean;deactivatedAt:string|null;sessionsRevokedAt:string|null;cascadeStates:readonly('pending'|'in_progress'|'retry_wait'|'dead_letter'|'verified'|'excepted')[];activeHoldCount:number;ambiguousProviderReceipts:number;exportRequired:boolean;exportVerified:boolean}){
  const b:string[]=[];if(!input.identityVerified)b.push('identity_not_verified');if(!input.deactivatedAt)b.push('access_not_deactivated');if(!input.sessionsRevokedAt)b.push('sessions_not_revoked');
  if(!input.cascadeStates.length)b.push('cascade_empty');if(input.cascadeStates.some(s=>!['verified','excepted'].includes(s)))b.push('cascade_incomplete');
  if(input.activeHoldCount)b.push('active_legal_hold');if(input.ambiguousProviderReceipts)b.push('provider_outcome_ambiguous');if(input.exportRequired&&!input.exportVerified)b.push('export_not_verified');
  if(!['executing','blocked'].includes(input.status))b.push('invalid_completion_source_state');return b;
}
export function buildMinimalCompletionReceipt(input:{requestId:string;cascadeVersion:string;verifiedAt:string;dispositionCounts:Partial<Record<PrivacyDisposition,number>>;exceptionRefs:readonly string[]}){
  return{requestId:input.requestId,cascadeVersion:input.cascadeVersion,verifiedAt:input.verifiedAt,dispositionCounts:Object.fromEntries((['delete','anonymize','retain','detach','review']as const).map(k=>[k,input.dispositionCounts[k]??0])),exceptionRefs:[...input.exceptionRefs].sort()};
}
