import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
                <meta charSet='utf-8' />

                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            </Head>

			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
