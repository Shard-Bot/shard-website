/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import discord from 'discord.js';

import Navbar from '../../../components/navbar';
import SaveFooter from '../../../components/save-footer';
import HelpTooltip from '../../../components/help-tooltip';

import { Container, Col, Row } from 'react-bootstrap';
import Head from 'next/head';
import Select from 'react-select';
import Particles from 'react-tsparticles';

import styles from '../../../assets/styles/dashboard/general.module.scss';
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

	if (server.data == '500')
		return {
			redirect: {
				destination: '/error/?code=500',
				permanent: false,
			},
		};

	return {
		props: {
			lang: content.data.lang,
			user: context.req.user,
			server: server.data,
		},
	};
};

let loadUsersTimer: any = null;
let loadChannelsTimer: any = null;
let loadRolesTimer: any = null;

const DashboardGeneral: NextPage = (props: any) => {
	const [selectOptions, setSelectOptions] = useState({
		users: {
			values: [],
			default: [],
			isLoading: true,
		},
		roles: {
			muted: {
				values: [],
				default: {} as any,
				isLoading: true,
			},
		},
		channels: {
			JoinLog: {
				values: [],
				default: {
					label: '',
					value: '',
				},
				isLoading: true,
			},
			ExitLog: {
				values: [],
				default: {
					label: '',
					value: '',
				},
				isLoading: true,
			},
			ModLog: {
				values: [],
				default: {
					label: '',
					value: '',
				},
				isLoading: true,
			},
			BotLog: {
				values: [],
				default: {
					label: '',
					value: '',
				},
				isLoading: true,
			},
		},
	});

	const [config, setConfig] = useState(props.server.config);
	const [unsavedChanges, setUnsavedChanges] = useState(false);

	const loadUsers = (inputValue: string) => {
		if (!inputValue) return;
		if (props.server.info.owner !== props.user.id) return;

		clearTimeout(loadUsersTimer);
		setSelectOptions({
			...selectOptions,
			users: {
				...selectOptions.users,
				isLoading: true,
			},
		});

		loadUsersTimer = setTimeout(async () => {
			const response = await axios({
				method: 'post',
				url: `/api/users/search`,
				headers: {},
				data: {
					query: inputValue,
					server: props.server.info.id,
				},
			});

			if (response.data == '500') return (window.location.href = '/error/?code=500');

			let values = [];
			for (let i = 0; i < response.data.length; i++) {
				values.push({
					value: response.data[i].id,
					label: `${response.data[i].username}#${response.data[i].discriminator}`,
				});
			}

			for (let i = 0; i < selectOptions.users.default.length; i++) {
				for (let j = 0; j < values.length; j++) {
					if (selectOptions.users.default[i].value === values[j].value) {
						values.splice(j, 1);
					}
				}
			}

			setSelectOptions({
				...selectOptions,
				users: {
					...selectOptions.users,
					// @ts-ignore
					values: values,
					isLoading: false,
				},
			});
		}, 2000);
	};

	const loadChannels = (inputValue: string, option: any) => {
		if (!inputValue) return;

		clearTimeout(loadChannelsTimer);
		setSelectOptions({
			...selectOptions,
			channels: {
				...selectOptions.channels,
				[option]: {
					// @ts-ignore
					...selectOptions.channels[option],
					isLoading: true,
				},
			},
		});

		loadChannelsTimer = setTimeout(async () => {
			const response = await axios({
				method: 'post',
				url: `/api/channels/search`,
				headers: {},
				data: {
					query: inputValue,
					server: props.server.info.id,
				},
			});

			if (response.data == '500') return (window.location.href = '/error/?code=500');

			let values = response.data.map((channel: discord.GuildChannel) => {
				return {
					value: channel.id,
					label: `#${channel.name}`,
				};
			});

			setSelectOptions({
				...selectOptions,
				channels: {
					...selectOptions.channels,
					[option]: {
						// @ts-ignore
						...selectOptions.channels[option],
						values: values,
						isLoading: false,
					},
				},
			});
		}, 2000);
	};

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
		const getInfo = async () => {
			const trustedResult = await axios({
				method: 'post',
				url: `/api/users/getInfo`,
				headers: {},
				data: {
					users: props.server.config.Users.Trusted,
					server: props.server.info.id,
				},
			});

			if (trustedResult.data == '500') return (window.location.href = '/error/?code=500');

			const channelResult = await axios({
				method: 'post',
				url: `/api/channels/info`,
				headers: {},
				data: {
					channels: [
						{ id: props.server.config.Channels.ExitLog, key: 'ExitLog' },
						{ id: props.server.config.Channels.JoinLog, key: 'JoinLog' },
						{ id: props.server.config.Channels.ModLog, key: 'ModLog' },
						{ id: props.server.config.Channels.ModLog, key: 'BotLog' },
					],
				},
			});

			if (channelResult.data == '500') return (window.location.href = '/error/?code=500');

			setSelectOptions({
				...selectOptions,
				users: {
					...selectOptions.users,
					default: trustedResult.data.map((user) => {
						return {
							value: user.id,
							label: `${user.username}#${user.discriminator}`,
						};
					}),
					isLoading: false,
				},
				channels: {
					...selectOptions.channels,
					JoinLog: {
						...selectOptions.channels.JoinLog,
						default: {
							value: channelResult.data.JoinLog.value,
							label: `#${channelResult.data.JoinLog.label}`,
						},
						isLoading: false,
					},
					ExitLog: {
						...selectOptions.channels.ExitLog,
						default: {
							value: channelResult.data.ExitLog.value,
							label: `#${channelResult.data.ExitLog.label}`,
						},
						isLoading: false,
					},
					ModLog: {
						...selectOptions.channels.ModLog,
						default: {
							value: channelResult.data.ModLog.value,
							label: `#${channelResult.data.ModLog.label}`,
						},
						isLoading: false,
					},
					BotLog: {
						...selectOptions.channels.BotLog,
						default: {
							value: channelResult.data.BotLog.value,
							label: `#${channelResult.data.BotLog.label}`,
						},
						isLoading: false,
					},
				},
			});
		};

		getInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		<div className={styles['dashboard-general']}>
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>

			<Navbar user={props.user} lang={props.lang.navbar} />

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

				<Container fluid={true}>
					<Row sm={1} xs={1} md={2}>
						<Col>
							<h2>
								{props.lang.prefix} <HelpTooltip body={props.lang.tooltips.prefix} />
							</h2>
							<input
								defaultValue={props.server.config.Prefix}
								type='text'
								onChange={(e) => {
									setConfig({
										...config,
										Prefix: e.target.value,
									});
								}}
							/>

							<br />
							<br />
							<br />
							<br />

							<h2>
								{props.lang.users.trusted} <HelpTooltip body={props.lang.tooltips.trusted} />
							</h2>
							<Select
								isDisabled={props.server.info.owner !== props.user.id}
								options={selectOptions.users.values}
								onChange={(value) => {
									setConfig({
										...config,
										Users: {
											...config.Users,
											// @ts-ignore
											Trusted: value.map((v) => v.value),
										},
									});

									setSelectOptions({
										...selectOptions,
										users: {
											...selectOptions.users,
											// @ts-ignore
											default: value,
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.users.isLoading}
								isMulti={true}
								onInputChange={loadUsers}
								value={selectOptions.users.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>

							<br />
							<br />
							<br />

							<h2>
								{props.lang.channels.bot} <HelpTooltip body={props.lang.tooltips.bot} />
							</h2>
							<Select
								styles={selectStyles}
								isLoading={selectOptions.channels.BotLog.isLoading}
								value={selectOptions.channels.BotLog.default}
								onInputChange={(e) => loadChannels(e, 'BotLog')}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								onChange={(value) => {
									setConfig({
										...config,
										Channels: {
											...config.Channels,
											BotLog: value.value,
										},
									});

									setSelectOptions({
										...selectOptions,
										channels: {
											...selectOptions.channels,
											BotLog: {
												...selectOptions.channels.BotLog,
												default: value,
											},
										},
									});
								}}
								placeholder={props.lang.select}
								options={selectOptions.channels.BotLog.values}
							/>
						</Col>
						<Col className={styles['right-container']}>
							<h2>
								{props.lang.channels.join} <HelpTooltip body={props.lang.tooltips.join} />
							</h2>
							<Select
								styles={selectStyles}
								isLoading={selectOptions.channels.JoinLog.isLoading}
								value={selectOptions.channels.JoinLog.default}
								onInputChange={(e) => loadChannels(e, 'JoinLog')}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								onChange={(value) => {
									setConfig({
										...config,
										Channels: {
											...config.Channels,
											JoinLog: value.value,
										},
									});

									setSelectOptions({
										...selectOptions,
										channels: {
											...selectOptions.channels,
											JoinLog: {
												...selectOptions.channels.JoinLog,
												default: value,
											},
										},
									});
								}}
								placeholder={props.lang.select}
								options={selectOptions.channels.JoinLog.values}
							/>

							<br />
							<br />
							<br />

							<h2>
								{props.lang.channels.exit} <HelpTooltip body={props.lang.tooltips.exit} />
							</h2>
							<Select
								styles={selectStyles}
								isLoading={selectOptions.channels.ExitLog.isLoading}
								value={selectOptions.channels.ExitLog.default}
								onInputChange={(e) => loadChannels(e, 'ExitLog')}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								onChange={(value) => {
									setConfig({
										...config,
										Channels: {
											...config.Channels,
											ExitLog: value.value,
										},
									});

									setSelectOptions({
										...selectOptions,
										channels: {
											...selectOptions.channels,
											ExitLog: {
												...selectOptions.channels.ExitLog,
												default: value,
											},
										},
									});
								}}
								placeholder={props.lang.select}
								options={selectOptions.channels.ExitLog.values}
							/>

							<br />
							<br />
							<br />

							<h2>
								{props.lang.channels.mod} <HelpTooltip body={props.lang.tooltips.mod} />
							</h2>
							<Select
								styles={selectStyles}
								isLoading={selectOptions.channels.ModLog.isLoading}
								value={selectOptions.channels.ModLog.default}
								onInputChange={(e) => loadChannels(e, 'ModLog')}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								onChange={(value) => {
									setConfig({
										...config,
										Channels: {
											...config.Channels,
											ModLog: value.value,
										},
									});

									setSelectOptions({
										...selectOptions,
										channels: {
											...selectOptions.channels,
											ModLog: {
												...selectOptions.channels.ModLog,
												default: value,
											},
										},
									});
								}}
								placeholder={props.lang.select}
								options={selectOptions.channels.ModLog.values}
							/>
						</Col>
					</Row>
				</Container>

				<br />
				<br />
				{props.lang.note}
			</main>

			<footer>
				<SaveFooter open={unsavedChanges} reset={() => window.location.reload()} save={saveChanges} lang={props.lang.saveFooter} />
			</footer>
		</div>
	);
};

export default DashboardGeneral;
