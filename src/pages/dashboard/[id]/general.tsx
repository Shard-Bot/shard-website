/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import discord from 'discord.js';

import Navbar from '../../../components/navbar';
import SaveFooter from '../../../components/save-footer';

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

			let values = [];
			for (let i = 0; i < response.data.length; i++) {
				values.push({
					value: response.data[i].id,
					label: `${response.data[i].username}#${response.data[i].discriminator}`,
				});
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

	const loadRoles = (inputValue: string) => {
		if (!inputValue) return;

		clearTimeout(loadRolesTimer);
		setSelectOptions({
			...selectOptions,
			roles: {
				...selectOptions.roles,
				muted: {
					...selectOptions.roles.muted,
					isLoading: true,
				},
			},
		});

		loadRolesTimer = setTimeout(async () => {
			let response = await axios({
				method: 'post',
				url: `/api/roles/search`,
				headers: {},
				data: {
					query: inputValue,
					server: props.server.info.id,
				},
			});

			let values = response.data.map((role: discord.Role) => {
				return {
					value: role.id,
					label: role.name,
				};
			});

			setSelectOptions({
				...selectOptions,
				roles: {
					...selectOptions.roles,
					muted: {
						...selectOptions.roles.muted,
						// @ts-ignore
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

		console.log(response.data);
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

			const mutedResult = await axios({
				method: 'post',
				url: `/api/roles/info`,
				headers: {},
				data: {
					role: props.server.config.Roles.MuteRol,
					server: props.server.info.id,
				},
			});

			const channelResult = await axios({
				method: 'post',
				url: `/api/channels/info`,
				headers: {},
				data: {
					channels: [
						{ id: props.server.config.Channels.ExitLog, key: 'ExitLog' },
						{ id: props.server.config.Channels.JoinLog, key: 'JoinLog' },
						{ id: props.server.config.Channels.ModLog, key: 'ModLog' },
					],
				},
			});

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
				roles: {
					muted: {
						...selectOptions.roles.muted,
						default: {
							value: mutedResult.data.id,
							label: mutedResult.data.name,
						},
						isLoading: false,
					},
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
			<Navbar user={props.user} lang={props.lang.navbar} />
			<Head>
				<title>{props.lang.pageTitle}</title>
			</Head>

			<Particles
				className={styles['']}
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
							<h2>{props.lang.prefix}</h2>
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

							<h2>{props.lang.users.trusted}</h2>
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

							<h2>{props.lang.roles.muted}</h2>
							<Select
								styles={selectStyles}
								isLoading={selectOptions.roles.muted.isLoading}
								value={selectOptions.roles.muted.default}
								onInputChange={(e) => loadRoles(e)}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								onChange={(value) => {
									setSelectOptions({
										...selectOptions,
										roles: {
											...selectOptions.roles,
											muted: {
												...selectOptions.roles.muted,
												default: value,
											},
										},
									});

									setConfig({
										...config,
										Roles: {
											...config.Roles,
											// @ts-ignore
											MuteRol: value.value,
										},
									});
								}}
								placeholder={props.lang.select}
								options={selectOptions.roles.muted.values}
							/>
						</Col>
						<Col className={styles['right-container']}>
							<h2>{props.lang.channels.join}</h2>
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

							<h2>{props.lang.channels.exit}</h2>
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

							<h2>{props.lang.channels.mod}</h2>
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
			</main>

			<footer>
				<SaveFooter open={unsavedChanges} reset={() => window.location.reload()} save={saveChanges} lang={props.lang.saveFooter} />
			</footer>
		</div>
	);
};

export default DashboardGeneral;
