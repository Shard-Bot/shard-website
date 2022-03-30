/* eslint-disable @next/next/no-img-element */
import React from 'react';
import axios from 'axios';

import { Button } from 'react-bootstrap';
import Head from 'next/head';
import Particles from 'react-tsparticles';

import Navbar from '../../components/navbar';
import styles from '../../assets/styles/dashboard/servers.module.scss';

import type { NextPage, GetServerSideProps } from 'next';
import { ServerData } from '../../typings';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (!context.req.user || !context.req.user.id)
		return {
			redirect: {
				destination: '/api/auth/loginRedirect',
				permanent: false,
			},
		};

	const { data } = await axios({
		url: `${process.env.HOST}/api/content/main?page=servers`,
		method: 'GET',
		headers: context.req.headers as any,
	});

	return {
		props: {
			lang: data.lang,
			user: context.req.user,
			servers: data.session.servers,
		},
	};
};

const Dashboard: NextPage = (props: any) => {
	const serverList = props.servers.map((server: ServerData) => {
		if (!server.permissionsFlags.includes('MANAGE_GUILD')) return;
		let href = server.isBotOnServer == true ? `/dashboard/${server.id}` : `/invite/${server.id}/`;
		let button = (server.isBotOnServer == true) == true ? props.lang.manage : props.lang.invite;

		return (
			<div className='col-sm col-md-4 col-lg-2 div-server' onClick={() => (window.location.href = href)} key={server.id}>
				<img
					className='rounded-circle'
					id={server.id}
					src={
						server.icon !== null
							? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp?size=512`
							: '/assets/images/discord-icon-15.jpg'
					}
					alt={`${server.name} server icon`}
				/>
				<br />

				<h2>{server.name}</h2>
				<Button variant='info'>{button}</Button>
			</div>
		);
	});

	return (
		<div>
			<main>
				<Head>
					<title>{props.lang.pageTitle}</title>
				</Head>

				<Particles
					className={styles['particles']}
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

				<Navbar  user={props.user} lang={props.lang.navbar} />
				<div className='container w-100'>
					<div className={`${styles['server-list']} row container-fluid`}>
						{serverList}
						<nav className={styles['space']} />

						<p className={styles['footer']}>
							{props.lang.noServer.split('&')[0]} <a href='/api/auth/logout'>{props.lang.navbar.logout}</a>
							{props.lang.noServer.split('&')[1]}
						</p>
						<nav className={styles['space']} />
					</div>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
