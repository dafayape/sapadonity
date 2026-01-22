import { prisma } from '../server/src/config/db';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
    const adminEmail = 'admin@sapadonity.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        await prisma.user.create({
            data: {
                fullName: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN,
                notificationMethod: 'WEB',
            },
        });
        console.log('Admin account created');
    } else {
        console.log('Admin account already exists');
    }

    const holidays = [
        { date: new Date('2026-01-01'), name: 'Tahun Baru 2026 Masehi' },
        { date: new Date('2026-02-17'), name: 'Tahun Baru Imlek 2577 Kongzili' },
        { date: new Date('2026-03-11'), name: 'Isra Mi\'raj Nabi Muhammad SAW' },
        { date: new Date('2026-03-19'), name: 'Hari Suci Nyepi Tahun Baru Saka 1948' },
        { date: new Date('2026-03-31'), name: 'Hari Raya Idul Fitri 1447 Hijriah' },
        { date: new Date('2026-04-01'), name: 'Cuti Bersama Idul Fitri 1447 Hijriah' },
        { date: new Date('2026-05-01'), name: 'Hari Buruh Internasional' },
        { date: new Date('2026-05-14'), name: 'Kenaikan Isa Al Masih' },
        { date: new Date('2026-05-31'), name: 'Hari Raya Waisak 2570 BE' },
        { date: new Date('2026-06-01'), name: 'Hari Lahir Pancasila' },
        { date: new Date('2026-06-07'), name: 'Hari Raya Idul Adha 1447 Hijriah' },
        { date: new Date('2026-07-07'), name: 'Tahun Baru Islam 1448 Hijriah' },
        { date: new Date('2026-08-17'), name: 'Hari Kemerdekaan RI' },
        { date: new Date('2026-09-28'), name: 'Maulid Nabi Muhammad SAW' },
        { date: new Date('2026-12-25'), name: 'Hari Raya Natal' },
    ];

    for (const holiday of holidays) {
        await prisma.nationalHoliday.upsert({
            where: { date: holiday.date },
            update: {},
            create: {
                date: holiday.date,
                name: holiday.name,
                year: 2026,
            },
        });
    }

    console.log(`Seeded ${holidays.length} holidays for 2026`);
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
