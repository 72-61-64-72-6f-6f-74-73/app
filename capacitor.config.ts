import type { CapacitorConfig } from '@capacitor/cli';

const dev = process.env.NODE_ENV === `dev`;
const port = process.env.RADROOTS_APP_PORT ? Number(process.env.RADROOTS_APP_PORT) : 3000;
const iosKeychainPrefix = process.env.RADROOTS_APP_SQLITE_KEYCHAIN_PREFIX;
if (!iosKeychainPrefix) throw new Error('Error: iosKeychainPrefix is required');
const iosDatabaseLocation = process.env.RADROOTS_APP_SQLITE_DATABASE_LOCATION;
if (!iosDatabaseLocation) throw new Error('Error: iosDatabaseLocation is required');

const config: CapacitorConfig = {
  appId: process.env.RADROOTS_APP_ID,
  appName: 'Radroots',
  webDir: 'build',
  server: {
    url: dev ? `http://localhost:${port}` : undefined,
    cleartext: dev ? true : false,
    iosScheme: `radroots`,
    androidScheme: `radroots`,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
    CapacitorSQLite: {
      iosDatabaseLocation,
      iosIsEncryption: true,
      iosKeychainPrefix,
      androidIsEncryption: true,
    }
  }
};

export default config;
