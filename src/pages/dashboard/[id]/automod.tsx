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

import styles from '../../../assets/styles/dashboard/automod.module.scss';
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
		url: `${process.env.HOST}/api/content/dashboard?page=automod`,
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

const AutoMod = (props: any) => {
	const [config, setConfig] = useState(props.server.config);
	const [unsavedChanges, setUnsavedChanges] = useState(false);
	const [selectOptions, setSelectOptions] = useState({
		users: {
			values: [],
			default: [],
			isLoading: true,
		},
		roles: {
			values: [],
			default: [],
			isLoading: true,
		},
	});

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

	const loadUsers = (inputValue: string) => {
		if (!inputValue) return;

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

	const loadRoles = (inputValue: string) => {
		if (!inputValue) return;

		clearTimeout(loadUsersTimer);
		setSelectOptions({
			...selectOptions,
			roles: {
				...selectOptions.roles,
				isLoading: true,
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

			for (let i = 0; i < selectOptions.roles.default.length; i++) {
				for (let j = 0; j < values.length; j++) {
					if (selectOptions.roles.default[i].value == values[j].value) {
						values.splice(j, 1);
					}
				}
			}

			setSelectOptions({
				...selectOptions,
				roles: {
					...selectOptions.roles,
					// @ts-ignore
					values: values,
					isLoading: false,
				},
			});
		}, 2000);
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
			const whiteListedUsers = await axios({
				method: 'post',
				url: `/api/users/getInfo`,
				headers: {},
				data: {
					users: props.server.config.Modules.Automod.Whitelist.Users,
					server: props.server.info.id,
				},
			});

			const whiteListedRoles = await axios({
				method: 'post',
				url: `/api/roles/getInfo`,
				headers: {},
				data: {
					roles: props.server.config.Modules.Automod.Whitelist.Roles,
					server: props.server.info.id,
				},
			});

			setSelectOptions({
				...selectOptions,
				users: {
					...selectOptions.users,
					default: whiteListedUsers.data.map((user) => {
						return {
							value: user.id,
							label: `${user.username}#${user.discriminator}`,
						};
					}),
					isLoading: false,
				},
				roles: {
					...selectOptions.roles,
					default: whiteListedRoles.data,
					isLoading: false,
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
		<div className={styles['dashboard-automod']}>
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

				<Container fluid={true}>
					<Row sm={1} xs={1} md={2}>
						<Col>
							<h5>{props.lang.status}</h5>
							<Switch
								checked={config.Modules.Automod.Enabled}
								onChange={() => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											Automod: {
												...config.Modules.Automod,
												Enabled: !config.Modules.Automod.Enabled,
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
						</Col>
						<Col>
							<h5>
								{props.lang.whitelistUsers} <HelpTooltip body={props.lang.whitelistUsersDesc} />
							</h5>
							<Select
								options={selectOptions.users.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											Automod: {
												...config.Modules.Automod,
												Whitelist: {
													...config.Modules.Automod.Whitelist,
													Users: value.map((v) => v.value),
												},
											},
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
								onInputChange={(inputValue) => {
									loadUsers(inputValue);
								}}
								value={selectOptions.users.default}
								styles={selectStyles}
								placeholder={props.lang.select}
							/>
							<br />
							<br />
							<h5>
								{props.lang.whitelistRoles} <HelpTooltip body={props.lang.whitelistRolesDesc} />
							</h5>
							<Select
								options={selectOptions.roles.values}
								isDisabled={!isOwnerOrTrusted}
								onChange={(value) => {
									setConfig({
										...config,
										Modules: {
											...config.Modules,
											Automod: {
												...config.Modules.Automod,
												Whitelist: {
													...config.Modules.Automod.Whitelist,
													Roles: value.map((v) => v.value),
												},
											},
										},
									});

									setSelectOptions({
										...selectOptions,
										roles: {
											...selectOptions.roles,
											// @ts-ignore
											default: value,
										},
									});
								}}
								components={{
									NoOptionsMessage: () => null,
									ClearIndicator: () => null,
								}}
								isLoading={selectOptions.roles.isLoading}
								isMulti={true}
								onInputChange={(inputValue) => {
									loadRoles(inputValue);
								}}
								value={selectOptions.roles.default}
								styles={selectStyles}
								placeholder={props.lang.select}
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

export default AutoMod;
