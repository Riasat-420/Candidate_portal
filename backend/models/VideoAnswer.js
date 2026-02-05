'use strict';

module.exports = (sequelize, DataTypes) => {
    const VideoAnswer = sequelize.define('VideoAnswer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        questionIndex: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 4
            }
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        videoPath: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER, // Duration in seconds
            defaultValue: 0
        },
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'video_answers',
        timestamps: true
    });

    VideoAnswer.associate = (models) => {
        VideoAnswer.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return VideoAnswer;
};
