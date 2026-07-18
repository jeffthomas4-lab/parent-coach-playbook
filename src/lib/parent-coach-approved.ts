export type ApprovedProduct = {
  slug: string;
  name: string;
  sport: string;
  status: 'candidate' | 'testing' | 'editorial_review' | 'approved' | 'revoked';
  use_weeks?: number;
  alternative_slugs?: string[];
  wear_evidence_refs?: string[];
  verdict?: string;
  wrong_for?: string;
  skip_category_when?: string;
  paid_placement?: boolean;
  approved_by?: string;
  approved_at?: string;
};

export type ApprovedRegistry = {
  schema_version: number;
  mark: string;
  state: string;
  minimum_use_weeks: number;
  minimum_alternatives: number;
  paid_placement_allowed: boolean;
  products: ApprovedProduct[];
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string | undefined): boolean {
  if (!value || !ISO_DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateApprovedRegistry(value: ApprovedRegistry) {
  const errors: string[] = [];
  const products = Array.isArray(value.products) ? value.products : [];

  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (value.mark !== 'Parent Coach Approved') errors.push('mark name is fixed');
  if (value.minimum_use_weeks !== 12 || value.minimum_alternatives !== 2) {
    errors.push('minimum evidence policy must remain 12 weeks and 2 alternatives');
  }
  if (value.paid_placement_allowed !== false) {
    errors.push('paid placement can never award the mark');
  }
  if (!Array.isArray(value.products)) errors.push('products must be an array');

  const slugs = new Set<string>();
  for (const product of products) {
    if (!SLUG_PATTERN.test(product.slug) || slugs.has(product.slug)) {
      errors.push(`invalid or duplicate product slug: ${product.slug}`);
    }
    slugs.add(product.slug);

    if (product.paid_placement === true) {
      errors.push(`${product.slug}: paid placement is incompatible with the mark`);
    }
    if (product.status !== 'approved') continue;

    if ((product.use_weeks ?? 0) < value.minimum_use_weeks) {
      errors.push(`${product.slug}: approved product lacks 12 weeks of use`);
    }

    const alternatives = product.alternative_slugs ?? [];
    const uniqueAlternatives = new Set(alternatives);
    if (
      alternatives.some((slug) => !SLUG_PATTERN.test(slug)) ||
      uniqueAlternatives.size < value.minimum_alternatives ||
      uniqueAlternatives.has(product.slug)
    ) {
      errors.push(`${product.slug}: approved product lacks two distinct alternatives`);
    }

    if (!product.wear_evidence_refs?.length || product.wear_evidence_refs.some((ref) => !ref.trim())) {
      errors.push(`${product.slug}: approved product lacks wear evidence`);
    }
    for (const field of ['verdict', 'wrong_for', 'skip_category_when', 'approved_by'] as const) {
      if (!product[field]?.trim()) errors.push(`${product.slug}: approved product lacks ${field}`);
    }
    if (!isValidIsoDate(product.approved_at)) {
      errors.push(`${product.slug}: approved product lacks a valid approved_at date`);
    }
  }

  if (value.state === 'foundation_no_awards' && products.some((product) => product.status === 'approved')) {
    errors.push('foundation_no_awards cannot contain approved products');
  }

  return { valid: errors.length === 0, errors };
}
