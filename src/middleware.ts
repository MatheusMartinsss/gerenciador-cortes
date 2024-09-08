export { default } from 'next-auth/middleware'

export const config = {
    matcher: ['/', '/batchs', '/sections', '/settings'],
    pages: {
        signIn: '/auth'
    }
}