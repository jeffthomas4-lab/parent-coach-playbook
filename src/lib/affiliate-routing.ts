export type AffiliateMerchantRule = {
  id: string;
  display_name: string;
  hosts: string[];
  tracking_mode: 'preserve_special_link' | 'append_first_party_utm';
};

export type AffiliateGovernance = {
  merchants: AffiliateMerchantRule[];
};

export function merchantForDestination(destination: URL, governance: AffiliateGovernance): AffiliateMerchantRule | null {
  const host = destination.hostname.toLowerCase();
  return governance.merchants.find((merchant) => merchant.hosts.includes(host)) ?? null;
}

export function governedAffiliateDestination(
  rawDestination: string,
  campaign: string,
  governance: AffiliateGovernance,
): string {
  const destination = new URL(rawDestination);
  if (destination.protocol !== 'https:') throw new Error('Affiliate destinations must use HTTPS.');
  const merchant = merchantForDestination(destination, governance);
  if (!merchant) throw new Error(`Affiliate destination host is not governed: ${destination.hostname}`);

  if (merchant.tracking_mode === 'append_first_party_utm') {
    destination.searchParams.set('utm_source', 'parentcoachdesk');
    destination.searchParams.set('utm_medium', 'affiliate');
    destination.searchParams.set('utm_campaign', campaign);
  }
  return destination.toString();
}
