import { PrismaClient, Role, Status } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed...')

    // Limpieza
    await prisma.ticket.deleteMany({})
    await prisma.user.deleteMany({})

    // Crear Admin
    await prisma.user.create({
        data: {
            name: 'Agustin Admin',
            email: 'admin@club.com',
            password: 'password123',
            role: Role.ADMIN,
        },
    })

    // Generar 1000 tickets
    const ticketsData = Array.from({ length: 1000 }, (_, i) => ({
        number: i + 1,
        status: Status.AVAILABLE,
    }))

    await prisma.ticket.createMany({
        data: ticketsData,
    })

    console.log('✅ Seed finalizado con éxito.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
