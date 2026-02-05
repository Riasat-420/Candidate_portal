const { User } = require('./models');

const run = async () => {
    try {
        console.log('Checking Users table...');
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'onboardingStep', 'approvalStatus'],
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        console.log(`\nFound ${users.length} users:`);
        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            users.forEach(u => {
                console.log(`ID: ${u.id} | Name: ${u.firstName} ${u.lastName} | Role: ${u.role} | Status: ${u.approvalStatus} | Step: ${u.onboardingStep}`);
            });
        }

    } catch (err) {
        console.error('Error querying users:', err);
    }
};

run();
