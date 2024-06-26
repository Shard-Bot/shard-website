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

import styles from '../../../assets/styles/dashboard/lockdown.module.scss';
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
		url: `${process.env.HOST}/api/content/dashboard?page=lockdown`,
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

	if (server.data == "500") return {
		redirect: {
			destination: '/error/?code=500',
			permanent: false,
		},
	}

	return {
		props: {
			lang: content.data.lang,
			user: context.req.user,
			server: server.data,
		},
	};
};

const Lockdown = (props: any) => {
	const [config, setConfig] = useState(props.server.config);
	const [unsavedChanges, setUnsavedChanges] = useState(false);

	const isOwnerOrTrusted = config.Users.Trusted.includes(props.user.id) || props.server.ownerID == props.user.id;

	const selectStyles = {
		control: (base: any, _state: any) => ({
			...base,
			backgroundColor: '#1d2126',
			color: '#fff',
			border: 'none',
			width: '80%',
		}),
		option: (base: any, state: any) => ({
			...base,
			backgroundColor: state.isFocused ? '#1a1e24 ' : '#1d2126',
			color: '#FFF',
			transition: 'all 0.2s ease-in-out',
			padding: '10px',
		}),
		singleValue: (base: any, _state: any) => ({
			...base,
			color: '#FFF',
		}),
		placeholder: (base: any, state: any) => ({
			...base,
			color: state.isDisabled ? '#565656' : '#ccc',
		}),
		multiValue: (base: any, _state: any) => ({
			...base,
			color: '#FFF',
			backgroundColor: '#282c34',
		}),
		multiValueLabel: (base: any, _state: any) => ({
			...base,
			color: '#FFF',
		}),
		input: (base: any, _state: any) => ({
			...base,
			color: '#FFF',
		}),
		multiValueRemove: (base: any, _state: any) => ({
			...base,
			transition: 'all 0.2s ease-in-out',
			color: '#FFF',
			':hover': {
				color: '#FFF',
				backgroundColor: '#ef5859',
			},
			border: 'none',
		}),
		menu: (base: any, _state: any) => ({
			...base,
			width: '80%',
			backgroundColor: '#1a1e24',
		}),
	};

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

		if (response.data == '500') return (window.location.href = '/error/?code=500');
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
		<div className={styles['dashboard-lockdown']}>
			<Navbar user={props.user} lang={props.lang.navbar} />
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>

			<main>
				<Container fluid className={styles['title']}>
					<img
						className={styles['return-button']}
						onClick={() => history.back()}
						width={40}
						src='/assets/images/return-button.svg'
						alt='Return Button'
					/>
					<p>{props.lang.title}</p>
				</Container>

				<Container fluid>
					<Row sm={1} xs={1} md={2}>
						<Col>
							<h5>{props.lang.status}</h5>
							<Switch
								checked={config.Modules.Lockdown.Enabled}
								onChange={() => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											Lockdown: {
												...config.Modules.Lockdown,
												Enabled: !config.Modules.Lockdown.Enabled,
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
								disabled={!isOwnerOrTrusted}
								width={48}
							/>

							<br />
							<br />

							<h5>
								{props.lang.target} <HelpTooltip body={props.lang.targetDesc} />
							</h5>
							<Select
								styles={selectStyles}
								isDisabled={!isOwnerOrTrusted}
								defaultValue={{ value: config.Modules.Lockdown.Target, label: props.lang[config.Modules.Lockdown.Target] }}
								placeholder={props.lang.select}
								options={[
									{ value: 'alts', label: props.lang.alts },
									{ value: 'bots', label: props.lang.bots },
									{ value: 'all', label: props.lang.all },
								]}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								onChange={(value: any) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											Lockdown: {
												...config.Modules.Lockdown,
												Target: value.value,
											},
										},
									});
								}}
							/>

							<br />
							<br />

							<h5>
								{props.lang.mode} <HelpTooltip body={props.lang.modeDesc} />
							</h5>
							<Select
								styles={selectStyles}
								isDisabled={!isOwnerOrTrusted}
								defaultValue={{ value: config.Modules.Lockdown.Mode, label: props.lang[config.Modules.Lockdown.Mode] }}
								placeholder={props.lang.select}
								options={[
									{ value: 'kick', label: props.lang.kick },
									{ value: 'ban', label: props.lang.ban },
									{ value: 'mute', label: props.lang.mute },
								]}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								onChange={(value: any) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											Lockdown: {
												...config.Modules.Lockdown,
												Mode: value.value,
											},
										},
									});
								}}
							/>
						</Col>
					</Row>
					<br />
					<br />
					{props.lang.note} <br />
					{!isOwnerOrTrusted && props.lang.permissionsNote}
				</Container>
			</main>

			<footer>
				<SaveFooter open={unsavedChanges} reset={() => window.location.reload()} save={saveChanges} lang={props.lang.saveFooter} />
			</footer>
		</div>
	);
};

export default Lockdown;
