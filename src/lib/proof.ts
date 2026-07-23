// Types and helpers for the /proof social proof page.
// The page reads src/data/proof.json, a single curated file, committed to
// the repo, in the schema defined by 15-07 Social Proof Page Standard.
//
// Hard rule from the standard: no fabricated quotes, names, or sources.
// Ship groups with empty items until a real, approved statement exists.
// Only items with approved === true ever render.

export type ProofSource =
  | 'google'
  | 'yelp'
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'email'
  | 'sms'
  | 'text'
  | 'third-party'
  | 'other';

export interface ProofItem {
  quote: string;
  name: string;
  context?: string;
  source: ProofSource;
  sourceUrl?: string;
  product?: string;
  date?: string;
  approved: boolean;
}

export interface ProofGroup {
  id: string;
  label: string;
  items: ProofItem[];
}

export interface ProofFile {
  headline: string;
  intro: string;
  groups: ProofGroup[];
}

// An item must carry the required fields from the standard (quote, name,
// source, approved) and approved must literally be true before it renders.
export function isApprovedItem(item: ProofItem): boolean {
  return item.approved === true && Boolean(item.quote?.trim()) && Boolean(item.name?.trim()) && Boolean(item.source);
}

export function approvedItems(group: ProofGroup): ProofItem[] {
  return group.items.filter(isApprovedItem);
}

export function hasAnyApprovedItem(proof: ProofFile): boolean {
  return proof.groups.some((group) => approvedItems(group).length > 0);
}
