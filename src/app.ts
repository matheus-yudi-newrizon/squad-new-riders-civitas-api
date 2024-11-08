import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { MysqlDataSource } from './config/database';
import { swaggerConfig } from './config/swagger';
import { errorMiddleware } from './middlewares/errorMiddleware';
import routes from './routes/routes';

MysqlDataSource.initialize()
  .then(() => {
    console.log('MySQL Database initialized!');
  })
  .catch(err => {
    console.error('Database Error: ', err);
  });

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));
app.use(routes);

const swaggerSpec = swaggerJSDoc(swaggerConfig);

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get('/swagger.json', (_req, res) => res.send(swaggerSpec));

console.log(`Add swagger on /swagger`);

app.use(errorMiddleware);

const port = parseInt(process.env.PORT || '4444', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
