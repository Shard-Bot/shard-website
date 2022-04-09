/* eslint-disable @next/next/no-html-link-for-pages */
import axios from 'axios';
import React from 'react';

import styles from '../assets/styles/error.module.scss';

import { GetServerSideProps } from 'next';
import Navbar from '../components/navbar';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
	if (!context.req.query.code)
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};

	const { data } = await axios({
		url: `${process.env.HOST}/api/content/main?page=error`,
		method: 'GET',
		headers: context.req.headers as any,
	});

	return {
		props: {
			lang: data.lang,
			code: context.req.query.code,
			user: context.req.user ? context.req.user : null,
		},
	};
};

const Error = (props) => {
	return (
		<div className={styles['page']}>
			<Head>
				<title>Shard Bot</title>
			</Head>
			<Navbar user={props.user} lang={props.lang.navbar} />

			<main>
				<p>{props.lang.error.split('&')[0]}</p>
				<h1>{props.code}</h1>
				<p>{props.lang.error.split('&')[1]}</p>
				<br />
				<a href='/'>{props.lang.error.split('&')[2]}</a>
			</main>
		</div>
	);
};

export default Error;
