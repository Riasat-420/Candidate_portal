/**
 * Script to promote a user to admin role
 * Run this with: node promote-to-admin.js
 */

const { User } = require('./models');

async function promoteToAdmin() {
    try {
        const email = 'ukashaja557@gmail.com'; // Change this to your email

        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.error(`User with email ${email} not found`);
            process.exit(1);
        }

        console.log(`Found user: ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`Current role: ${user.role}`);

        // Update role to admin
        await user.update({ role: 'admin' });

        console.log(`✅ Successfully promoted ${user.email} to admin role`);
        console.log('You can now log in to the admin panel with this account');

        process.exit(0);
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
}

promoteToAdmin();
