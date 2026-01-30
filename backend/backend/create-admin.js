/**
 * Script to create a new admin user
 * Run this with: node create-admin.js
 */

const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function createAdmin() {
    try {
        const adminData = {
            email: 'admin@3percent.com',
            password: 'Admin@123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            onboardingStep: 'completion',
            onboardingCompleted: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ where: { email: adminData.email } });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists with this email');
            console.log('Email:', adminData.email);
            console.log('Updating to admin role...');

            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            await existingAdmin.update({
                role: 'admin',
                password: hashedPassword
            });

            console.log('✅ Existing user updated to admin role');
        } else {
            // Hash password
            const hashedPassword = await bcrypt.hash(adminData.password, 10);

            // Create admin user
            const admin = await User.create({
                ...adminData,
                password: hashedPassword
            });

            console.log('✅ Admin user created successfully!');
        }

        console.log('\n📧 Admin Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Email:    ', adminData.email);
        console.log('Password: ', adminData.password);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🔐 You can now log in to the admin panel at:');
        console.log('http://localhost:5173/admin/login');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdmin();
