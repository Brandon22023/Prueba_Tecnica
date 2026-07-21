export function createMockResponse() {
  return {
    statusCode: 200,
    jsonBody: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.jsonBody = payload;
      return this;
    }
  };
}

export function createConnectionStub({ execute, beginTransaction, commit, rollback, release } = {}) {
  return {
    execute: execute ?? (async () => [[], []]),
    beginTransaction: beginTransaction ?? (async () => {}),
    commit: commit ?? (async () => {}),
    rollback: rollback ?? (async () => {}),
    release: release ?? (() => {})
  };
}
