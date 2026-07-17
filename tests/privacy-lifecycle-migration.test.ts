import {describe,expect,it} from 'vitest';
import {readFile} from 'node:fs/promises';
const sql=await readFile(new URL('../migrations-pcd-ops/0015_privacy_request_lifecycle.sql',import.meta.url),'utf8');
describe('privacy lifecycle migration',()=>{
  it('defines request, cascade, hold, exception, provider, and completion evidence',()=>{
    for(const table of ['privacy_requests','privacy_request_events','privacy_cascade_items','privacy_legal_holds','privacy_exception_approvals','privacy_provider_receipts','privacy_completion_receipts'])expect(sql).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    for(const term of ["'delete'","'anonymize'","'retain'","'detach'","'review'","'retry_wait'","'dead_letter'"])expect(sql).toContain(term);
  });
  it('fails closed on completion, session revocation, tenancy and independent approval',()=>{
    for(const term of ["status <> 'completed' OR completed_at IS NOT NULL",'sessions_revoked_at IS NOT NULL','UNIQUE(request_id,system_code,record_class,subject_ref,tenant_ref)','first_approved_by <> proposed_by','second_approved_by NOT IN (proposed_by,first_approved_by)'])expect(sql).toContain(term);
  });
  it('is inert and excludes direct personal payload fields',()=>{
    expect(sql).not.toMatch(/CREATE\s+TRIGGER/i);
    expect(sql).not.toMatch(/email|phone|address|message_body|prompt_text/i);
  });
});
