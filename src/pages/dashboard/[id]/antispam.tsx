/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Navbar from '../../../components/navbar';
import SaveFooter from '../../../components/save-footer';
import HelpTooltip from '../../../components/help-tooltip';

import Switch from 'react-switch';
import { Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import Particles from 'react-tsparticles';
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
		},
		roles: {
			wallText: {
				values: [],
				default: [],
				isLoading: true,
			},
		},
	});

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

			let values = [];
			for (let i = 0; i < response.data.length; i++) {
				values.push({
					value: response.data[i].id,
					label: `${response.data[i].username}#${response.data[i].discriminator}`,
				});
			}

			for (let i = 0; i < selectOptions.users.wallText.default.length; i++) {
				for (let j = 0; j < values.length; j++) {
					if (selectOptions.users.wallText.default[i].value == values[j].value) {
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

		clearTimeout(loadUsersTimer);
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

			let values = [];
			for (let i = 0; i < response.data.length; i++) {
				values.push({
					value: response.data[i].id,
					label: response.data[i].name,
				});
			}

			for (let i = 0; i < selectOptions.roles.wallText.default.length; i++) {
				for (let j = 0; j < values.length; j++) {
					if (selectOptions.roles.wallText.default[i].value == values[j].value) {
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
			const wallTextWhiteListedUsers = await axios({
				method: 'post',
				url: `/api/users/getInfo`,
				headers: {},
				data: {
					users: props.server.config.Modules.AntiWallText.Whitelist.Users,
					server: props.server.info.id,
				},
			});

			const wallTextWhiteListedRoles = await axios({
				method: 'post',
				url: `/api/roles/getInfo`,
				headers: {},
				data: {
					roles: props.server.config.Modules.AntiWallText.Whitelist.Roles,
					server: props.server.info.id,
				},
			});

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
				},
				roles: {
					...selectOptions.roles,
					wallText: {
						...selectOptions.roles.wallText,
						default: wallTextWhiteListedRoles.data,
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
								value={config.Modules.AntiWallText.Percent}
								max={100}
								min={1}
								onChange={(e) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											AntiWallText: {
												...config.Modules.AntiWallText,
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
								value={config.Modules.AntiWallText.PercentTimeLimit}
								max={300}
								min={1}
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
						</Col>
						<Col className={styles['right-container']}>
							<h5>
								{props.lang.whitelistUsers} <HelpTooltip body={props.lang.whitelistUsersDesc} />
							</h5>
							<Select
								options={selectOptions.users.wallText.values}
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
						</Col>
					</Row>
				</Container>
				<br />
				<br />
				<Container>
					<h1>{props.lang.flood}</h1>
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
						<Col className={styles['right-container']}>ejwioqejqw</Col>
					</Row>
				</Container>
				<br />
				<br />
				<Container>
					<h1>{props.lang.caps}</h1>
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
						<Col className={styles['right-container']}>ejwioqejqw</Col>
					</Row>
				</Container>
			</main>

			<footer>
				<SaveFooter open={unsavedChanges} reset={() => window.location.reload()} save={saveChanges} lang={props.lang.saveFooter} />
			</footer>
		</div>
	);
};

export default AntiSpam;
