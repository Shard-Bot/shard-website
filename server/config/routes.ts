import { app } from '../index';
import { reportError } from '../utils/error';
import chalk from 'chalk';

try {
	app.use('/api/auth/', require('../api/auth').router);	
	app.use('/api/channels/', require('../api/channels').router);
	app.use('/api/content/', require('../api/content').router);
	app.use('/api/roles/', require('../api/roles').router);
	app.use('/api/servers/', require('../api/servers').router);
	app.use('/api/users/', require('../api/users').router);

	console.log(chalk.cyan('info ') + '- Routes loaded');
} catch (err) {
	console.log(chalk.red('error ') + '- Failed to load routes');
	reportError(err);
}

export {};
