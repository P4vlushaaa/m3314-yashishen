import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.contact.deleteMany();
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
        data: {
            email: 'pavel.yashishen@example.com',
            passwordHash: 'demo-hash',
            profile: {
                create: {
                    fullName: 'Павел Ящищен',
                    subtitle: 'Backend-разработчик и студент ИТМО',
                    bio: 'Разрабатываю серверные приложения, работаю с базами данных и проектирую API. Интересуюсь распределенными системами, автоматизацией и качественной архитектурой web-сервисов.',
                    skills: {
                        create: [
                            {
                                title: 'TypeScript',
                                description: 'Разрабатываю типизированные web-приложения и backend-сервисы на TypeScript.',
                                imageUrl: '/javascript.svg',
                            },
                            {
                                title: 'Java',
                                description: 'Использую Java для учебных и прикладных backend-задач, знаком с ООП, коллекциями и многопоточностью.',
                                imageUrl: '/img/java2-logo.png',
                            },
                            {
                                title: 'PostgreSQL',
                                description: 'Проектирую реляционные схемы, пишу SQL-запросы и работаю с миграциями через Prisma.',
                                imageUrl: '/img/img.png',
                            },
                            {
                                title: 'NestJS',
                                description: 'Создаю REST и GraphQL API, подключаю валидацию, авторизацию и интеграции с внешними сервисами.',
                                imageUrl: '/webstorm-icon-logo.svg',
                            },
                        ],
                    },
                    projects: {
                        create: [
                            {
                                title: 'Сервис учета учебных задач',
                                description:
                                    'Backend-приложение для хранения задач, дедлайнов и статусов выполнения с REST API и PostgreSQL.',
                                repositoryUrl:
                                    'https://github.com/pavel-yashishen/task-tracker',
                                imageUrl: '/img/image-for-projects-1.png',
                            },
                            {
                                title: 'API для заметок',
                                description:
                                    'Сервис для создания заметок с фильтрацией, валидацией запросов и хранением данных в PostgreSQL.',
                                repositoryUrl: 'https://github.com/pavel-yashishen/notes-api',
                                imageUrl: '/img/image-for-projects-1.png',
                            },
                            {
                                title: 'Портфолио с API',
                                description:
                                    'Персональное портфолио на NestJS с серверным рендерингом, Swagger-документацией и GraphQL.',
                                repositoryUrl: 'https://github.com/pavel-yashishen/portfolio-api',
                                imageUrl: '/img/image-for-projects-1.png',
                            },
                        ],
                    },
                    contacts: {
                        create: [
                            {
                                type: 'email',
                                value: 'pavel.yashishen@gmail.com',
                            },
                            {
                                type: 'telegram',
                                value: '@P4vlushaaa',
                            },
                            {
                                type: 'github',
                                value: 'github.com/pavel-yashishen',
                            },
                        ],
                    },
                },
            },
        },
        include: {
            profile: true,
        },
    });

    console.log('Seed completed:', user.email);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
