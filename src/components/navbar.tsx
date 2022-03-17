/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

import Fade from 'react-bootstrap/Fade';
import { Dropdown } from 'react-bootstrap';

import styles from './navbar.module.scss';
import { NextPage } from 'next';

const Navbar: any = (props: { user: any; lang: any }) => {
	const [open, setOpen] = useState(false);

	return (
		<div className={styles['navbar']}>
			<img width='50' src='/assets/images/logo.png' alt='Shard Logo' />
			<h1>Shard Bot</h1>

			<div className={`${styles['align-left']}`}>
				{props.user !== null && (
					<Dropdown>
						<Dropdown.Toggle variant='none' className='shadow-none' id='dropdown-basic'>
							<img
								width='20'
								src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png`}
								alt='Shard Logo'
							/>
							<p>
								{props.user.username}#{props.user.discriminator}
							</p>
						</Dropdown.Toggle>

						<Fade in={open}>
							<Dropdown.Menu className={`container ${styles.dropdown}`} align='end'>
								<Dropdown.Item href='/'>{props.lang.home}</Dropdown.Item>
								<Dropdown.Item href='/guide'>{props.lang.guide}</Dropdown.Item>
								<Dropdown.Item href='/dashboard'>{props.lang.servers}</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item href='/api/auth/logout'>{props.lang.logout}</Dropdown.Item>
							</Dropdown.Menu>
						</Fade>
					</Dropdown>
				)}

				{props.user === null && (
					<div className={styles['not-logged-menu']}>
						<a href='/api/auth/loginRedirect'>{props.lang.login}</a>
						<a href='https://discord.gg/2WEzY3KGYC'>{props.lang.support}</a>
						<a href='/invite'>{props.lang.invite}</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
