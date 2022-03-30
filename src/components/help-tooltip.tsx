/* eslint-disable @next/next/no-img-element */
import React from 'react';

import { Popover, OverlayTrigger } from 'react-bootstrap';

const popover = (body) => {
	return (
		<Popover id='popover-basic'>
			<Popover.Body>{body}</Popover.Body>
		</Popover>
	);
};

const HelpTooltip = (props: any) => {
	return (
		<OverlayTrigger trigger='click' placement='top' overlay={popover(props.body)}>
			<img
				src='/assets/images/question-circle-line.svg'
				alt='some'
				style={{ cursor: "pointer" }}
			/>
		</OverlayTrigger>
	);
};

export default HelpTooltip;
