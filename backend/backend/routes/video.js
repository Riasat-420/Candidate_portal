const express = require('express');
const { authenticate } = require('../middleware/auth');
const db = require('../models');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Generate interview questions based on professional summary
router.post('/generate-questions', authenticate, async (req, res) => {
    try {
        const { summary } = req.body;
        const userId = req.user.id;

        if (!summary || summary.trim().length < 50) {
            return res.status(400).json({
                success: false,
                message: 'Professional summary must be at least 50 characters long'
            });
        }

        // Save summary to user profile
        await db.User.update(
            { professionalSummary: summary },
            { where: { id: userId } }
        );

        // Generate questions using AI or fallback to template-based questions
        let questions;

        // Try OpenAI API if key is available
        if (process.env.OPENAI_API_KEY) {
            try {
                questions = await generateQuestionsWithAI(summary);
            } catch (aiError) {
                console.error('AI generation failed, using fallback:', aiError);
                questions = generateFallbackQuestions(summary);
            }
        } else {
            // Fallback to template-based questions
            questions = generateFallbackQuestions(summary);
        }

        // Store questions for this user
        await db.User.update(
            { aiGeneratedQuestions: JSON.stringify(questions) },
            { where: { id: userId } }
        );

        res.status(200).json({
            success: true,
            questions: questions,
            userId: userId
        });

    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate questions. Please try again.'
        });
    }
});

// Helper function for AI-based question generation
async function generateQuestionsWithAI(summary) {
    const { Configuration, OpenAIApi } = require('openai');
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Based on the following professional summary, generate exactly 5 interview questions that are:
1. Relevant to the person's experience and skills
2. Open-ended to encourage detailed responses
3. Professional and appropriate for a job interview
4. Diverse, covering different aspects (technical skills, achievements, challenges, teamwork, goals)

Professional Summary:
"${summary}"

Return ONLY a JSON array of 5 questions, nothing else. Format: ["Question 1?", "Question 2?", ...]`;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500
    });

    const questionsText = completion.data.choices[0].message.content.trim();
    return JSON.parse(questionsText);
}

// Fallback template-based question generation
function generateFallbackQuestions(summary) {
    const summaryLower = summary.toLowerCase();
    const questions = [];

    // Extract key information
    const hasTechnical = /developer|engineer|programmer|designer|analyst|architect/i.test(summary);
    const hasManagement = /manager|lead|director|supervisor|team/i.test(summary);
    const hasYearsExp = summary.match(/(\d+)\s+(year|yr)/i);

    // Question 1: Experience overview
    if (hasYearsExp) {
        questions.push(`You mentioned ${hasYearsExp[0]} of experience. Can you walk us through your career journey and the key roles you've held?`);
    } else {
        questions.push("Can you tell us about your professional journey and the key experiences that have shaped your career?");
    }

    // Question 2: Technical/Domain expertise
    if (hasTechnical) {
        questions.push("What are the most complex technical challenges you've faced, and how did you solve them?");
    } else {
        questions.push("What are the most challenging projects you've worked on, and what made them successful?");
    }

    // Question 3: Achievements
    questions.push("What is your proudest professional achievement, and what impact did it have on your organization or clients?");

    // Question 4: Teamwork/Leadership
    if (hasManagement) {
        questions.push("Can you describe your leadership style and share an example of how you've mentored or developed team members?");
    } else {
        questions.push("Tell us about a time when you collaborated with a team to achieve a common goal. What was your role?");
    }

    // Question 5: Career goals
    questions.push("Where do you see yourself in the next 3-5 years, and what type of opportunities are you looking for to achieve those goals?");

    return questions;
}

// Upload video answer for a specific question
router.post('/upload-answer', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { questionIndex, duration } = req.query;

        if (!questionIndex || questionIndex < 0 || questionIndex > 4) {
            return res.status(400).json({
                success: false,
                message: 'Invalid question index'
            });
        }

        // Get the questions for this user
        const user = await db.User.findByPk(userId);
        if (!user || !user.aiGeneratedQuestions) {
            return res.status(400).json({
                success: false,
                message: 'No questions found. Please generate questions first.'
            });
        }

        const questions = JSON.parse(user.aiGeneratedQuestions);
        const question = questions[questionIndex];

        // Save video file
        const uploadsDir = path.join(__dirname, '../uploads/videos');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filename = `video-q${questionIndex}-${userId}-${Date.now()}.webm`;
        const filePath = path.join(uploadsDir, filename);

        // Write the video data
        await fs.promises.writeFile(filePath, req.body);

        // Store in database
        await db.VideoAnswer.create({
            userId: userId,
            questionIndex: parseInt(questionIndex),
            question: question,
            videoPath: filename,
            duration: parseInt(duration) || 0
        });

        res.status(200).json({
            success: true,
            message: 'Video answer uploaded successfully',
            questionIndex: questionIndex
        });

    } catch (error) {
        console.error('Error uploading video answer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload video answer'
        });
    }
});

// Get user's video answers
router.get('/answers', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const answers = await db.VideoAnswer.findAll({
            where: { userId },
            order: [['questionIndex', 'ASC']]
        });

        res.status(200).json({
            success: true,
            answers: answers
        });

    } catch (error) {
        console.error('Error fetching video answers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch video answers'
        });
    }
});

module.exports = router;
