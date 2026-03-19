import dotenv from 'dotenv';
dotenv.config();

import express, { Router } from 'express';

import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt';

import { DataTypes, Sequelize } from 'sequelize';

const PORT = process.env.PORT;

const DB_DIALECT = process.env.DB_DIALECT;
const DB_STORAGE = process.env.DB_STORAGE;

const JWT_SECRET_ACCESS_KEY = process.env.JWT_SECRET_ACCESS_KEY;

const app = express();
const router = Router();

app.use(express.urlencoded({ extended:  true, limit: "500mb" }));
app.use(express.json());

app.use('/server-api/v1/', router);


// Предисловие: это не реальный проект, а проект для 
// экзамена по embeded systems университета KIUT

const sequelize = new Sequelize({
    dialect: DB_DIALECT,
    storage: DB_STORAGE
});

(async function () {
    try {
        await sequelize.authenticate();
        console.log("connected");
    } catch (error) {
        console.log(error);
    }
})();

const StudentModel = sequelize.define('student', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    photo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false
    },

    about_work: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const DeviceModel = sequelize.define('device', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

const WindMeasurementModel = sequelize.define('wind_measurement', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    device_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    rpm: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


DeviceModel.hasMany(WindMeasurementModel, {
    as: 'wind_measurements',
    foreignKey: 'device_id'
});

WindMeasurementModel.belongsTo(DeviceModel, {
    as: 'device',
    foreignKey: 'device_id'
});

sequelize.sync();

const savePhotoMiddleware = multer({
    storage: multer.diskStorage({
        destination: function (_req, _file, callback) {
            callback(null, 'static/images');
        },
        filename: function (_req, file, callback) {
            callback(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
        }
    })
}).single('photo');


const deviceGuardMiddleware = async (req, res, next) => {
    if (req.method === 'OPTIONS') next();

    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Устройство не было авторизованно!' });
        }

        const decoded = jsonwebtoken.verify(token, JWT_SECRET_ACCESS_KEY);
        if (decoded) {
            const device = await DeviceModel.findOne({
                where: {
                    serial_number: decoded.serial_number
                }
            });

            if (device) {
                req.device = device.dataValues;
                next();
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Пользователь не был авторизован!' });
    }
}

const studentGuardMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS') next();

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Пользователь не был авторизован!' });
        }

        const decoded = jsonwebtoken.verify(token, JWT_SECRET_ACCESS_KEY);
        req.user = decoded;

        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Пользователь не был авторизован!' });
    }
}

const authDevice = async (req, res, next) => {
    try {
        const { device_number } = req.body;

        const device = await DeviceModel.findOne({
            where: { 
                device_number
            }
        });

        if (!device) {
            return res.status(404).json({ message: 'Данное устройство небыло найдено в нашей системе' });
        }

        const accessToken = jsonwebtoken.sign({ device_number, id: device.id }, JWT_SECRET_ACCESS_KEY);

        return res.status(200).json({ accessToken });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}

const authStudent = async (req, res, next) => {
    try {
        const { first_name, last_name, password } = req.body;
        
        const student = await StudentModel.findOne({
            where: {
                first_name,
                last_name
            }
        });

        if (!student) {
            return res.status(401).json({ message: 'Данного пользователя не существует' });
        }

        const isUserCheckedPassword = await bcrypt.compareSync(password, student.password);
        if (!isUserCheckedPassword) {
           return res.status(401).json({ message: 'Не правильный логин или пароль' });
        }

        const accessToken = await jsonwebtoken.sign({ id: student.id }, JWT_SECRET_ACCESS_KEY);
        return res.status(200).json({ accessToken });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}


const saveStudent = async (req, res, next) => {
    try {
        const { first_name, last_name, password, role, about_work } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Файл не был получен' });
        }

        const hashPassword = await bcrypt.hash(password, 5);

        const student = await StudentModel.create({
            first_name,
            last_name,
            password: hashPassword,
            photo: `/static/images/${req.file.filename}`,
            role,
            about_work
        });

        return res.status(201).json(student);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}

const saveDevice = async (req, res, next) => {
    try {
        const { name, serial_number } = req.body;
        const device = await DeviceModel.create({
            name,
            serial_number,
            is_active: false
        });

        return res.status(201).json(device);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}

const saveWindMeasurement = async (req, res, next) => {
    try {
        const { id, device_id, value, rpm } = req.body;

        const device = await DeviceModel.findOne({
            where: {
                device_id
            }
        });

        if (!device) {
            return res.status(404).json({ message: 'Устройство небыло найдено в нашей системе' });
        }

        if (!device.is_active) {
            device.is_active = true;
            device.update();
        }

        const windMeasurement = await WindMeasurementModel.create({
            id, device_id, value, rpm
        });

        return res.status(201).json(windMeasurement);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}

const getStudent = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const offset = page * limit - limit;

        const students = await StudentModel.findAndCountAll({
            limit,
            offset
        })

        return res.status(200).json(students);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}

const getDevices = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const offset = page * limit - limit;

        const devices = await DeviceModel.findAndCountAll({
            offset,
            limit
        });

        return res.status(200).json(devices); 
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}

const getOneStudent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const student = await StudentModel.findOne({
            where: {
                id
            }
        });

        if (!student) {
            return res.status(404).json({ message: 'Данный пользователь не найден в нашей системе' });
        }

        return res.status(200).json(student);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}

const getOneDevice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const device = await DeviceModel.findOne({
            where: {
                id
            }
        });

        if (!device) {
            return res.status(404).json({ message: 'Данное устройство не найденно в нашей системе' });
        }

        return res.status(200).json(device);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}


const getProfile = async (req, res, next) => {
    try {
        const { id } = req.user;
        const student = await StudentModel.findOne({
            where: {
                id
            }
        });

        if (!student) {
            return res.status(404).json({ message: 'Данный пользователь не найден в нашей системе' });
        }

        return res.status(200).json(student);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}

const getDashboard = async (req, res, next) => {
    try {

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}

const getChartDeviceData = async (req, res, next) => {
    try {

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Неизветная ошибка сервера', error });
    }
}


router.post('/device', saveDevice);
router.post('/wind-measurement', checkDeviceAuth, saveWindMeasurement);

app.listen(PORT, () => {
    console.log('Приложение запущено на http://127.0.0.1');
    console.log('Документация доступна на http://127.0.0.1/server-api/docs/swagger');
})