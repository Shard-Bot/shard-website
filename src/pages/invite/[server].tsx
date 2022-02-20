import React from 'react';
import { useRouter } from 'next/router';

export default function Invite() {
	const router = useRouter();

	setTimeout(() => {
		const server = router.query.server;
		if (server == undefined) return;
		if (server.length !== 18) return 'https://discord.com/oauth2/authorize?scope=bot+applications.commands&response_type=code&permissions=8&client_id=848074235678031893';

		return window.location.href = `https://discord.com/oauth2/authorize?scope=bot+applications.commands&response_type=code&permissions=8&client_id=848074235678031893&guild_id=${server}`;
	}, 300);

	return (
		<div>
			<h1>Redirecting...</h1>
		</div>
	);
}
