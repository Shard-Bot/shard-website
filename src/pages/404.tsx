export default function FourOhFour() {
	if (process.browser) {
		window.location.href = '/error?code=404';
	}

	return <>Redirecting</>;
}
