/* eslint-disable @next/next/no-img-element */
import React from 'react';
import axios from 'axios';

import Head from 'next/head';
import { Row, Col, Container } from 'react-bootstrap';
import Particles from 'react-tsparticles';
import Navbar from '../../../components/navbar';

import styles from '../../../assets/styles/dashboard/index.module.scss';
import { GetServerSideProps, NextPage } from 'next';

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
		url: `${process.env.HOST}/api/content/dashboard?page=index`,
		headers: context.req.headers,
	});

	const server = await axios({
		method: 'get',
		url: `${process.env.HOST}/api/servers/info`,
		headers: context.req.headers,
		data: {
			user: context.req.user,
			server: context.query.id,
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

const Dashboard: NextPage = (props: any) => {
	return (
		<div className={styles['dashboard']}>
			<Navbar lang={props.lang.navbar} user={props.user} />
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>


			<main>
				<Container>
					<Row>
						<Col>
							<img
								src={`https://cdn.discordapp.com/icons/${props.server.info.id}/${props.server.info.icon}.webp?size=512`}
								alt={`${props.server.info.name}'s Icon`}
								className='rounded-circle'
							/>
							<h1>Server Info</h1>
							<p>
								<strong>{props.lang.serverInfo.name}:</strong> {props.server.info.name}
							</p>
							<p>
								<strong>{props.lang.serverInfo.id}:</strong> {props.server.info.id}
							</p>
							<p>
								<strong>{props.lang.serverInfo.memberCount}:</strong> {props.server.info.memberCount}
							</p>
							<p>
								<strong>{props.lang.serverInfo.channelCount}:</strong> {props.server.info.channelCount}
							</p>
							<p>
								<strong>{props.lang.serverInfo.roleCount}:</strong> {props.server.info.roleCount}
							</p>
						</Col>
						<Col className={styles['buttons']}>
							<h1>{props.lang.configTitles.title}</h1>
							<a href={`general`}>{props.lang.configTitles.general}</a><br />
							<a href={`antispam`}>{props.lang.configTitles.antispam}</a><br />
							<a href={`antinuker`}>{props.lang.configTitles.antinuker}</a><br />
							<a href={`lockdown`}>{props.lang.configTitles.lockdown}</a><br />
							<a href={`automod`}>{props.lang.configTitles.automod}</a>
						</Col>
					</Row>
				</Container>
			</main>
		</div>
	);
};

export default Dashboard;
