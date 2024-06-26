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
		url: `${process.env.HOST}/api/content/dashboard?page=antispam`,
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

let loadUsersTimer: any = null;
let loadRolesTimer: any = null;
let loadChannelsTimer: any = null;

const AntiSpam = (props: any) => {
	const [config, setConfig] = useState(props.server.config);
	const [unsavedChanges, setUnsavedChanges] = useState(false);
	const [selectOptions, setSelectOptions] = useState({
		users: {
			wallText: {
				values: [],
				default: [],
				isLoading: true,
			},
			antiFlood: {
				values: [],
				default: [],
				isLoading: true,
			},
			antiCaps: {
				values: [],
				default: [],
				isLoading: true,
			},
			antiLinks: {
				values: [],
				default: [],
				isLoading: true,
			},
		},
		roles: {
			wallText: {
				values: [],
				default: [],
				isLoading: true,
			},
			antiFlood: {
				values: [],
				default: [],
				isLoading: true,
			},
			antiCaps: {
				values: [],
				default: [],
				isLoading: true,
			},
			antiLinks: {
				values: [],
				default: [],
				isLoading: true,
			},
		},
		channels: {
			wallText: {
				values: [],
				default: [],
				isLoading: true,
			},
			antiFlood: {
				values: [],
				default: [],
				isLoading: true,
			},
			antiCaps: {
				values: [],
				default: [],
				isLoading: true,
			},
			antiLinks: {
				values: [],
				default: [],
				isLoading: true,
			},
		},
	});

	const isOwnerOrTrusted = config.Users.Trusted.includes(props.user.id) || props.server.ownerID == props.user.id;

	const loadUsers = (inputValue: string, field: string) => {
		if (!inputValue) return;

		clearTimeout(loadUsersTimer);
		setSelectOptions({
			...selectOptions,
			users: {
				...selectOptions.users,
				[field]: {
					...selectOptions.users[field],
					isLoading: true,
				},
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

			if (response.data == "500") return window.location.href = '/error/?code=500';

			let values = [];
			for (let i = 0; i < response.data.length; i++) {
				values.push({
					value: response.data[i].id,
					label: `${response.data[i].username}#${response.data[i].discriminator}`,
				});
			}

			for (let i = 0; i < selectOptions.users[field].default.length; i++) {
				for (let j = 0; j < values.length; j++) {
					if (selectOptions.users[field].default[i].value == values[j].value) {
						values.splice(j, 1);
					}
				}
			}

			setSelectOptions({
				...selectOptions,
				users: {
					...selectOptions.users,
					[field]: {
						...selectOptions.users[field],
						// @ts-ignore
						values: values,
						isLoading: false,
					},
				},
			});
		}, 2000);
	};

	const loadRoles = (inputValue: string, field: string) => {
		if (!inputValue) return;

		clearTimeout(loadRolesTimer);
		setSelectOptions({
			...selectOptions,
			roles: {
				...selectOptions.roles,
				[field]: {
					...selectOptions.roles[field],
					isLoading: true,
				},
			},
		});

		loadRolesTimer = setTimeout(async () => {
			const response = await axios({
				method: 'post',
				url: `/api/roles/search`,
				headers: {},
				data: {
					query: inputValue,
					server: props.server.info.id,
				},
			});

			if (response.data == "500") return window.location.href = '/error/?code=500';

			let values = [];
			for (let i = 0; i < response.data.length; i++) {
				values.push({
					value: response.data[i].id,
					label: response.data[i].name,
				});
			}

			for (let i = 0; i < selectOptions.roles[field].default.length; i++) {
				for (let j = 0; j < values.length; j++) {
					if (selectOptions.roles[field].default[i].value == values[j].value) {
						values.splice(j, 1);
					}
				}
			}

			setSelectOptions({
				...selectOptions,
				roles: {
					...selectOptions.roles,
					[field]: {
						...selectOptions.roles[field],
						// @ts-ignore
						values: values,
						isLoading: false,
					},
				},
			});
		}, 2000);
	};

	const loadChannels = (inputValue: string, field: string) => {
		if (!inputValue) return;

		clearTimeout(loadChannelsTimer);

		setSelectOptions({
			...selectOptions,
			channels: {
				...selectOptions.channels,
				[field]: {
					...selectOptions.channels[field],
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

			if (response.data == "500") return window.location.href = '/error/?code=500';

			let values = [];
			for (let i = 0; i < response.data.length; i++) {
				values.push({
					value: response.data[i].id,
					label: response.data[i].name,
				});
			}

			for (let i = 0; i < selectOptions.channels[field].default.length; i++) {
				for (let j = 0; j < values.length; j++) {
					if (selectOptions.channels[field].default[i].value == values[j].value) {
						values.splice(j, 1);
					}
				}
			}

			setSelectOptions({
				...selectOptions,
				channels: {
					...selectOptions.channels,
					[field]: {
						...selectOptions.channels[field],
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

		if (response.data == "500") return window.location.href = '/error/?code=500';
	};

	useEffect(() => {
		const getInfo = async () => {
			// Users
			const wallTextWhiteListedUsers = await axios({
				method: 'post',
				url: `/api/users/getInfo`,
				headers: {},
				data: {
					users: props.server.config.Modules.AntiWallText.Whitelist.Users,
					server: props.server.info.id,
				},
			});

			if (wallTextWhiteListedUsers.data == "500") return window.location.href = '/error/?code=500';
			
			const floodWhiteListedUsers = await axios({
				method: 'post',
				url: `/api/users/getInfo`,
				headers: {},
				data: {
					users: props.server.config.Modules.AntiFlood.Whitelist.Users,
					server: props.server.info.id,
				},
			});

			if (floodWhiteListedUsers.data == "500") return window.location.href = '/error/?code=500';

			const linksWhiteListedUsers = await axios({
				method: 'post',
				url: `/api/users/getInfo`,
				headers: {},
				data: {
					users: props.server.config.Modules.AntiLinks.Whitelist.Users,
					server: props.server.info.id,
				},
			});

			if (linksWhiteListedUsers.data == "500") return window.location.href = '/error/?code=500';

			const capsWhiteListedUsers = await axios({
				method: 'post',
				url: `/api/users/getInfo`,
				headers: {},
				data: {
					users: props.server.config.Modules.AntiCaps.Whitelist.Users,
					server: props.server.info.id,
				},
			});

			if (capsWhiteListedUsers.data == "500") return window.location.href = '/error/?code=500';

			// Roles
			const wallTextWhiteListedRoles = await axios({
				method: 'post',
				url: `/api/roles/getInfo`,
				headers: {},
				data: {
					roles: props.server.config.Modules.AntiWallText.Whitelist.Roles,
					server: props.server.info.id,
				},
			});

			if (wallTextWhiteListedRoles.data == "500") return window.location.href = '/error/?code=500';

			const floodWhiteListedRoles = await axios({
				method: 'post',
				url: `/api/roles/getInfo`,
				headers: {},
				data: {
					roles: props.server.config.Modules.AntiFlood.Whitelist.Roles,
					server: props.server.info.id,
				},
			});

			if (floodWhiteListedRoles.data == "500") return window.location.href = '/error/?code=500';
			
			const capsWhiteListedRoles = await axios({
				method: 'post',
				url: `/api/roles/getInfo`,
				headers: {},
				data: {
					roles: props.server.config.Modules.AntiCaps.Whitelist.Roles,
					server: props.server.info.id,
				},
			});

			if (capsWhiteListedRoles.data == "500") return window.location.href = '/error/?code=500';

			const linksWhiteListedRoles = await axios({
				method: 'post',
				url: `/api/roles/getInfo`,
				headers: {},
				data: {
					roles: props.server.config.Modules.AntiLinks.Whitelist.Roles,
					server: props.server.info.id,
				},
			});

			if (linksWhiteListedRoles.data == "500") return window.location.href = '/error/?code=500';

			// Channels
			const wallTextWhiteListedChannels = await axios({
				method: 'post',
				url: `/api/channels/getInfo`,
				headers: {},
				data: {
					channels: props.server.config.Modules.AntiWallText.Whitelist.Channels,
					server: props.server.info.id,
				},
			});

			if (wallTextWhiteListedChannels.data == "500") return window.location.href = '/error/?code=500';

			const floodWhiteListedChannels = await axios({
				method: 'post',
				url: `/api/channels/getInfo`,
				headers: {},
				data: {
					channels: props.server.config.Modules.AntiFlood.Whitelist.Channels,
					server: props.server.info.id,
				},
			});

			if (floodWhiteListedChannels.data == "500") return window.location.href = '/error/?code=500';

			const capsWhiteListedChannels = await axios({
				method: 'post',
				url: `/api/channels/getInfo`,
				headers: {},
				data: {
					channels: props.server.config.Modules.AntiCaps.Whitelist.Channels,
					server: props.server.info.id,
				},
			});

			if (capsWhiteListedChannels.data == "500") return window.location.href = '/error/?code=500';

			const linksWhiteListedChannels = await axios({
				method: 'post',
				url: `/api/channels/getInfo`,
				headers: {},
				data: {
					channels: props.server.config.Modules.AntiLinks.Whitelist.Channels,
					server: props.server.info.id,
				},
			});

			if (linksWhiteListedChannels.data == "500") return window.location.href = '/error/?code=500';

			setSelectOptions({
				...selectOptions,
				users: {
					...selectOptions.users,
					wallText: {
						...selectOptions.users.wallText,
						default: wallTextWhiteListedUsers.data.map((user) => {
							return {
								value: user.id,
								label: `${user.username}#${user.discriminator}`,
							};
						}),
						isLoading: false,
					},
					antiFlood: {
						...selectOptions.users.antiFlood,
						default: floodWhiteListedUsers.data.map((user) => {
							return {
								value: user.id,
								label: `${user.username}#${user.discriminator}`,
							};
						}),
						isLoading: false,
					},
					antiCaps: {
						...selectOptions.users.antiCaps,
						default: capsWhiteListedUsers.data.map((user) => {
							return {
								value: user.id,
								label: `${user.username}#${user.discriminator}`,
							};
						}),
						isLoading: false,
					},
					antiLinks: {
						...selectOptions.users.antiLinks,
						default: linksWhiteListedUsers.data.map((user) => {
							return {
								value: user.id,
								label: `${user.username}#${user.discriminator}`,
							};
						}),
						isLoading: false,
					},
				},
				roles: {
					...selectOptions.roles,
					wallText: {
						...selectOptions.roles.wallText,
						default: wallTextWhiteListedRoles.data,
						isLoading: false,
					},
					antiFlood: {
						...selectOptions.roles.antiFlood,
						default: floodWhiteListedRoles.data,
						isLoading: false,
					},
					antiCaps: {
						...selectOptions.roles.antiCaps,
						default: capsWhiteListedRoles.data,
						isLoading: false,
					},
					antiLinks: {
						...selectOptions.roles.antiLinks,
						default: linksWhiteListedRoles.data,
						isLoading: false,
					},
				},
				channels: {
					...selectOptions.channels,
					wallText: {
						...selectOptions.channels.wallText,
						default: wallTextWhiteListedChannels.data,
						isLoading: false,
					},
					antiFlood: {
						...selectOptions.channels.antiFlood,
						default: floodWhiteListedChannels.data,
						isLoading: false,
					},
					antiCaps: {
						...selectOptions.channels.antiCaps,
						default: capsWhiteListedChannels.data,
						isLoading: false,
					},
					antiLinks: {
						...selectOptions.channels.antiLinks,
						default: linksWhiteListedChannels.data,
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
		<div className={styles['dashboard-antispam']}>
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

				{/* AntiWallText */}
				<Container>
					<h1>{props.lang.textWalls}</h1>
					<Row sm={1} xs={1} md={2}>
						<Col>
							<h5>{props.lang.status}</h5>
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
								disabled={!isOwnerOrTrusted}
								onColor='#86d3ff'
								onHandleColor='#2693e6'
								handleDiameter={30}
								uncheckedIcon={false}
								checkedIcon={false}
								boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
								activeBoxShadow='0px 0px 1px 10px rgba(0, 0, 0, 0.2)'
								height={20}
								width={48}
							/>

							<br />
							<br />
							<h5>
								{props.lang.resetTimeout} <HelpTooltip body={props.lang.resetTimeoutDesc} />
							</h5>
							<input
								type='number'
								placeholder={props.lang.resetTimeoutPlaceholder}
								value={config.Modules.AntiWallText.PercentTimeLimit}
								disabled={!isOwnerOrTrusted}
								onChange={(e) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiWallText: {
												...config.Modules.AntiWallText,
												PercentTimeLimit: parseInt(e.target.value),
											},
										},
									});
								}}
							/>

							<br />
							<br />
							<h5>
								{props.lang.charLimit} <HelpTooltip body={props.lang.wallTextLimitDesc} />
							</h5>
							<input
								type='number'
								placeholder={props.lang.wallTextLimitPlaceholder}
								value={config.Modules.AntiWallText.Limit}
								disabled={!isOwnerOrTrusted}
								onChange={(e) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiWallText: {
												...config.Modules.AntiWallText,
												Limit: parseInt(e.target.value),
											},
										},
									});
								}}
							/>
						</Col>
						<Col className={styles['right-container']}>
							<h5>
								{props.lang.whitelistUsers} <HelpTooltip body={props.lang.whitelistUsersDesc} />
							</h5>
							<Select
								options={selectOptions.users.wallText.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiWallText: {
												...config.Modules.AntiWallText,
												Whitelist: {
													...config.Modules.AntiWallText.Whitelist,
													Users: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										users: {
											...selectOptions.users,
											wallText: {
												...selectOptions.users.wallText,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.users.wallText.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadUsers(inputValue, 'wallText');
								}}
								value={selectOptions.users.wallText.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>
							<br />
							<br />
							<h5>
								{props.lang.whitelistRoles} <HelpTooltip body={props.lang.whitelistRolesDesc} />
							</h5>
							<Select
								options={selectOptions.roles.wallText.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiWallText: {
												...config.Modules.AntiWallText,
												Whitelist: {
													...config.Modules.AntiWallText.Whitelist,
													Roles: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										roles: {
											...selectOptions.roles,
											wallText: {
												...selectOptions.roles.wallText,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.roles.wallText.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadRoles(inputValue, 'wallText');
								}}
								value={selectOptions.roles.wallText.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>

							<br />
							<br />
							<h5>
								{props.lang.whitelistChannels} <HelpTooltip body={props.lang.whitelistChannelsDesc} />
							</h5>
							<Select
								options={selectOptions.channels.wallText.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiWallText: {
												...config.Modules.AntiWallText,
												Whitelist: {
													...config.Modules.AntiWallText.Whitelist,
													Channels: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										channels: {
											...selectOptions.channels,
											wallText: {
												...selectOptions.channels.wallText,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.channels.wallText.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadChannels(inputValue, 'wallText');
								}}
								value={selectOptions.channels.wallText.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>
						</Col>
					</Row>
				</Container>
				<br />
				<br />

				{/* AntiFlood */}
				<Container>
					<h1>{props.lang.flood}</h1>
					<Row sm={1} xs={1} md={2}>
						<Col>
							<h5>{props.lang.status}</h5>
							<Switch
								checked={config.Modules.AntiFlood.Enabled}
								disabled={!isOwnerOrTrusted}
								onChange={() => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiFlood: {
												...config.Modules.AntiFlood,
												Enabled: !config.Modules.AntiFlood.Enabled,
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
							/>

							<br />
							<br />
							<h5>
								{props.lang.percentage} <HelpTooltip body={props.lang.percentageDesc} />
							</h5>
							<input
								type='number'
								placeholder={props.lang.percentagePlaceholder}
								value={config.Modules.AntiFlood.Percent}
								disabled={!isOwnerOrTrusted}
								onChange={(e) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiFlood: {
												...config.Modules.AntiFlood,
												Percent: parseInt(e.target.value),
											},
										},
									});
								}}
							/>

							<br />
							<br />
							<h5>
								{props.lang.resetTimeout} <HelpTooltip body={props.lang.resetTimeoutDesc} />
							</h5>
							<input
								type='number'
								placeholder={props.lang.resetTimeoutPlaceholder}
								value={config.Modules.AntiFlood.PercentTimeLimit}
								disabled={!isOwnerOrTrusted}
								onChange={(e) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiFlood: {
												...config.Modules.AntiFlood,
												PercentTimeLimit: parseInt(e.target.value),
											},
										},
									});
								}}
							/>
						</Col>
						<Col className={styles['right-container']}>
							<h5>
								{props.lang.whitelistUsers} <HelpTooltip body={props.lang.whitelistUsersDesc} />
							</h5>
							<Select
								options={selectOptions.users.antiFlood.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiFlood: {
												...config.Modules.AntiFlood,
												Whitelist: {
													...config.Modules.AntiFlood.Whitelist,
													Users: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										users: {
											...selectOptions.users,
											antiFlood: {
												...selectOptions.users.wallText,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.users.antiFlood.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadUsers(inputValue, 'antiFlood');
								}}
								value={selectOptions.users.antiFlood.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>
							<br />
							<br />
							<h5>
								{props.lang.whitelistRoles} <HelpTooltip body={props.lang.whitelistRolesDesc} />
							</h5>
							<Select
								options={selectOptions.roles.antiFlood.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiFlood: {
												...config.Modules.AntiFlood,
												Whitelist: {
													...config.Modules.AntiFlood.Whitelist,
													Roles: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										roles: {
											...selectOptions.roles,
											antiFlood: {
												...selectOptions.roles.antiFlood,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.roles.antiFlood.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadRoles(inputValue, 'antiFlood');
								}}
								value={selectOptions.roles.antiFlood.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>

							<br />
							<br />
							<h5>
								{props.lang.whitelistChannels} <HelpTooltip body={props.lang.whitelistChannelsDesc} />
							</h5>
							<Select
								options={selectOptions.channels.antiFlood.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiFlood: {
												...config.Modules.AntiFlood,
												Whitelist: {
													...config.Modules.AntiFlood.Whitelist,
													Channels: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										channels: {
											...selectOptions.channels,
											antiFlood: {
												...selectOptions.channels.antiFlood,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.channels.antiFlood.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadChannels(inputValue, 'antiFlood');
								}}
								value={selectOptions.channels.antiFlood.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>
						</Col>
					</Row>
				</Container>
				<br />
				<br />

				{/* AntiCap */}
				<Container>
					<h1>{props.lang.caps}</h1>
					<Row sm={1} xs={1} md={2}>
						<Col>
							<h5>{props.lang.status}</h5>
							<Switch
								checked={config.Modules.AntiCaps.Enabled}
								disabled={!isOwnerOrTrusted}
								onChange={() => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiCaps: {
												...config.Modules.AntiCaps,
												Enabled: !config.Modules.AntiCaps.Enabled,
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
							/>

							<br />
							<br />
							<h5>
								{props.lang.percentage} <HelpTooltip body={props.lang.percentageDesc} />
							</h5>
							<input
								type='number'
								placeholder={props.lang.percentagePlaceholder}
								value={config.Modules.AntiCaps.Percent}
								disabled={!isOwnerOrTrusted}
								onChange={(e) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiCaps: {
												...config.Modules.AntiCaps,
												Percent: parseInt(e.target.value),
											},
										},
									});
								}}
							/>

							<br />
							<br />
							<h5>
								{props.lang.resetTimeout} <HelpTooltip body={props.lang.resetTimeoutDesc} />
							</h5>
							<input
								type='number'
								placeholder={props.lang.resetTimeoutPlaceholder}
								value={config.Modules.AntiCaps.PercentTimeLimit}
								disabled={!isOwnerOrTrusted}
								onChange={(e) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiCaps: {
												...config.Modules.AntiCaps,
												PercentTimeLimit: parseInt(e.target.value),
											},
										},
									});
								}}
							/>

							<br />
							<br />
							<h5>
								{props.lang.charLimit} <HelpTooltip body={props.lang.capsLimitDesc} />
							</h5>
							<input
								type='number'
								placeholder={props.lang.capsLimitPlaceholder}
								value={config.Modules.AntiCaps.Limit}
								disabled={!isOwnerOrTrusted}
								onChange={(e) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiCaps: {
												...config.Modules.AntiCaps,
												Limit: parseInt(e.target.value),
											},
										},
									});
								}}
							/>
						</Col>
						<Col className={styles['right-container']}>
							<h5>
								{props.lang.whitelistUsers} <HelpTooltip body={props.lang.whitelistUsersDesc} />
							</h5>
							<Select
								options={selectOptions.users.antiCaps.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiCaps: {
												...config.Modules.AntiCaps,
												Whitelist: {
													...config.Modules.AntiCaps.Whitelist,
													Users: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										users: {
											...selectOptions.users,
											antiCaps: {
												...selectOptions.users.antiCaps,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.users.antiCaps.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadUsers(inputValue, 'antiCaps');
								}}
								value={selectOptions.users.antiCaps.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>
							<br />
							<br />
							<h5>
								{props.lang.whitelistRoles} <HelpTooltip body={props.lang.whitelistRolesDesc} />
							</h5>
							<Select
								options={selectOptions.roles.antiCaps.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiCaps: {
												...config.Modules.AntiCaps,
												Whitelist: {
													...config.Modules.AntiCaps.Whitelist,
													Roles: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										roles: {
											...selectOptions.roles,
											antiCaps: {
												...selectOptions.roles.antiCaps,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.roles.antiCaps.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadRoles(inputValue, 'antiCaps');
								}}
								value={selectOptions.roles.antiCaps.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>

							<br />
							<br />
							<h5>
								{props.lang.whitelistChannels} <HelpTooltip body={props.lang.whitelistChannelsDesc} />
							</h5>
							<Select
								options={selectOptions.channels.antiCaps.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiCaps: {
												...config.Modules.AntiCaps,
												Whitelist: {
													...config.Modules.AntiCaps.Whitelist,
													Channels: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										channels: {
											...selectOptions.channels,
											antiCaps: {
												...selectOptions.channels.antiCaps,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.channels.antiCaps.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadChannels(inputValue, 'antiCaps');
								}}
								value={selectOptions.channels.antiCaps.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>
						</Col>
					</Row>
				</Container>
				<br />
				<br />

				{/* AntiLinks */}
				<Container>
					<h1>{props.lang.links}</h1>
					<Row sm={1} xs={1} md={2}>
						<Col>
							<h5>{props.lang.status}</h5>
							<Switch
								checked={config.Modules.AntiLinks.Enabled}
								disabled={!isOwnerOrTrusted}
								onChange={() => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiLinks: {
												...config.Modules.AntiLinks,
												Enabled: !config.Modules.AntiLinks.Enabled,
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
							/>

							<br />
							<br />
							<h5>
								{props.lang.allowImages} <HelpTooltip body={props.lang.allowImagesDesc} />
							</h5>
							<Switch
								checked={config.Modules.AntiLinks.AllowImages}
								disabled={!isOwnerOrTrusted}
								onChange={() => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiLinks: {
												...config.Modules.AntiLinks,
												AllowImages: !config.Modules.AntiLinks.AllowImages,
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
							/>
						</Col>

						<Col className={styles['right-container']}>
							<h5>
								{props.lang.whitelistUsers} <HelpTooltip body={props.lang.whitelistUsersDesc} />
							</h5>
							<Select
								options={selectOptions.users.antiLinks.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiLinks: {
												...config.Modules.AntiLinks,
												Whitelist: {
													...config.Modules.AntiLinks.Whitelist,
													Users: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										users: {
											...selectOptions.users,
											antiLinks: {
												...selectOptions.users.antiLinks,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.users.antiLinks.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadUsers(inputValue, 'antiLinks');
								}}
								value={selectOptions.users.antiLinks.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>
							<br />
							<br />
							<h5>
								{props.lang.whitelistRoles} <HelpTooltip body={props.lang.whitelistRolesDesc} />
							</h5>
							<Select
								options={selectOptions.roles.antiLinks.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiLinks: {
												...config.Modules.AntiLinks,
												Whitelist: {
													...config.Modules.AntiLinks.Whitelist,
													Roles: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										roles: {
											...selectOptions.roles,
											antiLinks: {
												...selectOptions.roles.antiLinks,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.roles.antiCaps.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadRoles(inputValue, 'antiCaps');
								}}
								value={selectOptions.roles.antiCaps.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>

							<br />
							<br />
							<h5>
								{props.lang.whitelistChannels} <HelpTooltip body={props.lang.whitelistChannelsDesc} />
							</h5>
							<Select
								options={selectOptions.channels.antiLinks.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiLinks: {
												...config.Modules.AntiLinks,
												Whitelist: {
													...config.Modules.AntiLinks.Whitelist,
													Channels: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										channels: {
											...selectOptions.channels,
											antiLinks: {
												...selectOptions.channels.antiLinks,
												// @ts-ignore
												default: value,
											},
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.channels.antiLinks.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadChannels(inputValue, 'antiLinks');
								}}
								value={selectOptions.channels.antiLinks.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>
						</Col>
					</Row>
				</Container>

				<br />
				<br />

				{!isOwnerOrTrusted && props.lang.permissionsNote}
			</main>

			<footer>
				<SaveFooter open={unsavedChanges} reset={() => window.location.reload()} save={saveChanges} lang={props.lang.saveFooter} />
			</footer>
		</div>
	);
};

export default AntiSpam;
