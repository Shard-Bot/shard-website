/* eslint-disable @next/next/no-img-element */
import React from 'react';
import axios, { AxiosRequestHeaders } from 'axios';

import Head from 'next/head';

import { motion } from 'framer-motion';
import { Col, Row, Container } from 'react-bootstrap';
import Navbar from 'src/components/navbar';
import Particles from 'react-tsparticles';

import styles from '../assets/styles/index.module.scss';
import type { NextPage, GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	const { data } = await axios({
		method: 'get',
		url: `${process.env.HOST}/api/content/main?page=index`,
		headers: context.req.headers as AxiosRequestHeaders,
	});

	return {
		props: {
			lang: data.lang,
			user: context.req.user ? context.req.user : null,
		},
	};
};

const Index: NextPage = (props: any) => {
	return (
		<div>
			<Head>
				<title>{props.lang.pageTitle}</title>
				<meta name='description' content={props.lang.pageDescription} />
			</Head>

			<Particles
				style={{
					zIndex: "100000000000 !important",
				}}
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

			<main>
				<Navbar lang={props.lang.navbar} user={props.user} />
				<br />

				<Container className={styles.title}>
					<Row sm={1} xs={1} md={2}>
						<Col>
							<motion.img
								animate={{
									y: [0, -25, 0],
									transition: {
										type: 'easeInOut',
										duration: 5,
										stiffness: 200,
										damping: 20,
										repeat: Infinity,
										repeatType: 'reverse',
									},
								}}
								src='/assets/images/logo.png'
								alt='Logo png'
							/>
						</Col>
						<Col className={styles.titleText}>
							<motion.div
								animate={{
									y: [100, 0],
									opacity: [0, 1],
									transition: {
										duration: 2,
									},
								}}
							>
								<h1>{props.lang.pageTitle}</h1>
								<h2>{props.lang.features.title}</h2>
								<ul>
									<li>{props.lang.features.antinuke}</li>
									<li>{props.lang.features.automodreation}</li>
									<li>{props.lang.features.dashboard}</li>
									<li>{props.lang.features.antiraid}</li>
									<li>{props.lang.features.more}</li>
								</ul>
							</motion.div>
						</Col>
					</Row>
				</Container>

				<Container className={styles.showcase}>
					<Row className={styles['showcase-card']}>
						<Col>
							<img
								src='https://media.discordapp.net/attachments/945041023262924870/945041325131194418/Peek_2022-02-19_17-29.gif'
								alt=''
								width={700}
							/>
						</Col>
						<Col>
							<h3>Automoderation</h3>
							<p>With Shard you dont have to worry about people doing spam or sending sus messages</p>
						</Col>
					</Row>
					<Row className={styles['showcase-card']}>
						<Col>
							<h3>Moderation Commands</h3>
							<p>With Shard you dont have to worry about people doing spam or sending sus messages</p>
						</Col>
						<Col>
							<img
								src='https://media.discordapp.net/attachments/945041023262924870/945041627662147614/unknown.png'
								alt=''
								width={700}
							/>
						</Col>
					</Row>
					<Row className={styles['showcase-card']}>
						<Col>
							<img
								src='https://media.discordapp.net/attachments/945041498037182525/945049213375508530/unknown.png'
								alt=''
								width={600}
							/>
						</Col>
						<Col>
							<h3>Utility commands</h3>
							<p>With Shard you dont have to worry about people doing spam or sending sus messages</p>
						</Col>
					</Row>
					<Row className={styles['showcase-card']}>
						<Col>
							<h3>Logging</h3>
							<p>With Shard you dont have to worry about people doing spam or sending sus messages</p>
						</Col>
						<Col>
							<img
								src='https://media.discordapp.net/attachments/945041023262924870/945042073323712563/unknown.png'
								alt=''
								width={600}
							/>
						</Col>
					</Row>
				</Container>
			</main>

			
		</div>
	);
};

export default Index;
