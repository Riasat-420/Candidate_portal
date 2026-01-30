// Quick script to check if we have data in the database
const { User, Upload, Questionnaire } = require('./backend/models');

async function checkData() {
    try {
        console.log('🔍 Checking database for data...\n');

        // Check users
        const totalUsers = await User.count();
        const nonAdminUsers = await User.count({ where: { role: { $ne: 'admin' } } });
        const completedUsers = await User.count({ where: { onboardingCompleted: true } });

        console.log('👥 Users:');
        console.log(`   Total users: ${totalUsers}`);
        console.log(`   Non-admin users: ${nonAdminUsers}`);
        console.log(`   Completed onboarding: ${completedUsers}\n`);

        // Check uploads
        const totalUploads = await Upload.count();
        const photoUploads = await Upload.count({ where: { fileType: 'photo' } });
        const audioUploads = await Upload.count({ where: { fileType: 'audio' } });
        const videoUploads = await Upload.count({ where: { fileType: 'video' } });

        console.log('📁 Uploads:');
        console.log(`   Total uploads: ${totalUploads}`);
        console.log(`   Photos: ${photoUploads}`);
        console.log(`   Audio: ${audioUploads}`);
        console.log(`   Video: ${videoUploads}\n`);

        // Check questionnaires
        const totalQuestionnaires = await Questionnaire.count();
        console.log('📋 Questionnaires:');
        console.log(`   Total questionnaires: ${totalQuestionnaires}\n`);

        // List recent users
        if (nonAdminUsers > 0) {
            const recentUsers = await User.findAll({
                where: { role: { $ne: 'admin' } },
                attributes: ['id', 'email', 'firstName', 'lastName', 'onboardingStep', 'createdAt'],
                order: [['createdAt', 'DESC']],
                limit: 5
            });

            console.log('📝 Recent candidates:');
            recentUsers.forEach(user => {
                console.log(`   ${user.id} - ${user.email} (${user.onboardingStep})`);
            });
        } else {
            console.log('⚠️  No candidate users found in database!');
            console.log('   Try registering a new user at http://localhost:5173/register');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkData();
