const encoder = new TextEncoder();

/** Compare secrets as fixed-size hashes without an early-exit byte loop. */
export async function secretsMatch(presented: string, expected: string): Promise<boolean> {
  const [presentedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(presented)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const left = new Uint8Array(presentedHash);
  const right = new Uint8Array(expectedHash);
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

/** Read an RFC 6750-style bearer credential without logging or decoding it. */
export function bearerCredential(request: Request): string {
  const header = request.headers.get('authorization') ?? '';
  return header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
}
