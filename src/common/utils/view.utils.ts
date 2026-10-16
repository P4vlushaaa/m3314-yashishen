export function getSessionModel(auth?: string) {
    return {
        isAuth: auth === '1',
        user: auth === '1' ? 'Павел Ящищен' : null,
    };
}

export function mapContactType(type: string) {
    switch (type) {
        case 'email':
            return 'Почта';
        case 'telegram':
            return 'Telegram';
        case 'github':
            return 'GitHub';
        default:
            return type;
    }
}
