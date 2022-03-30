import Head from 'next/head';
import SSRProvider from 'react-bootstrap/SSRProvider';

import '../assets/styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
			</Head>

			<SSRProvider>
				<Component {...pageProps} />
			</SSRProvider>
		</>
	);
}

export default MyApp;
