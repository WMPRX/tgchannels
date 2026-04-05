import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['tr', 'en', 'az', 'de', 'ru', 'hi', 'ar'],
  defaultLocale: 'tr',
  localePrefix: 'always',
});

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
