import mongoose from 'mongoose';
import chalk from 'chalk';

// @ts-ignore
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true } as mongoose.ConnectOptions);
const mongooseClient = mongoose.connection;

mongooseClient.once('open', () => {
	console.log(chalk.magenta('event ') + '- Databases connected');
});

mongooseClient.once("error", () => {
	console.log(chalk.red('error ') + '- Failed to connect to databases');
})

export { mongooseClient };
