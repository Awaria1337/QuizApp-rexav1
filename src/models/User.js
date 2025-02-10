import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Kullanıcı adı zorunludur'],
        unique: true,
        trim: true,
        minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır']
    },
    email: {
        type: String,
        required: [true, 'Email zorunludur'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi giriniz']
    },
    password: {
        type: String,
        required: [true, 'Şifre zorunludur'],
        minlength: [6, 'Şifre en az 6 karakter olmalıdır']
    },
    avatar: {
        type: String,
        default: ''
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    hearts: {
        type: Number,
        default: 5
    },
    gems: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    quizStats: {
        totalQuizzes: { type: Number, default: 0 },
        correctAnswers: { type: Number, default: 0 },
        wrongAnswers: { type: Number, default: 0 },
        categoryStats: {
            type: Map,
            of: {
                completed: { type: Number, default: 0 },
                correct: { type: Number, default: 0 },
                wrong: { type: Number, default: 0 },
                bestScore: { type: Number, default: 0 },
                totalTime: { type: Number, default: 0 }
            }
        }
    },
    levelProgress: {
        currentLevelXP: { type: Number, default: 0 },
        nextLevelXP: { type: Number, default: 1000 },
        totalXPEarned: { type: Number, default: 0 }
    },
    achievements: [{
        type: { type: String, enum: ['quiz_master', 'streak_champion', 'category_expert'] },
        name: String,
        description: String,
        unlockedAt: { type: Date, default: Date.now }
    }],
    inventory: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
        quantity: { type: Number, default: 1 },
        purchaseDate: { type: Date, default: Date.now }
    }],
    completedTasks: [{
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        completedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

// Level sistemi için XP hesaplama
userSchema.methods.addXP = async function (xpAmount) {
    this.xp += xpAmount;
    this.levelProgress.totalXPEarned += xpAmount;
    this.levelProgress.currentLevelXP += xpAmount;

    // Level hesaplama formülü: Her level için gereken XP = level * 1000
    const nextLevel = this.level + 1;
    const requiredXP = nextLevel * 1000;
    this.levelProgress.nextLevelXP = requiredXP;

    if (this.levelProgress.currentLevelXP >= requiredXP) {
        this.level = nextLevel;
        this.levelProgress.currentLevelXP -= requiredXP;
        // Level atlama bonusu
        this.gems += 50 + (this.level * 5); // Level arttıkça bonus artar
        this.hearts += 2;

        // Yeni level için XP gereksinimini güncelle
        this.levelProgress.nextLevelXP = (this.level + 1) * 1000;
    }

    await this.save();
    return {
        newLevel: this.level,
        currentXP: this.levelProgress.currentLevelXP,
        nextLevelXP: this.levelProgress.nextLevelXP,
        rewards: {
            gems: this.gems,
            hearts: this.hearts
        }
    };
};

// Kategori istatistiklerini güncelleme
userSchema.methods.updateCategoryStats = async function (categoryId, correct, time) {
    const stats = this.quizStats.categoryStats.get(categoryId) || {
        completed: 0,
        correct: 0,
        wrong: 0,
        bestScore: 0,
        totalTime: 0
    };

    stats.completed += 1;
    if (correct) {
        stats.correct += 1;
    } else {
        stats.wrong += 1;
    }
    
    const score = (correct ? 100 : 0);
    if (score > stats.bestScore) {
        stats.bestScore = score;
    }
    
    stats.totalTime += time;
    this.quizStats.categoryStats.set(categoryId, stats);
    
    await this.save();
    return stats;
};

const User = mongoose.models?.User || mongoose.model('User', userSchema);

export default User;