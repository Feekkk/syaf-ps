const KEY = 'syaf-shop-auth-bypass';

export const enableAuthBypass = () => sessionStorage.setItem(KEY, '1');
export const clearAuthBypass = () => sessionStorage.removeItem(KEY);
export const hasAuthBypass = () => sessionStorage.getItem(KEY) === '1';
