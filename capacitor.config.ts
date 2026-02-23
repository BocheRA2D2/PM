import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.pm.panstwamiasta',
    appName: 'Państwa-Miasta',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        StatusBar: {
            style: 'DARK',
            backgroundColor: '#0a0e1a'
        }
    }
};

export default config;
