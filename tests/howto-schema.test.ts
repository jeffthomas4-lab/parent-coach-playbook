import { describe, expect, it } from 'vitest';
import { buildCoachingTipHowToSteps } from '../src/lib/howto-schema';

describe('coaching tip HowTo schema', () => {
  it('uses the numbered instructions readers can see', () => {
    const steps = buildCoachingTipHowToSteps(`
**How to run it:**

1. Put a [cone](/go/cone/) at each corner.
2. **Shuffle** to the next cone.
3. Reset and repeat.

**What to watch:** Keep the feet apart.
`);

    expect(steps).toEqual([
      { '@type': 'HowToStep', position: 1, name: 'Step 1', text: 'Put a cone at each corner.' },
      { '@type': 'HowToStep', position: 2, name: 'Step 2', text: 'Shuffle to the next cone.' },
      { '@type': 'HowToStep', position: 3, name: 'Step 3', text: 'Reset and repeat.' },
    ]);
  });

  it('stops before the next visible section', () => {
    const steps = buildCoachingTipHowToSteps(`
__How to run it__
1) First instruction.
2) Second instruction.
__What to watch:__
1. This is not a procedure step.
`);

    expect(steps).toHaveLength(2);
  });

  it('refuses misleading HowTo schema without a real sequence', () => {
    expect(buildCoachingTipHowToSteps('A useful drill with no instructions.')).toBeNull();
    expect(buildCoachingTipHowToSteps('**How to run it:**\n1. Only one vague step.')).toBeNull();
  });
});
