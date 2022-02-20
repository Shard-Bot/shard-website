import React from 'react';
import styles from './save-footer.module.scss';
import { motion } from 'framer-motion';

export default function saveFooter(props) {
	return (
		<motion.div
			variants={{
				hidden: {
					opacity: 0,
				},
				visible: {
					opacity: 1,
					transition: {
						duration: 0.5,
						ease: 'easeInOut',
					},
				},
			}}
			initial={props.open ? 'visible' : 'hidden'}
			animate={props.open ? 'visible' : 'hidden'}
			className={styles['save-footer']}
		>
			<p>{props.lang.content}</p>
			<button className={styles['save-button']} onClick={props.save}>
				{props.lang.save}
			</button>
			<button className={styles['reset-button']} onClick={props.reset}>
				{props.lang.reset}
			</button>
		</motion.div>
	);
}
