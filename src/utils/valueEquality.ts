export function areValuesEqual(actual: unknown, expected: unknown): boolean {
  if (actual === expected) return true;

  if (Array.isArray(actual) && Array.isArray(expected)) {
    return actual.length === expected.length
      && actual.every((value, index) => areValuesEqual(value, expected[index]));
  }

  if (
    actual !== null
    && expected !== null
    && typeof actual === 'object'
    && typeof expected === 'object'
    && !Array.isArray(actual)
    && !Array.isArray(expected)
  ) {
    const actualRecord = actual as Record<string, unknown>;
    const expectedRecord = expected as Record<string, unknown>;
    const actualKeys = Object.keys(actualRecord).sort();
    const expectedKeys = Object.keys(expectedRecord).sort();

    return actualKeys.length === expectedKeys.length
      && actualKeys.every((key, index) => (
        key === expectedKeys[index]
        && areValuesEqual(actualRecord[key], expectedRecord[key])
      ));
  }

  return (
    typeof actual === 'number'
    && typeof expected === 'number'
    && Number.isNaN(actual)
    && Number.isNaN(expected)
  );
}
