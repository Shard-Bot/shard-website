/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Navbar from '../../../components/navbar';
import SaveFooter from '../../../components/save-footer';
import HelpTooltip from '../../../components/help-tooltip';

import Switch from 'react-switch';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import Select from 'react-select';

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
		url: `${process.env.HOST}/api/content/dashboard?page=antinuker`,
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

const AntiNuker = (props: any) => {
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
			</main>

			<footer>
				<SaveFooter open={unsavedChanges} reset={() => window.location.reload()} save={saveChanges} lang={props.lang.saveFooter} />
			</footer>
		</div>
	);
};

export default AntiNuker;
