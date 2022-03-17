/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Navbar from '../../../components/navbar';
import SaveFooter from '../../../components/save-footer';

import Switch from 'react-switch';
import { Container } from 'react-bootstrap';
import Head from 'next/head';
import Particles from 'react-tsparticles';

import styles from '../../../assets/styles/dashboard/antispam.module.scss';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (context.req.user == undefined) {
		return {
			redirect: {
				destination: '/api/auth/loginRedirect',
				permanent: false,
			},
		};
	}

	const content = await axios({
		method: 'get',
		url: `${process.env.HOST}/api/content/dashboard?page=general`,
		headers: context.req.headers,
	});

	const server = await axios({
		method: 'get',
		url: `${process.env.HOST}/api/servers/info`,
		headers: context.req.headers,
		data: {
			user: context.req.user,
			server: context.req.url.split('/')[context.req.url.split('/').length - 3],
		},
	});

	return {
		props: {
			lang: content.data.lang,
			user: context.req.user,
			server: server.data,
		},
	};
};

export default function Antinuker(props: any) {
	const [config, setConfig] = useState(props.server.config);
	const [unsavedChanges, setUnsavedChanges] = useState(false);

	const saveChanges = async () => {
		setUnsavedChanges(false);

		let response = await axios({
			method: 'post',
			url: `/api/servers/save-changes`,
			headers: {},
			data: {
				user: props.user,
				config: config,
				server: props.server.info.id,
			},
		});

		console.log(response.data);
	};

	useEffect(() => {
		const haveSameData = function (obj1: any, obj2: any) {
			const obj1Length = Object.keys(obj1).length;
			const obj2Length = Object.keys(obj2).length;

			if (obj1Length === obj2Length) {
				return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && obj2[key] === obj1[key]);
			}
			return false;
		};

		if (haveSameData(config, props.server.config)) return setUnsavedChanges(false);
		setUnsavedChanges(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [config]);

	return (
		<div className={styles['dashboard-antispam']}>
			<Navbar user={props.user} lang={props.lang.navbar} />
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>

			<Particles
				params={{
					particles: {
						number: {
							value: 10,
							density: {
								enable: true,
								value_area: 800,
							},
						},
						color: {
							value: '#21252b',
						},
						shape: {
							type: 'polygon',
							stroke: {
								width: 0,
								color: '#000',
							},
							polygon: {
								nb_sides: 6,
							},
							image: {
								width: 100,
								height: 100,
							},
						},
						opacity: {
							value: 0.4,
							random: true,
							anim: {
								enable: false,
								speed: 1,
								opacity_min: 0.1,
								sync: false,
							},
						},
						size: {
							value: 160,
							random: true,
							anim: {
								enable: true,
								speed: 10,
								size_min: 40,
								sync: false,
							},
						},
						line_linked: {
							enable: false,
							distance: 200,
							color: '#ffffff',
							opacity: 1,
							width: 2,
						},
						move: {
							enable: true,
							speed: 1,
							direction: 'none',
							random: false,
							straight: false,
							out_mode: 'out',
							bounce: false,
							attract: {
								enable: false,
								rotateX: 600,
								rotateY: 1200,
							},
						},
					},
					retina_detect: true,
				}}
			/>

			{/* You gotta add this categories here
			AntiTextWall
			AntiFlood
			AntiCaps */}

			<main>
				<Container fluid={true} className={styles['title']}>
					<img
						className={styles['return-button']}
						onClick={() => history.back()}
						width={40}
						src='/assets/images/return-button.svg'
						alt='Return Button'
					/>
					<p>{props.lang.title}</p>
				</Container>

				<Container>
					<h1>Anti TextWalls</h1>
					enabled:
					<Switch
						checked={config.Modules.AntiWallText.Enabled}
						onChange={() => {
							setConfig({
								...config,
								Modules: {
									...config.Modules,
									AntiWallText: {
										...config.Modules.AntiWallText,
										Enabled: !config.Modules.AntiWallText.Enabled,
									},
								},
							});
						}}
						onColor='#86d3ff'
						onHandleColor='#2693e6'
						handleDiameter={30}
						uncheckedIcon={false}
						checkedIcon={false}
						boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
						activeBoxShadow='0px 0px 1px 10px rgba(0, 0, 0, 0.2)'
						height={20}
						width={48}
						className='react-switch'
						id='material-switch'
					/>
				</Container>
				<br />
				<br />
				<Container>
					<h1>Anti Flood</h1>
				</Container>
				<br />
				<br />
				<Container>
					<h1>Anti Caps</h1>
				</Container>
			</main>

			<footer>
				<SaveFooter open={unsavedChanges} reset={() => window.location.reload()} save={saveChanges} lang={props.lang.saveFooter} />
			</footer>
		</div>
	);
}
