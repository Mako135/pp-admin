// Переменные должны быть вне функции
let token: string | null = null;
let tokenPromise: Promise<string | null> | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const authStore = () => {
  // Setters
  const setToken = (newToken: string | null) => {
    token = newToken;
  };
  const setTokenPromise = (promise: Promise<string | null> | null) => {
    tokenPromise = promise;
  };

  const setRefreshPromise = (promise: Promise<string | null> | null) => {
    refreshPromise = promise;
  };

  const clearAllTokens = () => {
    token = null;
    tokenPromise = null;
    refreshPromise = null;
  };

  return {
    token,
    tokenPromise,
    refreshPromise,
    setToken,
    setTokenPromise,
    setRefreshPromise,
    clearAllTokens,
  };
};
