import React from 'react';

export default function Invite() {
	setTimeout(() => {
		return (window.location.href = `https://discord.com/oauth2/authorize?scope=bot+applications.commands&response_type=code&permissions=8&client_id=848074235678031893`);
	}, 300);

	return (
		<div>
			<h1>Redirecting...</h1>
		</div>
	);
}
