const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API встроенного сервера',
        version: '1.0.0',
        description: 'Структурированная документация API для студентов, устройств и измерений ветра.'
    },
    servers: [
        {
            url: 'http://localhost:3000/server-api/v1',
            description: 'Локальный сервер разработки'
        }
    ],
    tags: [
        {
            name: 'Авторизация',
            description: 'Эндпоинты авторизации студентов и устройств.'
        },
        {
            name: 'Студенты',
            description: 'Эндпоинты создания, получения списка, карточки и профиля студента.'
        },
        {
            name: 'Устройства',
            description: 'Эндпоинты создания, получения списка, карточки и графика устройства.'
        },
        {
            name: 'Измерения ветра',
            description: 'Эндпоинты приёма и сохранения измерений ветра.'
        },
        {
            name: 'Дашборд',
            description: 'Сводная статистика для панели управления.'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT токен доступа, который передаётся в заголовке Authorization.'
            }
        },
        parameters: {
            PageQuery: {
                in: 'query',
                name: 'page',
                required: true,
                description: 'Текущий номер страницы для пагинированного ответа.',
                schema: {
                    type: 'integer',
                    example: 1
                }
            },
            LimitQuery: {
                in: 'query',
                name: 'limit',
                required: true,
                description: 'Максимальное количество элементов на одной странице.',
                schema: {
                    type: 'integer',
                    example: 10
                }
            },
            StudentIdParam: {
                in: 'path',
                name: 'id',
                required: true,
                description: 'Уникальный идентификатор студента.',
                schema: {
                    type: 'integer',
                    example: 1
                }
            },
            DeviceIdParam: {
                in: 'path',
                name: 'id',
                required: true,
                description: 'Уникальный идентификатор устройства.',
                schema: {
                    type: 'integer',
                    example: 1
                }
            },
            ChartDeviceIdParam: {
                in: 'path',
                name: 'deviceId',
                required: true,
                description: 'Уникальный идентификатор устройства, по которому строится график.',
                schema: {
                    type: 'integer',
                    example: 1
                }
            }
        },
        schemas: {
            AccessTokenResponse: {
                type: 'object',
                description: 'JWT токен, который возвращается после успешной авторизации.',
                properties: {
                    accessToken: {
                        type: 'string',
                        description: 'Подписанный JWT токен доступа.',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
                    }
                }
            },
            ErrorResponse: {
                type: 'object',
                description: 'Стандартный ответ API при ошибке.',
                properties: {
                    message: {
                        type: 'string',
                        description: 'Текстовое описание ошибки.',
                        example: 'Внутренняя ошибка сервера'
                    },
                    error: {
                        type: 'object',
                        description: 'Необязательный объект с техническими деталями ошибки.'
                    }
                }
            },
            Student: {
                type: 'object',
                description: 'Сущность студента, которая хранится в базе данных.',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Уникальный идентификатор студента.',
                        example: 1
                    },
                    first_name: {
                        type: 'string',
                        description: 'Имя студента.',
                        example: 'Данил'
                    },
                    last_name: {
                        type: 'string',
                        description: 'Фамилия студента.',
                        example: 'Сабитов'
                    },
                    password: {
                        type: 'string',
                        description: 'Хэш пароля студента, который хранится на сервере.',
                        example: '$2b$05$hash'
                    },
                    photo: {
                        type: 'string',
                        description: 'Относительный путь к сохранённой фотографии студента.',
                        example: '/static/images/1710000000000-avatar.jpg'
                    },
                    role: {
                        type: 'string',
                        description: 'Роль студента в системе.',
                        example: 'student'
                    },
                    about_work: {
                        type: 'string',
                        description: 'Краткое описание деятельности или специализации студента.',
                        example: 'Работает с микроконтроллерами'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Дата и время создания записи студента.',
                        example: '2026-03-19T12:00:00.000Z'
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Дата и время последнего обновления записи студента.',
                        example: '2026-03-19T12:00:00.000Z'
                    }
                }
            },
            StudentCreateRequest: {
                type: 'object',
                description: 'Тело multipart-запроса для создания студента вместе с фотографией.',
                required: ['first_name', 'last_name', 'password', 'role', 'about_work', 'photo'],
                properties: {
                    first_name: {
                        type: 'string',
                        description: 'Имя студента.',
                        example: 'Данил'
                    },
                    last_name: {
                        type: 'string',
                        description: 'Фамилия студента.',
                        example: 'Сабитов'
                    },
                    password: {
                        type: 'string',
                        description: 'Пароль в открытом виде, который будет захэширован перед сохранением.',
                        example: '123456'
                    },
                    role: {
                        type: 'string',
                        description: 'Роль, которая будет назначена студенту.',
                        example: 'student'
                    },
                    about_work: {
                        type: 'string',
                        description: 'Описание работы, специализации или направления студента.',
                        example: 'Инженер в области embedded systems'
                    },
                    photo: {
                        type: 'string',
                        format: 'binary',
                        description: 'Файл фотографии студента, который отправляется как multipart/form-data.'
                    }
                }
            },
            StudentAuthRequest: {
                type: 'object',
                description: 'Учетные данные для авторизации студента.',
                required: ['first_name', 'last_name', 'password'],
                properties: {
                    first_name: {
                        type: 'string',
                        description: 'Имя студента.',
                        example: 'Данил'
                    },
                    last_name: {
                        type: 'string',
                        description: 'Фамилия студента.',
                        example: 'Сабитов'
                    },
                    password: {
                        type: 'string',
                        description: 'Пароль студента в открытом виде.',
                        example: '123456'
                    }
                }
            },
            StudentListResponse: {
                type: 'object',
                description: 'Пагинированный ответ со списком студентов.',
                properties: {
                    count: {
                        type: 'integer',
                        description: 'Общее количество студентов в базе данных.',
                        example: 25
                    },
                    rows: {
                        type: 'array',
                        description: 'Массив студентов для текущей страницы.',
                        items: {
                            $ref: '#/components/schemas/Student'
                        }
                    }
                }
            },
            Device: {
                type: 'object',
                description: 'Сущность устройства, которая хранится в базе данных.',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Уникальный идентификатор устройства.',
                        example: 1
                    },
                    name: {
                        type: 'string',
                        description: 'Человекочитаемое название устройства.',
                        example: 'Датчик ветра №1'
                    },
                    serial_number: {
                        type: 'string',
                        description: 'Уникальный серийный номер устройства.',
                        example: 'SN-001'
                    },
                    is_active: {
                        type: 'boolean',
                        description: 'Показывает, отправляло ли устройство измерения и считается ли активным.',
                        example: true
                    },
                    created_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Дата и время создания записи устройства.',
                        example: '2026-03-19T12:00:00.000Z'
                    },
                    updated_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Дата и время последнего обновления записи устройства.',
                        example: '2026-03-19T12:00:00.000Z'
                    }
                }
            },
            DeviceCreateRequest: {
                type: 'object',
                description: 'Тело запроса для создания нового устройства.',
                required: ['name', 'serial_number'],
                properties: {
                    name: {
                        type: 'string',
                        description: 'Человекочитаемое название устройства.',
                        example: 'Датчик ветра №1'
                    },
                    serial_number: {
                        type: 'string',
                        description: 'Уникальный серийный номер, присвоенный устройству.',
                        example: 'SN-001'
                    }
                }
            },
            DeviceAuthRequest: {
                type: 'object',
                description: 'Тело запроса для авторизации устройства.',
                required: ['serial_number'],
                properties: {
                    serial_number: {
                        type: 'string',
                        description: 'Номер устройства в том виде, в котором его ожидает текущий контроллер авторизации.',
                        example: 'SN-001'
                    }
                }
            },
            DeviceListResponse: {
                type: 'object',
                description: 'Пагинированный ответ со списком устройств.',
                properties: {
                    count: {
                        type: 'integer',
                        description: 'Общее количество устройств в базе данных.',
                        example: 8
                    },
                    rows: {
                        type: 'array',
                        description: 'Массив устройств для текущей страницы.',
                        items: {
                            $ref: '#/components/schemas/Device'
                        }
                    }
                }
            },
            WindMeasurement: {
                type: 'object',
                description: 'Сущность измерения ветра, которая хранится в базе данных.',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Уникальный идентификатор измерения.',
                        example: 1
                    },
                    device_id: {
                        type: 'integer',
                        description: 'Идентификатор устройства, которое отправило измерение.',
                        example: 1
                    },
                    value: {
                        type: 'integer',
                        description: 'Сырое значение датчика.',
                        example: 220
                    },
                    rpm: {
                        type: 'integer',
                        description: 'Расчётное количество оборотов в минуту.',
                        example: 1450
                    },
                    created_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Дата и время создания измерения.',
                        example: '2026-03-19T12:00:00.000Z'
                    },
                    updated_at: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Дата и время последнего обновления измерения.',
                        example: '2026-03-19T12:00:00.000Z'
                    }
                }
            },
            WindMeasurementCreateRequest: {
                type: 'object',
                description: 'Тело запроса для сохранения измерения ветра.',
                required: ['id', 'device_id', 'value', 'rpm'],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Идентификатор измерения, который передаёт клиент.',
                        example: 1
                    },
                    device_id: {
                        type: 'integer',
                        description: 'Идентификатор устройства, отправившего данные.',
                        example: 1
                    },
                    value: {
                        type: 'integer',
                        description: 'Сырое значение датчика.',
                        example: 220
                    },
                    rpm: {
                        type: 'integer',
                        description: 'Расчётное количество оборотов в минуту.',
                        example: 1450
                    }
                }
            },
            DashboardResponse: {
                type: 'object',
                description: 'Сводная статистика для панели управления.',
                properties: {
                    counts: {
                        type: 'object',
                        description: 'Счётчики сущностей, используемые на дашборде.',
                        properties: {
                            students: {
                                type: 'integer',
                                description: 'Общее количество студентов.',
                                example: 25
                            },
                            devices: {
                                type: 'integer',
                                description: 'Общее количество устройств.',
                                example: 8
                            },
                            measurements: {
                                type: 'integer',
                                description: 'Общее количество сохранённых измерений ветра.',
                                example: 123
                            },
                            active_devices: {
                                type: 'integer',
                                description: 'Количество устройств, которые сейчас помечены как активные.',
                                example: 5
                            }
                        }
                    },
                    stats: {
                        type: 'object',
                        description: 'Рассчитанная статистика по RPM.',
                        properties: {
                            current_rpm: {
                                type: 'integer',
                                description: 'Значение RPM из последнего измерения.',
                                example: 1450
                            },
                            max_rpm: {
                                type: 'integer',
                                description: 'Максимальное значение RPM в наборе данных.',
                                example: 1600
                            },
                            avg_rpm: {
                                type: 'integer',
                                description: 'Среднее значение RPM, округлённое сервером.',
                                example: 1380
                            }
                        }
                    },
                    last_measurement: {
                        allOf: [
                            {
                                $ref: '#/components/schemas/WindMeasurement'
                            }
                        ],
                        description: 'Последняя сохранённая запись измерения ветра.'
                    }
                }
            },
            DeviceChartDataset: {
                type: 'object',
                description: 'Один набор данных, который отображается на графике устройства.',
                properties: {
                    label: {
                        type: 'string',
                        description: 'Название набора данных на графике.',
                        example: 'RPM'
                    },
                    data: {
                        type: 'array',
                        description: 'Числовые значения, которые отображаются на графике.',
                        items: {
                            type: 'integer',
                            example: 1450
                        }
                    }
                }
            },
            DeviceChartResponse: {
                type: 'object',
                description: 'Информация об устройстве и массивы измерений, подготовленные для построения графика.',
                properties: {
                    device: {
                        type: 'object',
                        description: 'Краткая информация об устройстве для страницы графика.',
                        properties: {
                            id: {
                                type: 'integer',
                                description: 'Уникальный идентификатор устройства.',
                                example: 1
                            },
                            name: {
                                type: 'string',
                                description: 'Название устройства.',
                                example: 'Датчик ветра №1'
                            },
                            serial_number: {
                                type: 'string',
                                description: 'Серийный номер устройства.',
                                example: 'SN-001'
                            },
                            is_active: {
                                type: 'boolean',
                                description: 'Показывает, активно ли устройство в данный момент.',
                                example: true
                            }
                        }
                    },
                    chart: {
                        type: 'object',
                        description: 'Метки и наборы данных для построения графика.',
                        properties: {
                            labels: {
                                type: 'array',
                                description: 'Временные метки, сформированные из времени создания измерений.',
                                items: {
                                    type: 'string',
                                    example: '10:35:12'
                                }
                            },
                            datasets: {
                                type: 'array',
                                description: 'Наборы данных для RPM и значений датчика.',
                                items: {
                                    $ref: '#/components/schemas/DeviceChartDataset'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    paths: {
        '/device/auth': {
            post: {
                tags: ['Авторизация'],
                summary: 'Авторизация устройства',
                description: 'Авторизует устройство и возвращает JWT токен доступа.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/DeviceAuthRequest'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Устройство успешно авторизовано.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AccessTokenResponse'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Устройство не найдено.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/student/auth': {
            post: {
                tags: ['Авторизация'],
                summary: 'Авторизация студента',
                description: 'Авторизует студента и возвращает JWT токен доступа.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/StudentAuthRequest'
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Студент успешно авторизован.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AccessTokenResponse'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Учётные данные студента неверны.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/student': {
            post: {
                tags: ['Студенты'],
                summary: 'Создание студента',
                description: 'Создаёт нового студента и загружает файл фотографии.',
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                $ref: '#/components/schemas/StudentCreateRequest'
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Студент успешно создан.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Student'
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Файл фотографии или переданные данные некорректны.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Студенты'],
                summary: 'Получение списка студентов',
                description: 'Возвращает пагинированный список студентов.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        $ref: '#/components/parameters/PageQuery'
                    },
                    {
                        $ref: '#/components/parameters/LimitQuery'
                    }
                ],
                responses: {
                    200: {
                        description: 'Пагинированный список студентов.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/StudentListResponse'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Для запроса требуется авторизация студента.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/student/profile': {
            get: {
                tags: ['Студенты'],
                summary: 'Получение профиля студента',
                description: 'Возвращает данные профиля авторизованного студента.',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Профиль авторизованного студента.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Student'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Для запроса требуется авторизация студента.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Профиль студента не найден.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/student/{id}': {
            get: {
                tags: ['Студенты'],
                summary: 'Получение одного студента',
                description: 'Возвращает одного студента по идентификатору.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        $ref: '#/components/parameters/StudentIdParam'
                    }
                ],
                responses: {
                    200: {
                        description: 'Карточка студента.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Student'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Для запроса требуется авторизация студента.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Студент не найден.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/device': {
            post: {
                tags: ['Устройства'],
                summary: 'Создание устройства',
                description: 'Создаёт новое устройство, которое по умолчанию сохраняется как неактивное.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/DeviceCreateRequest'
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Устройство успешно создано.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Device'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Устройства'],
                summary: 'Получение списка устройств',
                description: 'Возвращает пагинированный список устройств.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        $ref: '#/components/parameters/PageQuery'
                    },
                    {
                        $ref: '#/components/parameters/LimitQuery'
                    }
                ],
                responses: {
                    200: {
                        description: 'Пагинированный список устройств.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/DeviceListResponse'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Для запроса требуется авторизация студента.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/device/{id}': {
            get: {
                tags: ['Устройства'],
                summary: 'Получение одного устройства',
                description: 'Возвращает одно устройство по идентификатору.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        $ref: '#/components/parameters/DeviceIdParam'
                    }
                ],
                responses: {
                    200: {
                        description: 'Карточка устройства.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Device'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Для запроса требуется авторизация студента.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Устройство не найдено.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/device/{deviceId}/chart': {
            get: {
                tags: ['Устройства'],
                summary: 'Получение данных графика устройства',
                description: 'Возвращает данные устройства и последние измерения в формате, удобном для построения графика.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        $ref: '#/components/parameters/ChartDeviceIdParam'
                    }
                ],
                responses: {
                    200: {
                        description: 'Данные устройства для построения графика.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/DeviceChartResponse'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Для запроса требуется авторизация студента.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Устройство не найдено.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/wind-measurement': {
            post: {
                tags: ['Измерения ветра'],
                summary: 'Сохранение измерения ветра',
                description: 'Создаёт новую запись измерения ветра на основе запроса от устройства.',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/WindMeasurementCreateRequest'
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Измерение ветра успешно создано.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/WindMeasurement'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Для запроса требуется авторизация устройства.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Устройство не найдено.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/dashboard': {
            get: {
                tags: ['Дашборд'],
                summary: 'Получение данных дашборда',
                description: 'Возвращает счётчики и статистику RPM для панели управления.',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Данные для дашборда.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/DashboardResponse'
                                }
                            }
                        }
                    },
                    401: {
                        description: 'Для запроса требуется авторизация студента.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    },
                    500: {
                        description: 'Непредвиденная ошибка сервера.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ErrorResponse'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export default swaggerDefinition;




