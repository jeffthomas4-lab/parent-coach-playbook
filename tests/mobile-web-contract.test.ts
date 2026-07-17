import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

type MobileContract = {
  release_blocking: boolean;
  target: string;
  viewports_css_px: number[];
  conditions: string[];
  prohibited_patterns: string[];
  journeys: string[];
  required_evidence: string[];
  current_evidence_status: string;
  claim_boundary: string;
};

describe('mobile web release contract', () => {
  it('covers representative small screens and adverse mobile conditions', async () => {
    const contract = JSON.parse(
      await readFile(new URL('../automation/mobile-web-contract.json', import.meta.url), 'utf8'),
    ) as MobileContract;

    expect(contract.release_blocking).toBe(true);
    expect(contract.target).toBe('WCAG 2.2 AA');
    expect(contract.viewports_css_px).toEqual([320, 360, 390, 430]);
    expect(contract.conditions).toEqual(expect.arrayContaining([
      'landscape',
      '200_percent_zoom',
      'reduced_motion',
      'virtual_keyboard_open',
      'safe_area_insets',
      'slow_mobile_network',
      'touch_only',
    ]));
    expect(contract.prohibited_patterns).toEqual(expect.arrayContaining([
      'horizontal_page_scroll',
      'hover_only_action',
      'desktop_only_recovery',
    ]));
  });

  it('blocks release until customer, staff, owner, and commerce journey evidence exists', async () => {
    const contract = JSON.parse(
      await readFile(new URL('../automation/mobile-web-contract.json', import.meta.url), 'utf8'),
    ) as MobileContract;

    expect(contract.journeys).toEqual(expect.arrayContaining([
      'browse_and_filter_camps',
      'request_correction_or_removal',
      'staff_admin_triage',
      'future_owner_account_and_recovery',
      'future_checkout_and_cancellation',
    ]));
    expect(contract.required_evidence).toEqual(expect.arrayContaining([
      'screen_reader_sample',
      'real_or_emulated_touch_run',
      'mobile_core_web_vitals',
      'form_error_and_retry_run',
    ]));
    expect(contract.current_evidence_status).toBe('pending');
    expect(contract.claim_boundary).toContain('do not establish WCAG conformance');
  });
});
