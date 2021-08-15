<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">Project Belajar  dengan menggunakan nestjs. Project berupa sebuah blog api. Semoga dapat menjadi refrensi bersama.</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## STEP-BY-STEP

#### Setup Database 
1. Database yang digunakan yaitu postgreSQL dengan memanfaatkan sequelize. Sequlize sendiri adalah ORM Node.js yang berbasis promise. Ini bisa digunakan dengan PostgreSQL, MySQL, MariaDB, SQLite, dan MSSQL.
2. Untuk env nya menggunakan dotenv (.env)
3. Install :
    - npm install -g sequelize
    - npm install --save sequelize sequelize-typescript pg-hstore pg
    - npm install --save-dev @types/sequelize
    - npm install dotenv --save
4. Selanjutnya, Buat folder  <strong>core</strong> di dalam src dan buat module database :
    - nest generate module database

##### Setting Interface Database
5. Buat folder <strong>interface</strong> didalam src > core > database
    - Didalamnya buat lagi file dengan nama <strong>dbConfig.interface.ts</strong>
     - Code :
      ```ts
      export interface IDatabaseConfigAttributes {
        username?: string;
        password?: string;
        database?: string;
        host?: string;
        port?: number | string;
        dialect?: string;
        urlDatabase?: string;
      }

      export interface IDaatabaseConfig {
        development: IDatabaseConfigAttributes;
        test: IDatabaseConfigAttributes;
        production: IDatabaseConfigAttributes;
      }
      ```
##### Set Konfigurasi Database
6. Buat file <strong>database.config.ts</strong> di dalam src > core > database
   - Code
    ```ts
    // import env dan interface database
      import * as dotenv from 'dotenv';
      import { IDatabaseConfig } from './interfaces/dbConfig.interface';

      dotenv.config();

      export const databaseConfig: IDatabaseConfig = {
        development: {
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME_DEVELOPMENT,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: process.env.DB_DIALECT,
        },
        test: {
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME_TEST,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: process.env.DB_DIALECT,
        },
        production: {
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME_PRODUCTION,
          host: process.env.DB_HOST,
          dialect: process.env.DB_DIALECT,
        },
      };
    ```
7. Buat file .env . file ini akan berisikan environment dalam pengembangan suatu web
   - code :
    ```ts
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=database_user_name
    DB_PASS=database_password
    DB_DIALECT=postgres
    DB_NAME_TEST=test_database_name
    DB_NAME_DEVELOPMENT=development_database_name
    DB_NAME_PRODUCTION=production_database_name
    JWTKEY=random_secret_key
    TOKEN_EXPIRATION=48h
    BEARER=Bearer
    ```
8. Agar .env dapat bekerja diselurh aplikasi, maka install  @nestjs/config 
   - Install :
       - npm i @nestjs/config --ssave
   - Import package tsb ke dapam root module src > app.module.ts
     - Code :
        ```ts
       import { Module } from '@nestjs/common';
       import { ConfigModule } from '@nestjs/config';

       @Module({
         // set isGlobal : true agar .env dapat bekerja di seluruh aplikasi
         imports: [ConfigModule.forRoot({ isGlobal: true })],
       })
       export class AppModule {}
        ```

##### Set Provider untuk Database
9.  Buat file <strong>database.provider.ts</strong>. didalam file ini agar database dapat berjalan dengan berbagai kondisi : dev, test, dan production
    - code :
    ```ts
    import { Sequelize } from 'sequelize-typescript';
    import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
    import { databaseConfig } from './database.config';

    export const databaseProviders = [{
        provide: SEQUELIZE,
        useFactory: async () => {
            let config;
            switch (process.env.NODE_ENV) {
            case DEVELOPMENT:
               config = databaseConfig.development;
               break;
            case TEST:
               config = databaseConfig.test;
               break;
            case PRODUCTION:
               config = databaseConfig.production;
               break;
            default:
               config = databaseConfig.development;
            }
            const sequelize = new Sequelize(config);
            sequelize.addModels(['models goes here']);
            await sequelize.sync();
            return sequelize;
        },
    }];
     ```
10. Nah, namun.. akan ada error di line ke 2. karena path constants belum ada. mari kita buat dlu ya.... bikin folder <constants> di dalam src > core lalu tambahkan file dengan nama <strong>index.ts</strong>
    - code :
    ```ts
    export const SEQUELIZE = 'SEQUELIZE';
    export const DEVELOPMENT = 'development';
    export const TEST = 'test';
    export const PRODUCTION = 'production';
     ```
11. Selanjutnya, pasang provider database ke dalam module database di file <strong>database.module.ts</strong>
    - code :
    ```ts
    import { Module } from '@nestjs/common';
    import { databaseProviders } from './database.provider';

    @Module({
      providers: [...databaseProviders],
      exports: [...databaseProviders],
    })
    export class DatabaseModule {}
    ```
     
#### Setting Endpoint
1. Kita akan buat sebuah endpoint <strong>api/v1</strong>. Tujuan diberikan v1 agar jika kedepannya terdapat pembaharuan versi. Bisa menjadi v2, v3, atau seterusnya.
2. Setting global endpoint dpt dilakukan dalam file src > main.ts
    - Code :
    ```ts
    ....... 
    // kode sebelumnya
     // set api/v1
    app.setGlobalPrefix('api/v1');
    ......
     // kode setelahnya
    ```
3. Selanjutnya, kita butuh module yang dapat menampung model-model yang digunakan. Buat folder <strong>modules</strong> didalam src. Masuk ke folder ini dan buat module dan service untuk users
    - Perintah : nest generate module users dan nest generate service users
    - Hasil : didalam folder src > modules > users akan ada 3 file yaitu : users.module.ts, users.service.spec.ts, dan users.service.ts

##### Setup schema untuk database dan model users
1. Masih didalam src > modules > users. Buat file <strong>user.entity.ts</strong>, file ini berisi dari kolom-kolom tabel users
   - code :
   ```ts
    import { Table, Column, Model, DataType } from 'sequelize-typescript';
    @Table
    export class User extends Model<User> {
      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      name: string;

      @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
      })
      email: string;

      @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      password: string;

      @Column({
        type: DataType.ENUM,
        values: ['male', 'female'],
        allowNull: false,
      })
      gender: string;
    }
    ```
  - Untuk refrensi bisa klik link ini : [Referensi](https://github.com/RobinBuschmann/sequelize-typescript#readme) \

2. Didalam folder users kita juga butuh data tansfer object (dto), kita bisa buat folder dto dengan file berisikan user.dto.ts.
  - code :
  ```ts
  export class UserDto {
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly gender: string;
  }

  ```
3. nah, untuk komunikasi dengan database kita buat lagi provider untuk user. Masih di dalam folder userss, buat file users.providers.ts
    - code :
    ```ts
    import { User } from './users.entity';
    import { USER_REPOSITORY } from '../../core/constants';

    export const usersProviders = [
      {
        provide: USER_REPOSITORY,
        useValue: User,
      },
    ];
    
    //dan tambahkan code berupa : export const USER_REPOSITORY = 'USER_REPOSITORY' pada file constants > index.ts
    ```
4. Selanjutnya, kita perlu utk import users service dan providers ke dalam users.module.ts
   - code :
   ```ts
    import { Module } from '@nestjs/common';
    import { usersProviders } from './users.provider';
    import { UsersService } from './users.service';
    @Module({
      providers: [UsersService, ...usersProviders],
      exports: [UsersService],
    })
    export class UsersModule {}
   ``` 
5. Mari kita lakukan operasi CRUD di dalam file users.service.ts
   - code :
   ```ts
      import { Injectable, Inject } from '@nestjs/common';
      import { User } from './user.entity';
      import { UserDto } from './dto/user.dto';
      import { USER_REPOSITORY } from '../../core/constants';

      @Injectable()
      export class UsersService {
        constructor(
          @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        ) {}

        async create(user: UserDto): Promise<User> {
          return await this.userRepository.create<User>(user);
        }

        async findOneByEmail(email: string): Promise<User> {
          return await this.userRepository.findOne<User>({ where: { email } });
        }

        async findOneById(id: number): Promise<User> {
          return await this.userRepository.findOne<User>({ where: { id } });
        }
      }
   ```  
6. Kemudian, dalam database.provider.ts kita import model <strong>User</strong> 
   - Code updatenya :
   ```ts
    import { Sequelize } from 'sequelize-typescript';
    import { User } from 'src/modules/users/user.entity';
    import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
    import { databaseConfig } from './database.config';

    export const databaseProviders = [
      {
        provide: SEQUELIZE,
        useFactory: async () => {
          let config;
          switch (process.env.NODE_ENV) {
            case DEVELOPMENT:
              config = databaseConfig.development;
              break;
            case TEST:
              config = databaseConfig.test;
              break;
            case PRODUCTION:
              config = databaseConfig.production;
              break;
            default:
              config = databaseConfig.development;
          }
          const sequelize = new Sequelize(config);
          sequelize.addModels([User]);
          await sequelize.sync();
          return sequelize;
        },
      },
    ];
  ```  
7. 
  
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
