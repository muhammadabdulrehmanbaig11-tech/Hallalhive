// __mocks__/firebase-admin.ts
// Minimal, safe mock for unit tests that import firebase-admin

// auth mock
const auth = () => ({
    getUserByEmail: jest.fn(),
    setCustomUserClaims: jest.fn(),
  });
  
  // firestore mock
  const firestore = () => {
    const batch = {
      set: jest.fn(),
      commit: jest.fn(),
    };
  
    // simple collection/doc stubs (expand as you need)
    const collection = jest.fn(() => ({
      doc: jest.fn(() => ({ id: "mockDocId" })),
      orderBy: jest.fn(() => ({ get: jest.fn() })),
      limit: jest.fn(() => ({ get: jest.fn() })),
      add: jest.fn(),
    }));
  
    return {
      batch: jest.fn(() => batch),
      collection,
    };
  };
  
  // storage mock
  const storage = () => ({
    bucket: jest.fn(() => ({
      file: jest.fn(),
    })),
  });
  
  // emulate firebase-admin api surface
  const initializeApp = jest.fn();
  const credential = { cert: jest.fn() };
  const apps: any[] = []; // firebase-admin apps array
  
  // Named exports
  export { initializeApp, credential, auth, firestore, storage, apps };
  
  // Default export (some code may import default)
  export default { initializeApp, credential, auth, firestore, storage, apps };
  