import { AuthToken } from '../utils/authTypes';

export const loginApi = async (
    username: string,
    password: string,
): Promise<AuthToken> => {
    await new Promise<void>(resolve => {
        setTimeout(resolve, 800);
    });

    return {
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000,
    };
};
