// Utilities and polyfills are now in js/utils.js
// TranslationManager is now in js/translations.js

class MyChildGame {
    constructor() {
        // Get username from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.username = urlParams.get('username') || 'default';
        
        // Load customization
        this.loadCustomization();
        
        // Load saved game or create new
        const savedGame = this.loadGame();
        
        this.child = savedGame ? savedGame.child : {
            name: this.customization.name || (this.customization.gender === 'girl' ? 'Jente' : 'Gutt'),
            happiness: 50,
            energy: 80,
            social: 60,
            learning: 40,
            hunger: 70,
            age: this.customization.age !== undefined ? this.customization.age : 0,
            // Alex is a bullying victim - emotional states
            resilience: 50, // How well Alex handles bullying (0-100)
            currentEmotion: 'neutral', // Current emotional state
            emotionalState: {
                // Alex's complex emotions
                angry: 0,
                sad: 0,
                scared: 0,
                happy: 0,
                anxious: 0,
                curious: 0,
                embarrassed: 0,
                surprised: 0
            },
            // Career and success system
            studyLevel: 0, // Study dedication (0-100)
            money: 20, // Starting money (like original - need to manage resources)
            careerProgress: 0, // Career development (0-100)
            // Track daily routines (like original - must do these)
            lastFed: 0, // Day when child was last fed
            lastBathed: 0, // Day when child was last bathed
            lastPlayed: 0, // Day when child was last played with
            daysWithoutFood: 0, // Track consecutive days without food
            daysWithoutBath: 0, // Track consecutive days without bath
            helpingOthers: 0, // Times Alex helped others (hero counter)
            goodChoices: 0, // Count of good long-term choices
            shortTermChoices: 0, // Count of short-term pleasure choices
            // Learning and activity tracking
            emotionLessonsLearned: savedGame && savedGame.emotionLessonsLearned ? savedGame.emotionLessonsLearned : 0,
            mindfulnessPractices: savedGame && savedGame.mindfulnessPractices ? savedGame.mindfulnessPractices : 0,
            artCreated: savedGame && savedGame.artCreated ? savedGame.artCreated : 0,
            quizzesCompleted: savedGame && savedGame.quizzesCompleted ? savedGame.quizzesCompleted : 0,
            cookedMeals: savedGame && savedGame.cookedMeals ? savedGame.cookedMeals : 0,
            exercisesCompleted: savedGame && savedGame.exercisesCompleted ? savedGame.exercisesCompleted : 0,
            natureExplorations: savedGame && savedGame.natureExplorations ? savedGame.natureExplorations : 0,
            subjectsStudied: savedGame && savedGame.subjectsStudied ? savedGame.subjectsStudied : {},
            // Character customization
            gender: this.customization.gender || 'boy',
            emoji: this.customization.emoji || '🧒',
            hairColor: this.customization.hairColor || 'brown',
            eyeColor: this.customization.eyeColor || 'brown',
            style: this.customization.style || 'normal',
            // Profile customization
            customAvatar: savedGame && savedGame.child && savedGame.child.customAvatar ? savedGame.child.customAvatar : null,
            avatarType: savedGame && savedGame.child && savedGame.child.avatarType ? savedGame.child.avatarType : 'emoji',
            bio: savedGame && savedGame.child && savedGame.child.bio ? savedGame.child.bio : '',
            ownedItems: savedGame && savedGame.child && savedGame.child.ownedItems ? savedGame.child.ownedItems : [],
            // Bullying tracking (like original - important for narrative)
            bullyingCopingMethod: savedGame && savedGame.child && savedGame.child.bullyingCopingMethod ? savedGame.child.bullyingCopingMethod : null,
            teacherInvolved: savedGame && savedGame.child && savedGame.child.teacherInvolved ? savedGame.child.teacherInvolved : false,
            lastSupportiveChoice: savedGame && savedGame.child && savedGame.child.lastSupportiveChoice ? savedGame.child.lastSupportiveChoice : null
        };
        
        this.day = savedGame ? savedGame.day : 1;
        this.year = savedGame ? savedGame.year : 2000;
        this.timeOfDay = savedGame ? savedGame.timeOfDay : 0;
        this.timeNames = ["Morning", "Afternoon", "Evening", "Night"];
        this.currentLocation = savedGame ? savedGame.currentLocation : "home";
        this.pendingEvent = savedGame ? savedGame.pendingEvent : null;
        this.dialogueQueue = savedGame ? savedGame.dialogueQueue : [];
        this.actionsToday = savedGame ? savedGame.actionsToday : 0;
        this.maxActionsPerDay = 5; // Like original - limited actions per day (reduced from 6 to make it more challenging)
        this.memory = savedGame ? savedGame.memory : []; // Track important events and choices
        this.relationship = savedGame ? savedGame.relationship : 50; // Relationship strength (hidden stat)
            this.bullyingIncidents = savedGame ? savedGame.bullyingIncidents : 0; // Track bullying incidents
            this.copingActivities = savedGame ? savedGame.copingActivities : []; // Track activities that help Alex cope
            this.achievements = savedGame ? savedGame.achievements : []; // Track achievements
        this.factsShown = savedGame ? savedGame.factsShown : []; // Track which facts have been shown
        this.lastFactDay = savedGame ? savedGame.lastFactDay : 0; // Track last day a fact was shown
        this.dailyTipShown = savedGame ? savedGame.dailyTipShown : false; // Track if daily tip was shown today
        this.hasSeenTutorial = savedGame ? savedGame.hasSeenTutorial : false; // Track if user has seen tutorial
        this.language = savedGame ? (savedGame.language || 'no') : 'no'; // Language: 'no' or 'en'
        
        // Initialize translation manager
        this.translationManager = new TranslationManager();
        
        // Initialize customization if not loaded
        this.customization = this.customization || {
            gender: 'boy',
            name: 'Alex',
            age: 8,
            emoji: '🧒',
            hairColor: 'brown',
            eyeColor: 'brown',
            style: 'normal'
        };
        
        this.locations = {
            home: { name: "Home", color: "#ffb3ba", image: "images/home.jpg", usePlaceholder: false },
            school: { name: "School", color: "#bae1ff", image: "images/school.jpg", usePlaceholder: false },
            playground: { name: "Playground", color: "#baffc9", image: "images/playground.jpg", usePlaceholder: false },
            friend: { name: "Friend's House", color: "#ffffba", image: "images/friend.jpg", usePlaceholder: false },
            nature: { name: "Nature", color: "#90EE90", image: "images/nature.jpg", usePlaceholder: false }
        };
        
        // Try to load images automatically (async)
        setTimeout(() => this.loadSceneImages(), 100);
        
        // Initialize music
        this.musicEnabled = true;
        this.backgroundMusic = null;
        
        // API configuration
        this.apiConfig = window.APIConfig || null;
        this.useAPI = false; // Will be set based on API availability
        
        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => this.saveGame(), 30000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => this.saveGame());
        
        // Save on visibility change (when tab becomes hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveGame();
            }
        });
        
        // Initialize mobile UX features (after DOM is ready)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initMobileUX());
        } else {
            setTimeout(() => this.initMobileUX(), 100);
        }
        
        // Redirect to login if no username
        if (!this.username || this.username === 'default') {
            if (window.location.pathname.includes('index.html')) {
                window.location.href = 'login.html';
                return;
            }
        }
        
        this.initializeGame();
    }
    
    loadCustomization() {
        try {
            const customizationData = localStorage.getItem(`mychild_customization_${this.username}`);
            if (customizationData) {
                this.customization = JSON.parse(customizationData);
            } else {
                this.customization = {
                    gender: 'boy',
                    name: 'Alex',
                    age: 8,
                    emoji: '🧒',
                    hairColor: 'brown',
                    eyeColor: 'brown',
                    style: 'normal'
                };
            }
        } catch (e) {
            console.error('Error loading customization:', e);
            this.customization = {
                gender: 'boy',
                name: 'Gutt',
                age: 0,
                emoji: '🧒',
                hairColor: 'brown',
                eyeColor: 'brown',
                style: 'normal'
            };
        }
    }
    
    loadGame() {
        try {
            if (typeof(Storage) === "undefined") {
                console.warn('LocalStorage not available');
                return null;
            }
            
            const gameData = localStorage.getItem(`mychild_game_${this.username}`);
            if (gameData) {
                const parsed = JSON.parse(gameData);
                // Validate data structure
                if (parsed && parsed.child && typeof parsed.day === 'number') {
                    // Restore learning tracking from saved data
                    if (parsed.emotionLessonsLearned !== undefined && parsed.child) {
                        parsed.child.emotionLessonsLearned = parsed.emotionLessonsLearned;
                    }
                    if (parsed.mindfulnessPractices !== undefined && parsed.child) {
                        parsed.child.mindfulnessPractices = parsed.mindfulnessPractices;
                    }
                    if (parsed.artCreated !== undefined && parsed.child) {
                        parsed.child.artCreated = parsed.artCreated;
                    }
                    if (parsed.quizzesCompleted !== undefined && parsed.child) {
                        parsed.child.quizzesCompleted = parsed.quizzesCompleted;
                    }
                    if (parsed.hasSeenTutorial !== undefined) {
                        parsed.hasSeenTutorial = parsed.hasSeenTutorial;
                    }
                    // Restore activity tracking
                    if (parsed.child) {
                        if (parsed.cookedMeals !== undefined) parsed.child.cookedMeals = parsed.cookedMeals;
                        if (parsed.exercisesCompleted !== undefined) parsed.child.exercisesCompleted = parsed.exercisesCompleted;
                        if (parsed.natureExplorations !== undefined) parsed.child.natureExplorations = parsed.natureExplorations;
                        if (parsed.subjectsStudied !== undefined) parsed.child.subjectsStudied = parsed.subjectsStudied;
                    }
                    return parsed;
                } else {
                    console.warn('Invalid game data structure, creating new game');
                    return null;
                }
            }
        } catch (e) {
            console.error('Error loading game:', e);
            // If JSON is corrupted, try to recover or create new
            try {
                localStorage.removeItem(`mychild_game_${this.username}`);
            } catch (removeError) {
                console.error('Could not remove corrupted save:', removeError);
            }
        }
        return null;
    }
    
    saveGame() {
        try {
            // Check if localStorage is available
            if (typeof(Storage) === "undefined") {
                console.warn('LocalStorage not available');
                return false;
            }
            
            const gameData = {
                child: this.child,
                day: this.day,
                year: this.year,
                timeOfDay: this.timeOfDay,
                currentLocation: this.currentLocation,
                pendingEvent: this.pendingEvent,
                dialogueQueue: this.dialogueQueue,
                actionsToday: this.actionsToday,
                memory: this.memory,
                    relationship: this.relationship,
                    bullyingIncidents: this.bullyingIncidents,
                    copingActivities: this.copingActivities,
                    achievements: this.achievements,
                    factsShown: this.factsShown,
                    lastFactDay: this.lastFactDay,
                    dailyTipShown: this.dailyTipShown,
                    emotionLessonsLearned: this.child.emotionLessonsLearned || 0,
                    mindfulnessPractices: this.child.mindfulnessPractices || 0,
                    artCreated: this.child.artCreated || 0,
                    quizzesCompleted: this.child.quizzesCompleted || 0,
                    cookedMeals: this.child.cookedMeals || 0,
                    exercisesCompleted: this.child.exercisesCompleted || 0,
                    natureExplorations: this.child.natureExplorations || 0,
                    subjectsStudied: this.child.subjectsStudied || {},
                    lastSaved: new Date().toISOString() // Save timestamp
                };
            
            const gameDataString = JSON.stringify(gameData);
            
            // Check if data is too large (localStorage has ~5-10MB limit)
            if (gameDataString.length > 5000000) {
                console.warn('Game data too large to save');
                return false;
            }
            
            localStorage.setItem(`mychild_game_${this.username}`, gameDataString);
            this.showSaveIndicator(true);
            console.log('Game saved successfully');
            return true;
        } catch (e) {
            console.error('Error saving game:', e);
            let errorMessage = null;
            if (e.name === 'QuotaExceededError') {
                errorMessage = this.language === 'no' 
                    ? '⚠️ Lagringsfull - vennligst slett noen gamle spill'
                    : '⚠️ Storage full - please delete some old games';
                this.showMessage(errorMessage);
            } else {
                errorMessage = this.language === 'no'
                    ? '⚠️ Kunne ikke lagre spillet'
                    : '⚠️ Could not save game';
            }
            this.showSaveIndicator(false, errorMessage);
            return false;
        }
    }
    
    showSaveIndicator(success = true, message = null) {
        // Show save indicator with visual feedback
        const saveIndicator = document.getElementById('saveIndicator');
        if (saveIndicator) {
            if (success) {
                const savedText = this.language === 'no' ? '💾 Lagret' : '💾 Saved';
                saveIndicator.textContent = message || savedText;
                saveIndicator.className = 'save-indicator save-success';
                saveIndicator.style.opacity = '1';
                saveIndicator.setAttribute('aria-live', 'polite');
                saveIndicator.setAttribute('aria-label', savedText);
                
                // Animate success
                setTimeout(() => {
                    saveIndicator.style.opacity = '0.6';
                    saveIndicator.className = 'save-indicator';
                }, 3000);
            } else {
                const errorText = this.language === 'no' ? '⚠️ Lagring feilet' : '⚠️ Save failed';
                saveIndicator.textContent = message || errorText;
                saveIndicator.className = 'save-indicator save-error';
                saveIndicator.style.opacity = '1';
                saveIndicator.setAttribute('aria-live', 'assertive');
                saveIndicator.setAttribute('aria-label', errorText);
                
                // Keep error visible longer
                setTimeout(() => {
                    saveIndicator.style.opacity = '0.6';
                    saveIndicator.className = 'save-indicator';
                }, 5000);
            }
        }
    }
    
    deleteGame() {
        const confirmMsg = this.t('messages.deleteConfirm');
        if (confirm(confirmMsg)) {
            try {
                localStorage.removeItem(`mychild_game_${this.username}`);
                localStorage.removeItem(`mychild_customization_${this.username}`);
                window.location.href = 'login.html';
            } catch (e) {
                console.error('Error deleting game:', e);
                const errorMsg = this.t('messages.deleteError');
                alert(errorMsg);
            }
        }
    }
    
    initializeGame() {
        // Update child name and customization from saved data
        if (this.customization) {
            this.child.name = this.customization.name || this.child.name;
            this.child.gender = this.customization.gender || this.child.gender;
            this.child.emoji = this.customization.emoji || this.child.emoji;
            this.child.hairColor = this.customization.hairColor || this.child.hairColor;
            this.child.eyeColor = this.customization.eyeColor || this.child.eyeColor;
            this.child.style = this.customization.style || this.child.style;
        }
        
        this.updateDisplay();
        
        // Check if this is a loaded game
        const isLoadedGame = this.loadGame() !== null;
        
        if (isLoadedGame) {
            const backDialogue = this.language === 'no'
                ? "Hei! Jeg er tilbake, " + this.child.name + ". Klar for å fortsette reisen vår!"
                : "Hi! I'm back, " + this.child.name + ". Ready to continue our journey!";
            const backMessage = this.language === 'no'
                ? "Velkommen tilbake! " + this.child.name + "s fremgang er lagret. La oss fortsette å vokse sterkere sammen!"
                : "Welcome back! " + this.child.name + "'s progress has been saved. Let's continue growing stronger together!";
            this.showDialogue(backDialogue);
            this.showMessage(backMessage);
        } else {
            let ageAppropriateDialogue = "";
            if (this.child.age < 1) {
                ageAppropriateDialogue = this.language === 'no'
                    ? "Hei... Jeg er " + this.child.name + ". Jeg er bare en baby i år 2000. Jeg vil vokse opp med din hjelp og støtte!"
                    : "Hi... I'm " + this.child.name + ". I'm just a baby in the year 2000. I'll grow up with your help and support!";
            } else if (this.child.age < 5) {
                ageAppropriateDialogue = this.language === 'no'
                    ? "Hei! Jeg er " + this.child.name + ". Jeg er " + this.child.age + " år gammel i 2000-tallet. Alt er nytt og spennende!"
                    : "Hi! I'm " + this.child.name + ". I'm " + this.child.age + " years old in the 2000s. Everything is new and exciting!";
            } else if (this.child.age < 7) {
                ageAppropriateDialogue = this.language === 'no'
                    ? "Hei... Jeg er " + this.child.name + ". Jeg er " + this.child.age + " år gammel. Jeg forbereder meg på skolen snart!"
                    : "Hi... I'm " + this.child.name + ". I'm " + this.child.age + " years old. I'm getting ready for school soon!";
            } else {
                // Historical reference - like original game (post-WW2 context)
                ageAppropriateDialogue = this.language === 'no' 
                    ? "Hei... Jeg er " + this.child.name + ". Å begynne på skolen i 2000-tallet er... vel, det kan være komplisert noen ganger. Noen ganger føler jeg at jeg er annerledes, at folk ser på meg annerledes. Men jeg vet at jeg er god nok akkurat som jeg er, og det er alle andre også. Historien vår er ikke skrevet i stein - vi kan skape vår egen fremtid."
                    : "Hi... I'm " + this.child.name + ". Starting school in the 2000s is... well, it's complicated sometimes. Sometimes I feel different, like people see me differently. But I know I'm good enough just as I am, and so is everyone else. Our story isn't written in stone - we can create our own future.";
            }
            this.showDialogue(ageAppropriateDialogue);
            const welcomeMsg = this.language === 'no'
                ? "Velkommen! Du tar nå vare på " + this.child.name + " i år 2000. " + this.child.name + " er " + this.child.age + " år gammel. " + this.child.name + " møter utfordringer, men husk: " + this.child.name + " er perfekt akkurat som " + (this.child.gender === 'girl' ? 'hun' : 'han') + " er. Med din støtte og riktige valg kan " + this.child.name + " vokse sterkere, hjelpe andre og finne suksess. Hvert valg teller - både for i dag og i morgen."
                : "Welcome! You are now taking care of " + this.child.name + " in the year 2000. " + this.child.name + " is " + this.child.age + " years old. " + this.child.name + " faces challenges, but remember: " + this.child.name + " is perfect just as " + (this.child.gender === 'girl' ? 'she' : 'he') + " is. With your support and the right choices, " + this.child.name + " can grow stronger, help others, and find success. Every choice matters - both for today and tomorrow.";
            this.showMessage(welcomeMsg);
        }
        
        // Show image loading message
        if (this.locations.home.usePlaceholder) {
            const tipMsg = this.language === 'no'
                ? "Tips: Legg til bilder i 'images' mappen (home.jpg, school.jpg, playground.jpg, friend.jpg) for bedre visuell opplevelse!"
                : "Tip: Add images to the 'images' folder (home.jpg, school.jpg, playground.jpg, friend.jpg) for better visuals!";
            this.showMessage(tipMsg);
        }
        
        // Initialize background music
        this.initMusic();
        
        // Start with initial emotional check
        this.updateEmotionalState();
        
        // Show tutorial for new players
        if (!this.hasSeenTutorial && this.day === 1 && this.actionsToday === 0) {
            setTimeout(() => this.showTutorial(), 1500);
        }
        
        // Show daily learning fact or tip
        setTimeout(() => this.showDailyLearning(), 2000);
        
        this.checkForEvents();
    }
    
    t(key, ...args) {
        // Use TranslationManager for translations
        return this.translationManager.t(this.language, key, ...args);
    }
    
    setLanguage(lang) {
        this.language = lang;
        this.saveGame();
        
        // Update language radio buttons
        document.querySelectorAll('input[name="language"]').forEach(radio => {
            radio.checked = radio.value === lang;
        });
        
        this.updateAllTexts();
        this.showMessage(this.language === 'no' ? 'Språk endret til norsk!' : 'Language changed to English!');
    }
    
    updateAllTexts() {
        // Update all UI texts based on language
        this.updateDisplay();
        
        // Update time names
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = this.t('timeNames')[this.timeOfDay];
        }
        
        // Update elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Update profile modal texts
        this.updateProfileDisplay();
        
        // Update help modal title
        const helpModalTitle = document.querySelector('#helpModal .modal-header h2');
        if (helpModalTitle) {
            helpModalTitle.textContent = this.language === 'no' ? '❓ Hjelp og veiledning' : '❓ Help & Guide';
        }
        
        // Update initial welcome message
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage && !statusMessage.textContent) {
            statusMessage.textContent = this.t('messages.welcome');
        }
        
        // Update specific UI elements
        const yearLabel = document.querySelector('.year-display');
        if (yearLabel) {
            yearLabel.innerHTML = (this.language === 'no' ? 'År: ' : 'Year: ') + '<span id="currentYear">' + this.year + '</span>';
        }
        
        // Update action display
        this.updateActionDisplay();
        
        // Update profile money text
        const profileMoneyText = document.getElementById('profileMoneyText');
        if (profileMoneyText) {
            profileMoneyText.innerHTML = (this.language === 'no' ? 'Du har: ' : 'You have: ') + '<span id="profileMoney">' + (this.child.money || 0) + '</span> ' + (this.language === 'no' ? 'kr' : 'kr');
        }
    }
    
    getTranslation(key) {
        // Use TranslationManager for translations
        // Try ui namespace first, then messages, then activities
        return this.translationManager.t(this.language, 'ui.' + key) || 
               this.translationManager.t(this.language, 'messages.' + key) ||
               this.translationManager.t(this.language, 'activities.' + key) ||
               key;
    }
    
    // Legacy method - kept for compatibility (deprecated)
    _getTranslation(key) {
        // Simple translation lookup
        const translations = {
            no: {
                welcome: "Velkommen! Ta vare på barnet ditt i 2000-tallet.",
                activities: "Aktiviteter",
                playground: "Lekegrind",
                nature: "Natur",
                school: "Skole",
                home: "Hjem",
                friend: "Venns hus",
                dailyCare: "Daglig omsorg",
                feed: "Fôr",
                bathe: "Bad",
                play: "Lek",
                read: "Les",
                mindfulness: "Mindfulness",
                draw: "Tegn/Lag",
                cook: "Lag mat",
                support: "Støtte og mestring",
                daydream: "Drøm",
                talk: "Snakk",
                learnEmotions: "Lær følelser",
                cognitiveTherapy: "Kognitiv terapi",
                learning: "Læring og utvikling",
                environment: "Miljøvern",
                economics: "Økonomi",
                ethics: "Etikk & Filosofi",
                growth: "Vekst og valg",
                study: "Studer",
                volunteer: "Frivillig",
                help: "Hjelp andre",
                exercise: "Trening",
                freeTime: "Fritid",
                readBooks: "Les bøker",
                games: "Spill",
                quiz: "Følelses-quiz",
                music: "Hør musikk",
                call: "Ring venn",
                language: "Språk",
                shop: "Butikk",
                rest: "Hvile/Søvn",
                nextDay: "Neste dag →"
            },
            en: {
                welcome: "Welcome! Take care of your child in the 2000s.",
                activities: "Activities",
                playground: "Playground",
                nature: "Nature",
                school: "School",
                home: "Home",
                friend: "Friend's House",
                dailyCare: "Daily Care",
                feed: "Feed",
                bathe: "Bathe",
                play: "Play",
                read: "Read",
                mindfulness: "Mindfulness",
                draw: "Draw/Create",
                cook: "Cook Together",
                support: "Support & Coping",
                daydream: "Daydream",
                cognitiveTherapy: "Cognitive Therapy",
                learning: "Learning & Development",
                environment: "Environment",
                economics: "Economics",
                ethics: "Ethics & Philosophy",
                talk: "Talk",
                learnEmotions: "Learn Emotions",
                growth: "Growth & Choices",
                study: "Study Hard",
                volunteer: "Volunteer",
                help: "Help Others",
                exercise: "Exercise",
                freeTime: "Free Time",
                readBooks: "Read Books",
                games: "Games",
                quiz: "Emotion Quiz",
                music: "Listen Music",
                call: "Call Friend",
                language: "Language",
                shop: "Shop",
                rest: "Rest/Sleep",
                nextDay: "Next Day →"
            }
        };
        
        return translations[this.language] && translations[this.language][key] ? translations[this.language][key] : key;
    }
    
    showTutorial() {
        this.hasSeenTutorial = true;
        this.saveGame();
        
        const tutorialSteps = [
            {
                title: "Velkommen til MyChild! 👶",
                message: "Dette er et omsorgsspill hvor du tar vare på et barn som vokser opp i 2000-tallet. Ta vare på barnet ved å fylle statsene!",
                duration: 4000
            },
            {
                title: "Stats 📊",
                message: "Happiness, Energy, Social, Learning og Hunger er viktige stats. Sørg for at de ikke blir for lave!",
                duration: 4000
            },
            {
                title: "Aktiviteter 🎮",
                message: "Prøv ulike aktiviteter - Feed, Play, Read, Cook, Exercise og mer! Hver aktivitet gir læringsfakta og lærer barnet noe nytt!",
                duration: 4000
            },
            {
                title: "Tips 💡",
                message: "Spillet lærer bort om følelser, psykologi, mat, natur og mer! Se etter læringsfakta som dukker opp under aktiviteter.",
                duration: 4000
            }
        ];
        
        let currentStep = 0;
        
        const showNextStep = () => {
            if (currentStep < tutorialSteps.length) {
                const step = tutorialSteps[currentStep];
                this.showMessage("📖 " + step.title + " - " + step.message);
                currentStep++;
                if (currentStep < tutorialSteps.length) {
                    setTimeout(showNextStep, step.duration);
                }
            }
        };
        
        showNextStep();
    }
    
    showDailyLearning() {
        // Show a learning fact or tip once per day
        if (this.lastFactDay !== this.day) {
            this.lastFactDay = this.day;
            this.dailyTipShown = false;
        }
        
        if (!this.dailyTipShown && this.actionsToday === 0) {
            // Show learning fact about emotions or psychology
            const facts = this.getLearningFacts();
            const randomFact = facts[Math.floor(Math.random() * facts.length)];
            
            // Only show if not shown before, or rotate through them
            if (!this.factsShown.includes(randomFact.id) || this.factsShown.length >= facts.length) {
                this.factsShown.push(randomFact.id);
                if (this.factsShown.length >= facts.length) {
                    this.factsShown = []; // Reset when all facts shown
                }
                
                this.showMessage("💡 Læringsfakta: " + randomFact.text);
            }
            
            this.dailyTipShown = true;
        }
    }
    
    getLearningFacts() {
        return [
            { id: 1, text: "Følelser er normale! Alle føler seg glade, triste, sinte eller engstelige av og til. Det er viktig å snakke om følelsene våre." },
            { id: 2, text: "Hjernen vår har en del som heter 'amygdala' - den hjelper oss å kjenne igjen følelser. Den er som en alarmklokke som varsler når vi er redde eller engstelige." },
            { id: 3, text: "Når vi er stresset, kan dype pust og telling til 10 hjelpe hjernen vår å roe seg ned. Dette kalles 'selvregulering'." },
            { id: 4, text: "Empati betyr at vi forstår hvordan andre føler seg. Å ha empati gjør oss til gode venner og hjelpsomme mennesker." },
            { id: 5, text: "Selvtillit er når vi tror på oss selv. Vi bygger selvtillit ved å prøve nye ting og feile - feil er en del av læring!" },
            { id: 6, text: "Hjernen vår vokser og lærer hele livet! Når vi prøver nye ting, lager hjernen nye 'baner' som hjelper oss å huske bedre." },
            { id: 7, text: "Å sove godt er viktig for hjernen vår! Mens vi sover, reparerer hjernen seg og lagrer det vi har lært i dag." },
            { id: 8, text: "Følelser kan være som været - de kommer og går. Akkurat som regn ikke varer evig, varer ikke triste følelser heller." },
            { id: 9, text: "Å hjelpe andre gjør ikke bare dem glade - det gjør OSS også glade! Det kalles 'giver's high'." },
            { id: 10, text: "Alle har ulike styrker. Noen er gode til matte, andre til å være venner. Det er det som gjør verden interessant!" },
            { id: 11, text: "Mindfulness betyr å være oppmerksom på nåtiden. Det kan hjelpe oss å føle oss mer rolige og mindre engstelige." },
            { id: 12, text: "Når vi føler oss engstelige, er det fordi hjernen vår prøver å beskytte oss. Men vi kan lære å håndtere engstelsen." },
            { id: 13, text: "Å snakke om følelser våre gjør dem mindre skummle. Det er derfor det er viktig å ha noen å snakke med." },
            { id: 14, text: "Selvrespekt betyr å behandle oss selv godt, akkurat som vi behandler en venn. Vi fortjener alltid respekt!" },
            { id: 15, text: "Hjernen vår lager et kjemikal som heter 'dopamin' når vi gjør noe vi liker. Det er grunnen til at vi føler oss glade!" }
        ];
    }
    
    initMusic() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        if (this.backgroundMusic) {
            // Set volume (0.0 to 1.0)
            this.backgroundMusic.volume = 0.5; // 50% volume
            
            // Mobile-specific: Ensure playsinline is set (important for iOS)
            if (!this.backgroundMusic.hasAttribute('playsinline')) {
                this.backgroundMusic.setAttribute('playsinline', 'true');
            }
            if (!this.backgroundMusic.hasAttribute('preload')) {
                this.backgroundMusic.setAttribute('preload', 'auto');
            }
            
            // Try to play music (may require user interaction due to browser policies)
            // Music will start when user interacts with the page
            const tryPlayMusic = () => {
                if (this.musicEnabled && this.backgroundMusic && this.backgroundMusic.paused) {
                    const playPromise = this.backgroundMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => {
                            console.log('Music autoplay prevented by browser:', e);
                        });
                    }
                }
            };
            
            // Try on various user interactions (important for mobile)
            document.addEventListener('click', tryPlayMusic, { once: true });
            document.addEventListener('touchstart', tryPlayMusic, { once: true });
            document.addEventListener('touchend', tryPlayMusic, { once: true });
            document.addEventListener('keydown', tryPlayMusic, { once: true });
            
            // Also try on button interactions after DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach(btn => {
                        btn.addEventListener('click', tryPlayMusic, { once: true });
                    });
                });
            } else {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(btn => {
                    btn.addEventListener('click', tryPlayMusic, { once: true });
                });
            }
        }
    }
    
    toggleMusic() {
        if (!this.backgroundMusic) {
            this.backgroundMusic = document.getElementById('backgroundMusic');
        }
        
        if (this.backgroundMusic) {
            if (this.musicEnabled) {
                // Pause music
                this.backgroundMusic.pause();
                this.musicEnabled = false;
                const toggleBtn = document.getElementById('musicToggle');
                if (toggleBtn) {
                    toggleBtn.classList.add('muted');
                    toggleBtn.textContent = '🔇';
                }
            } else {
                // Play music - handle mobile autoplay restrictions
                const playPromise = this.backgroundMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.musicEnabled = true;
                        const toggleBtn = document.getElementById('musicToggle');
                        if (toggleBtn) {
                            toggleBtn.classList.remove('muted');
                            toggleBtn.textContent = '🎵';
                        }
                    }).catch(e => {
                        console.log('Error playing music (may require user interaction):', e);
                        // Show message to user that they need to interact first
                        this.showMessage('Musikk krever brukerinteraksjon på mobil. Trykk på en knapp for å starte musikk.');
                    });
                } else {
                    this.musicEnabled = true;
                    const toggleBtn = document.getElementById('musicToggle');
                    if (toggleBtn) {
                        toggleBtn.classList.remove('muted');
                        toggleBtn.textContent = '🎵';
                    }
                }
            }
        }
    }
    
    updateDisplay() {
        // Update stats with animation
        const updateStatWithAnimation = (elementId, value) => {
            const element = document.getElementById(elementId);
            if (element) {
                const oldValue = parseInt(element.textContent) || 0;
                if (oldValue !== value) {
                    // Add animation class
                    element.classList.add('stat-updating');
                    element.textContent = value;
                    // Remove animation class after animation
                    setTimeout(() => element.classList.remove('stat-updating'), 500);
                } else {
                    element.textContent = value;
                }
            }
        };
        
        updateStatWithAnimation('happinessValue', this.child.happiness);
        updateStatWithAnimation('energyValue', this.child.energy);
        updateStatWithAnimation('socialValue', this.child.social);
        updateStatWithAnimation('learningValue', this.child.learning);
        updateStatWithAnimation('hungerValue', this.child.hunger);
        
        // Update bars with smooth transition
        const updateBar = (barId, value) => {
            const bar = document.getElementById(barId);
            if (bar) {
                bar.style.transition = 'width 0.5s ease';
                bar.style.width = value + '%';
            }
        };
        
        updateBar('happinessBar', this.child.happiness);
        updateBar('energyBar', this.child.energy);
        updateBar('socialBar', this.child.social);
        updateBar('learningBar', this.child.learning);
        
        const hungerBar = document.getElementById('hungerBar');
        if (hungerBar) {
            hungerBar.style.transition = 'width 0.5s ease';
            hungerBar.style.width = this.child.hunger + '%';
            if (this.child.hunger < 30) {
                hungerBar.classList.add('low');
            } else {
                hungerBar.classList.remove('low');
            }
        }
        
        // Update time
        document.getElementById('currentDay').textContent = this.day;
        document.getElementById('currentYear').textContent = this.year;
        document.getElementById('currentTime').textContent = this.timeNames[this.timeOfDay];
        
        // Update child name
        document.getElementById('childName').textContent = this.child.name;
        
        // Update emotion display (like original - show child's feelings)
        this.updateEmotionDisplay();
        
        // Update money display if child has money
        const moneyDisplay = document.getElementById('moneyDisplay');
        const moneyValue = document.getElementById('moneyValue');
        if (moneyDisplay && moneyValue) {
            if (this.child.money > 0) {
                moneyDisplay.style.display = 'block';
                moneyValue.textContent = this.child.money;
            } else {
                moneyDisplay.style.display = 'none';
            }
        }
        
        // Update action counter
        this.updateActionDisplay();
        
        // Update progress stats if visible
        this.updateProgressStats();
        
        // Update avatar based on emotional state (async)
        this.updateAvatar().catch(e => console.log('Avatar update error:', e));
        
        // Update child avatar image based on gender and age
        this.updateChildAvatarImage();
        
        // Update scene (async)
        this.updateScene().catch(e => console.log('Scene update error:', e));
        
        // Check for critical states
        this.checkCriticalStates();
        
        // Check for achievements
        this.checkAchievements();
    }
    
    updateProgressStats() {
        const progressStats = document.getElementById('progressStats');
        if (!progressStats) return;
        
        // Only update if visible
        if (progressStats.style.display !== 'none') {
            const resilienceBar = document.getElementById('resilienceBar');
            const resilienceValue = document.getElementById('resilienceValue');
            const studyBar = document.getElementById('studyBar');
            const studyValue = document.getElementById('studyValue');
            const helpingValue = document.getElementById('helpingValue');
            
            if (resilienceBar) {
                resilienceBar.style.width = this.child.resilience + '%';
                if (resilienceValue) resilienceValue.textContent = this.child.resilience;
            }
            
            if (studyBar) {
                studyBar.style.width = this.child.studyLevel + '%';
                if (studyValue) studyValue.textContent = this.child.studyLevel;
            }
            
            if (helpingValue) {
                helpingValue.textContent = this.child.helpingOthers;
            }
        }
    }
    
    toggleProgressStats() {
        const progressStats = document.getElementById('progressStats');
        const toggleBtn = document.querySelector('.toggle-stats-btn');
        if (progressStats && toggleBtn) {
            if (progressStats.style.display === 'none') {
                progressStats.style.display = 'block';
                toggleBtn.textContent = '📊 Skjul fremgang';
                this.updateProgressStats();
            } else {
                progressStats.style.display = 'none';
                toggleBtn.textContent = '📊 Vis fremgang';
            }
        }
    }
    
    checkCriticalStates() {
        // Only show one critical message at a time to avoid spam
        if (this.child.hunger < 20 && Math.random() < 0.3) {
            this.showDialogue("I'm so hungry... Can I have something to eat?");
            this.adjustStat('happiness', -5);
        } else if (this.child.happiness < 20 && Math.random() < 0.3) {
            this.showDialogue("I feel sad... Can we do something fun together?");
        } else if (this.child.energy < 15 && Math.random() < 0.3) {
            this.showDialogue("I'm really tired... Can I rest?");
        }
    }
    
    updateChildAvatarImage() {
        // Use real photos if available based on gender
        const avatar = document.querySelector('.child-avatar');
        if (!avatar) return;
        
        // Check if we should use real photos (for older children)
        if (this.child.age >= 3) {
            const photoPath = this.child.gender === 'girl' 
                ? 'images/girlcloseuppicture.png' 
                : 'images/boycloseuppicture.png';
            
            // Only use photo if avatar is currently emoji
            if (avatar.textContent && !avatar.querySelector('img')) {
                const img = document.createElement('img');
                img.src = photoPath;
                img.alt = this.child.name;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                img.style.transition = 'opacity 0.3s';
                img.onerror = () => {
                    // If image doesn't exist, keep emoji
                    img.style.display = 'none';
                };
                img.onload = () => {
                    // Fade in photo
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                };
                
                // Don't replace if already has image
                if (!avatar.querySelector('img')) {
                    const currentEmoji = avatar.textContent;
                    avatar.innerHTML = '';
                    avatar.appendChild(img);
                    // Keep emoji as fallback text
                    avatar.setAttribute('data-emoji', currentEmoji);
                }
            }
        }
    }
    
    updateEmotionalState() {
        // Update Alex's current emotion based on emotional states (like original - more reactive)
        const emotions = this.child.emotionalState;
        const maxEmotion = Object.entries(emotions).reduce((a, b) => emotions[a[0]] > emotions[b[1]] ? a : b);
        
        // More sensitive emotion detection (like original game)
        if (maxEmotion[1] > 25) { // Lowered threshold for stronger reactions
            this.child.currentEmotion = maxEmotion[0];
        } else if (this.child.happiness < 30) {
            this.child.currentEmotion = 'sad';
        } else if (this.child.happiness > 70) {
            this.child.currentEmotion = 'happy';
        } else {
            this.child.currentEmotion = 'neutral';
        }
        
        // Emotional states fade slower (like original - emotions last longer)
        Object.keys(emotions).forEach(emotion => {
            if (emotions[emotion] > 0) {
                // Strong emotions fade slower
                const fadeRate = emotions[emotion] > 50 ? 1 : 1.5;
                emotions[emotion] = Math.max(0, emotions[emotion] - fadeRate);
            }
        });
        
        // Update avatar to show emotion visually
        this.updateAvatar();
    }
    
    setEmotion(emotion, intensity = 30) {
        if (this.child.emotionalState.hasOwnProperty(emotion)) {
            this.child.emotionalState[emotion] = Math.min(100, Math.max(0, 
                this.child.emotionalState[emotion] + intensity));
            this.updateEmotionalState();
            this.updateDisplay();
        }
    }
    
    updateEmotionDisplay() {
        // Show child's current emotion (like original game)
        const emotionDisplay = document.getElementById('emotionDisplay');
        const emotionText = document.getElementById('emotionText');
        
        if (!emotionDisplay || !emotionText) return;
        
        const emotions = this.child.emotionalState;
        const maxEmotion = Object.entries(emotions).reduce((a, b) => emotions[a[0]] > emotions[b[1]] ? a : b);
        
        if (maxEmotion[1] > 30) {
            const emotionNames = {
                happy: this.language === 'no' ? '😊 Glad' : '😊 Happy',
                sad: this.language === 'no' ? '😢 Lei seg' : '😢 Sad',
                angry: this.language === 'no' ? '😠 Sint' : '😠 Angry',
                scared: this.language === 'no' ? '😨 Redd' : '😨 Scared',
                anxious: this.language === 'no' ? '😰 Engstelig' : '😰 Anxious',
                surprised: this.language === 'no' ? '😲 Overrasket' : '😲 Surprised',
                embarrassed: this.language === 'no' ? '😳 Flau' : '😳 Embarrassed',
                curious: this.language === 'no' ? '🤔 Nysgjerrig' : '🤔 Curious'
            };
            
            emotionText.textContent = emotionNames[maxEmotion[0]] || maxEmotion[0];
            emotionDisplay.style.display = 'block';
            
            // Color based on emotion
            if (maxEmotion[0] === 'happy' || maxEmotion[0] === 'curious') {
                emotionDisplay.style.background = 'rgba(76, 175, 80, 0.3)';
            } else if (maxEmotion[0] === 'sad' || maxEmotion[0] === 'anxious') {
                emotionDisplay.style.background = 'rgba(33, 150, 243, 0.3)';
            } else if (maxEmotion[0] === 'angry' || maxEmotion[0] === 'scared') {
                emotionDisplay.style.background = 'rgba(244, 67, 54, 0.3)';
            } else {
                emotionDisplay.style.background = 'rgba(255, 255, 255, 0.3)';
            }
        } else {
            emotionDisplay.style.display = 'none';
        }
    }
    
    async updateAvatar() {
        const avatar = document.querySelector('.child-avatar');
        
        // Determine emotion state based on Alex's complex emotions
        let emotion = this.child.currentEmotion;
        
        // Priority: strong emotions override basic needs
        if (this.child.emotionalState.angry > 40) {
            emotion = 'angry';
        } else if (this.child.emotionalState.scared > 40) {
            emotion = 'scared';
        } else if (this.child.emotionalState.sad > 40) {
            emotion = 'sad';
        } else if (this.child.emotionalState.happy > 40) {
            emotion = 'happy';
        } else if (this.child.emotionalState.embarrassed > 30) {
            emotion = 'embarrassed';
        } else if (this.child.emotionalState.surprised > 30) {
            emotion = 'surprised';
        } else if (this.child.hunger < 20) {
            emotion = 'hungry';
        } else if (this.child.happiness < 30) {
            emotion = 'sad';
        } else if (this.child.happiness > 80) {
            emotion = 'happy';
        }
        
        // Try to use API for professional illustration
        if (this.apiConfig && this.apiConfig.animationAPI && this.apiConfig.animationAPI.enabled) {
            try {
                const animationUrl = await this.apiConfig.animationAPI.getAnimation(emotion, this.child.age);
                if (animationUrl) {
                    avatar.innerHTML = `<img src="${animationUrl}" alt="Child avatar" style="width:100%;height:100%;object-fit:contain;border-radius:50%;">`;
                    return;
                }
            } catch (e) {
                console.log('API animation failed, using fallback:', e);
            }
        }
        
        // Try API image generation for character (professional portrait)
        if (this.apiConfig && this.apiConfig.imageAPI && this.apiConfig.imageAPI.enabled) {
            try {
                const prompt = this.apiConfig.characterPrompts[emotion].replace('{age}', this.child.age);
                const imageUrl = await this.apiConfig.imageAPI.generateImage(prompt, 'character');
                if (imageUrl) {
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = 'Child avatar';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '50%';
                    img.style.transition = 'opacity 0.3s';
                    img.style.opacity = '0';
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    avatar.innerHTML = '';
                    avatar.appendChild(img);
                    return;
                }
            } catch (e) {
                console.log('API image generation failed, using fallback:', e);
            }
        }
        
        // Try to use custom SVG renderer first
        if (window.CharacterRenderer) {
            try {
                const renderer = new CharacterRenderer();
                const svg = renderer.renderCharacter(this.child, emotion);
                avatar.innerHTML = '';
                avatar.appendChild(svg);
                return;
            } catch (e) {
                console.log('SVG rendering failed, using emoji fallback:', e);
            }
        }
        
        // Use real photos if available (boycloseuppicture.png / girlcloseuppicture.png)
        this.updateChildAvatarImage();
        
        // Fallback to emoji
        let baseEmoji = this.child.emoji || '🧒';
        
        // If no custom emoji, use age-appropriate default
        if (!this.child.emoji || this.child.emoji === '🧒') {
            if (this.child.age < 1) {
                baseEmoji = '👶'; // Newborn baby
            } else if (this.child.age < 3) {
                baseEmoji = '👶'; // Baby/toddler
            } else if (this.child.age < 5) {
                baseEmoji = '🧒'; // Young child
            } else if (this.child.age < 10) {
                baseEmoji = this.child.gender === 'girl' ? '👧' : '👦';
            } else if (this.child.age < 15) {
                baseEmoji = this.child.gender === 'girl' ? '👩' : '👨';
            } else {
                baseEmoji = this.child.gender === 'girl' ? '👩' : '🧑';
            }
        }
        
        avatar.textContent = baseEmoji;
        
        // Add emotion data attribute for CSS animations
        avatar.setAttribute('data-emotion', this.child.currentEmotion);
        
        // Add animation class for personality when happy
        if (this.child.happiness > 70) {
            avatar.classList.add('animated');
        } else {
            avatar.classList.remove('animated');
        }
    }
    
    supportsWebP() {
        // Check if browser supports WebP format
        if (this._webpSupport !== undefined) {
            return this._webpSupport;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        this._webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        return this._webpSupport;
    }
    
    preloadCriticalImages() {
        // Preload critical images (current location and next likely location)
        const currentIndex = ['home', 'school', 'playground', 'friend', 'nature'].indexOf(this.currentLocation);
        const nextLocation = ['home', 'school', 'playground', 'friend', 'nature'][(currentIndex + 1) % 5];
        
        [this.currentLocation, nextLocation].forEach(locationKey => {
            const location = this.locations[locationKey];
            if (location && location.image && !location.imagePreloaded) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = location.image;
                // fetchPriority is not supported in all browsers, use try-catch
                try {
                    if ('fetchPriority' in link) {
                        link.fetchPriority = locationKey === this.currentLocation ? 'high' : 'low';
                    }
                } catch (e) {
                    // Ignore if not supported
                }
                document.head.appendChild(link);
                location.imagePreloaded = true;
            }
        });
    }
    
    loadSceneImages() {
        // Check if images exist and update accordingly
        const imageNames = ['home.jpg', 'school.jpg', 'playground.jpg', 'friend.jpg'];
        imageNames.forEach((imgName, index) => {
            const locationKeys = ['home', 'school', 'playground', 'friend'];
            const location = locationKeys[index];
            const img = new Image();
            img.onload = () => {
                // Image exists, keep the path
                this.locations[location].usePlaceholder = false;
            };
            img.onerror = () => {
                // Image doesn't exist, use placeholder SVG
                this.locations[location].usePlaceholder = true;
                // Update scene if it's the current location
                if (this.currentLocation === location) {
                    this.updateScene().catch(e => console.log('Scene update error:', e));
                }
            };
            img.src = `images/${imgName}`;
        });
        
        // Preload critical images after checking
        setTimeout(() => this.preloadCriticalImages(), 500);
    }
    
    async updateScene() {
        const location = this.locations[this.currentLocation];
        const sceneImage = document.getElementById('sceneImage');
        const sceneName = document.getElementById('sceneName');
        
        sceneImage.style.background = `linear-gradient(135deg, ${location.color} 0%, ${location.color}dd 100%)`;
        
        // Preload next likely images
        this.preloadCriticalImages();
        
        // Try API-generated professional illustration first
        if (this.apiConfig && this.apiConfig.imageAPI && this.apiConfig.imageAPI.enabled) {
            // Show loading indicator
            sceneImage.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:1.2em;">🎨 Generating professional illustration...</div>';
            
            try {
                const prompt = this.apiConfig.scenePrompts[this.currentLocation] || `Professional illustration of ${location.name}`;
                const apiImageUrl = await this.apiConfig.imageAPI.generateImage(prompt, this.currentLocation);
                if (apiImageUrl) {
                    const img = document.createElement('img');
                    img.src = apiImageUrl;
                    img.alt = location.name;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.transition = 'opacity 0.3s';
                    img.style.opacity = '0';
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    img.onerror = () => {
                        // Fallback if API image fails
                        this.loadSceneImage(location, sceneImage);
                    };
                    sceneImage.innerHTML = '';
                    sceneImage.appendChild(img);
                    sceneName.textContent = location.name;
                    return;
                } else {
                    // API returned null, use fallback
                    this.loadSceneImage(location, sceneImage);
                }
            } catch (e) {
                console.log('API image generation failed, using local images:', e);
                this.loadSceneImage(location, sceneImage);
            }
        } else {
            // Use local images or placeholder
            this.loadSceneImage(location, sceneImage);
        }
        
        sceneName.textContent = location.name;
    }
    
    loadSceneImage(location, sceneImageElement) {
        // Use image if available, otherwise use SVG placeholder
        if (location.image && !location.usePlaceholder) {
            const img = document.createElement('img');
            img.loading = 'lazy'; // Lazy load images
            img.alt = location.name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.decoding = 'async'; // Async decoding for better performance
            // fetchPriority is not supported in all browsers
            try {
                if ('fetchPriority' in img) {
                    img.fetchPriority = 'high'; // High priority for visible images
                }
            } catch (e) {
                // Ignore if not supported
            }
            
            // Try WebP first, fallback to original format
            const imagePath = location.image;
            const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            
            // Check if WebP is supported
            const supportsWebP = this.supportsWebP();
            
            // Use Intersection Observer for better lazy loading
            if ('IntersectionObserver' in window && !location.imageLoaded) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Load WebP if supported, otherwise use original
                            if (supportsWebP) {
                                // Try WebP first
                                const webpImg = new Image();
                                webpImg.onload = () => {
                                    img.src = webpPath;
                                    observer.disconnect();
                                };
                                webpImg.onerror = () => {
                                    // Fallback to original if WebP doesn't exist
                                    img.src = imagePath;
                                    observer.disconnect();
                                };
                                webpImg.src = webpPath;
                            } else {
                                img.src = imagePath;
                                observer.disconnect();
                            }
                        }
                    });
                }, { rootMargin: '50px' });
                
                // Show placeholder while loading
                sceneImageElement.innerHTML = this.getPlaceholderSVG(this.currentLocation);
                sceneImageElement.appendChild(img);
                observer.observe(img);
            } else {
                // Fallback for browsers without IntersectionObserver
                if (supportsWebP) {
                    const webpImg = new Image();
                    webpImg.onload = () => img.src = webpPath;
                    webpImg.onerror = () => img.src = imagePath;
                    webpImg.src = webpPath;
                } else {
                    img.src = imagePath;
                }
            }
            
            img.onerror = () => {
                // If image fails to load, use placeholder
                this.locations[this.currentLocation].usePlaceholder = true;
                sceneImageElement.innerHTML = this.getPlaceholderSVG(this.currentLocation);
            };
            img.onload = () => {
                // Remove placeholder when image loads
                const placeholder = sceneImageElement.querySelector('svg');
                if (placeholder) {
                    placeholder.remove();
                }
                location.imageLoaded = true;
            };
            
            if (!sceneImageElement.contains(img)) {
                sceneImageElement.appendChild(img);
            }
        } else {
            // Use SVG placeholder
            sceneImageElement.innerHTML = this.getPlaceholderSVG(this.currentLocation);
        }
    }
    
    getPlaceholderSVG(location) {
        // Create SVG placeholders that look more like original game style
        const svgs = {
            home: `<svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#f0f0f0"/>
                <!-- House -->
                <rect x="150" y="150" width="100" height="80" fill="#d4a574" stroke="#8b6f47" stroke-width="2"/>
                <polygon points="150,150 200,100 250,150" fill="#8b4513" stroke="#654321" stroke-width="2"/>
                <rect x="170" y="170" width="25" height="35" fill="#4a4a4a"/>
                <rect x="205" y="180" width="20" height="20" fill="#87ceeb"/>
                <!-- Window -->
                <rect x="220" y="170" width="20" height="25" fill="#87ceeb" stroke="#4682b4" stroke-width="1"/>
                <!-- Door handle -->
                <circle cx="188" cy="188" r="2" fill="#ffd700"/>
            </svg>`,
            school: `<svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#e8f4f8"/>
                <!-- School building -->
                <rect x="100" y="120" width="200" height="100" fill="#c0c0c0" stroke="#808080" stroke-width="2"/>
                <polygon points="100,120 200,60 300,120" fill="#8b4513" stroke="#654321" stroke-width="2"/>
                <!-- Windows -->
                <rect x="130" y="150" width="30" height="40" fill="#87ceeb" stroke="#4682b4" stroke-width="1"/>
                <rect x="180" y="150" width="30" height="40" fill="#87ceeb" stroke="#4682b4" stroke-width="1"/>
                <rect x="230" y="150" width="30" height="40" fill="#87ceeb" stroke="#4682b4" stroke-width="1"/>
                <!-- Door -->
                <rect x="195" y="180" width="30" height="40" fill="#654321" stroke="#3e2723" stroke-width="1"/>
                <!-- Flag -->
                <line x1="200" y1="60" x2="200" y2="40" stroke="#333" stroke-width="2"/>
                <rect x="200" y="40" width="20" height="15" fill="#ff0000"/>
            </svg>`,
            playground: `<svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#90ee90"/>
                <!-- Ground -->
                <rect x="0" y="250" width="400" height="50" fill="#8b7355"/>
                <!-- Swing set -->
                <line x1="100" y1="250" x2="100" y2="150" stroke="#654321" stroke-width="4"/>
                <line x1="150" y1="250" x2="150" y2="150" stroke="#654321" stroke-width="4"/>
                <line x1="100" y1="150" x2="150" y2="150" stroke="#654321" stroke-width="4"/>
                <!-- Swing seat -->
                <line x1="125" y1="180" x2="125" y2="200" stroke="#654321" stroke-width="2"/>
                <rect x="115" y="200" width="20" height="5" fill="#8b4513"/>
                <!-- Slide -->
                <rect x="250" y="200" width="10" height="50" fill="#4682b4"/>
                <line x1="250" y1="200" x2="300" y2="250" stroke="#4682b4" stroke-width="8"/>
                <!-- Tree -->
                <rect x="320" y="180" width="20" height="70" fill="#8b4513"/>
                <circle cx="330" cy="180" r="30" fill="#228b22"/>
            </svg>`,
            friend: `<svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#fffacd"/>
                <!-- House -->
                <rect x="120" y="140" width="160" height="100" fill="#deb887" stroke="#8b6f47" stroke-width="2"/>
                <polygon points="120,140 200,80 280,140" fill="#8b4513" stroke="#654321" stroke-width="2"/>
                <!-- Windows with curtains -->
                <rect x="140" y="160" width="35" height="40" fill="#87ceeb" stroke="#4682b4" stroke-width="1"/>
                <line x1="157" y1="160" x2="157" y2="200" stroke="#ffd700" stroke-width="2"/>
                <rect x="225" y="160" width="35" height="40" fill="#87ceeb" stroke="#4682b4" stroke-width="1"/>
                <line x1="242" y1="160" x2="242" y2="200" stroke="#ffd700" stroke-width="2"/>
                <!-- Door -->
                <rect x="195" y="190" width="30" height="50" fill="#654321" stroke="#3e2723" stroke-width="1"/>
                <circle cx="218" cy="215" r="2" fill="#ffd700"/>
                <!-- Welcome mat -->
                <rect x="200" y="240" width="20" height="5" fill="#8b4513"/>
            </svg>`,
            nature: `<svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#87ceeb"/>
                <!-- Sky gradient -->
                <rect x="0" y="0" width="400" height="200" fill="#e0f7ff"/>
                <!-- Ground -->
                <rect x="0" y="200" width="400" height="100" fill="#90ee90"/>
                <!-- Trees -->
                <rect x="50" y="180" width="15" height="30" fill="#8b4513"/>
                <circle cx="57" cy="180" r="25" fill="#228b22"/>
                <rect x="150" y="170" width="15" height="40" fill="#8b4513"/>
                <circle cx="157" cy="170" r="30" fill="#228b22"/>
                <rect x="280" y="175" width="15" height="35" fill="#8b4513"/>
                <circle cx="287" cy="175" r="28" fill="#228b22"/>
                <!-- Flowers -->
                <circle cx="100" cy="220" r="3" fill="#ff69b4"/>
                <circle cx="200" cy="230" r="3" fill="#ffd700"/>
                <circle cx="320" cy="225" r="3" fill="#ff1493"/>
                <!-- Sun -->
                <circle cx="350" cy="50" r="25" fill="#ffd700"/>
                <!-- Butterfly -->
                <ellipse cx="250" cy="150" rx="8" ry="5" fill="#ff69b4"/>
                <ellipse cx="255" cy="150" rx="8" ry="5" fill="#ffd700"/>
            </svg>`
        };
        
        return svgs[location] || svgs.home;
    }
    
    // Helper function to set scene images
    setSceneImage(location, imagePath) {
        if (this.locations[location]) {
            this.locations[location].image = imagePath;
            this.locations[location].usePlaceholder = false;
            this.updateScene().catch(e => console.log('Scene update error:', e));
        }
    }
    
    showDialogue(text) {
        document.getElementById('dialogueText').textContent = text;
    }
    
    showMessage(text) {
        document.getElementById('statusMessage').textContent = text;
    }
    
    updateActionDisplay() {
        const actionInfo = document.getElementById('actionInfo');
        const actionInfoText = document.getElementById('actionInfoText');
        if (actionInfo && actionInfoText) {
            const remaining = this.maxActionsPerDay - this.actionsToday;
            const actionText = this.language === 'no' 
                ? `Handlinger: ${remaining}/${this.maxActionsPerDay}`
                : `Actions: ${remaining}/${this.maxActionsPerDay}`;
            actionInfoText.textContent = actionText;
            
            // Update color based on remaining actions
            if (remaining === 0) {
                actionInfo.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                actionInfo.style.boxShadow = '0 4px 8px rgba(244, 67, 54, 0.3)';
            } else if (remaining < 2) {
                actionInfo.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                actionInfo.style.boxShadow = '0 4px 8px rgba(255, 152, 0, 0.3)';
            } else if (remaining < 3) {
                actionInfo.style.background = 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)';
                actionInfo.style.boxShadow = '0 4px 8px rgba(255, 193, 7, 0.3)';
            } else {
                actionInfo.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                actionInfo.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
        }
    }
    
    adjustStat(stat, amount) {
        const oldValue = this.child[stat];
        this.child[stat] = Math.max(0, Math.min(100, this.child[stat] + amount));
        
        // Relationship affects stat changes
        if (this.relationship > 70 && amount > 0) {
            this.child[stat] = Math.min(100, this.child[stat] + Math.floor(amount * 0.1));
        }
        
        this.updateDisplay();
        return this.child[stat] - oldValue;
    }
    
    adjustRelationship(amount) {
        this.relationship = Math.max(0, Math.min(100, this.relationship + amount));
    }
    
    canPerformAction() {
        if (this.actionsToday >= this.maxActionsPerDay) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er trøtt... Kan vi hvile? Det har vært en lang dag."
                : "I'm tired... Can we rest? It's been a long day.";
            const noActionsMsg = this.language === 'no'
                ? "Du har brukt alle handlingene dine for i dag. Gå til neste dag for å fortsette."
                : "You've used all your actions for today. Go to the next day to continue.";
            this.showDialogue(tiredMsg);
            this.showMessage(noActionsMsg);
            return false;
        }
        return true;
    }
    
    performAction() {
        this.actionsToday++;
        this.updateActionDisplay();
    }
    
    async goToLocation(location) {
        this.currentLocation = location;
        this.updateDisplay();
        // Scene will be updated in updateDisplay, but ensure it happens
        
        const locationMessages = {
            home: [
                "Back at home. A safe place to rest and spend time together.",
                "Home sweet home! Time to relax and recharge.",
                "At home - perfect for family time and activities."
            ],
            school: [
                "At school! Time to learn and make friends.",
                "School day - learning new things and meeting classmates.",
                "School environment - great for learning and socializing."
            ],
            playground: [
                "At the playground! Perfect for playing and having fun.",
                "Playground time - running around and playing games outside!",
                "The playground - classic 2000s childhood fun!"
            ],
            friend: [
                "At a friend's house! Social time with peers.",
                "Visiting a friend - great for building friendships!",
                "Friend's house - hanging out and having fun together."
            ]
        };
        
        const messages = locationMessages[location];
        this.showMessage(messages[Math.floor(Math.random() * messages.length)]);
        
        // Location-specific activities
        this.triggerLocationActivity(location);
    }
    
    triggerLocationActivity(location) {
        if (location === "home") {
            this.showChoices([
                { text: "Do homework together", action: () => this.doHomework() },
                { text: "Watch TV together", action: () => this.watchTV() },
                { text: "Play games together", action: () => this.playGames() },
                { text: "Eat a meal together", action: () => this.eatMeal() },
                { text: "Go to sleep", action: () => this.sleep() }
            ]);
        } else if (location === "school") {
            this.showChoices([
                { text: "Attend classes", action: () => this.goToSchool() },
                { text: "Choose a subject", action: () => this.chooseSchoolSubject() },
                { text: "Talk to classmates", action: () => this.hangWithFriends() }
            ]);
        } else if (location === "nature") {
            this.showChoices([
                { text: "Explore nature", action: () => this.goToNature() },
                { text: "Look for insects", action: () => this.goToNature() }
            ]);
        } else if (location === "playground") {
            this.showChoices([
                { text: "Play outside", action: () => this.playOutside() },
                { text: "Meet other kids", action: () => this.hangWithFriends() }
            ]);
        } else if (location === "friend") {
            this.showChoices([
                { text: "Play together", action: () => this.playGames() },
                { text: "Just hang out", action: () => this.hangWithFriends() }
            ]);
        }
    }
    
    showChoices(choices) {
        const choicesArea = document.getElementById('choicesArea');
        choicesArea.innerHTML = '';
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.onclick = () => {
                choicesArea.innerHTML = '';
                choice.action();
            };
            choicesArea.appendChild(btn);
        });
    }
    
    doHomework() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 15) {
            this.showDialogue("I'm too tired for homework. Can I rest first?");
            this.showMessage("Your child needs more energy to do homework.");
            return;
        }
        this.adjustStat('learning', 20);
        this.adjustStat('energy', -15);
        this.adjustStat('happiness', -5);
        this.showDialogue("I finished my homework! It was about the new millennium and computers.");
        this.showMessage("Homework completed! Your child learned about early 2000s technology.");
        this.performAction();
        this.advanceTime();
    }
    
    watchTV() {
        if (!this.canPerformAction()) return;
        
        this.adjustStat('happiness', 15);
        this.adjustStat('energy', -10);
        this.adjustStat('learning', 5);
        this.adjustRelationship(1);
        
        const shows = [
            "I love watching these 2000s shows! They're so fun!",
            "This cartoon is awesome! Can we watch more?",
            "TV is so cool! I wish I could watch all day."
        ];
        this.showDialogue(shows[Math.floor(Math.random() * shows.length)]);
        this.showMessage("Watching classic 2000s TV shows together!");
        this.performAction();
        this.advanceTime();
    }
    
    playGames() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue("I'm too tired to play games right now.");
            return;
        }
        this.adjustStat('happiness', 20);
        this.adjustStat('energy', -15);
        this.adjustStat('social', 5);
        this.adjustRelationship(2);
        
        const games = [
            "I love playing on my Game Boy! This game is so cool!",
            "Playing video games is the best! Can we play more?",
            "This PlayStation game is awesome! I'm having so much fun!"
        ];
        this.showDialogue(games[Math.floor(Math.random() * games.length)]);
        this.showMessage("Playing classic 2000s video games!");
        this.performAction();
        this.advanceTime();
    }
    
    hangWithFriends() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 15) {
            this.showDialogue("I'm too tired to hang out with friends right now.");
            return;
        }
        this.adjustStat('social', 20);
        this.adjustStat('happiness', 15);
        this.adjustStat('energy', -10);
        this.adjustRelationship(1);
        
        const activities = [
            "I had so much fun with my friends today! We played games and talked.",
            "My friends are the best! We had a great time together.",
            "I love hanging out with friends! They make me so happy."
        ];
        this.showDialogue(activities[Math.floor(Math.random() * activities.length)]);
        this.showMessage("Great social interaction! Your child is building positive relationships.");
        this.performAction();
        this.advanceTime();
    }
    
    playOutside() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 20) {
            this.showDialogue("I'm too tired to play outside. I need more energy!");
            return;
        }
        this.adjustStat('energy', 10);
        this.adjustStat('social', 15);
        this.adjustStat('happiness', 10);
        this.adjustRelationship(1);
        
        const messages = [
            "Playing outside is so much fun! I love running around!",
            "I made new friends at the playground! This is great!",
            "Playing outside is the best! I wish I could do this every day!"
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        this.showMessage("Playing outside - classic 2000s childhood fun!");
        this.performAction();
        this.advanceTime();
    }
    
    eatMeal() {
        if (!this.canPerformAction()) return;
        
        // Eat meal also reduces hunger
        this.adjustStat('hunger', 20);
        this.adjustStat('energy', 25);
        this.adjustStat('happiness', 10);
        this.adjustRelationship(2);
        
        const meals = [
            "This food is so yummy! Thank you!",
            "I love eating together! It makes me happy.",
            "This meal is delicious! Can we have this again?",
            "I was getting hungry! This tastes great!"
        ];
        this.showDialogue(meals[Math.floor(Math.random() * meals.length)]);
        this.showMessage("Having a meal together - great family bonding time!");
        this.performAction();
        this.advanceTime();
    }
    
    goToSchool() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 6) {
            this.showDialogue("I'm too young for school yet! Maybe I can learn at home?");
            this.showMessage("Your child is too young to go to school. Try learning activities at home instead!");
            return;
        }
        
        if (this.child.energy < 20) {
            this.showDialogue("I'm too tired for school. Can I rest first?");
            this.showMessage("Your child needs more energy to go to school.");
            return;
        }
        this.adjustStat('learning', 25);
        this.adjustStat('social', 15);
        this.adjustStat('energy', -20);
        
        let schoolDays = [];
        if (this.child.age < 10) {
            schoolDays = [
                "School was fun! I learned new things!",
                "I like school! I made new friends!",
                "School is interesting! I'm learning a lot!"
            ];
        } else {
            schoolDays = [
                "School was fun today! I learned about computers and the internet!",
                "I had a great day at school! My classmates are really nice.",
                "I love school! We're learning so many interesting things about the 2000s!"
            ];
        }
        this.showDialogue(schoolDays[Math.floor(Math.random() * schoolDays.length)]);
        
        // Occasionally add learning fact about school and learning
        if (Math.random() < 0.2) {
            const schoolFacts = [
                "💡 Læringsfakta: Skole er viktig for å lære nye ting, men det er også viktig å lære utenfor skolen - gjennom lek og utforskning!",
                "💡 Læringsfakta: Når vi lærer sammen med andre, husker vi bedre! Det er derfor gruppearbeid er så nyttig.",
                "💡 Læringsfakta: Å stille spørsmål er en viktig del av læring. Det er bra å være nysgjerrig!"
            ];
            setTimeout(() => this.showMessage(schoolFacts[Math.floor(Math.random() * schoolFacts.length)]), 1000);
        }
        
        this.showMessage("A productive day at school! Learning and making friends.");
        this.performAction();
        this.advanceTime();
    }
    
    rest() {
        // Rest/sleep restores energy - can be used anytime but gives more energy if tired
        const energyRestored = this.child.energy < 30 ? 50 : 30; // More energy if very tired
        this.adjustStat('energy', energyRestored);
        this.adjustStat('happiness', 10);
        
        // Show sleeping baby image if available
        const sceneImage = document.getElementById('sceneImage');
        if (sceneImage && this.child.age < 3) {
            const sleepingImg = document.createElement('img');
            sleepingImg.src = 'images/sleepingbaby.jpg';
            sleepingImg.alt = 'Sleeping baby';
            sleepingImg.style.width = '100%';
            sleepingImg.style.height = '100%';
            sleepingImg.style.objectFit = 'cover';
            sleepingImg.onerror = () => {
                // If image doesn't exist, keep current scene
            };
            const currentContent = sceneImage.innerHTML;
            sceneImage.innerHTML = '';
            sceneImage.appendChild(sleepingImg);
            
            // Restore scene after 3 seconds
            setTimeout(() => {
                if (sceneImage.querySelector('img[alt="Sleeping baby"]')) {
                    sceneImage.innerHTML = currentContent;
                    this.updateScene();
                }
            }, 3000);
        }
        
        const restMsg = this.language === 'no'
            ? "Ahh, det føles godt å hvile! Jeg får energi tilbake."
            : "Ahh, it feels good to rest! I'm getting my energy back.";
        this.showDialogue(restMsg);
        const energyMsg = this.language === 'no'
            ? "Hvile er viktig for å få energi tilbake! " + this.child.name + " får " + energyRestored + " energi."
            : "Rest is important to restore energy! " + this.child.name + " gained " + energyRestored + " energy.";
        this.showMessage(energyMsg);
        this.setEmotion('happy', 10);
        // Rest doesn't count as action, but advances time slightly
        this.advanceTime();
    }
    
    sleep() {
        // Sleep doesn't count as action but restores energy
        if (this.actionsToday >= this.maxActionsPerDay) {
            this.adjustStat('energy', 40);
            this.adjustStat('happiness', 10);
            
            // Show sleeping baby image if available
            const sceneImage = document.getElementById('sceneImage');
            if (sceneImage && this.child.age < 3) {
                const sleepingImg = document.createElement('img');
                sleepingImg.src = 'images/sleepingbaby.jpg';
                sleepingImg.alt = 'Sleeping baby';
                sleepingImg.style.width = '100%';
                sleepingImg.style.height = '100%';
                sleepingImg.style.objectFit = 'cover';
                sleepingImg.onerror = () => {
                    // If image doesn't exist, keep current scene
                };
                const currentContent = sceneImage.innerHTML;
                sceneImage.innerHTML = '';
                sceneImage.appendChild(sleepingImg);
                
                // Restore scene after 3 seconds
                setTimeout(() => {
                    if (sceneImage.querySelector('img[alt="Sleeping baby"]')) {
                        sceneImage.innerHTML = currentContent;
                        this.updateScene();
                    }
                }, 3000);
            }
            
            this.showDialogue("Good night! I'm so tired. Sweet dreams!");
            this.showMessage("Your child is getting a good night's rest. Sleep is important for growing children.");
            this.advanceTime();
        } else {
            this.showDialogue("I'm not tired enough to sleep yet. Maybe do something else first?");
            this.showMessage("Your child needs to be more tired before sleeping.");
        }
    }
    
    // Daily care routines (like in original game)
    feedChild() {
        if (!this.canPerformAction()) return;
        
        // Check if we have food (money to buy food) - like original game
        // Food costs more as child gets older
        const foodCost = this.child.age < 5 ? 3 : this.child.age < 10 ? 5 : this.child.age < 14 ? 8 : 12;
        
        if (this.child.money < foodCost) {
            const noMoneyMsg = this.language === 'no'
                ? "Vi har ikke nok penger for mat... Vi trenger " + foodCost + " kroner, men har bare " + this.child.money + " kroner. Kanskje jeg burde jobbe først?"
                : "We don't have enough money for food... We need " + foodCost + " kroner, but only have " + this.child.money + " kroner. Maybe I should work first?";
            this.showDialogue(noMoneyMsg);
            this.showMessage(this.language === 'no' 
                ? "💡 Tips: Jobb for å tjene penger så du kan kjøpe mat! Mat er viktig!"
                : "💡 Tip: Work to earn money so you can buy food! Food is important!");
            return;
        }
        
        // Cost money to feed (like original game - critical resource management)
        this.child.money = Math.max(0, this.child.money - foodCost);
        
        // Show cost message
        if (this.child.age >= 5) {
            const costMsg = this.language === 'no'
                ? "Kjøpte mat for " + foodCost + " kroner. Gjenstående: " + this.child.money + " kroner."
                : "Bought food for " + foodCost + " kroner. Remaining: " + this.child.money + " kroner.";
            setTimeout(() => this.showMessage(costMsg), 500);
        }
        
        // Track that child was fed (like original - important for daily routine)
        this.child.lastFed = this.day;
        this.child.daysWithoutFood = 0;
        
        this.adjustStat('hunger', 35);
        this.adjustStat('happiness', 10);
        this.adjustStat('energy', 5);
        this.adjustRelationship(2);
        this.setEmotion('happy', 10);
        this.setEmotion('anxious', -5); // Eating together is comforting
        
        let messages = [];
        if (this.child.age < 1) {
            messages = [
                "*gurgles happily*",
                "*coos and smiles*",
                "*drinks milk contentedly*"
            ];
        } else if (this.child.age < 3) {
            messages = [
                "Yummy! More please!",
                "I like this food!",
                "Mmm, tasty!"
            ];
        } else {
            messages = [
                "Thank you! This food is so yummy!",
                "I was so hungry! This tastes great!",
                "Mmm, this is delicious! Can I have more?",
                "I love eating with you! Thank you for the meal!",
                "Eating together makes me feel safe... Thank you."
            ];
        }
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Occasionally add learning fact about nutrition
        if (Math.random() < 0.15) {
            const nutritionFacts = [
                "💡 Læringsfakta: God mat gir hjernen vår energi! Hjernen vår bruker mye energi, så det er viktig å spise næringsrikt.",
                "💡 Læringsfakta: Frukter og grønnsaker inneholder vitaminer som hjelper hjernen vår å fungere best!",
                "💡 Læringsfakta: Når vi spiser sammen med andre, bygger vi også relasjoner. Det er godt for både kropp og sinn!"
            ];
            setTimeout(() => this.showMessage(nutritionFacts[Math.floor(Math.random() * nutritionFacts.length)]), 1000);
        }
        
        this.showMessage("You fed your child. A well-fed child is a happy child!");
        this.performAction();
        this.advanceTime();
    }
    
    batheChild() {
        if (!this.canPerformAction()) return;
        
        // Open interactive bath universe
        this.openUniverse('bath');
    }
    
    openBathUniverse(content) {
        if (this.child.energy < 5) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å bade akkurat nå..."
                : "I'm too tired to bathe right now...";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        const bathContent = this.language === 'no' ? `
            <div style="padding: 20px;">
                <h3>🛁 Badetid!</h3>
                <p>Hva vil du gjøre i badekaret?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                    <button class="universe-btn" onclick="game.completeBathActivity('bubbles')" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🫧 Lek med bobler
                    </button>
                    <button class="universe-btn" onclick="game.completeBathActivity('toys')" style="padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🦆 Lek med leker
                    </button>
                    <button class="universe-btn" onclick="game.completeBathActivity('relax')" style="padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        😌 Slapp av
                    </button>
                    <button class="universe-btn" onclick="game.completeBathActivity('sing')" style="padding: 15px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🎵 Syng badelåter
                    </button>
                </div>
            </div>
        ` : `
            <div style="padding: 20px;">
                <h3>🛁 Bath Time!</h3>
                <p>What would you like to do in the bathtub?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                    <button class="universe-btn" onclick="game.completeBathActivity('bubbles')" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🫧 Play with bubbles
                    </button>
                    <button class="universe-btn" onclick="game.completeBathActivity('toys')" style="padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🦆 Play with toys
                    </button>
                    <button class="universe-btn" onclick="game.completeBathActivity('relax')" style="padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        😌 Relax
                    </button>
                    <button class="universe-btn" onclick="game.completeBathActivity('sing')" style="padding: 15px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🎵 Sing bath songs
                    </button>
                </div>
            </div>
        `;
        
        content.innerHTML = bathContent;
    }
    
    completeBathActivity(activity) {
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        // Track that child was bathed
        this.child.lastBathed = this.day;
        this.child.daysWithoutBath = 0;
        
        let happinessGain = 8;
        let energyCost = 5;
        let message = '';
        
        switch(activity) {
            case 'bubbles':
                happinessGain = 12;
                message = this.language === 'no' 
                    ? "Bobler er så morsomt! Jeg elsker å se dem flyte rundt! 🫧"
                    : "Bubbles are so fun! I love watching them float around! 🫧";
                break;
            case 'toys':
                happinessGain = 10;
                message = this.language === 'no'
                    ? "Lekene mine i badekaret er de beste! 🦆"
                    : "My bath toys are the best! 🦆";
                break;
            case 'relax':
                happinessGain = 8;
                energyCost = 3;
                message = this.language === 'no'
                    ? "Dette er så avslappende... Jeg føler meg rolig og trygg. 😌"
                    : "This is so relaxing... I feel calm and safe. 😌";
                break;
            case 'sing':
                happinessGain = 15;
                energyCost = 4;
                message = this.language === 'no'
                    ? "Jeg elsker å synge i badekaret! Det er så gøy! 🎵"
                    : "I love singing in the bathtub! It's so fun! 🎵";
                break;
        }
        
        this.adjustStat('happiness', happinessGain);
        this.adjustStat('energy', -energyCost);
        this.adjustStat('social', 2);
        this.adjustRelationship(1);
        this.setEmotion('happy', 15);
        
        // Occasionally add learning fact
        if (Math.random() < 0.2) {
            const hygieneFacts = this.language === 'no' ? [
                "💡 Læringsfakta: Å ta vare på kroppen vår er viktig! Det hjelper oss å føle oss godt, både fysisk og mentalt.",
                "💡 Læringsfakta: Å ta bad eller dusj kan være avslappende. Varmt vann hjelper kroppen å slappe av, noe som også hjelper hjernen.",
                "💡 Læringsfakta: Selvpleie er en måte å vise respekt for oss selv. Vi fortjener å ta vare på oss selv!"
            ] : [
                "💡 Learning fact: Taking care of our body is important! It helps us feel good, both physically and mentally.",
                "💡 Learning fact: Taking a bath or shower can be relaxing. Warm water helps the body relax, which also helps the brain.",
                "💡 Learning fact: Self-care is a way to show respect for ourselves. We deserve to take care of ourselves!"
            ];
            setTimeout(() => this.showMessage(hygieneFacts[Math.floor(Math.random() * hygieneFacts.length)]), 1000);
        }
        
        content.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>🛁 ${message}</h3>
                <p style="font-size: 1.2em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +' + happinessGain + ' glede og +2 sosial!' : 'You gained +' + happinessGain + ' happiness and +2 social!'}</p>
                <button onclick="game.closeUniverse(); game.performAction(); game.advanceTime();" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ${this.language === 'no' ? 'Lukk' : 'Close'}
                </button>
            </div>
        `;
    }
    
    playWithChild() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å leke akkurat nå..."
                : "I'm too tired to play right now...";
            this.showDialogue(tiredMsg);
            return;
        }
        
        // Track that child was played with (like original - important for daily routine)
        this.child.lastPlayed = this.day;
        
        this.adjustStat('happiness', 20);
        this.adjustStat('social', 10);
        this.adjustStat('energy', -10);
        this.adjustRelationship(3); // Playing together strengthens relationship
        this.setEmotion('happy', 25);
        this.setEmotion('sad', -15);
        this.setEmotion('anxious', -10);
        this.child.resilience = Math.min(100, this.child.resilience + 2);
        
        let messages = [];
        if (this.child.age < 3) {
            messages = [
                "Yay! Play!",
                "Fun! More play!",
                "I like playing!",
                "*giggles happily*"
            ];
        } else if (this.child.age < 7) {
            messages = [
                "This is so much fun! I love playing!",
                "Can we play more? This is the best!",
                "Playing makes me feel happy!",
                "I love when we play together!"
            ];
        } else {
            messages = [
                "This is so much fun! I love playing with you!",
                "Yay! Playing together is the best! When we play, I forget about everything else.",
                "I'm having the best time! Can we play more? This makes me feel so much better!",
                "This is awesome! You're the best! Playing helps me forget about school.",
                "I feel so free when we play... Like nothing can hurt me here."
            ];
        }
        
        const playMessage = messages[Math.floor(Math.random() * messages.length)];
        this.showDialogue(playMessage);
        
        // Occasionally add learning fact about play
        if (Math.random() < 0.3) {
            const playFacts = [
                "💡 Læringsfakta: Når vi leker, frigir hjernen vår endorfiner - kjemikalier som gjør oss glade!",
                "💡 Læringsfakta: Lek er viktig for hjernen vår! Det hjelper oss å lære, være kreative og bygge selvtillit.",
                "💡 Læringsfakta: Å leke sammen styrker båndet mellom mennesker. Det bygger tillit og glede!"
            ];
            setTimeout(() => this.showMessage(playFacts[Math.floor(Math.random() * playFacts.length)]), 1000);
        }
        
        this.showMessage("Playing together strengthens your bond and helps " + this.child.name + " find joy! Remember: " + this.child.name + " is perfect just as " + (this.child.gender === 'girl' ? 'she' : 'he') + " is!");
        this.copingActivities.push({day: this.day, activity: 'play', helpful: true});
        this.performAction();
        this.saveGame(); // Auto-save after important actions
        this.advanceTime();
    }
    
    readToChild() {
        if (!this.canPerformAction()) return;
        
        // Open interactive reading universe
        this.openUniverse('reading');
    }
    
    openReadingUniverse(content) {
        if (this.child.energy < 5) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å lese akkurat nå..."
                : "I'm too tired to read right now...";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        const books = this.language === 'no' ? [
            { title: "Eventyrbok", emoji: "📚", learning: 20, happiness: 12 },
            { title: "Dyrbok", emoji: "🦁", learning: 18, happiness: 15 },
            { title: "Historiebok", emoji: "🏛️", learning: 25, happiness: 10 },
            { title: "Vitenskapsbok", emoji: "🔬", learning: 22, happiness: 12 },
            { title: "Bildebok", emoji: "🎨", learning: 15, happiness: 18 }
        ] : [
            { title: "Fairy Tale", emoji: "📚", learning: 20, happiness: 12 },
            { title: "Animal Book", emoji: "🦁", learning: 18, happiness: 15 },
            { title: "History Book", emoji: "🏛️", learning: 25, happiness: 10 },
            { title: "Science Book", emoji: "🔬", learning: 22, happiness: 12 },
            { title: "Picture Book", emoji: "🎨", learning: 15, happiness: 18 }
        ];
        
        const readingContent = this.language === 'no' ? `
            <div style="padding: 20px;">
                <h3>📖 Les sammen!</h3>
                <p>Hvilken bok vil du lese?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 20px;">
                    ${books.map(book => `
                        <button class="universe-btn" onclick="game.completeReadingActivity('${book.title}', ${book.learning}, ${book.happiness}, '${book.emoji}')" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                            ${book.emoji} ${book.title}
                        </button>
                    `).join('')}
                </div>
            </div>
        ` : `
            <div style="padding: 20px;">
                <h3>📖 Read Together!</h3>
                <p>Which book would you like to read?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 20px;">
                    ${books.map(book => `
                        <button class="universe-btn" onclick="game.completeReadingActivity('${book.title}', ${book.learning}, ${book.happiness}, '${book.emoji}')" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                            ${book.emoji} ${book.title}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        content.innerHTML = readingContent;
    }
    
    completeReadingActivity(bookTitle, learningGain, happinessGain, emoji) {
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        this.adjustStat('learning', learningGain);
        this.adjustStat('happiness', happinessGain);
        this.adjustStat('energy', -5);
        this.adjustRelationship(2);
        this.setEmotion('happy', 15);
        this.setEmotion('anxious', -10);
        
        let messages = [];
        if (this.child.age < 1) {
            messages = this.language === 'no' ? [
                "*ser på bildene med store øyne*",
                "*lytter stille*",
                "*gurgler mot de fargerike sidene*"
            ] : [
                "*looks at pictures with wide eyes*",
                "*listens quietly*",
                "*coos at the colorful pages*"
            ];
        } else if (this.child.age < 3) {
            messages = this.language === 'no' ? [
                "Fine bilder!",
                "Jeg liker denne boken!",
                "Mer historie, takk!"
            ] : [
                "Pretty pictures!",
                "I like this book!",
                "More story please!"
            ];
        } else {
            messages = this.language === 'no' ? [
                "Jeg elsker denne historien! Kan du lese en til?",
                "Denne boken er så interessant! Jeg lærer så mye!",
                "Å lese sammen er så fint... Det får meg til å glemme skolen.",
                "Jeg vil lære å lese som deg! Dette er flott!",
                "Når vi leser, kan jeg rømme til andre verdener... Det hjelper."
            ] : [
                "I love this story! Can you read another one?",
                "This book is so interesting! I'm learning so much!",
                "Reading together is so nice... It makes me forget about school.",
                "I want to learn to read like you! This is great!",
                "When we read, I can escape to other worlds... It helps."
            ];
        }
        
        const dialogue = messages[Math.floor(Math.random() * messages.length)];
        
        // Occasionally add learning fact
        if (Math.random() < 0.3) {
            const readingFacts = this.language === 'no' ? [
                "💡 Læringsfakta: Når vi leser, aktiveres mange deler av hjernen vår samtidig! Det er som en treningsøkt for hjernen.",
                "💡 Læringsfakta: Å lese sammen med noen bygger bånd og hjelper med språkutvikling. Det er spesielt viktig for små barn!",
                "💡 Læringsfakta: Bøker kan hjelpe oss å forstå andre mennesker og situasjoner bedre. Det bygger empati!"
            ] : [
                "💡 Learning fact: When we read, many parts of our brain are activated at once! It's like a workout for the brain.",
                "💡 Learning fact: Reading together builds bonds and helps with language development. It's especially important for young children!",
                "💡 Learning fact: Books can help us understand other people and situations better. It builds empathy!"
            ];
            setTimeout(() => this.showMessage(readingFacts[Math.floor(Math.random() * readingFacts.length)]), 1000);
        }
        
        content.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>${emoji} ${bookTitle}</h3>
                <p style="font-size: 1.1em; margin: 15px 0; font-style: italic;">"${dialogue}"</p>
                <p style="font-size: 1.2em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +' + learningGain + ' læring og +' + happinessGain + ' glede!' : 'You gained +' + learningGain + ' learning and +' + happinessGain + ' happiness!'}</p>
                <button onclick="game.closeUniverse(); game.performAction(); game.advanceTime();" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ${this.language === 'no' ? 'Lukk' : 'Close'}
                </button>
            </div>
        `;
    }
    
    daydream() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 15) {
            this.showDialogue("I'm too tired to daydream...");
            return;
        }
        
        this.adjustStat('happiness', 15);
        this.adjustStat('energy', -5);
        this.setEmotion('happy', 20);
        this.setEmotion('curious', 15);
        this.setEmotion('anxious', -15); // Daydreaming helps Alex escape and find comfort
        this.setEmotion('sad', -10);
        this.adjustRelationship(2);
        
        const messages = [
            "I love imagining... In my dreams, I'm a hero!",
            "Daydreaming helps me forget about what happened at school...",
            "I imagine I'm somewhere else, somewhere safe and happy.",
            "When I daydream, I can be anyone I want to be.",
            "It's peaceful... I can create my own world in my mind."
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Occasionally add learning fact about imagination
        if (Math.random() < 0.2) {
            setTimeout(() => this.showMessage("💡 Læringsfakta: Fantasi og dagdrømmer er viktig for kreativitet! Hjernen vår trenger tid til å tenke fritt."), 1000);
        }
        
        this.showMessage("Daydreaming helps " + this.child.name + " find comfort and escape.");
        this.copingActivities.push({day: this.day, activity: 'daydream', helpful: true});
        this.performAction();
        this.advanceTime();
    }
    
    learnAboutEmotions() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue("I'm too tired to learn right now...");
            return;
        }
        
        this.adjustStat('learning', 15);
        this.adjustStat('happiness', 10);
        this.adjustStat('energy', -8);
        this.setEmotion('curious', 20);
        this.setEmotion('happy', 10);
        this.setEmotion('anxious', -10);
        this.child.resilience = Math.min(100, this.child.resilience + 3);
        this.adjustRelationship(2);
        
        const emotionLessons = [
            {
                emotion: "Glad",
                description: "Når vi er glade, lager hjernen vår dopamin og serotonin - kjemikalier som gjør oss glad!",
                dialogue: "Jeg lærte om følelser i dag! Det er interessant å forstå hvordan hjernen vår fungerer."
            },
            {
                emotion: "Trist",
                description: "Det er normalt å føle seg trist. Triste følelser hjelper oss å forstå hva som er viktig for oss.",
                dialogue: "Jeg lærte at triste følelser er normale. De går over etter hvert, akkurat som været."
            },
            {
                emotion: "Sint",
                description: "Sinne er vår kropps måte å si 'noe er ikke rettferdig'. Det er viktig å lære å håndtere sinne på en god måte.",
                dialogue: "Jeg lærte om sinne i dag. Det er en viktig følelse, men vi må lære å uttrykke den på en god måte."
            },
            {
                emotion: "Engstelig",
                description: "Engstelse er hjernens vårsystem som prøver å beskytte oss. Vi kan lære å håndtere engstelse ved å puste dypt og tenke på trygge ting.",
                dialogue: "Jeg lærte at engstelse er hjernens måte å beskytte oss på. Det er normalt, og vi kan lære å håndtere det."
            },
            {
                emotion: "Overrasket",
                description: "Når vi er overrasket, blir hjernen vår ekstra oppmerksom. Det hjelper oss å lære nye ting!",
                dialogue: "Jeg lærte at overraskelse hjelper hjernen vår å lære! Det er derfor nye ting er så interessante."
            }
        ];
        
        const lesson = emotionLessons[Math.floor(Math.random() * emotionLessons.length)];
        
        this.showDialogue(lesson.dialogue);
        setTimeout(() => {
            this.showMessage("💡 Læringsfakta om følelser: " + lesson.emotion + " - " + lesson.description);
        }, 1000);
        
        this.showMessage("Learning about emotions helps " + this.child.name + " understand " + (this.child.gender === 'girl' ? 'herself' : 'himself') + " better!");
        if (!this.child.emotionLessonsLearned) this.child.emotionLessonsLearned = 0;
        this.child.emotionLessonsLearned++;
        this.checkAchievements();
        this.performAction();
        this.advanceTime();
    }
    
    talkToCaringAdult() {
        if (!this.canPerformAction()) return;
        
        this.adjustStat('happiness', 12);
        this.adjustStat('social', 8);
        this.setEmotion('happy', 15);
        this.setEmotion('anxious', -20);
        this.setEmotion('sad', -15);
        this.adjustRelationship(4);
        this.child.resilience = Math.min(100, this.child.resilience + 5);
        
        let messages = [];
        if (this.child.age < 5) {
            messages = [
                "I like talking with you!",
                "You make me feel safe.",
                "I feel better now!",
                "Thank you for listening!"
            ];
        } else {
            messages = [
                "Thank you for listening... It helps to talk about it.",
                "I feel better when I can tell you what's happening.",
                "Sometimes I'm scared to talk, but you make me feel safe.",
                "I don't know what I'd do without you...",
                "Talking to you makes the bad feelings go away a little."
            ];
        }
        
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Add learning fact about communication
        const talkFacts = [
            "💡 Læringsfakta: Å snakke om følelser våre gjør dem mindre skummle. Det kalles 'validering' når noen lytter og forstår.",
            "💡 Læringsfakta: Å ha noen å snakke med er viktig for mental helse. Det er bra å dele både gode og vanskelige følelser!",
            "💡 Læringsfakta: Når vi snakker om problemer, kan hjernen vår lettere finne løsninger. Det er derfor samtale er så kraftig!"
        ];
        setTimeout(() => this.showMessage(talkFacts[Math.floor(Math.random() * talkFacts.length)]), 1000);
        
        this.showMessage("Talking with caring adults helps " + this.child.name + " feel supported and stronger.");
        this.copingActivities.push({day: this.day, activity: 'talk', helpful: true});
        this.performAction();
        this.advanceTime();
    }
    
    studyHard() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 20) {
            this.showDialogue("I'm too tired to study right now...");
            return;
        }
        
        this.adjustStat('learning', 20);
        this.adjustStat('energy', -15);
        this.child.studyLevel = Math.min(100, this.child.studyLevel + 5);
        this.child.careerProgress = Math.min(100, this.child.careerProgress + 3);
        this.child.goodChoices++;
        this.setEmotion('curious', 15);
        this.setEmotion('happy', 10);
        
        // Higher study level unlocks opportunities
        if (this.child.studyLevel > 50 && this.child.age >= 12) {
            this.adjustStat('happiness', 10);
            this.setEmotion('happy', 15);
            const messages = [
                "I'm getting better at this! Studying is paying off!",
                "I understand more now... This feels good!",
                "I'm learning so much! Maybe I can do something great one day.",
                "The more I study, the more I realize I can achieve anything.",
                "I used to think I wasn't smart enough... But I'm proving myself wrong!"
            ];
            this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        } else {
            const messages = [
                "I'm studying hard... It's not easy, but I know it matters.",
                "I want to be smart and successful. I'll keep working at it.",
                "Sometimes I'd rather do something else, but I know this is important.",
                "I'm building my future, one study session at a time.",
                "The kids who mock me now... They'll see. I'm building something real."
            ];
            this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        }
        
        // Occasionally add learning fact about brain and learning
        if (Math.random() < 0.25) {
            const studyFacts = [
                "💡 Læringsfakta: Når vi lærer noe nytt, vokser hjernen vår! Det lages nye forbindelser mellom nerveceller - det kalles 'nevroplastisitet'.",
                "💡 Læringsfakta: Repetisjon er viktig for hukommelsen! Når vi leser samme ting flere ganger, blir det lagret bedre i hjernen.",
                "💡 Læringsfakta: Å ta pauser mens vi studerer hjelper hjernen å huske bedre. Det er derfor variasjon er viktig!"
            ];
            setTimeout(() => this.showMessage(studyFacts[Math.floor(Math.random() * studyFacts.length)]), 1000);
        }
        
        this.showMessage("Hard work pays off! " + this.child.name + " is building a bright future. You're doing great, " + this.child.name + " - you're perfect just as you are!");
        this.performAction();
        this.saveGame(); // Auto-save after important actions
        this.advanceTime();
    }
    
    volunteer() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 10) {
            this.showDialogue("I'm too young to volunteer... But maybe I can help in other ways?");
            return;
        }
        
        this.adjustStat('happiness', 15);
        this.adjustStat('social', 12);
        this.adjustStat('energy', -10);
        this.child.helpingOthers++;
        this.child.goodChoices++;
        this.child.careerProgress = Math.min(100, this.child.careerProgress + 2);
        this.setEmotion('happy', 25);
        this.setEmotion('sad', -10);
        this.adjustRelationship(3);
        this.child.resilience = Math.min(100, this.child.resilience + 3);
        
        const messages = [
            "Helping others feels so good... I know what it's like to need help.",
            "I want to be there for people who are hurting, like you were there for me.",
            "Making a difference in someone's life... This is what I want to do.",
            "The people I help thank me... It makes all the hard times worth it.",
            "I'm learning that my pain can help me understand others' pain."
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Add learning fact about helping others
        const helpingFacts = [
            "💡 Læringsfakta: Når vi hjelper andre, lager hjernen vår oksytocin - 'kjærlighetshormonet'! Det gjør oss glade.",
            "💡 Læringsfakta: Å hjelpe andre gir oss en følelse av mening og formål. Det er godt for mental helse!",
            "💡 Læringsfakta: Frivillig arbeid lærer oss nye ferdigheter og gir oss selvtillit. Det er en vinn-vinn-situasjon!"
        ];
        setTimeout(() => this.showMessage(helpingFacts[Math.floor(Math.random() * helpingFacts.length)]), 1000);
        
        this.showMessage("Volunteering helps others and makes " + this.child.name + " feel valuable and strong!");
        this.memory.push({day: this.day, event: "Volunteered - helped others", positive: true});
        this.performAction();
        this.advanceTime();
    }
    
    helpOthers() {
        if (!this.canPerformAction()) return;
        
        if (this.child.resilience < 40) {
            this.showDialogue("I want to help... But I'm still too scared. Maybe when I'm stronger?");
            return;
        }
        
        this.adjustStat('happiness', 20);
        this.adjustStat('social', 15);
        this.adjustStat('energy', -12);
        this.child.helpingOthers++;
        this.child.goodChoices++;
        this.setEmotion('happy', 30);
        this.setEmotion('surprised', 15);
        this.setEmotion('anxious', -15);
        this.adjustRelationship(5);
        this.child.resilience = Math.min(100, this.child.resilience + 5);
        
        const messages = [
            "I stood up for someone today... I told the bullies to stop. It was scary but right.",
            "I helped someone who was being bullied. I know how they feel.",
            "I can't let others go through what I went through... Not if I can help it.",
            "I was brave today. I helped someone, and it felt amazing.",
            "I'm becoming the person I needed when I was younger."
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        this.showMessage(this.child.name + " is becoming a hero! Standing up for others shows incredible strength! Remember: all children are good enough just as they are - including you, " + this.child.name + "!");
        this.memory.push({day: this.day, event: "Helped someone - stopped bullying", positive: true});
        this.performAction();
        this.saveGame(); // Auto-save after important actions
        this.advanceTime();
    }
    
    readBooks() {
        if (!this.canPerformAction()) return;
        
        // Reading books is positive activity
        this.adjustStat('happiness', 12);
        this.adjustStat('learning', 15);
        this.adjustStat('energy', -8);
        this.setEmotion('happy', 15);
        this.setEmotion('curious', 20);
        this.adjustRelationship(2);
        this.child.goodChoices++;
        
        const messages = this.language === 'no' ? [
            "Jeg leste en bok... Det var så interessant! Jeg lærte mye.",
            "Jeg elsker å lese! Det gjør meg smartere og gladere.",
            "Lesing er så rolig og givende. Jeg vil lese mer!",
            "Bøker er fantastiske! De tar meg med på eventyr.",
            "Jeg lærte noe nytt i dag gjennom lesing!"
        ] : [
            "I read a book... It was so interesting! I learned a lot.",
            "I love reading! It makes me smarter and happier.",
            "Reading is so calming and rewarding. I want to read more!",
            "Books are amazing! They take me on adventures.",
            "I learned something new today through reading!"
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        const msg = this.language === 'no' 
            ? "Lesing bøker gir læring og glede! " + this.child.name + " lærer mye gjennom lesing!"
            : "Reading books provides learning and joy! " + this.child.name + " learns a lot through reading!";
        this.showMessage(msg);
        
        // Learning fact about reading
        if (Math.random() < 0.3) {
            const facts = this.language === 'no' ? [
                "💡 Læringsfakta: Lesing forbedrer ordforrådet og hjelper hjernen vår å utvikle seg!",
                "💡 Læringsfakta: Når vi leser, skaper hjernen nye baner som hjelper oss å huske bedre.",
                "💡 Læringsfakta: Lesing kan være rolig og redusere stress. Det er perfekt før leggetid!"
            ] : [
                "💡 Learning Fact: Reading improves vocabulary and helps our brain develop!",
                "💡 Learning Fact: When we read, our brain creates new pathways that help us remember better.",
                "💡 Learning Fact: Reading can be calming and reduce stress. It's perfect before bedtime!"
            ];
            setTimeout(() => this.showMessage(facts[Math.floor(Math.random() * facts.length)]), 1000);
        }
        
        this.performAction();
        this.advanceTime();
    }
    
    playVideoGames() {
        if (!this.canPerformAction()) return;
        
        // Moderate choice - can be fun but excessive is bad
        this.adjustStat('happiness', 12);
        this.adjustStat('energy', -8);
        this.adjustStat('learning', -1);
        this.child.shortTermChoices++;
        
        if (this.child.shortTermChoices > this.child.goodChoices * 2) {
            // Too much gaming vs. productive activities
            this.child.studyLevel = Math.max(0, this.child.studyLevel - 2);
            this.setEmotion('anxious', 5);
            const messages = [
                "I've been playing a lot... Maybe too much? I feel like I'm wasting time.",
                "Games are fun, but I'm not moving forward with my goals.",
                "I should probably balance this better... Study and play, not just play."
            ];
            this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        } else {
            this.setEmotion('happy', 15);
            const messages = [
                "Playing games is fun! A good break from everything.",
                "I love this game! It helps me relax.",
                "Gaming is fun, but I know when to stop and study too."
            ];
            this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        }
        
        this.showMessage("Gaming can be fun, but balance with productive activities is important!");
        this.performAction();
        this.advanceTime();
    }
    
    practiceMindfulness() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue("I'm too tired to focus right now...");
            return;
        }
        
        this.adjustStat('happiness', 12);
        this.adjustStat('learning', 10);
        this.adjustStat('energy', -5);
        this.setEmotion('happy', 15);
        this.setEmotion('anxious', -20);
        this.setEmotion('sad', -10);
        this.child.resilience = Math.min(100, this.child.resilience + 4);
        this.adjustRelationship(2);
        
        let messages = [];
        if (this.child.age < 5) {
            messages = [
                "I'm breathing slowly... It feels nice.",
                "I feel calm now.",
                "This is peaceful."
            ];
        } else {
            messages = [
                "Taking deep breaths... I feel my body relaxing.",
                "Mindfulness helps me feel more peaceful and less anxious.",
                "I'm focusing on my breathing. It helps me feel calm.",
                "When I practice mindfulness, the worries seem smaller.",
                "I'm learning to be present in the moment. It's peaceful."
            ];
        }
        
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        const mindfulnessFacts = [
            "💡 Læringsfakta: Mindfulness hjelper hjernen vår å roe seg ned. Det reduserer stresshormoner og øker følelsen av ro.",
            "💡 Læringsfakta: Når vi puster dypt, sender vi signal til hjernen vår om at alt er trygt. Dette hjelper kroppen å slappe av.",
            "💡 Læringsfakta: Å være oppmerksom på nåtiden hjelper oss å være mindre bekymret for fremtiden. Det kalles 'presence'."
        ];
        setTimeout(() => this.showMessage(mindfulnessFacts[Math.floor(Math.random() * mindfulnessFacts.length)]), 1000);
        
        this.showMessage("Mindfulness practice helps " + this.child.name + " feel calmer and more centered!");
        this.copingActivities.push({day: this.day, activity: 'mindfulness', helpful: true});
        if (!this.child.mindfulnessPractices) this.child.mindfulnessPractices = 0;
        this.child.mindfulnessPractices++;
        this.checkAchievements();
        this.performAction();
        this.advanceTime();
    }
    
    cognitiveTherapy() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å fokusere akkurat nå..."
                : "I'm too tired to focus right now...";
            this.showDialogue(tiredMsg);
            return;
        }
        
        this.adjustStat('happiness', 15);
        this.adjustStat('learning', 12);
        this.adjustStat('energy', -8);
        this.setEmotion('happy', 20);
        this.setEmotion('anxious', -25);
        this.setEmotion('sad', -15);
        this.child.resilience = Math.min(100, this.child.resilience + 5);
        this.adjustRelationship(3);
        
        const therapyTopics = this.language === 'no' ? [
            {
                topic: "Negative tanker",
                description: "Vi kan lære å gjenkjenne negative tanker og utfordre dem. 'Jeg er ikke god nok' kan bli til 'Jeg gjør mitt beste, og det er nok.'",
                dialogue: "Jeg lærte i dag at mine tanker ikke alltid er sannheten. Jeg kan utfordre negative tanker!"
            },
            {
                topic: "Kognitiv omstrukturering",
                description: "Å endre hvordan vi tenker om situasjoner kan endre hvordan vi føler. Dette kalles kognitiv omstrukturering.",
                dialogue: "Jeg lærte at jeg kan se på situasjoner fra en annen vinkel. Det hjelper meg å føle meg bedre."
            },
            {
                topic: "Selvmedfølelse",
                description: "Å være snill mot oss selv når vi gjør feil er viktig. Vi fortjener samme medfølelse vi gir andre.",
                dialogue: "Jeg lærte at jeg kan være snill mot meg selv, akkurat som jeg er mot andre. Det føles godt."
            },
            {
                topic: "Tankefeller",
                description: "Noen ganger faller vi i 'tankefeller' som 'alt-eller-ingenting-tenkning' eller 'katastrofetenkning'. Vi kan lære å gjenkjenne dem.",
                dialogue: "Jeg lærte om tankefeller i dag. Nå kan jeg se når jeg tenker på måter som ikke hjelper meg."
            },
            {
                topic: "Bevis og motbevis",
                description: "Når vi har en negativ tanke, kan vi spørre: 'Hva er beviset for dette? Hva er beviset mot dette?' Dette hjelper oss å tenke mer balansert.",
                dialogue: "Jeg lærte å spørre meg selv om bevis for mine tanker. Det hjelper meg å tenke mer realistisk."
            }
        ] : [
            {
                topic: "Negative thoughts",
                description: "We can learn to recognize negative thoughts and challenge them. 'I'm not good enough' can become 'I'm doing my best, and that's enough.'",
                dialogue: "I learned today that my thoughts aren't always the truth. I can challenge negative thoughts!"
            },
            {
                topic: "Cognitive restructuring",
                description: "Changing how we think about situations can change how we feel. This is called cognitive restructuring.",
                dialogue: "I learned that I can look at situations from a different angle. It helps me feel better."
            },
            {
                topic: "Self-compassion",
                description: "Being kind to ourselves when we make mistakes is important. We deserve the same compassion we give others.",
                dialogue: "I learned that I can be kind to myself, just like I am to others. It feels good."
            },
            {
                topic: "Thinking traps",
                description: "Sometimes we fall into 'thinking traps' like 'all-or-nothing thinking' or 'catastrophizing'. We can learn to recognize them.",
                dialogue: "I learned about thinking traps today. Now I can see when I'm thinking in ways that don't help me."
            },
            {
                topic: "Evidence and counter-evidence",
                description: "When we have a negative thought, we can ask: 'What's the evidence for this? What's the evidence against this?' This helps us think more balanced.",
                dialogue: "I learned to ask myself about evidence for my thoughts. It helps me think more realistically."
            }
        ];
        
        const topic = therapyTopics[Math.floor(Math.random() * therapyTopics.length)];
        this.showDialogue(topic.dialogue);
        setTimeout(() => {
            const factMsg = this.language === 'no'
                ? "💡 Kognitiv terapi: " + topic.topic + " - " + topic.description
                : "💡 Cognitive Therapy: " + topic.topic + " - " + topic.description;
            this.showMessage(factMsg);
        }, 1000);
        
        const successMsg = this.language === 'no'
            ? "Kognitiv terapi hjelper " + this.child.name + " å forstå og endre negative tankemønstre!"
            : "Cognitive therapy helps " + this.child.name + " understand and change negative thought patterns!";
        this.showMessage(successMsg);
        this.copingActivities.push({day: this.day, activity: 'cognitive_therapy', helpful: true});
        this.performAction();
        this.advanceTime();
    }
    
    learnEnvironment() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å lære akkurat nå..."
                : "I'm too tired to learn right now...";
            this.showDialogue(tiredMsg);
            return;
        }
        
        this.adjustStat('learning', 18);
        this.adjustStat('happiness', 12);
        this.adjustStat('energy', -8);
        this.setEmotion('curious', 20);
        this.setEmotion('happy', 15);
        this.child.goodChoices++;
        this.adjustRelationship(2);
        
        const envTopics = this.language === 'no' ? [
            {
                topic: "Klimaendringer",
                description: "Jorden vår blir varmere på grunn av drivhusgasser. Vi kan hjelpe ved å bruke mindre energi, gå mer, og velge miljøvennlige alternativer.",
                dialogue: "Jeg lærte om klimaendringer i dag. Jeg vil hjelpe til med å ta vare på planeten vår!"
            },
            {
                topic: "Resirkulering",
                description: "Å resirkulere betyr å gjenbruke materialer i stedet for å kaste dem. Dette reduserer søppel og sparer ressurser.",
                dialogue: "Jeg lærte at resirkulering er viktig! Jeg kan hjelpe ved å sortere søppel riktig."
            },
            {
                topic: "Biodiversitet",
                description: "Biodiversitet betyr variasjonen av liv på jorden. Når arter dør ut, påvirker det hele økosystemet. Vi må beskytte naturen!",
                dialogue: "Jeg lærte om biodiversitet. Alle dyr og planter er viktige for balansen i naturen!"
            },
            {
                topic: "Ren energi",
                description: "Solenergi, vindkraft og vannkraft er fornybare energikilder som ikke forurenser. De er bedre for miljøet enn fossile brenstoffer.",
                dialogue: "Jeg lærte om ren energi i dag. Det er viktig å bruke fornybare energikilder!"
            },
            {
                topic: "Vannbevaring",
                description: "Rent vann er en begrenset ressurs. Vi kan spare vann ved å dusje kortere, reparere lekkasjer, og ikke la vannet renne unødvendig.",
                dialogue: "Jeg lærte at vann er verdifullt! Jeg skal være mer forsiktig med å ikke kaste bort vann."
            },
            {
                topic: "Plastforurensning",
                description: "Plast i havet skader dyr og miljø. Vi kan redusere plastforbruket ved å bruke gjenbrukbare poser, flasker og bestikk.",
                dialogue: "Jeg lærte om plastforurensning. Jeg vil prøve å bruke mindre plast!"
            }
        ] : [
            {
                topic: "Climate change",
                description: "Our Earth is getting warmer due to greenhouse gases. We can help by using less energy, walking more, and choosing eco-friendly options.",
                dialogue: "I learned about climate change today. I want to help take care of our planet!"
            },
            {
                topic: "Recycling",
                description: "Recycling means reusing materials instead of throwing them away. This reduces waste and saves resources.",
                dialogue: "I learned that recycling is important! I can help by sorting waste correctly."
            },
            {
                topic: "Biodiversity",
                description: "Biodiversity means the variety of life on Earth. When species go extinct, it affects the whole ecosystem. We must protect nature!",
                dialogue: "I learned about biodiversity. All animals and plants are important for nature's balance!"
            },
            {
                topic: "Clean energy",
                description: "Solar, wind, and hydro power are renewable energy sources that don't pollute. They're better for the environment than fossil fuels.",
                dialogue: "I learned about clean energy today. It's important to use renewable energy sources!"
            },
            {
                topic: "Water conservation",
                description: "Clean water is a limited resource. We can save water by taking shorter showers, fixing leaks, and not letting water run unnecessarily.",
                dialogue: "I learned that water is precious! I'll be more careful not to waste water."
            },
            {
                topic: "Plastic pollution",
                description: "Plastic in the ocean harms animals and the environment. We can reduce plastic use by using reusable bags, bottles, and utensils.",
                dialogue: "I learned about plastic pollution. I'll try to use less plastic!"
            }
        ];
        
        const topic = envTopics[Math.floor(Math.random() * envTopics.length)];
        this.showDialogue(topic.dialogue);
        setTimeout(() => {
            const factMsg = this.language === 'no'
                ? "🌍 Miljøvern: " + topic.topic + " - " + topic.description
                : "🌍 Environment: " + topic.topic + " - " + topic.description;
            this.showMessage(factMsg);
        }, 1000);
        
        const successMsg = this.language === 'no'
            ? "Miljøvern-læring hjelper " + this.child.name + " å forstå viktigheten av å ta vare på planeten!"
            : "Environmental learning helps " + this.child.name + " understand the importance of caring for the planet!";
        this.showMessage(successMsg);
        this.performAction();
        this.advanceTime();
    }
    
    learnEconomics() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 5) {
            const tooYoungMsg = this.language === 'no'
                ? "Jeg er for liten til å lære om penger ennå..."
                : "I'm too young to learn about money yet...";
            this.showDialogue(tooYoungMsg);
            return;
        }
        
        if (this.child.energy < 10) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å lære akkurat nå..."
                : "I'm too tired to learn right now...";
            this.showDialogue(tiredMsg);
            return;
        }
        
        this.adjustStat('learning', 15);
        this.adjustStat('happiness', 10);
        this.adjustStat('energy', -8);
        this.setEmotion('curious', 18);
        this.child.goodChoices++;
        this.adjustRelationship(2);
        
        const econTopics = this.language === 'no' ? [
            {
                topic: "Spare penger",
                description: "Å spare penger betyr å sette av litt hver måned. Dette gir oss en trygghet og mulighet til å kjøpe større ting senere. 'Spare i tide, er å spare i tide!'",
                dialogue: "Jeg lærte om sparing i dag! Jeg skal prøve å spare litt av pengene mine."
            },
            {
                topic: "Budsjett",
                description: "Et budsjett er en plan for hvordan vi bruker pengene våre. Vi setter av penger til mat, husleie, sparing og gøy. Dette hjelper oss å ikke bruke mer enn vi har.",
                dialogue: "Jeg lærte om budsjett! Nå forstår jeg bedre hvordan jeg skal bruke pengene mine."
            },
            {
                topic: "Behov vs. ønsker",
                description: "Behov er ting vi må ha for å overleve (mat, hus, klær). Ønsker er ting vi vil ha, men ikke trenger. Det er viktig å prioritere behov først.",
                dialogue: "Jeg lærte forskjellen mellom behov og ønsker. Det hjelper meg å ta bedre valg!"
            },
            {
                topic: "Rente",
                description: "Når vi låner penger, må vi betale tilbake mer enn vi lånte - det ekstra beløpet kalles rente. Når vi sparer, kan vi få rente på pengene våre!",
                dialogue: "Jeg lærte om rente i dag. Det er viktig å forstå når man låner eller sparer!"
            },
            {
                topic: "Inntekt og utgifter",
                description: "Inntekt er penger vi tjener (fra jobb). Utgifter er penger vi bruker. For å ha penger igjen, må inntekten være større enn utgiftene!",
                dialogue: "Jeg lærte om inntekt og utgifter. Nå forstår jeg bedre hvordan økonomi fungerer!"
            },
            {
                topic: "Gjeld",
                description: "Gjeld er penger vi skylder andre. Det er viktig å unngå unødvendig gjeld, og hvis vi har gjeld, bør vi betale den tilbake så raskt som mulig.",
                dialogue: "Jeg lærte om gjeld. Det er viktig å være forsiktig med å låne penger!"
            }
        ] : [
            {
                topic: "Saving money",
                description: "Saving money means setting aside a little each month. This gives us security and the ability to buy bigger things later. 'Save for a rainy day!'",
                dialogue: "I learned about saving today! I'll try to save some of my money."
            },
            {
                topic: "Budget",
                description: "A budget is a plan for how we use our money. We set aside money for food, rent, savings, and fun. This helps us not spend more than we have.",
                dialogue: "I learned about budgets! Now I understand better how to use my money."
            },
            {
                topic: "Needs vs. wants",
                description: "Needs are things we must have to survive (food, shelter, clothes). Wants are things we'd like to have but don't need. It's important to prioritize needs first.",
                dialogue: "I learned the difference between needs and wants. It helps me make better choices!"
            },
            {
                topic: "Interest",
                description: "When we borrow money, we must pay back more than we borrowed - the extra amount is called interest. When we save, we can earn interest on our money!",
                dialogue: "I learned about interest today. It's important to understand when borrowing or saving!"
            },
            {
                topic: "Income and expenses",
                description: "Income is money we earn (from work). Expenses are money we spend. To have money left, income must be greater than expenses!",
                dialogue: "I learned about income and expenses. Now I understand better how finances work!"
            },
            {
                topic: "Debt",
                description: "Debt is money we owe others. It's important to avoid unnecessary debt, and if we have debt, we should pay it back as quickly as possible.",
                dialogue: "I learned about debt. It's important to be careful about borrowing money!"
            }
        ];
        
        const topic = econTopics[Math.floor(Math.random() * econTopics.length)];
        this.showDialogue(topic.dialogue);
        setTimeout(() => {
            const factMsg = this.language === 'no'
                ? "💰 Personlig økonomi: " + topic.topic + " - " + topic.description
                : "💰 Personal Finance: " + topic.topic + " - " + topic.description;
            this.showMessage(factMsg);
        }, 1000);
        
        // Apply learning to current money situation
        if (this.child.money > 0 && Math.random() < 0.3) {
            const appliedMsg = this.language === 'no'
                ? "💡 Praktisk: Du har " + this.child.money + " kroner. Husk å spare litt og bruke resten klokt!"
                : "💡 Practical: You have " + this.child.money + " kroner. Remember to save some and spend the rest wisely!";
            setTimeout(() => this.showMessage(appliedMsg), 2000);
        }
        
        const successMsg = this.language === 'no'
            ? "Økonomi-læring hjelper " + this.child.name + " å ta bedre økonomiske valg!"
            : "Economics learning helps " + this.child.name + " make better financial decisions!";
        this.showMessage(successMsg);
        this.performAction();
        this.advanceTime();
    }
    
    learnEthics() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 6) {
            const tooYoungMsg = this.language === 'no'
                ? "Jeg er for liten til å tenke på store spørsmål ennå..."
                : "I'm too young to think about big questions yet...";
            this.showDialogue(tooYoungMsg);
            return;
        }
        
        if (this.child.energy < 10) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å tenke dypt akkurat nå..."
                : "I'm too tired to think deeply right now...";
            this.showDialogue(tiredMsg);
            return;
        }
        
        this.adjustStat('learning', 20);
        this.adjustStat('happiness', 12);
        this.adjustStat('energy', -10);
        this.setEmotion('curious', 25);
        this.setEmotion('happy', 15);
        this.child.goodChoices++;
        this.child.resilience = Math.min(100, this.child.resilience + 3);
        this.adjustRelationship(3);
        
        const ethicsTopics = this.language === 'no' ? [
            {
                topic: "Retten og galt",
                description: "Etikk handler om å tenke på hva som er rett og galt. Noen ganger er det ikke lett å vite, men vi kan spørre: 'Hva ville jeg ønsket at andre gjorde mot meg?'",
                dialogue: "Jeg tenker på hva som er rett og galt i dag. Det er viktig å være snill mot andre."
            },
            {
                topic: "Empati",
                description: "Empati betyr å forstå hvordan andre føler. Når vi setter oss i andres sted, kan vi bedre forstå dem og være snillere.",
                dialogue: "Jeg lærte om empati. Jeg vil prøve å forstå hvordan andre føler seg!"
            },
            {
                topic: "Retten og plikten",
                description: "Vi har rettigheter (ting vi fortjener), men vi har også plikter (ting vi bør gjøre). For eksempel: Vi har rett på respekt, men vi har også plikt til å respektere andre.",
                dialogue: "Jeg lærte om rettigheter og plikter. Alle fortjener respekt, og jeg skal respektere andre også!"
            },
            {
                topic: "Retten og galt i historien",
                description: "Gjennom historien har mennesker tenkt på hva som er rett og galt. Noen tenkere sa: 'Behandle andre som du vil bli behandlet' - dette kalles den gylne regel.",
                dialogue: "Jeg lærte om den gylne regelen: Behandle andre som du vil bli behandlet. Det er en god regel!"
            },
            {
                topic: "Forskjeller og likhet",
                description: "Alle mennesker er forskjellige, men vi er også like på mange måter. Vi fortjener alle respekt og kjærlighet, uansett hvem vi er eller hvor vi kommer fra.",
                dialogue: "Jeg lærte at alle mennesker fortjener respekt, uansett hvem de er. Det er viktig!"
            },
            {
                topic: "Valg og konsekvenser",
                description: "Hvert valg vi tar har konsekvenser - både for oss selv og for andre. Det er viktig å tenke på hvordan våre valg påvirker andre mennesker.",
                dialogue: "Jeg lærte at mine valg påvirker andre. Jeg vil prøve å ta gode valg!"
            },
            {
                topic: "Sannhet og ærlighet",
                description: "Å være ærlig betyr å si sannheten. Noen ganger er det vanskelig, men ærlighet bygger tillit og gjør relasjoner sterkere.",
                dialogue: "Jeg lærte at ærlighet er viktig. Det bygger tillit mellom mennesker!"
            }
        ] : [
            {
                topic: "Right and wrong",
                description: "Ethics is about thinking about what's right and wrong. Sometimes it's not easy to know, but we can ask: 'What would I want others to do to me?'",
                dialogue: "I'm thinking about what's right and wrong today. It's important to be kind to others."
            },
            {
                topic: "Empathy",
                description: "Empathy means understanding how others feel. When we put ourselves in others' shoes, we can better understand them and be kinder.",
                dialogue: "I learned about empathy. I'll try to understand how others feel!"
            },
            {
                topic: "Rights and duties",
                description: "We have rights (things we deserve), but we also have duties (things we should do). For example: We have the right to respect, but we also have a duty to respect others.",
                dialogue: "I learned about rights and duties. Everyone deserves respect, and I should respect others too!"
            },
            {
                topic: "Right and wrong in history",
                description: "Throughout history, people have thought about what's right and wrong. Some thinkers said: 'Treat others as you want to be treated' - this is called the golden rule.",
                dialogue: "I learned about the golden rule: Treat others as you want to be treated. That's a good rule!"
            },
            {
                topic: "Differences and similarities",
                description: "All humans are different, but we're also similar in many ways. We all deserve respect and love, regardless of who we are or where we come from.",
                dialogue: "I learned that all humans deserve respect, regardless of who they are. That's important!"
            },
            {
                topic: "Choices and consequences",
                description: "Every choice we make has consequences - both for ourselves and for others. It's important to think about how our choices affect other people.",
                dialogue: "I learned that my choices affect others. I'll try to make good choices!"
            },
            {
                topic: "Truth and honesty",
                description: "Being honest means telling the truth. Sometimes it's difficult, but honesty builds trust and makes relationships stronger.",
                dialogue: "I learned that honesty is important. It builds trust between people!"
            }
        ];
        
        const topic = ethicsTopics[Math.floor(Math.random() * ethicsTopics.length)];
        this.showDialogue(topic.dialogue);
        setTimeout(() => {
            const factMsg = this.language === 'no'
                ? "🤔 Etikk & Filosofi: " + topic.topic + " - " + topic.description
                : "🤔 Ethics & Philosophy: " + topic.topic + " - " + topic.description;
            this.showMessage(factMsg);
        }, 1000);
        
        const successMsg = this.language === 'no'
            ? "Etikk og filosofi hjelper " + this.child.name + " å tenke dypt om viktige spørsmål!"
            : "Ethics and philosophy help " + this.child.name + " think deeply about important questions!";
        this.showMessage(successMsg);
        this.performAction();
        this.advanceTime();
    }
    
    drawOrCreate() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 8) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å være kreativ akkurat nå..."
                : "I'm too tired to be creative right now...";
            this.showDialogue(tiredMsg);
            return;
        }
        
        // Open interactive drawing/creating universe
        this.openUniverse('drawing');
    }
    
    openDrawingUniverse(content) {
        if (this.child.energy < 8) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å tegne akkurat nå..."
                : "I'm too tired to draw right now...";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        const activities = this.language === 'no' ? [
            { name: "Tegne", emoji: "✏️", happiness: 20, learning: 15 },
            { name: "Male", emoji: "🎨", happiness: 18, learning: 12 },
            { name: "Lage leir", emoji: "🧱", happiness: 15, learning: 18 },
            { name: "Lage origami", emoji: "📄", happiness: 12, learning: 20 },
            { name: "Lage musikk", emoji: "🎵", happiness: 22, learning: 10 }
        ] : [
            { name: "Draw", emoji: "✏️", happiness: 20, learning: 15 },
            { name: "Paint", emoji: "🎨", happiness: 18, learning: 12 },
            { name: "Make clay", emoji: "🧱", happiness: 15, learning: 18 },
            { name: "Make origami", emoji: "📄", happiness: 12, learning: 20 },
            { name: "Make music", emoji: "🎵", happiness: 22, learning: 10 }
        ];
        
        const drawingContent = this.language === 'no' ? `
            <div style="padding: 20px;">
                <h3>🎨 Tegn og lag!</h3>
                <p>Hva vil du lage?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 20px;">
                    ${activities.map(act => `
                        <button class="universe-btn" onclick="game.completeDrawingActivity('${act.name}', ${act.happiness}, ${act.learning}, '${act.emoji}')" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                            ${act.emoji} ${act.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        ` : `
            <div style="padding: 20px;">
                <h3>🎨 Draw & Create!</h3>
                <p>What would you like to create?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 20px;">
                    ${activities.map(act => `
                        <button class="universe-btn" onclick="game.completeDrawingActivity('${act.name}', ${act.happiness}, ${act.learning}, '${act.emoji}')" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                            ${act.emoji} ${act.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        content.innerHTML = drawingContent;
    }
    
    completeDrawingActivity(activityName, happinessGain, learningGain, emoji) {
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        this.adjustStat('happiness', happinessGain);
        this.adjustStat('learning', learningGain);
        this.adjustStat('energy', -6);
        this.setEmotion('happy', 20);
        this.setEmotion('curious', 15);
        this.setEmotion('anxious', -12);
        this.setEmotion('sad', -10);
        this.child.resilience = Math.min(100, this.child.resilience + 3);
        this.adjustRelationship(2);
        
        if (!this.child.artCreated) this.child.artCreated = 0;
        this.child.artCreated++;
        this.checkAchievements();
        
        let messages = [];
        if (this.child.age < 3) {
            messages = this.language === 'no' ? [
                "Jeg tegner!",
                "Fine farger!",
                "Jeg liker å lage kunst!"
            ] : [
                "I'm drawing!",
                "Pretty colors!",
                "I like making art!"
            ];
        } else if (this.child.age < 7) {
            messages = this.language === 'no' ? [
                "Jeg lager noe nytt! Dette er gøy!",
                "Jeg elsker å tegne og lage ting!",
                "Å være kreativ gjør meg glad!",
                "Jeg lagde noe kult! Se!"
            ] : [
                "I'm creating something new! This is fun!",
                "I love drawing and making things!",
                "Being creative makes me feel happy!",
                "I made something cool! Look!"
            ];
        } else {
            messages = this.language === 'no' ? [
                "Å lage noe med hendene mine... Det hjelper meg å uttrykke hvordan jeg føler.",
                "Når jeg tegner eller lager noe, kan jeg vise følelser jeg ikke alltid kan sette ord på.",
                "Kunst er som et trygt sted hvor jeg kan være meg selv, uten dømming.",
                "Jeg elsker å lage ting! Det gjør meg stolt og glad.",
                "Å lage noe nytt får meg til å føle at jeg kan gjøre hva som helst!"
            ] : [
                "Creating something with my hands... It helps me express how I feel.",
                "When I draw or create, I can show emotions I can't always put into words.",
                "Art is like a safe space where I can be me, without judgment.",
                "I love making things! It makes me feel proud and happy.",
                "Creating something new makes me feel like I can do anything!"
            ];
        }
        
        const dialogue = messages[Math.floor(Math.random() * messages.length)];
        
        // Occasionally add learning fact
        if (Math.random() < 0.3) {
            const creativityFacts = this.language === 'no' ? [
                "💡 Læringsfakta: Når vi er kreative, aktiveres hjernens høyre side. Dette hjelper oss å tenke på nye måter!",
                "💡 Læringsfakta: Kunst og kreativitet kan være en måte å uttrykke følelser på når ord ikke er nok.",
                "💡 Læringsfakta: Å være kreativ bygger selvtillit! Når vi lager noe, føler vi stolthet og glede."
            ] : [
                "💡 Learning fact: When we're creative, the right side of our brain is activated. This helps us think in new ways!",
                "💡 Learning fact: Art and creativity can be a way to express emotions when words aren't enough.",
                "💡 Learning fact: Being creative builds self-confidence! When we create something, we feel pride and joy."
            ];
            setTimeout(() => this.showMessage(creativityFacts[Math.floor(Math.random() * creativityFacts.length)]), 1000);
        }
        
        content.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>${emoji} ${activityName}</h3>
                <p style="font-size: 1.1em; margin: 15px 0; font-style: italic;">"${dialogue}"</p>
                <p style="font-size: 1.2em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +' + happinessGain + ' glede og +' + learningGain + ' læring!' : 'You gained +' + happinessGain + ' happiness and +' + learningGain + ' learning!'}</p>
                <button onclick="game.closeUniverse(); game.performAction(); game.advanceTime();" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ${this.language === 'no' ? 'Lukk' : 'Close'}
                </button>
            </div>
        `;
    }
    
    quizAboutEmotions() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue("I'm too tired for a quiz right now...");
            return;
        }
        
        this.adjustStat('learning', 20);
        this.adjustStat('happiness', 10);
        this.adjustStat('energy', -8);
        this.setEmotion('curious', 25);
        this.setEmotion('happy', 15);
        this.child.resilience = Math.min(100, this.child.resilience + 2);
        
        const quizzes = [
            {
                question: "Hvilket kjemikal lager hjernen vår når vi er glade?",
                options: ["Dopamin", "Adrenalin", "Kortisol"],
                correct: 0,
                explanation: "Dopamin er 'glede-kjemikaliet'! Hjernen vår lager dopamin når vi gjør noe vi liker."
            },
            {
                question: "Hva betyr empati?",
                options: ["Å være sint", "Å forstå hvordan andre føler seg", "Å være redd"],
                correct: 1,
                explanation: "Empati er når vi forstår og deler følelsene til andre. Det gjør oss til gode venner!"
            },
            {
                question: "Hva heter hjernens 'alarmklokke' som varsler når vi er redde?",
                options: ["Prefrontal cortex", "Amygdala", "Hippocampus"],
                correct: 1,
                explanation: "Amygdala er hjernens 'alarmklokke'! Den hjelper oss å kjenne igjen fare og beskytter oss."
            },
            {
                question: "Hva er nevroplastisitet?",
                options: ["Hjernen vokser når vi lærer", "Vi blir dummere", "Hjernen slutter å fungere"],
                correct: 0,
                explanation: "Nevroplastisitet betyr at hjernen vår vokser og endrer seg når vi lærer nye ting!"
            },
            {
                question: "Hva hjelper oss å roe seg ned når vi er stresset?",
                options: ["Mer stress", "Dype pust og telling", "Ikke gjøre noe"],
                correct: 1,
                explanation: "Dype pust og telling hjelper hjernen vår å roe seg ned. Det kalles selvregulering!"
            }
        ];
        
        const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        const userAnswer = Math.floor(Math.random() * 3); // Simulate user answering (in real game, this would be interactive)
        
        if (userAnswer === quiz.correct) {
            this.showDialogue("Jeg fikk det riktig! " + quiz.explanation);
            this.adjustStat('happiness', 5);
            this.setEmotion('happy', 10);
            this.setEmotion('surprised', 5);
        } else {
            this.showDialogue("Hmm, det var ikke riktig. Men jeg lærte noe nytt: " + quiz.explanation);
            this.adjustStat('learning', 5); // Still learning even if wrong
        }
        
        setTimeout(() => {
            this.showMessage("💡 Quiz: " + quiz.question + " - Riktig svar: " + quiz.options[quiz.correct] + ". " + quiz.explanation);
        }, 1000);
        
        this.showMessage("Quizzes help " + this.child.name + " learn about emotions and the brain in a fun way!");
        if (!this.child.quizzesCompleted) this.child.quizzesCompleted = 0;
        this.child.quizzesCompleted++;
        this.checkAchievements();
        this.performAction();
        this.advanceTime();
    }
    
    listenToMusic() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue("I'm too tired to listen to music right now...");
            return;
        }
        
        this.adjustStat('happiness', 15);
        this.adjustStat('learning', 5);
        this.adjustStat('energy', -3);
        this.setEmotion('happy', 20);
        this.setEmotion('anxious', -15);
        this.setEmotion('sad', -10);
        this.adjustRelationship(2);
        
        let messages = [];
        if (this.child.age < 5) {
            messages = [
                "I like the music! It makes me happy!",
                "Music is fun! I want to dance!",
                "This song is nice!"
            ];
        } else {
            messages = [
                "I love listening to music! It helps me feel better.",
                "Music is so cool! It makes me forget about everything else.",
                "This is my favorite song! Can we listen to more?",
                "Music helps me relax and feel happy.",
                "I love 2000s music! It's the best!"
            ];
        }
        
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Show CD image briefly
        const sceneImage = document.getElementById('sceneImage');
        if (sceneImage) {
            const cdImg = document.createElement('img');
            cdImg.src = 'images/cd.png';
            cdImg.alt = 'CD Player';
            cdImg.style.width = '100%';
            cdImg.style.height = '100%';
            cdImg.style.objectFit = 'contain';
            cdImg.style.padding = '20px';
            const currentContent = sceneImage.innerHTML;
            sceneImage.innerHTML = '';
            sceneImage.appendChild(cdImg);
            
            setTimeout(() => {
                if (sceneImage.querySelector('img[alt="CD Player"]')) {
                    sceneImage.innerHTML = currentContent;
                    this.updateScene();
                }
            }, 2000);
        }
        
        // Occasionally add learning fact about music
        if (Math.random() < 0.25) {
            const musicFacts = [
                "💡 Læringsfakta: Musikk aktiverer mange deler av hjernen vår samtidig! Det kan hjelpe med humør, minne og konsentrasjon.",
                "💡 Læringsfakta: Å lytte til musikk kan redusere stress og engstelse. Det er derfor musikkterapi er så effektivt!",
                "💡 Læringsfakta: Musikk kan hjelpe oss å uttrykke følelser vi ikke alltid finner ord for."
            ];
            setTimeout(() => this.showMessage(musicFacts[Math.floor(Math.random() * musicFacts.length)]), 1000);
        }
        
        this.showMessage("Listening to music helps " + this.child.name + " relax and feel happy!");
        this.performAction();
        this.advanceTime();
    }
    
    callFriend() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 5) {
            this.showDialogue("I'm too young to use a phone...");
            return;
        }
        
        if (this.child.energy < 10) {
            this.showDialogue("I'm too tired to call someone right now...");
            return;
        }
        
        this.adjustStat('happiness', 12);
        this.adjustStat('social', 15);
        this.adjustStat('energy', -5);
        this.setEmotion('happy', 15);
        this.setEmotion('anxious', -10);
        this.adjustRelationship(2);
        
        let messages = [];
        if (this.child.age < 10) {
            messages = [
                "I talked to my friend on the phone! It was fun!",
                "My friend told me about their day! I'm happy!",
                "I love talking to my friends!"
            ];
        } else {
            messages = [
                "I called my friend! We talked for a while. It's nice to have someone to talk to.",
                "Talking to my friend makes me feel better. They understand me.",
                "I love having friends I can call. It helps me not feel alone.",
                "My friend always makes me laugh. Phone calls are the best!",
                "It's so nice to hear a friendly voice. I feel less alone now."
            ];
        }
        
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Show Nokia phone image briefly
        const sceneImage = document.getElementById('sceneImage');
        if (sceneImage) {
            const phoneImg = document.createElement('img');
            phoneImg.src = 'images/nokiaphone.png';
            phoneImg.alt = 'Nokia Phone';
            phoneImg.style.width = '100%';
            phoneImg.style.height = '100%';
            phoneImg.style.objectFit = 'contain';
            phoneImg.style.padding = '20px';
            const currentContent = sceneImage.innerHTML;
            sceneImage.innerHTML = '';
            sceneImage.appendChild(phoneImg);
            
            setTimeout(() => {
                if (sceneImage.querySelector('img[alt="Nokia Phone"]')) {
                    sceneImage.innerHTML = currentContent;
                    this.updateScene();
                }
            }, 2000);
        }
        
        // Occasionally add learning fact about communication
        if (Math.random() < 0.2) {
            const communicationFacts = [
                "💡 Læringsfakta: Å snakke med venner er viktig for vår mentale helse. Sosiale forbindelser er like viktige som mat og søvn!",
                "💡 Læringsfakta: Når vi snakker med noen vi stoler på, lager hjernen vår oksytocin - 'bonding-hormonet' som gjør oss glade!",
                "💡 Læringsfakta: Å ha noen å snakke med kan redusere følelser av ensomhet og stress. Vennskap er medisin!"
            ];
            setTimeout(() => this.showMessage(communicationFacts[Math.floor(Math.random() * communicationFacts.length)]), 1000);
        }
        
        this.showMessage("Calling friends helps " + this.child.name + " feel connected and happy!");
        this.performAction();
        this.advanceTime();
    }
    
    cookTogether() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 3) {
            const youngMsg = this.language === 'no' 
                ? "Jeg er for ung til å lage mat... Men jeg kan se på!"
                : "I'm too young to cook... But I can watch!";
            this.showDialogue(youngMsg);
            return;
        }
        
        if (this.child.energy < 15) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å lage mat akkurat nå..."
                : "I'm too tired to cook right now...";
            this.showDialogue(tiredMsg);
            return;
        }
        
        // Start cooking minigame (with ingredient costs)
        this.startCookingGame();
    }
    
    startCookingGame() {
        // Ingredient prices (like original game - must buy ingredients)
        const ingredientPrices = {
            "Mel": 5,      // per dl
            "Melk": 3,     // per dl
            "Egg": 8,      // per stk
            "Smør": 12,    // per 100g
            "Sukker": 4,   // per dl
            "Salt": 2      // per ts
        };
        
        const recipes = [
            {
                name: this.language === 'no' ? "Pannekaker" : "Pancakes",
                ingredients: [
                    { name: "Mel", amount: 2, unit: "dl", price: ingredientPrices["Mel"] * 2 },
                    { name: "Melk", amount: 4, unit: "dl", price: ingredientPrices["Melk"] * 4 },
                    { name: "Egg", amount: 2, unit: "stk", price: ingredientPrices["Egg"] * 2 },
                    { name: "Salt", amount: 0.5, unit: "ts", price: ingredientPrices["Salt"] * 0.5 }
                ],
                conversion: {
                    question: this.language === 'no' ? "Hvor mange ml er 2 dl melk?" : "How many ml is 2 dl milk?",
                    answer: "200",
                    explanation: this.language === 'no' ? "1 dl = 100 ml, så 2 dl = 200 ml" : "1 dl = 100 ml, so 2 dl = 200 ml"
                }
            },
            {
                name: this.language === 'no' ? "Kaker" : "Cakes",
                ingredients: [
                    { name: "Smør", amount: 100, unit: "g", price: ingredientPrices["Smør"] },
                    { name: "Sukker", amount: 1.5, unit: "dl", price: ingredientPrices["Sukker"] * 1.5 },
                    { name: "Mel", amount: 3, unit: "dl", price: ingredientPrices["Mel"] * 3 },
                    { name: "Egg", amount: 2, unit: "stk", price: ingredientPrices["Egg"] * 2 }
                ],
                conversion: {
                    question: this.language === 'no' ? "Hvor mange dl er 500 ml?" : "How many dl is 500 ml?",
                    answer: "5",
                    explanation: this.language === 'no' ? "1 dl = 100 ml, så 500 ml = 5 dl" : "1 dl = 100 ml, so 500 ml = 5 dl"
                }
            },
            {
                name: this.language === 'no' ? "Vafler" : "Waffles",
                ingredients: [
                    { name: "Mel", amount: 3, unit: "dl", price: ingredientPrices["Mel"] * 3 },
                    { name: "Melk", amount: 5, unit: "dl", price: ingredientPrices["Melk"] * 5 },
                    { name: "Egg", amount: 3, unit: "stk", price: ingredientPrices["Egg"] * 3 },
                    { name: "Smør", amount: 50, unit: "g", price: ingredientPrices["Smør"] * 0.5 }
                ],
                conversion: {
                    question: this.language === 'no' ? "Hvor mange ml er 3 dl?" : "How many ml is 3 dl?",
                    answer: "300",
                    explanation: this.language === 'no' ? "1 dl = 100 ml, så 3 dl = 300 ml" : "1 dl = 100 ml, so 3 dl = 300 ml"
                }
            }
        ];
        
        const recipe = recipes[Math.floor(Math.random() * recipes.length)];
        
        // Calculate total cost
        const totalCost = recipe.ingredients.reduce((sum, ing) => sum + ing.price, 0);
        
        // Check if player has enough money (like original game)
        if (this.child.money < totalCost) {
            const noMoneyMsg = this.language === 'no'
                ? "Vi har ikke nok penger for ingrediensene... Vi trenger " + totalCost + " kroner, men har bare " + this.child.money + " kroner. Kanskje vi kan jobbe litt først?"
                : "We don't have enough money for the ingredients... We need " + totalCost + " kroner, but only have " + this.child.money + " kroner. Maybe we can work a bit first?";
            this.showDialogue(noMoneyMsg);
            this.showMessage(this.language === 'no' 
                ? "💡 Tips: Jobb for å tjene penger så du kan kjøpe ingredienser!"
                : "💡 Tip: Work to earn money so you can buy ingredients!");
            return;
        }
        
        // Show ingredient list with prices
        const ingredientLabel = this.language === 'no' ? "Ingredienser for " : "Ingredients for ";
        let ingredientList = ingredientLabel + recipe.name + " (Totalt: " + totalCost + " kr):\n";
        recipe.ingredients.forEach((ing, idx) => {
            ingredientList += `${idx + 1}. ${ing.amount} ${ing.unit} ${ing.name} - ${ing.price} kr\n`;
        });
        
        const cookDialogue = this.language === 'no'
            ? "La oss lage " + recipe.name + " sammen! " + ingredientList + "\nSkal vi kjøpe ingrediensene? (Vi har " + this.child.money + " kr)"
            : "Let's make " + recipe.name + " together! " + ingredientList + "\nShould we buy the ingredients? (We have " + this.child.money + " kr)";
        this.showDialogue(cookDialogue);
        
        // Deduct money for ingredients (like original game)
        this.child.money -= totalCost;
        this.updateDisplay();
        
        // Show conversion question
        const promptText = this.language === 'no'
            ? recipe.conversion.question + "\n(Svar med tall)"
            : recipe.conversion.question + "\n(Answer with number)";
        
        setTimeout(() => {
            const userAnswer = prompt(promptText);
            if (userAnswer && userAnswer.trim() === recipe.conversion.answer) {
                const correctMsg = this.language === 'no'
                    ? "Riktig! " + recipe.conversion.explanation + " Vi kan lage " + recipe.name + " nå!"
                    : "Correct! " + recipe.conversion.explanation + " We can make " + recipe.name + " now!";
                this.showDialogue(correctMsg);
                this.adjustStat('happiness', 20);
                this.adjustStat('learning', 15);
                this.adjustStat('energy', -10);
                this.setEmotion('happy', 25);
                this.setEmotion('curious', 15);
                this.adjustRelationship(3);
                
                // Learning fact about measurements
                const measurementFacts = this.language === 'no' ? [
                    "💡 Læringsfakta: 1 dl = 100 ml. Det er viktig å kunne konvertere mellom ml, dl og liter når man lager mat!",
                    "💡 Læringsfakta: 1 liter = 10 dl = 1000 ml. Å forstå måleenheter hjelper oss i hverdagen!",
                    "💡 Læringsfakta: Når vi lager mat sammen, lærer vi ikke bare måling, men også samarbeid og tålmodighet!"
                ] : [
                    "💡 Learning Fact: 1 dl = 100 ml. It's important to be able to convert between ml, dl and liters when cooking!",
                    "💡 Learning Fact: 1 liter = 10 dl = 1000 ml. Understanding measurements helps us in daily life!",
                    "💡 Learning Fact: When we cook together, we learn not only measurement, but also cooperation and patience!"
                ];
                setTimeout(() => this.showMessage(measurementFacts[Math.floor(Math.random() * measurementFacts.length)]), 1000);
                
                const successMsg = this.language === 'no'
                    ? "Matlaging lærer " + this.child.name + " om måling og samarbeid!"
                    : "Cooking together teaches " + this.child.name + " about measurements and teamwork!";
                this.showMessage(successMsg);
            } else {
                const wrongMsg = this.language === 'no'
                    ? "Hmm, det var ikke riktig. Men det er greit! " + recipe.conversion.explanation + " Vi prøver igjen!"
                    : "Hmm, that wasn't right. But that's okay! " + recipe.conversion.explanation + " Let's try again!";
                this.showDialogue(wrongMsg);
                this.adjustStat('happiness', 10);
                this.adjustStat('learning', 5);
                this.adjustStat('energy', -8);
                this.setEmotion('curious', 10);
                this.adjustRelationship(2);
                const learnMsg = this.language === 'no'
                    ? "Å lære fra feil er en del av matlaging! " + this.child.name + " lærer fortsatt!"
                    : "Learning from mistakes is part of cooking! " + this.child.name + " is still learning!";
                this.showMessage(learnMsg);
            }
            
            // Track cooking
            if (!this.child.cookedMeals) this.child.cookedMeals = 0;
            this.child.cookedMeals++;
            this.checkAchievements();
            
            this.performAction();
            this.advanceTime();
        }, 2000);
    }
    
    work() {
        if (!this.canPerformAction()) return;
        
        // Work requires minimum age (like original game)
        if (this.child.age < 14) {
            const tooYoungMsg = this.language === 'no'
                ? "Jeg er for ung til å jobbe... Jeg må være minst 14 år."
                : "I'm too young to work... I need to be at least 14 years old.";
            this.showDialogue(tooYoungMsg);
            return;
        }
        
        if (this.child.energy < 20) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å jobbe akkurat nå... Jeg trenger mer energi."
                : "I'm too tired to work right now... I need more energy.";
            this.showDialogue(tiredMsg);
            return;
        }
        
        // Different jobs based on age and study level (like original game)
        let jobType, earnings, energyCost;
        
        if (this.child.age >= 14 && this.child.age < 16) {
            // Part-time jobs for younger teens
            jobType = this.language === 'no' ? "Deltidsjobb (avisbud)" : "Part-time job (paper delivery)";
            earnings = 15 + Math.floor(this.child.studyLevel / 10);
            energyCost = 25;
        } else if (this.child.age >= 16 && this.child.studyLevel < 50) {
            // Basic jobs
            jobType = this.language === 'no' ? "Deltidsjobb (butikk)" : "Part-time job (store)";
            earnings = 25 + Math.floor(this.child.studyLevel / 5);
            energyCost = 30;
        } else if (this.child.age >= 16 && this.child.studyLevel >= 50) {
            // Better jobs for those who studied
            jobType = this.language === 'no' ? "Deltidsjobb (kontor)" : "Part-time job (office)";
            earnings = 40 + Math.floor(this.child.studyLevel / 3);
            energyCost = 25;
        } else {
            // Adult jobs
            jobType = this.language === 'no' ? "Fulltidsjobb" : "Full-time job";
            earnings = 60 + Math.floor(this.child.careerProgress / 2);
            energyCost = 35;
        }
        
        // Earn money (like original game)
        this.child.money += earnings;
        this.adjustStat('energy', -energyCost);
        this.adjustStat('happiness', -5); // Work is tiring
        this.child.careerProgress = Math.min(100, this.child.careerProgress + 2);
        
        const workMsg = this.language === 'no'
            ? "Jeg jobbet som " + jobType + " og tjente " + earnings + " kroner! Jeg er litt trøtt, men det var verdt det."
            : "I worked as " + jobType + " and earned " + earnings + " kroner! I'm a bit tired, but it was worth it.";
        this.showDialogue(workMsg);
        
        const moneyMsg = this.language === 'no'
            ? "💰 Du har nå " + this.child.money + " kroner. Bruk dem klokt!"
            : "💰 You now have " + this.child.money + " kroner. Use them wisely!";
        this.showMessage(moneyMsg);
        
        this.updateDisplay();
        this.performAction();
        this.advanceTime();
    }
    
    exercise() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 6) {
            this.showDialogue("I'm too young to exercise properly, but I can play and run!");
            this.playOutside();
            return;
        }
        
        if (this.child.energy < 25) {
            this.showDialogue("I'm too tired to exercise right now...");
            return;
        }
        
        // Start exercise minigame with distance conversion
        this.startExerciseGame();
    }
    
    startExerciseGame() {
        const exercises = [
            {
                name: "Løpetur",
                distance: { amount: 2, unit: "km" },
                conversion: {
                    question: "Hvor mange meter er 2 km?",
                    answer: "2000",
                    explanation: "1 km = 1000 m, så 2 km = 2000 m"
                }
            },
            {
                name: "Sykling",
                distance: { amount: 5, unit: "km" },
                conversion: {
                    question: "Hvor mange meter er 5 km?",
                    answer: "5000",
                    explanation: "1 km = 1000 m, så 5 km = 5000 m"
                }
            },
            {
                name: "Lange tur",
                distance: { amount: 1, unit: "mil" },
                conversion: {
                    question: "Hvor mange km er 1 mil?",
                    answer: "10",
                    explanation: "1 mil = 10 km. Det er en lang tur!"
                }
            }
        ];
        
        const exercise = exercises[Math.floor(Math.random() * exercises.length)];
        
        const exerciseDialogue = this.language === 'no'
            ? "La oss gå på " + exercise.name + "! Vi skal gå " + exercise.distance.amount + " " + exercise.distance.unit + "!"
            : "Let's go on a " + exercise.name + "! We're going " + exercise.distance.amount + " " + exercise.distance.unit + "!";
        this.showDialogue(exerciseDialogue);
        
        const promptText = this.language === 'no'
            ? exercise.conversion.question + "\n(Svar med tall)"
            : exercise.conversion.question + "\n(Answer with number)";
        
        setTimeout(() => {
            const userAnswer = prompt(promptText);
            if (userAnswer && userAnswer.trim() === exercise.conversion.answer) {
                const correctMsg = this.language === 'no'
                    ? "Riktig! " + exercise.conversion.explanation + " La oss begynne!"
                    : "Correct! " + exercise.conversion.explanation + " Let's begin!";
                this.showDialogue(correctMsg);
                this.adjustStat('happiness', 18);
                this.adjustStat('energy', 15);
                this.adjustStat('learning', 12);
                this.setEmotion('happy', 20);
                this.setEmotion('curious', 10);
                this.adjustRelationship(2);
                
                // Learning fact about distance
                const distanceFacts = this.language === 'no' ? [
                    "💡 Læringsfakta: 1 km = 1000 m. Å forstå avstander hjelper oss å planlegge turer og aktiviteter!",
                    "💡 Læringsfakta: 1 mil = 10 km. Det er en standard måleenhet i Norge!",
                    "💡 Læringsfakta: Trening er bra for både kropp og sinn! Det hjelper oss å føle oss sterkere og mer energiske!"
                ] : [
                    "💡 Learning Fact: 1 km = 1000 m. Understanding distances helps us plan trips and activities!",
                    "💡 Learning Fact: 1 mil = 10 km. That's a standard unit of measurement in Norway!",
                    "💡 Learning Fact: Exercise is good for both body and mind! It helps us feel stronger and more energetic!"
                ];
                setTimeout(() => this.showMessage(distanceFacts[Math.floor(Math.random() * distanceFacts.length)]), 1000);
                
                const successMsg = this.language === 'no'
                    ? "Trening hjelper " + this.child.name + " å holde seg sunn og lære om avstander!"
                    : "Exercise helps " + this.child.name + " stay healthy and learn about distances!";
                this.showMessage(successMsg);
            } else {
                const wrongMsg = this.language === 'no'
                    ? "Hmm, det var ikke riktig. Men det er greit! " + exercise.conversion.explanation + " Vi prøver igjen!"
                    : "Hmm, that wasn't right. But that's okay! " + exercise.conversion.explanation + " Let's try again!";
                this.showDialogue(wrongMsg);
                this.adjustStat('happiness', 10);
                this.adjustStat('energy', 10);
                this.adjustStat('learning', 5);
                this.setEmotion('curious', 10);
                this.adjustRelationship(1);
                const learnMsg = this.language === 'no'
                    ? "Å lære fra feil er en del av trening! " + this.child.name + " lærer fortsatt!"
                    : "Learning from mistakes is part of exercise! " + this.child.name + " is still learning!";
                this.showMessage(learnMsg);
            }
            
            // Track exercise
            if (!this.child.exercisesCompleted) this.child.exercisesCompleted = 0;
            this.child.exercisesCompleted++;
            this.checkAchievements();
            
            this.performAction();
            this.advanceTime();
        }, 2000);
    }
    
    goToNature() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 15) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å utforske naturen akkurat nå..."
                : "I'm too tired to explore nature right now...";
            this.showDialogue(tiredMsg);
            return;
        }
        
        this.adjustStat('happiness', 15);
        this.adjustStat('learning', 10);
        this.adjustStat('energy', -10);
        this.setEmotion('curious', 20);
        this.setEmotion('happy', 15);
        this.adjustRelationship(2);
        
        let messages = [];
        if (this.child.age < 5) {
            messages = this.language === 'no' ? [
                "Jeg liker å utforske! Så mange interessante ting!",
                "Natur er gøy! Jeg fant en bug!",
                "Jeg elsker å være ute i naturen!"
            ] : [
                "I like exploring! So many interesting things!",
                "Nature is fun! I found a bug!",
                "I love being outside in nature!"
            ];
        } else {
            messages = this.language === 'no' ? [
                "Å utforske naturen er så interessant! Jeg lærer om planter og dyr.",
                "Jeg elsker å være i naturen! Det er rolig og fullt av liv.",
                "Natur er fantastisk! Det er så mye å oppdage!",
                "Jeg fant noen interessante insekter! De er så små, men viktige!"
            ] : [
                "Exploring nature is so interesting! I'm learning about plants and animals.",
                "I love being in nature! It's peaceful and full of life.",
                "Nature is amazing! There's so much to discover!",
                "I found some interesting insects! They're so small but important!"
            ];
        }
        
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Insect facts
        const insectFacts = this.language === 'no' ? [
            {
                fact: "💡 Læringsfakta: Insekter er super viktige! De pollinerer planter, bryter ned døde ting, og er mat for andre dyr. Uten insekter ville verden være helt annerledes!",
                tip: "Hvordan bevare insekter: La noen deler av hagen være vill og ubeskjært. Plant blomster som insekter liker, og bruk ikke for mye kjemikalier."
            },
            {
                fact: "💡 Læringsfakta: Humler er faktisk bedre pollinatorer enn bier! De kan fly i kaldere vær og besøke flere blomster.",
                tip: "Hvordan hjelpe humler: La noen områder i hagen være gress med blomster. Humler trenger steder å bo og mat året rundt."
            },
            {
                fact: "💡 Læringsfakta: Mange insekter er faktisk nyttige i hagen! Larver av marihøner spiser bladlus, som beskytter plantene våre.",
                tip: "Hvordan tiltrekke nyttige insekter: Plant blomster som marihøner og andre nyttige insekter liker. La noen døde greiner ligge - de gir hjem til mange små dyr."
            },
            {
                fact: "💡 Læringsfakta: Insekter utgjør over 80% av alle dyr på jorden! De er ekstremt viktige for økosystemet.",
                tip: "Hvordan bevare insekter: Unngå å bruke mye kjemikalier. La noen områder være naturlige, med blomster og plass for insekter å bo."
            },
            {
                fact: "💡 Læringsfakta: Sommerfugler og møll er viktige pollinatorer! De overfører pollen fra blomst til blomst.",
                tip: "Hvordan tiltrekke sommerfugler: Plant blomster med nektar, spesielt liljer, lavendel og malurt. La noen larver være - de blir til sommerfugler!"
            }
        ] : [
            {
                fact: "💡 Learning Fact: Insects are super important! They pollinate plants, break down dead things, and are food for other animals. Without insects, the world would be completely different!",
                tip: "How to preserve insects: Let some parts of the garden be wild and uncut. Plant flowers that insects like, and don't use too many chemicals."
            },
            {
                fact: "💡 Learning Fact: Bumblebees are actually better pollinators than bees! They can fly in colder weather and visit more flowers.",
                tip: "How to help bumblebees: Let some areas in the garden be grass with flowers. Bumblebees need places to live and food year-round."
            },
            {
                fact: "💡 Learning Fact: Many insects are actually useful in the garden! Ladybug larvae eat aphids, which protects our plants.",
                tip: "How to attract useful insects: Plant flowers that ladybugs and other useful insects like. Let some dead branches lie - they provide homes for many small animals."
            },
            {
                fact: "💡 Learning Fact: Insects make up over 80% of all animals on earth! They are extremely important for the ecosystem.",
                tip: "How to preserve insects: Avoid using too many chemicals. Let some areas be natural, with flowers and space for insects to live."
            },
            {
                fact: "💡 Learning Fact: Butterflies and moths are important pollinators! They transfer pollen from flower to flower.",
                tip: "How to attract butterflies: Plant flowers with nectar, especially lilies, lavender and wormwood. Let some caterpillars be - they become butterflies!"
            }
        ];
        
        const selectedFact = insectFacts[Math.floor(Math.random() * insectFacts.length)];
        setTimeout(() => {
            this.showMessage(selectedFact.fact);
            setTimeout(() => {
                const tipLabel = this.language === 'no' ? "💚 Tips: " : "💚 Tip: ";
                this.showMessage(tipLabel + selectedFact.tip);
            }, 2000);
        }, 1000);
        
        const natureMsg = this.language === 'no'
            ? "Å utforske naturen hjelper " + this.child.name + " å lære om miljø og insekter!"
            : "Exploring nature helps " + this.child.name + " learn about the environment and insects!";
        this.showMessage(natureMsg);
        
        // Track nature exploration
        if (!this.child.natureExplorations) this.child.natureExplorations = 0;
        this.child.natureExplorations++;
        this.checkAchievements();
        
        this.performAction();
        this.advanceTime();
    }
    
    chooseSchoolSubject() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 6) {
            const youngMsg = this.language === 'no'
                ? "Jeg er for ung for skolefag ennå!"
                : "I'm too young for school subjects yet!";
            this.showDialogue(youngMsg);
            return;
        }
        
        const subjects = this.language === 'no' ? [
            {
                name: "Matematikk",
                emoji: "🔢",
                facts: [
                    "💡 Læringsfakta: Matematikk er overalt! Når vi teller, måler, eller ser på klokken, bruker vi matte.",
                    "💡 Læringsfakta: Å forstå tall hjelper oss i hverdagen - fra å kjøpe mat til å planlegge turer!",
                    "💡 Læringsfakta: Matematikk trener hjernen vår til å tenke logisk og løse problemer!"
                ],
                game: "Hvor mange er 7 + 5?",
                answer: "12"
            },
            {
                name: "Naturfag",
                emoji: "🔬",
                facts: [
                    "💡 Læringsfakta: Alt i naturen er koblet sammen! Planter trenger sollys, vann og næring for å vokse.",
                    "💡 Læringsfakta: Vann går i en syklus - det fordamper fra havet, blir til skyer, og faller som regn!",
                    "💡 Læringsfakta: Planter produserer oksygen gjennom fotosyntese - det er derfor vi trenger trær!"
                ],
                game: "Hva trenger planter for å vokse? (Sol, vann, eller begge?)",
                answer: "begge"
            },
            {
                name: "Norsk",
                emoji: "📚",
                facts: [
                    "💡 Læringsfakta: Språk hjelper oss å uttrykke følelser og tanker. Når vi lærer nye ord, kan vi bedre forklare hvordan vi har det!",
                    "💡 Læringsfakta: Å lese bøker utvider vokabularet vårt og hjelper oss å forstå verden bedre.",
                    "💡 Læringsfakta: Å skrive historier er en kreativ måte å uttrykke seg på - det er som å male med ord!"
                ],
                game: "Hvilket ord betyr 'glad'? (Trist, Lykkelig, eller Redd?)",
                answer: "lykkelig"
            },
            {
                name: "Engelsk",
                emoji: "🌍",
                facts: [
                    "💡 Læringsfakta: Å lære nye språk åpner nye dører! Det hjelper oss å kommunisere med folk fra hele verden.",
                    "💡 Læringsfakta: Når vi lærer engelsk, kan vi forstå musikk, filmer og bøker fra mange land!",
                    "💡 Læringsfakta: Å være flerspråklig trener hjernen vår og gjør den mer fleksibel!"
                ],
                game: "Hva betyr 'Hello' på norsk? (Hei, Hade, eller Takk?)",
                answer: "hei"
            },
            {
                name: "Kunst",
                emoji: "🎨",
                facts: [
                    "💡 Læringsfakta: Kunst er en måte å uttrykke følelser på når ord ikke er nok. Det kan være terapeutisk!",
                    "💡 Læringsfakta: Når vi lager kunst, aktiveres hjernens høyre side - det hjelper med kreativitet og problemløsning!",
                    "💡 Læringsfakta: Å se på kunst fra andre kan hjelpe oss å forstå deres perspektiv og følelser!"
                ],
                game: "Hvilken farge får du når du blander rødt og blått?",
                answer: "lilla"
            }
        ] : [
            {
                name: "Mathematics",
                emoji: "🔢",
                facts: [
                    "💡 Learning Fact: Mathematics is everywhere! When we count, measure, or look at the clock, we use math.",
                    "💡 Learning Fact: Understanding numbers helps us in daily life - from buying food to planning trips!",
                    "💡 Learning Fact: Mathematics trains our brain to think logically and solve problems!"
                ],
                game: "What is 7 + 5?",
                answer: "12"
            },
            {
                name: "Science",
                emoji: "🔬",
                facts: [
                    "💡 Learning Fact: Everything in nature is connected! Plants need sunlight, water and nutrients to grow.",
                    "💡 Learning Fact: Water goes in a cycle - it evaporates from the ocean, becomes clouds, and falls as rain!",
                    "💡 Learning Fact: Plants produce oxygen through photosynthesis - that's why we need trees!"
                ],
                game: "What do plants need to grow? (Sun, water, or both?)",
                answer: "both"
            },
            {
                name: "Language",
                emoji: "📚",
                facts: [
                    "💡 Learning Fact: Language helps us express feelings and thoughts. When we learn new words, we can better explain how we feel!",
                    "💡 Learning Fact: Reading books expands our vocabulary and helps us understand the world better.",
                    "💡 Learning Fact: Writing stories is a creative way to express ourselves - it's like painting with words!"
                ],
                game: "What word means 'happy'? (Sad, Joyful, or Scared?)",
                answer: "joyful"
            },
            {
                name: "English",
                emoji: "🌍",
                facts: [
                    "💡 Learning Fact: Learning new languages opens new doors! It helps us communicate with people from all over the world.",
                    "💡 Learning Fact: When we learn English, we can understand music, movies and books from many countries!",
                    "💡 Learning Fact: Being multilingual trains our brain and makes it more flexible!"
                ],
                game: "What does 'Hello' mean in Norwegian? (Hi, Bye, or Thanks?)",
                answer: "hi"
            },
            {
                name: "Art",
                emoji: "🎨",
                facts: [
                    "💡 Learning Fact: Art is a way to express feelings when words aren't enough. It can be therapeutic!",
                    "💡 Learning Fact: When we create art, the right side of our brain is activated - it helps with creativity and problem solving!",
                    "💡 Learning Fact: Looking at art from others can help us understand their perspective and feelings!"
                ],
                game: "What color do you get when you mix red and blue?",
                answer: "purple"
            }
        ];
        
        // Show subject selection
        const subjectChoice = subjects[Math.floor(Math.random() * subjects.length)];
        
        const wantToLearn = this.language === 'no'
            ? "Jeg vil lære " + subjectChoice.name + " i dag! " + subjectChoice.emoji
            : "I want to learn " + subjectChoice.name + " today! " + subjectChoice.emoji;
        this.showDialogue(wantToLearn);
        
        setTimeout(() => {
            // Show fact
            const fact = subjectChoice.facts[Math.floor(Math.random() * subjectChoice.facts.length)];
            this.showMessage(fact);
            
            setTimeout(() => {
                // Show game/question
                const promptText = this.language === 'no'
                    ? subjectChoice.game + "\n(Skriv ditt svar)"
                    : subjectChoice.game + "\n(Write your answer)";
                const userAnswer = prompt(promptText);
                if (userAnswer && userAnswer.toLowerCase().trim() === subjectChoice.answer.toLowerCase()) {
                    const correctMsg = this.language === 'no'
                        ? "Riktig! Jeg lærte mye i " + subjectChoice.name + " i dag!"
                        : "Correct! I learned a lot in " + subjectChoice.name + " today!";
                    this.showDialogue(correctMsg);
                    this.adjustStat('happiness', 15);
                    this.adjustStat('learning', 20);
                    this.adjustStat('energy', -12);
                    this.setEmotion('happy', 20);
                    this.setEmotion('curious', 15);
                    this.adjustRelationship(2);
                    const smartMsg = this.language === 'no'
                        ? "Bra jobbet med å lære " + subjectChoice.name + "! " + this.child.name + " blir smartere!"
                        : "Great job learning " + subjectChoice.name + "! " + this.child.name + " is getting smarter!";
                    this.showMessage(smartMsg);
                } else {
                    const wrongMsg = this.language === 'no'
                        ? "Hmm, det var ikke riktig. Men jeg lærte noe nytt i " + subjectChoice.name + "!"
                        : "Hmm, that wasn't right. But I learned something new in " + subjectChoice.name + "!";
                    this.showDialogue(wrongMsg);
                    this.adjustStat('happiness', 8);
                    this.adjustStat('learning', 12);
                    this.adjustStat('energy', -10);
                    this.setEmotion('curious', 10);
                    this.adjustRelationship(1);
                    const learnMsg = this.language === 'no'
                        ? "Å lære fra feil er viktig! " + this.child.name + " lærer fortsatt!"
                        : "Learning from mistakes is important! " + this.child.name + " is still learning!";
                    this.showMessage(learnMsg);
                }
                
                // Track subject studied
                if (!this.child.subjectsStudied) this.child.subjectsStudied = {};
                if (!this.child.subjectsStudied[subjectChoice.name]) {
                    this.child.subjectsStudied[subjectChoice.name] = 0;
                }
                this.child.subjectsStudied[subjectChoice.name]++;
                this.checkAchievements();
                
                this.performAction();
                this.advanceTime();
            }, 2000);
        }, 1000);
    }
    
    advanceTime() {
        this.timeOfDay = (this.timeOfDay + 1) % 4;
        this.updateDisplay();
        // Auto-save after time advance
        this.saveGame();
    }
    
    nextDay() {
        this.day++;
        this.timeOfDay = 0;
        this.actionsToday = 0; // Reset actions for new day
        
        // Age progression
        if (this.day % 30 === 0) {
            this.child.age++;
            
            // Show progress and hope based on choices
            let progressMessage = "";
            if (this.child.helpingOthers > 10) {
                progressMessage = this.language === 'no'
                    ? `Jeg er ${this.child.age} år gammel nå! Jeg har hjulpet så mange mennesker... Jeg trodde aldri jeg kunne gjøre en forskjell, men det gjør jeg.`
                    : `I'm ${this.child.age} years old now! I've helped so many people... I never thought I could make a difference, but I am.`;
            } else if (this.child.studyLevel > 70) {
                progressMessage = this.language === 'no'
                    ? `Jeg er ${this.child.age} år gammel nå! Alt hardt arbeid med å studere lønner seg. Jeg blir smartere hver dag!`
                    : `I'm ${this.child.age} years old now! All my hard studying is paying off. I'm getting smarter every day!`;
            } else if (this.child.resilience > 80) {
                progressMessage = this.language === 'no'
                    ? `Jeg er ${this.child.age} år gammel nå! Jeg er så mye sterkere enn jeg var. Ting blir bedre.`
                    : `I'm ${this.child.age} years old now! I'm so much stronger than I was. Things are getting better.`;
            } else if (this.child.goodChoices > this.child.shortTermChoices) {
                progressMessage = this.language === 'no'
                    ? `Jeg er ${this.child.age} år gammel nå! Jeg tar gode valg, bygger min fremtid.`
                    : `I'm ${this.child.age} years old now! I'm making good choices, building my future.`;
            } else {
                progressMessage = this.language === 'no'
                    ? `Jeg er ${this.child.age} år gammel nå! Jeg vokser opp i 2000-tallet!`
                    : `I'm ${this.child.age} years old now! I'm growing up in the 2000s!`;
            }
            
            this.showDialogue(progressMessage);
            
            const ageMessages = this.language === 'no' ? [
                `Barnet ditt ble ${this.child.age} år gammelt! Vokser opp i 2000-tallet.`,
                `🎂 Gratulerer med ${this.child.age} år! Nok et år med 2000-talls barndom!`
            ] : [
                `Your child turned ${this.child.age} years old! Growing up in the 2000s.`,
                `🎂 Happy ${this.child.age}th birthday! Another year of 2000s childhood!`
            ];
            this.showMessage(ageMessages[Math.floor(Math.random() * ageMessages.length)]);
            
            // Career opportunities based on study level and age
            if (this.child.age >= 14 && this.child.studyLevel > 60 && this.child.money === 0) {
                const careerMsg = this.language === 'no'
                    ? "💼 " + this.child.name + " er gammel nok og smart nok til å begynne å tjene penger gjennom deltidsarbeid!"
                    : "💼 " + this.child.name + " is old enough and smart enough to start earning money through part-time work!";
                this.showMessage(careerMsg);
            }
            
            // Year progression
            if (this.child.age % 2 === 0 && this.child.age <= 18) {
                this.year++;
                if (this.year <= 2009) {
                    const yearMsg = this.language === 'no'
                        ? `Det er ${this.year} nå! 2000-tallet flyr forbi!`
                        : `It's ${this.year} now! The 2000s are flying by!`;
                    this.showDialogue(yearMsg);
                }
            }
            
            // Special milestone at age 18 - show success story
            if (this.child.age === 18) {
                this.showFinalSuccessMessage();
            }
        }
        
        // Check for success milestones
        this.checkSuccessMilestones();
        
        // Natural stat changes (like original game - more challenging)
        this.adjustStat('energy', -8); // More energy loss per day
        this.adjustStat('hunger', -12); // Hunger decreases faster (more important!)
        
        // Track daily routines - consequences for skipping (like original)
        const daysSinceFed = this.day - (this.child.lastFed || 0);
        const daysSinceBathed = this.day - (this.child.lastBathed || 0);
        const daysSincePlayed = this.day - (this.child.lastPlayed || 0);
        
        // Critical: Must feed child regularly (like original)
        if (daysSinceFed > 1) {
            this.child.daysWithoutFood = (this.child.daysWithoutFood || 0) + 1;
            this.adjustStat('hunger', -15); // Extra hunger loss
            this.adjustStat('happiness', -10);
            this.setEmotion('anxious', 10);
            if (daysSinceFed > 2) {
                const hungryMsg = this.language === 'no'
                    ? this.child.name + " har ikke spist på " + daysSinceFed + " dager! Dette er kritisk!"
                    : this.child.name + " hasn't eaten in " + daysSinceFed + " days! This is critical!";
                this.showMessage("⚠️ " + hungryMsg);
                this.adjustStat('energy', -10);
                this.adjustStat('happiness', -15);
            }
        } else {
            this.child.daysWithoutFood = 0;
        }
        
        // Must bathe child regularly (like original)
        if (daysSinceBathed > 2) {
            this.child.daysWithoutBath = (this.child.daysWithoutBath || 0) + 1;
            this.adjustStat('happiness', -5);
            this.adjustStat('social', -3); // Poor hygiene affects social interactions
            if (daysSinceBathed > 3) {
                const dirtyMsg = this.language === 'no'
                    ? this.child.name + " trenger et bad. Dette påvirker " + (this.child.gender === 'girl' ? 'henne' : 'ham') + " negativt."
                    : this.child.name + " needs a bath. This is affecting " + (this.child.gender === 'girl' ? 'her' : 'him') + " negatively.";
                this.showMessage("⚠️ " + dirtyMsg);
            }
        } else {
            this.child.daysWithoutBath = 0;
        }
        
        // Must play with child regularly (like original)
        if (daysSincePlayed > 3) {
            this.adjustStat('happiness', -8);
            this.adjustRelationship(-2);
            this.setEmotion('sad', 10);
            const lonelyMsg = this.language === 'no'
                ? this.child.name + " føler seg ensom... Vi har ikke lekt sammen på lenge."
                : this.child.name + " feels lonely... We haven't played together in a while.";
            this.showMessage("💔 " + lonelyMsg);
        }
        
        // Low hunger affects happiness more severely (like original)
        if (this.child.hunger < 30) {
            this.adjustStat('happiness', -8);
            this.setEmotion('anxious', 8);
            if (this.child.hunger < 15) {
                // Critical hunger - child is suffering
                const criticalMsg = this.language === 'no'
                    ? this.child.name + " er veldig sulten! Dette påvirker " + (this.child.gender === 'girl' ? 'henne' : 'ham') + " mye."
                    : this.child.name + " is very hungry! This is affecting " + (this.child.gender === 'girl' ? 'her' : 'him') + " a lot.";
                this.showMessage("⚠️ " + criticalMsg);
            }
        }
        
        // Low happiness can affect other stats more (like original)
        if (this.child.happiness < 20) {
            this.adjustStat('social', -3);
            this.adjustStat('learning', -2);
            this.adjustRelationship(-2);
            this.setEmotion('sad', 15);
        }
        
        // Bullying incidents have lasting effects (like original)
        if (this.bullyingIncidents > 0 && this.child.age >= 7) {
            // Recent bullying affects child more
            const daysSinceLastBullying = this.day - (this.memory.filter(m => m.event && m.event.includes("Bullying")).pop()?.day || 0);
            if (daysSinceLastBullying < 3) {
                this.adjustStat('happiness', -3);
                this.setEmotion('anxious', 5);
            }
        }
        
        // High relationship provides passive benefits
        if (this.relationship > 80) {
            this.adjustStat('happiness', 2);
            this.setEmotion('happy', 5);
        }
        
        // High resilience helps Alex handle challenges better
        if (this.child.resilience > 70) {
            this.adjustStat('happiness', 1);
            this.setEmotion('anxious', -2);
        }
        
        // High study level provides passive learning benefits
        if (this.child.studyLevel > 50) {
            this.adjustStat('learning', 1);
            this.child.careerProgress = Math.min(100, this.child.careerProgress + 0.5);
        }
        
        // Helping others provides passive happiness
        if (this.child.helpingOthers > 5) {
            this.adjustStat('happiness', 1);
            this.setEmotion('happy', 2);
        }
        
        // Update emotional state daily
        this.updateEmotionalState();
        
        // Check for narrative events
        this.checkForEvents();
        
        this.updateDisplay();
        this.saveGame(); // Auto-save at end of day
        const dayMsg = this.language === 'no'
            ? `Dag ${this.day} begynner! Tid for nye eventyr i 2000-tallet. Husk: ${this.child.name} er perfekt akkurat som ${this.child.gender === 'girl' ? 'hun' : 'han'} er, og det er alle andre også! Hver dag er en mulighet til å bygge en bedre fremtid, uansett fortid.`
            : `Day ${this.day} begins! Time for new adventures in the 2000s. Remember: ${this.child.name} is perfect just as ${this.child.gender === 'girl' ? 'she' : 'he'} is, and so is everyone else! Each day is an opportunity to build a better future, regardless of the past.`;
        this.showMessage(dayMsg);
    }
    
    checkSuccessMilestones() {
        // Show hope and progress messages
        if (this.child.helpingOthers === 5 && this.child.age >= 12) {
            const dialogue = this.language === 'no'
                ? "Jeg har hjulpet fem personer nå... Jeg blir noen som gjør en forskjell. Dette føles fantastisk!"
                : "I've helped five people now... I'm becoming someone who makes a difference. This feels amazing!";
            const message = this.language === 'no'
                ? "🎉 " + this.child.name + " blir en helt! Å hjelpe andre gir formål og styrke!"
                : "🎉 " + this.child.name + " is becoming a hero! Helping others gives purpose and strength!";
            this.showDialogue(dialogue);
            this.showMessage(message);
        }
        
        if (this.child.studyLevel === 50 && this.child.age >= 12) {
            const dialogue = this.language === 'no'
                ? "Jeg blir virkelig god på å studere! Jeg kan se fremtiden min åpne seg... Barna som hånte meg vet ikke hva jeg bygger."
                : "I'm really getting good at studying! I can see my future opening up... The kids who mocked me don't know what I'm building.";
            const message = this.language === 'no'
                ? "💪 " + this.child.name + "s harde arbeid lønner seg! Suksess kommer fra dedikasjon!"
                : "💪 " + this.child.name + "'s hard work is paying off! Success comes from dedication!";
            this.showDialogue(dialogue);
            this.showMessage(message);
        }
        
        if (this.child.careerProgress >= 50 && this.child.age >= 14) {
            const dialogue = this.language === 'no'
                ? "Jeg begynner å se muligheter... Alt dette arbeidet leder til noe. Jeg er ikke den de sa jeg var."
                : "I'm starting to see opportunities... All this work is leading somewhere. I'm not who they said I was.";
            const message = this.language === 'no'
                ? "✨ " + this.child.name + " bygger en lys fremtid! Historien er ikke over - den begynner bare!"
                : "✨ " + this.child.name + " is building a bright future! The story isn't over - it's just beginning!";
            this.showDialogue(dialogue);
            this.showMessage(message);
        }
        
        if (this.child.goodChoices > this.child.shortTermChoices * 2 && this.child.age >= 12) {
            const dialogue = this.language === 'no'
                ? "Jeg tar gode valg... Prioriterer fremtiden min fremfor kortsiktig moro. Jeg vet det er verdt det."
                : "I'm making good choices... Prioritizing my future over short-term fun. I know it's worth it.";
            const message = this.language === 'no'
                ? "🌟 " + this.child.name + " lærer verdien av langsiktig tenkning! Disse valgene vil forme fremtiden!"
                : "🌟 " + this.child.name + " is learning the value of long-term thinking! These choices will shape the future!";
            this.showDialogue(dialogue);
            this.showMessage(message);
        }
    }
    
    showFinalSuccessMessage() {
        let successStory = "";
        let finalMessage = "";
        
        if (this.child.helpingOthers > 20) {
            successStory = this.language === 'no'
                ? "Jeg har vokst opp gjennom hele 2000-tallet! Jeg har hjulpet over 20 personer... Jeg ble den personen jeg trengte da jeg var yngre. Bøllene som sa jeg aldri ville bli noe? De tok feil. Jeg er en helt nå, og jeg er bare i gang."
                : "I've grown up through the whole 2000s! I've helped over 20 people... I became the person I needed when I was younger. The bullies who said I'd never amount to anything? They were wrong. I'm a hero now, and I'm just getting started.";
            finalMessage = this.language === 'no'
                ? "🌟 " + this.child.name + "s historie viser at med støtte, hardt arbeid og gode valg kan alle overvinne utfordringer og finne suksess! Fremtiden er aldri skrevet i stein - den bygges av valgene vi tar i dag!"
                : "🌟 " + this.child.name + "'s story shows that with support, hard work, and good choices, anyone can overcome challenges and find success! The future is never set in stone - it's built by the choices we make today!";
        } else if (this.child.studyLevel > 80 && this.child.careerProgress > 70) {
            successStory = this.language === 'no'
                ? "Jeg har vokst opp gjennom hele 2000-tallet! Alt det studiet betalte seg... Jeg er vellykket, smart og tjener penger. Barna som kalte meg taper? De kan se meg nå - vellykket, lykkelig og bygger min fremtid. Hardt arbeid vinner."
                : "I've grown up through the whole 2000s! All that studying paid off... I'm successful, smart, and making money. The kids who called me a loser? They can see me now - successful, happy, and building my future. Hard work wins.";
            finalMessage = this.language === 'no'
                ? "🌟 " + this.child.name + "s historie viser at med støtte, hardt arbeid og gode valg kan alle overvinne utfordringer og finne suksess! Fremtiden er aldri skrevet i stein - den bygges av valgene vi tar i dag!"
                : "🌟 " + this.child.name + "'s story shows that with support, hard work, and good choices, anyone can overcome challenges and find success! The future is never set in stone - it's built by the choices we make today!";
        } else if (this.child.resilience > 90) {
            successStory = this.language === 'no'
                ? "Jeg har vokst opp gjennom hele 2000-tallet! Jeg er sterkere enn jeg noen gang kunne forestille meg. Jeg møtte utfordringer, jeg vokste, og jeg lærte at jeg er i stand til fantastiske ting. Historien er ikke skrevet i stein - jeg skrev min egen historie."
                : "I've grown up through the whole 2000s! I'm stronger than I ever imagined. I faced challenges, I grew, and I learned that I'm capable of amazing things. The story isn't written in stone - I wrote my own story.";
            finalMessage = this.language === 'no'
                ? "🌟 " + this.child.name + "s historie viser at med støtte, hardt arbeid og gode valg kan alle overvinne utfordringer og finne suksess! Fremtiden er aldri skrevet i stein - den bygges av valgene vi tar i dag!"
                : "🌟 " + this.child.name + "'s story shows that with support, hard work, and good choices, anyone can overcome challenges and find success! The future is never set in stone - it's built by the choices we make today!";
        } else if (this.child.goodChoices > this.child.shortTermChoices) {
            successStory = this.language === 'no'
                ? "Jeg har vokst opp gjennom 2000-tallet! Jeg tok gode valg, selv når de var vanskelige. Jeg prioriterte fremtiden min, og nå høster jeg belønningene. Suksess kommer ikke fra å ta den enkle veien - den kommer fra hardt arbeid."
                : "I've grown up through the 2000s! I made good choices, even when they were hard. I prioritized my future, and now I'm reaping the rewards. Success doesn't come from taking the easy path - it comes from working hard.";
            finalMessage = this.language === 'no'
                ? "🌟 " + this.child.name + "s historie viser at med støtte, hardt arbeid og gode valg kan alle overvinne utfordringer og finne suksess! Fremtiden er aldri skrevet i stein - den bygges av valgene vi tar i dag!"
                : "🌟 " + this.child.name + "'s story shows that with support, hard work, and good choices, anyone can overcome challenges and find success! The future is never set in stone - it's built by the choices we make today!";
        }
        
        if (successStory) {
            this.showDialogue(successStory);
            this.showMessage(finalMessage);
        } else {
            const defaultDialogue = this.language === 'no'
                ? "Jeg har vokst opp gjennom hele 2000-tallet! For en reise!"
                : "I've grown up through the whole 2000s! What a journey!";
            const defaultMessage = this.language === 'no'
                ? "Barnet ditt har vokst opp gjennom 2000-tallet! For en fantastisk reise!"
                : "Your child has grown up through the 2000s! What an amazing journey!";
            this.showDialogue(defaultDialogue);
            this.showMessage(defaultMessage);
        }
    }
    
    checkForEvents() {
        // Bullying incidents happen more frequently (like original game - central to story)
        // Higher chance at school, but can happen anywhere
        let bullyingChance = 0;
        if (this.currentLocation === 'school') {
            // Much higher chance at school (like original)
            bullyingChance = this.child.resilience < 50 ? 0.6 : 0.4;
        } else if (this.currentLocation === 'playground') {
            // Can also happen at playground
            bullyingChance = this.child.resilience < 50 ? 0.4 : 0.25;
        } else {
            // Lower chance elsewhere, but still possible
            bullyingChance = this.child.resilience < 30 ? 0.2 : 0.1;
        }
        
        // More frequent if child is older (school age)
        if (this.child.age >= 7) {
            bullyingChance *= 1.5;
        }
        
        // Check for bullying first (more important than narrative events)
        if (Math.random() < bullyingChance) {
            this.triggerBullyingEvent();
            return;
        }
        
        // Narrative events - more frequent if relationship is good
        const eventChance = this.relationship > 70 ? 0.5 : 0.3;
        if (Math.random() < eventChance) {
            this.triggerNarrativeEvent();
        }
    }
    
    triggerBullyingEvent() {
        this.bullyingIncidents++;
        const pronoun = this.child.gender === 'girl' ? (this.language === 'no' ? 'hun' : 'she') : (this.language === 'no' ? 'han' : 'he');
        const pronoun2 = this.child.gender === 'girl' ? (this.language === 'no' ? 'henne' : 'her') : (this.language === 'no' ? 'ham' : 'him');
        
        const events = this.language === 'no' ? [
            {
                dialogue: "Noen barn på skolen... de sa slemme ting i dag. De sa at jeg var annerledes, at jeg ikke hørte hjemme. Det gjorde vondt. Men jeg vet at jeg er god nok akkurat som jeg er. Alle barn fortjener kjærlighet og respekt, uansett hvor de kommer fra eller hvem de er.",
                message: this.child.name + " opplevde mobbing på skolen. " + (this.language === 'no' ? "Historien viser oss at alle barn fortjener kjærlighet, uansett bakgrunn." : "History shows us that all children deserve love, regardless of background."),
                choices: [
                    { 
                        text: "Jeg er så lei meg. Fortell meg hva som skjedde. Du er trygg her.", 
                        effect: () => { 
                            this.setEmotion('sad', 20);
                            this.setEmotion('anxious', 15);
                            this.adjustStat('happiness', -10);
                            this.adjustStat('social', -5);
                            this.adjustRelationship(8); // Stronger relationship boost
                            this.child.resilience = Math.min(100, this.child.resilience + 5); // More resilience
                            // Permanent memory - affects future events
                            this.memory.push({
                                day: this.day, 
                                event: "Bullying - talked about it", 
                                positive: true,
                                choiceType: "supportive_listening",
                                lastingEffect: true
                            });
                            // This choice makes future bullying easier to handle
                            this.child.bullyingCopingMethod = "talking";
                            this.showDialogue("Takk for at du hører... Det hjelper å snakke om det. Jeg føler meg litt bedre. Jeg vet at jeg er god nok, selv om de sier slemme ting."); 
                            // Lasting effect - child will remember this support
                            this.child.lastSupportiveChoice = this.day;
                            this.saveGame();
                        } 
                    },
                    { 
                        text: "Ikke la dem få deg til å føle deg dårlig. Du er sterk og perfekt akkurat som du er.", 
                        effect: () => { 
                            this.setEmotion('sad', 15);
                            this.setEmotion('angry', 10);
                            this.adjustStat('happiness', -8); // More negative impact
                            this.adjustRelationship(2); // Less relationship boost
                            this.child.resilience = Math.min(100, this.child.resilience + 2);
                            // Memory of this choice
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - told to be strong",
                                positive: false,
                                choiceType: "dismissive",
                                lastingEffect: true
                            });
                            this.child.bullyingCopingMethod = "suppression";
                            this.showDialogue("Jeg skal prøve å være sterk... men det er vanskelig noen ganger. Jeg føler at jeg må holde det inne."); 
                        } 
                    },
                    { 
                        text: "Kanskje vi burde snakke med læreren om dette.", 
                        effect: () => { 
                            this.setEmotion('anxious', 15); // More anxiety
                            this.setEmotion('scared', 10);
                            this.adjustStat('happiness', -8);
                            this.adjustStat('social', -5); // More social impact
                            this.adjustRelationship(3);
                            this.child.resilience = Math.min(100, this.child.resilience + 4); // Good resilience boost
                            // Memory - this is a brave choice
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - considered telling teacher",
                                positive: true,
                                choiceType: "seeking_help",
                                lastingEffect: true
                            });
                            this.child.bullyingCopingMethod = "seeking_help";
                            // Future bullying might be less severe if teacher gets involved
                            this.child.teacherInvolved = true;
                            this.showDialogue("Jeg er redd... hva hvis de blir sinte? Men... kanskje det er det riktige å gjøre. Jeg vil prøve."); 
                        } 
                    }
                ]
            },
        ] : [
            {
                dialogue: "Some kids at school... they said mean things today. It hurt. But I know I'm good enough just as I am.",
                message: this.child.name + " experienced bullying at school, but remembers that " + pronoun + " is perfect just as " + pronoun + " is.",
                choices: [
                    { 
                        text: "I'm so sorry. Tell me what happened. You're safe here.", 
                        effect: () => { 
                            this.setEmotion('sad', 20);
                            this.setEmotion('anxious', 15);
                            this.adjustStat('happiness', -10);
                            this.adjustStat('social', -5);
                            this.adjustRelationship(5);
                            this.child.resilience = Math.min(100, this.child.resilience + 3);
                            this.memory.push({day: this.day, event: "Bullying - talked about it", positive: true});
                            this.showDialogue("Thank you for listening... It helps to talk about it. I feel a little better. I know I'm good enough, even if they say mean things."); 
                            this.saveGame();
                        } 
                    },
                    { 
                        text: "Don't let them get to you. You're strong and perfect just as you are.", 
                        effect: () => { 
                            this.setEmotion('sad', 15);
                            this.setEmotion('angry', 10);
                            this.adjustStat('happiness', -5);
                            this.child.resilience = Math.min(100, this.child.resilience + 2);
                            this.showDialogue("I'll try to be strong... but it's hard sometimes."); 
                        } 
                    },
                    { 
                        text: "Maybe we should talk to the teacher about this.", 
                        effect: () => { 
                            this.setEmotion('anxious', 10);
                            this.setEmotion('scared', 5);
                            this.adjustStat('happiness', -5);
                            this.adjustStat('social', -3);
                            this.child.resilience = Math.min(100, this.child.resilience + 1);
                            this.showDialogue("I'm scared... what if they get angry? But... maybe it's the right thing."); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "De dytte meg i dag... Jeg visste ikke hva jeg skulle gjøre." : "They pushed me today... I didn't know what to do.",
                message: this.language === 'no' ? "Fysisk mobbing-hendelse." : "Physical bullying incident.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Er du okay? Vi må fortelle noen om dette." : "Are you okay? We need to tell someone about this.", 
                        effect: () => { 
                            this.setEmotion('scared', 25);
                            this.setEmotion('sad', 20);
                            this.adjustStat('happiness', -15);
                            this.adjustStat('energy', -10);
                            this.adjustRelationship(6);
                            this.child.resilience = Math.min(100, this.child.resilience + 5);
                            this.memory.push({day: this.day, event: "Physical bullying - got help", positive: true});
                            const msg = this.language === 'no' ? "Jeg er okay... Takk for at du bryr deg. Jeg er redd, men jeg vet at du vil hjelpe meg." : "I'm okay... Thank you for caring. I'm scared but I know you'll help me.";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Du er modig. Stå opp for deg selv neste gang." : "You're brave. Stand up for yourself next time.", 
                        effect: () => { 
                            this.setEmotion('angry', 20);
                            this.setEmotion('scared', 15);
                            this.adjustStat('happiness', -10);
                            this.child.resilience = Math.min(100, this.child.resilience + 2);
                            const msg = this.language === 'no' ? "Jeg skal prøve... Jeg vil være modig. Men det er skummelt." : "I'll try... I want to be brave. But it's scary.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Alle lo av meg i klassen i dag... Jeg ville bare forsvinne." : "Everyone laughed at me in class today... I wanted to disappear.",
                message: this.language === 'no' ? "Flauhet og sosial mobbing." : "Embarrassment and social bullying.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Jeg er her for deg. De følelsene er gyldige. La oss snakke om det." : "I'm here for you. Those feelings are valid. Let's talk about it.", 
                        effect: () => { 
                            this.setEmotion('embarrassed', 30);
                            this.setEmotion('sad', 20);
                            this.adjustStat('happiness', -12);
                            this.adjustStat('social', -8);
                            this.adjustRelationship(4);
                            this.child.resilience = Math.min(100, this.child.resilience + 3);
                            this.copingActivities.push({day: this.day, activity: 'talk', helpful: true});
                            const msg = this.language === 'no' ? "Jeg føler meg så flau... Men å snakke med deg hjelper. Jeg føler meg ikke så alene." : "I feel so embarrassed... But talking to you helps. I don't feel so alone.";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Ikke bekymre deg for hva andre tenker. Du er spesiell." : "Don't worry about what others think. You're special.", 
                        effect: () => { 
                            this.setEmotion('embarrassed', 20);
                            this.setEmotion('happy', 10);
                            this.adjustStat('happiness', -5);
                            this.child.resilience = Math.min(100, this.child.resilience + 2);
                            const msg = this.language === 'no' ? "Takk... Jeg vet at du ser meg for den jeg er." : "Thank you... I know you see me for who I am.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg kom tilbake sterkere i dag. Jeg sa til dem å stoppe, og de gjorde det faktisk." : "I came back stronger today. I told them to stop, and they actually did.",
                message: this.language === 'no' ? this.child.name + " sto opp for seg selv!" : this.child.name + " stood up for themselves!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Jeg er så stolt av deg! Det krevde mot! Du er perfekt akkurat som du er!" : "I'm so proud of you! That took courage! You're perfect just as you are!", 
                        effect: () => { 
                            this.setEmotion('happy', 30);
                            this.setEmotion('surprised', 15);
                            this.setEmotion('anxious', -20);
                            this.setEmotion('sad', -15);
                            this.adjustStat('happiness', 25);
                            this.adjustStat('social', 10);
                            this.adjustRelationship(8);
                            this.child.resilience = Math.min(100, this.child.resilience + 10);
                            this.memory.push({day: this.day, event: "Stood up to bullies - succeeded!", positive: true});
                            const msg = this.language === 'no' ? "Jeg gjorde det! Jeg kan ikke tro det fungerte! Jeg føler meg så mye sterkere nå! Du har rett - jeg er god nok akkurat som jeg er!" : "I did it! I can't believe it worked! I feel so much stronger now! You're right - I am good enough just as I am!";
                            this.showDialogue(msg); 
                            this.saveGame();
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Det er min modige unge! Du lærer å håndtere dette." : "That's my brave child! You're learning to handle this.", 
                        effect: () => { 
                            this.setEmotion('happy', 20);
                            this.setEmotion('surprised', 10);
                            this.adjustStat('happiness', 15);
                            this.adjustStat('social', 8);
                            this.child.resilience = Math.min(100, this.child.resilience + 8);
                            const msg = this.language === 'no' ? "Jeg lærer... Jeg blir sterkere. Takk for at du tror på meg." : "I'm learning... I'm getting stronger. Thank you for believing in me.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg latet som jeg ikke brydde meg, men jeg er virkelig såret på innsiden..." : "I pretended I didn't care, but I'm really hurt inside...",
                message: this.language === 'no' ? this.child.name + " skjuler følelsene sine." : this.child.name + " is hiding their feelings.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det er okay å føle seg såret. Følelsene dine betyr noe. La oss snakke." : "It's okay to feel hurt. Your feelings matter. Let's talk.", 
                        effect: () => { 
                            this.setEmotion('sad', 25);
                            this.setEmotion('anxious', -15);
                            this.adjustStat('happiness', -8);
                            this.adjustRelationship(6);
                            this.child.resilience = Math.min(100, this.child.resilience + 4);
                            this.copingActivities.push({day: this.day, activity: 'talk', helpful: true});
                            const msg = this.language === 'no' ? "Takk... Det er vanskelig å vise hvordan jeg virkelig føler. Men med deg, kan jeg." : "Thank you... It's hard to show how I really feel. But with you, I can.";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Du er sterk. Men du trenger ikke skjule følelsene dine med meg." : "You're strong. But you don't have to hide your feelings with me.", 
                        effect: () => { 
                            this.setEmotion('sad', 15);
                            this.adjustStat('happiness', -5);
                            this.adjustRelationship(4);
                            this.child.resilience = Math.min(100, this.child.resilience + 3);
                            const msg = this.language === 'no' ? "Jeg vet... Jeg er bare redd for å være sårbar. Men jeg stoler på deg." : "I know... I'm just scared of being vulnerable. But I trust you.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.showNarrativeEvent(event);
    }
    
    triggerNarrativeEvent() {
        const events = this.language === 'no' ? [
            {
                dialogue: "Jeg fant en kul leke i butikken! Kan jeg beholde den?",
                message: "Barnet ditt fant noe interessant!",
                choices: [
                    { text: "Selvfølgelig! Du kan beholde den.", effect: () => { 
                        this.adjustStat('happiness', 15); 
                        this.adjustRelationship(3);
                        this.memory.push({day: this.day, event: "Got toy", positive: true});
                        this.showDialogue("Takk så mye! Jeg elsker den!"); 
                    } },
                    { text: "Kanskje senere, la oss snakke om det.", effect: () => { 
                        this.adjustStat('happiness', 5); 
                        this.adjustRelationship(-1);
                        this.showDialogue("Ok, jeg forstår."); 
                    } }
                ]
            },
            {
                dialogue: "En klassekamerat inviterte meg til bursdagsfeiringen sin! Kan jeg dra?",
                message: "Sosial mulighet!",
                choices: [
                    { text: "Ja, det høres gøy ut!", effect: () => { this.adjustStat('social', 20); this.adjustStat('happiness', 15); this.showDialogue("Jippi! Jeg er så spent! Jeg skal ha det så bra!"); } },
                    { text: "Vi får se, la oss sjekke timeplanen.", effect: () => { this.adjustStat('social', 5); this.showDialogue("Jeg håper jeg kan dra..."); } }
                ]
            },
            {
                dialogue: "Jeg har problemer med leksene mine. Kan du hjelpe meg?",
                message: "Barnet ditt trenger hjelp med læring.",
                choices: [
                    { text: "Selvfølgelig! La oss jobbe sammen med det.", effect: () => { this.adjustStat('learning', 15); this.adjustStat('happiness', 10); this.showDialogue("Takk! Nå forstår jeg det!"); } },
                    { text: "Prøv å finne ut av det først, så spør hvis du trenger hjelp.", effect: () => { this.adjustStat('learning', 5); this.showDialogue("Ok, jeg skal prøve mitt beste."); } }
                ]
            },
        ] : [
            {
                dialogue: "I found a cool toy at the store! Can I keep it?",
                message: "Your child found something interesting!",
                choices: [
                    { text: "Of course! You can keep it.", effect: () => { 
                        this.adjustStat('happiness', 15); 
                        this.adjustRelationship(3);
                        this.memory.push({day: this.day, event: "Got toy", positive: true});
                        this.showDialogue("Thank you so much! I love it!"); 
                    } },
                    { text: "Maybe later, let's talk about it.", effect: () => { 
                        this.adjustStat('happiness', 5); 
                        this.adjustRelationship(-1);
                        this.showDialogue("Okay, I understand."); 
                    } }
                ]
            },
            {
                dialogue: "A classmate invited me to their birthday party! Can I go?",
                message: "Social opportunity!",
                choices: [
                    { text: "Yes, that sounds fun!", effect: () => { this.adjustStat('social', 20); this.adjustStat('happiness', 15); this.showDialogue("Yay! I'm so excited! I'll have the best time!"); } },
                    { text: "We'll see, let's check the schedule.", effect: () => { this.adjustStat('social', 5); this.showDialogue("I hope I can go..."); } }
                ]
            },
            {
                dialogue: "I'm having trouble with my homework. Can you help me?",
                message: "Your child needs help with learning.",
                choices: [
                    { text: "Of course! Let's work on it together.", effect: () => { this.adjustStat('learning', 15); this.adjustStat('happiness', 10); this.showDialogue("Thank you! I understand it now!"); } },
                    { text: "Try to figure it out first, then ask if you need help.", effect: () => { this.adjustStat('learning', 5); this.showDialogue("Okay, I'll try my best."); } }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg vil lære å bruke datamaskinen! Kan du lære meg?" : "I want to learn how to use the computer! Can you teach me?",
                message: this.language === 'no' ? "Interesse for 2000-talls teknologi!" : "Interest in 2000s technology!",
                choices: [
                    { text: this.language === 'no' ? "Absolutt! La oss utforske datamaskinen sammen." : "Absolutely! Let's explore the computer together.", effect: () => { 
                        this.adjustStat('learning', 20); 
                        this.adjustStat('happiness', 15); 
                        const msg = this.language === 'no' ? "Dette er så kult! Jeg elsker å lære om datamaskiner!" : "This is so cool! I love learning about computers!";
                        this.showDialogue(msg); 
                    } },
                    { text: this.language === 'no' ? "Kanskje senere, vi er opptatt akkurat nå." : "Maybe later, we're busy right now.", effect: () => { 
                        this.adjustStat('learning', 3); 
                        const msg = this.language === 'no' ? "Jeg venter da..." : "I'll wait then...";
                        this.showDialogue(msg); 
                    } }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg fikk en ny venn på skolen i dag! De er veldig snille!" : "I made a new friend at school today! They're really nice!",
                message: this.language === 'no' ? "Positiv sosial interaksjon!" : "Positive social interaction!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det er fantastisk! Fortell meg om dem." : "That's wonderful! Tell me about them.", 
                        effect: () => { 
                            this.adjustStat('social', 15); 
                            this.adjustStat('happiness', 10); 
                            const msg = this.language === 'no' ? "De liker de samme spillene som meg! Vi skal leke sammen!" : "They like the same games as me! We're going to play together!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Det er fint. Husk å være vennlig." : "That's nice. Make sure to be friendly.", 
                        effect: () => { 
                            this.adjustStat('social', 8); 
                            const msg = this.language === 'no' ? "Jeg skal! De er veldig kule." : "I will! They're really cool.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Kan vi dra på kjøpesenteret? Alle på skolen drar dit!" : "Can we go to the mall? Everyone at school goes there!",
                message: this.language === 'no' ? "2000-talls sosial aktivitetsforespørsel!" : "2000s social activity request!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Selvfølgelig! La oss dra i helgen." : "Sure! Let's go this weekend.", 
                        effect: () => { 
                            this.adjustStat('social', 12); 
                            this.adjustStat('happiness', 15); 
                            const msg = this.language === 'no' ? "Fantastisk! Jeg gleder meg! Kjøpesenteret er så kult i 2000-tallet!" : "Awesome! I can't wait! The mall is so cool in the 2000s!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Kanskje en annen gang, vi har andre planer." : "Maybe another time, we have other plans.", 
                        effect: () => { 
                            this.adjustStat('happiness', -5); 
                            const msg = this.language === 'no' ? "Åh... ok. Kanskje neste gang?" : "Oh... okay. Maybe next time?";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg føler meg litt ensom i dag... Kan vi tilbringe mer tid sammen?" : "I'm feeling a bit lonely today... Can we spend more time together?",
                message: this.language === 'no' ? this.child.name + " trenger oppmerksomhet og trøst." : this.child.name + " needs attention and comfort.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Selvfølgelig! La oss gjøre noe gøy sammen." : "Of course! Let's do something fun together.", 
                        effect: () => { 
                            this.adjustStat('happiness', 20); 
                            this.adjustStat('social', 10); 
                            this.setEmotion('happy', 20);
                            this.setEmotion('sad', -15);
                            this.setEmotion('anxious', -10);
                            this.adjustRelationship(4);
                            const msg = this.language === 'no' ? "Takk! Jeg føler meg så mye bedre nå! Å være med deg gjør alt bra." : "Thank you! I feel so much better now! Being with you makes everything okay.";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Jeg forstår, men vi er opptatt akkurat nå." : "I understand, but we're busy right now.", 
                        effect: () => { 
                            this.adjustStat('happiness', -10); 
                            this.setEmotion('sad', 15);
                            const msg = this.language === 'no' ? "Åh... ok. Jeg venter." : "Oh... okay. I'll wait.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg fant et stille sted på biblioteket i dag. Det var fredelig der..." : "I found a quiet spot in the library today. It was peaceful there...",
                message: this.language === 'no' ? this.child.name + " fant et trygt sted." : this.child.name + " found a safe space.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det høres fantastisk ut! Å finne steder som gjør deg trygg er viktig." : "That sounds wonderful! Finding places that make you feel safe is important.", 
                        effect: () => { 
                            this.adjustStat('happiness', 15); 
                            this.setEmotion('happy', 15);
                            this.setEmotion('anxious', -15);
                            this.child.resilience = Math.min(100, this.child.resilience + 3);
                            this.memory.push({day: this.day, event: "Found safe space", positive: true});
                            const msg = this.language === 'no' ? "Det var... Jeg følte at jeg kunne puste der. Kanskje jeg kan gå tilbake?" : "It was... I felt like I could breathe there. Maybe I can go back?";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Det er fint. Biblioteker er fredelige steder." : "That's nice. Libraries are peaceful places.", 
                        effect: () => { 
                            this.adjustStat('happiness', 8); 
                            this.setEmotion('happy', 10);
                            const msg = this.language === 'no' ? "Ja... Det var fint å være et sted som var stille." : "Yes... It was nice to be somewhere quiet.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Noen på skolen var snill med meg i dag... Det overrasket meg." : "Someone at school was nice to me today... It surprised me.",
                message: this.language === 'no' ? "Positiv sosial interaksjon!" : "Positive social interaction!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det er fantastisk! Fortell meg om det." : "That's wonderful! Tell me about it.", 
                        effect: () => { 
                            this.adjustStat('happiness', 20); 
                            this.adjustStat('social', 15); 
                            this.setEmotion('happy', 25);
                            this.setEmotion('surprised', 15);
                            this.setEmotion('sad', -10);
                            this.child.resilience = Math.min(100, this.child.resilience + 5);
                            this.memory.push({day: this.day, event: "Someone was kind", positive: true});
                            const msg = this.language === 'no' ? "De bare... snakket med meg normalt. Som om jeg betydde noe. Det føltes så godt!" : "They just... talked to me normally. Like I mattered. It felt so good!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Det er fint. Mennesker kan overraske deg." : "That's nice. People can surprise you.", 
                        effect: () => { 
                            this.adjustStat('happiness', 12); 
                            this.adjustStat('social', 8); 
                            this.setEmotion('happy', 15);
                            const msg = this.language === 'no' ? "Ja... Kanskje ikke alle er slemme?" : "Yes... Maybe not everyone is mean?";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg skrev i dagboken min i dag... Det hjalp meg å bearbeide følelsene mine." : "I wrote in my journal today... It helped me process my feelings.",
                message: this.language === 'no' ? this.child.name + " finner sunne måter å takle på." : this.child.name + " is finding healthy ways to cope.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det er en flott måte å uttrykke deg på! Å skrive kan være veldig helbredende." : "That's a great way to express yourself! Writing can be very healing.", 
                        effect: () => { 
                            this.adjustStat('happiness', 15); 
                            this.setEmotion('happy', 15);
                            this.setEmotion('anxious', -15);
                            this.setEmotion('sad', -10);
                            this.child.resilience = Math.min(100, this.child.resilience + 4);
                            this.copingActivities.push({day: this.day, activity: 'journal', helpful: true});
                            const msg = this.language === 'no' ? "Det hjelper virkelig... Å få tankene mine på papir gjør dem mindre skummle." : "It really does help... Getting my thoughts on paper makes them less scary.";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Det er bra. Fortsett å uttrykke deg." : "That's good. Keep expressing yourself.", 
                        effect: () => { 
                            this.adjustStat('happiness', 10); 
                            this.setEmotion('happy', 10);
                            this.child.resilience = Math.min(100, this.child.resilience + 2);
                            const msg = this.language === 'no' ? "Jeg skal... Det blir en vane som hjelper meg." : "I will... It's becoming a habit that helps me.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg begynner å føle meg... sterkere? Som om jeg lærer å håndtere ting bedre." : "I'm starting to feel... stronger? Like I'm learning to handle things better.",
                message: this.language === 'no' ? this.child.name + " vokser i motstandskraft!" : this.child.name + " is growing in resilience!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Jeg er så stolt av deg! Du blir så sterk og modig. Du var alltid perfekt - du oppdager det bare nå!" : "I'm so proud of you! You're becoming so strong and brave. You were always perfect - you're just discovering it now!", 
                        effect: () => { 
                            this.adjustStat('happiness', 25); 
                            this.setEmotion('happy', 30);
                            this.setEmotion('surprised', 10);
                            this.setEmotion('anxious', -20);
                            this.adjustRelationship(8);
                            this.child.resilience = Math.min(100, this.child.resilience + 10);
                            this.memory.push({day: this.day, event: "Growing stronger", positive: true});
                            const msg = this.language === 'no' ? "Takk... Jeg kunne ikke gjort dette uten deg. Jeg lærer at jeg er sterkere enn jeg trodde! Og jeg innser at jeg er god nok akkurat som jeg er - alle barn er det!" : "Thank you... I couldn't do this without you. I'm learning that I'm stronger than I thought! And I'm realizing that I'm good enough just as I am - all children are!";
                            this.showDialogue(msg); 
                            this.saveGame();
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Du har alltid vært sterk. Du oppdager det bare nå." : "You've always been strong. You're just discovering it now.", 
                        effect: () => { 
                            this.adjustStat('happiness', 20); 
                            this.setEmotion('happy', 20);
                            this.setEmotion('surprised', 15);
                            this.child.resilience = Math.min(100, this.child.resilience + 8);
                            const msg = this.language === 'no' ? "Tror du det? Jeg begynner å tro det også..." : "You think so? I'm starting to believe it too...";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg så noen andre bli mobbet i dag... Jeg stoppet det. Jeg kunne ikke la det skje." : "I saw someone else being bullied today... I stopped it. I couldn't let it happen.",
                message: this.language === 'no' ? this.child.name + " blir en helt!" : this.child.name + " is becoming a hero!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det er utrolig modig! Du gjør en virkelig forskjell." : "That's incredibly brave! You're making a real difference.", 
                        effect: () => { 
                            this.adjustStat('happiness', 30); 
                            this.adjustStat('social', 20);
                            this.setEmotion('happy', 35);
                            this.setEmotion('surprised', 20);
                            this.child.helpingOthers++;
                            this.child.goodChoices++;
                            this.child.resilience = Math.min(100, this.child.resilience + 10);
                            this.adjustRelationship(10);
                            this.memory.push({day: this.day, event: "Stopped bullying - became hero", positive: true});
                            const msg = this.language === 'no' ? "Jeg gjorde det! Jeg sto opp for dem... Jeg vet hvordan det føles. Jeg måtte hjelpe. Jeg blir den personen jeg trengte da jeg var yngre!" : "I did it! I stood up for them... I know what it feels like. I had to help. I'm becoming the person I needed when I was younger!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Du er fantastisk. Det krevde ekte mot." : "You're amazing. That took real courage.", 
                        effect: () => { 
                            this.adjustStat('happiness', 25); 
                            this.adjustStat('social', 15);
                            this.setEmotion('happy', 30);
                            this.child.helpingOthers++;
                            this.child.goodChoices++;
                            this.child.resilience = Math.min(100, this.child.resilience + 8);
                            const msg = this.language === 'no' ? "Takk... Jeg lærer at jeg kan være sterk. Jeg kan hjelpe andre nå." : "Thank you... I'm learning that I can be strong. I can help others now.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg ble akseptert i et bra program! Alt det harde arbeidet med å studere lønner seg!" : "I got accepted into a good program! All my studying is paying off!",
                message: this.language === 'no' ? "Suksess gjennom hardt arbeid!" : "Success through hard work!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Jeg er så stolt! Du jobbet så hardt for dette!" : "I'm so proud! You worked so hard for this!", 
                        effect: () => { 
                            this.adjustStat('happiness', 30); 
                            this.adjustStat('learning', 20);
                            this.setEmotion('happy', 40);
                            this.setEmotion('surprised', 25);
                            this.child.careerProgress = Math.min(100, this.child.careerProgress + 15);
                            this.child.money += 50;
                            this.memory.push({day: this.day, event: "Got accepted - success!", positive: true});
                            const msg = this.language === 'no' ? "Jeg kan ikke tro det! Alle de timene med å studere... De sa jeg ikke kunne gjøre det, men jeg gjorde det! Fremtiden er min!" : "I can't believe it! All those hours studying... They said I couldn't do it, but I did! The future is mine!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Du fortjente dette! Din dedikasjon er inspirerende." : "You earned this! Your dedication is inspiring.", 
                        effect: () => { 
                            this.adjustStat('happiness', 25); 
                            this.adjustStat('learning', 15);
                            this.setEmotion('happy', 35);
                            this.child.careerProgress = Math.min(100, this.child.careerProgress + 10);
                            const msg = this.language === 'no' ? "Jeg jobbet så hardt... Og det lønner seg. Jeg er ikke den de sa jeg var." : "I worked so hard... And it's paying off. I'm not who they said I was.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Barna som pleide å mobbe meg... De er annerledes nå. Noen beklaget til og med. Ting endret seg." : "The kids who used to bully me... They're different now. Some even apologized. Things changed.",
                message: this.language === 'no' ? "Historien er ikke skrevet i stein - ting kan endre seg!" : "The story isn't set in stone - things can change!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Folk kan endre seg, og du har vist utrolig vekst. Du er inspirerende." : "People can change, and you've shown incredible growth. You're inspiring.", 
                        effect: () => { 
                            this.adjustStat('happiness', 25); 
                            this.setEmotion('happy', 30);
                            this.setEmotion('surprised', 15);
                            this.child.resilience = Math.min(100, this.child.resilience + 10);
                            this.memory.push({day: this.day, event: "Things changed - hope", positive: true});
                            const msg = this.language === 'no' ? "Du har rett... Ting er ikke skrevet i stein. Jeg endret meg, de endret seg... Fremtiden er det vi gjør den til. Jeg har så mye håp nå." : "You're right... Things aren't set in stone. I changed, they changed... The future is what we make it. I have so much hope now.";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Du har kommet så langt. Historien din er bevis på at vanskelige tider ikke varer evig." : "You've come so far. Your story is proof that hard times don't last forever.", 
                        effect: () => { 
                            this.adjustStat('happiness', 20); 
                            this.setEmotion('happy', 25);
                            this.child.resilience = Math.min(100, this.child.resilience + 8);
                            const msg = this.language === 'no' ? "Takk... Jeg lærer at ingenting er permanent. Jeg kan skape min egen fremtid." : "Thank you... I'm learning that nothing is permanent. I can create my own future.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg fikk god karakter på prøven min! Se!" : "I got a good grade on my test! Look!",
                message: this.language === 'no' ? "Akademisk prestasjon!" : "Academic achievement!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det er fantastisk! Jeg er så stolt av deg!" : "That's amazing! I'm so proud of you!", 
                        effect: () => { 
                            this.adjustStat('happiness', 20); 
                            this.adjustStat('learning', 10); 
                            const msg = this.language === 'no' ? "Takk! Jeg studerte veldig hardt! Jeg er så glad!" : "Thank you! I studied really hard! I'm so happy!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Bra jobbet! Fortsett med det gode arbeidet." : "Good job! Keep up the good work.", 
                        effect: () => { 
                            this.adjustStat('happiness', 10); 
                            this.adjustStat('learning', 5); 
                            const msg = this.language === 'no' ? "Jeg skal! Jeg vil gjøre enda bedre neste gang!" : "I will! I want to do even better next time!";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg vil ikke gå på skolen i dag... Kan jeg bli hjemme?" : "I don't want to go to school today... Can I stay home?",
                message: this.language === 'no' ? "Skolemotvilje." : "School reluctance.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Skole er viktig. La oss snakke om hvorfor du ikke vil gå." : "School is important. Let's talk about why you don't want to go.", 
                        effect: () => { 
                            this.adjustStat('learning', 5); 
                            this.adjustStat('happiness', 5); 
                            const msg = this.language === 'no' ? "Ok... Jeg går. Men jeg er fortsatt ikke sikker på det." : "Okay... I'll go. But I'm still not sure about it.";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Hvis du ikke føler deg bra, kan du bli hjemme i dag." : "If you're not feeling well, you can stay home today.", 
                        effect: () => { 
                            this.adjustStat('learning', -10); 
                            this.adjustStat('happiness', 10); 
                            const msg = this.language === 'no' ? "Takk! Jeg vil hvile og føle meg bedre i morgen." : "Thank you! I'll rest and feel better tomorrow.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Kan jeg få et kjæledyr? Alle vennene mine har kjæledyr!" : "Can I have a pet? All my friends have pets!",
                message: this.language === 'no' ? "Forespørsel om kjæledyr!" : "Pet request!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det høres ut som en flott idé! La oss skaffe et kjæledyr." : "That sounds like a great idea! Let's get a pet.", 
                        effect: () => { 
                            this.adjustStat('happiness', 25); 
                            this.adjustStat('social', 10); 
                            const msg = this.language === 'no' ? "Jippi! Jeg skal ta så godt vare på det! Dette er fantastisk!" : "Yay! I'll take such good care of it! This is amazing!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Det er et stort ansvar. La oss tenke på det." : "That's a big responsibility. Let's think about it.", 
                        effect: () => { 
                            this.adjustStat('happiness', -5); 
                            const msg = this.language === 'no' ? "Jeg forstår... men jeg vil virkelig ha en en dag." : "I understand... but I really want one someday.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg vil lære å sykle! Kan du lære meg?" : "I want to learn to ride a bike! Can you teach me?",
                message: this.language === 'no' ? "Mulighet til å lære ny ferdighet!" : "New skill learning opportunity!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Absolutt! La oss gå og øve sammen." : "Absolutely! Let's go practice together.", 
                        effect: () => { 
                            this.adjustStat('learning', 15); 
                            this.adjustStat('happiness', 20); 
                            this.adjustStat('energy', -10); 
                            const msg = this.language === 'no' ? "Dette er så gøy! Jeg blir bedre! Takk for at du lærer meg!" : "This is so fun! I'm getting better! Thank you for teaching me!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Kanskje når du er litt eldre." : "Maybe when you're a bit older.", 
                        effect: () => { 
                            this.adjustStat('happiness', -5); 
                            const msg = this.language === 'no' ? "Ok... men jeg vil virkelig lære snart." : "Okay... but I really want to learn soon.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg er bekymret for presentasjonen min på skolen i morgen..." : "I'm worried about my presentation at school tomorrow...",
                message: this.language === 'no' ? "Barnet ditt er engstelig." : "Your child is anxious.",
                choices: [
                    { 
                        text: this.language === 'no' ? "La oss øve sammen! Du kommer til å klare det bra!" : "Let's practice together! You'll do great!", 
                        effect: () => { 
                            this.adjustStat('happiness', 15); 
                            this.adjustStat('learning', 10); 
                            const msg = this.language === 'no' ? "Takk! Jeg føler meg så mye mer selvsikker nå!" : "Thank you! I feel so much more confident now!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Du kommer til å klare det. Bare gjør ditt beste." : "You'll be fine. Just do your best.", 
                        effect: () => { 
                            this.adjustStat('happiness', 5); 
                            const msg = this.language === 'no' ? "Jeg skal prøve... men jeg er fortsatt nervøs." : "I'll try... but I'm still nervous.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg vil prøve en ny hobby! Kan jeg bli med i en klubb på skolen?" : "I want to try a new hobby! Can I join a club at school?",
                message: this.language === 'no' ? "Interesse for nye aktiviteter!" : "Interest in new activities!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det er en flott idé! Hvilken klubb interesserer deg?" : "That's a great idea! Which club interests you?", 
                        effect: () => { 
                            this.adjustStat('social', 15); 
                            this.adjustStat('happiness', 15); 
                            this.adjustRelationship(2);
                            this.memory.push({day: this.day, event: "Joined club", positive: true});
                            const msg = this.language === 'no' ? "Jeg vil bli med i kunstklubben! Jeg elsker å tegne!" : "I want to join the art club! I love drawing!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "La oss fokusere på skolen først, så kan vi snakke om klubber." : "Let's focus on school first, then we can talk about clubs.", 
                        effect: () => { 
                            this.adjustStat('social', 5); 
                            this.adjustRelationship(-1);
                            const msg = this.language === 'no' ? "Ok... men jeg vil virkelig bli med i noe." : "Okay... but I really want to join something.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg mistet favorittleken min i dag... Jeg er virkelig lei meg for det." : "I lost my favorite toy today... I'm really sad about it.",
                message: this.language === 'no' ? "Barnet ditt er opprørt over å miste noe viktig." : "Your child is upset about losing something important.",
                choices: [
                    { 
                        text: this.language === 'no' ? "La oss lete etter den sammen! Ikke bekymre deg, vi finner den." : "Let's look for it together! Don't worry, we'll find it.", 
                        effect: () => { 
                            this.adjustStat('happiness', 10); 
                            this.adjustRelationship(3);
                            const msg = this.language === 'no' ? "Takk! Jeg føler meg så mye bedre når jeg vet at du vil hjelpe meg!" : "Thank you! I feel so much better knowing you'll help me!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Jeg forstår at det er opprørende, men vi kan skaffe en ny." : "I understand it's upsetting, but we can get a new one.", 
                        effect: () => { 
                            this.adjustStat('happiness', -5); 
                            this.adjustRelationship(-2);
                            const msg = this.language === 'no' ? "Men den var spesiell..." : "But that one was special...";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg vil lære et musikkinstrument! Kan jeg ta timer?" : "I want to learn a musical instrument! Can I take lessons?",
                message: this.language === 'no' ? "Interesse for musikk!" : "Interest in music!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Det er fantastisk! La oss finne en lærer til deg." : "That's wonderful! Let's find you a teacher.", 
                        effect: () => { 
                            this.adjustStat('learning', 15); 
                            this.adjustStat('happiness', 20); 
                            this.adjustStat('social', 10);
                            this.adjustRelationship(3);
                            this.memory.push({day: this.day, event: "Music lessons", positive: true});
                            const msg = this.language === 'no' ? "Virkelig? Dette er fantastisk! Jeg skal øve hver dag!" : "Really? This is amazing! I'll practice every day!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Det er dyrt. Kanskje vi kan tenke på det senere." : "That's expensive. Maybe we can think about it later.", 
                        effect: () => { 
                            this.adjustStat('happiness', -10); 
                            this.adjustRelationship(-2);
                            const msg = this.language === 'no' ? "Åh... ok. Jeg ville virkelig lære da." : "Oh... okay. I really wanted to learn though.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Noen barn på skolen var slemme mot meg i dag..." : "Some kids at school were mean to me today...",
                message: this.language === 'no' ? "Vanskelig sosial situasjon (men håndtert positivt)." : "Difficult social situation (but handled positively).",
                choices: [
                    { 
                        text: this.language === 'no' ? "Fortell meg hva som skjedde. Jeg er her for deg." : "Tell me what happened. I'm here for you.", 
                        effect: () => { 
                            this.adjustStat('happiness', 15); 
                            this.adjustStat('social', 10);
                            this.adjustRelationship(5);
                            this.memory.push({day: this.day, event: "Supported child", positive: true});
                            const msg = this.language === 'no' ? "Takk for at du hører. Jeg føler meg bedre når jeg snakker med deg om det." : "Thank you for listening. I feel better talking to you about it.";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Bare ignorer dem. Fokuser på vennene dine." : "Just ignore them. Focus on your friends.", 
                        effect: () => { 
                            this.adjustStat('happiness', 5); 
                            this.adjustRelationship(1);
                            const msg = this.language === 'no' ? "Jeg skal prøve... men det er vanskelig noen ganger." : "I'll try... but it's hard sometimes.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg vil hjelpe med husarbeid! Kan jeg hjelpe?" : "I want to help with chores around the house! Can I help?",
                message: this.language === 'no' ? "Barnet ditt vil være hjelpsomt!" : "Your child wants to be helpful!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Selvfølgelig! Det er veldig omtenksomt av deg." : "Of course! That's very thoughtful of you.", 
                        effect: () => { 
                            this.adjustStat('happiness', 15); 
                            this.adjustStat('learning', 5);
                            this.adjustRelationship(4);
                            this.memory.push({day: this.day, event: "Helped with chores", positive: true});
                            const msg = this.language === 'no' ? "Jippi! Jeg vil være hjelpsom! Hva kan jeg gjøre?" : "Yay! I want to be helpful! What can I do?";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Det er fint, men du trenger ikke." : "That's nice, but you don't have to.", 
                        effect: () => { 
                            this.adjustStat('happiness', 5); 
                            this.adjustRelationship(1);
                            const msg = this.language === 'no' ? "Men jeg vil hjelpe..." : "But I want to help...";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "Jeg er spent på et skoleprosjekt! Kan du hjelpe meg med det?" : "I'm excited about a school project! Can you help me with it?",
                message: this.language === 'no' ? "Akademisk entusiasme!" : "Academic enthusiasm!",
                choices: [
                    { 
                        text: this.language === 'no' ? "Absolutt! La oss jobbe sammen med det." : "Absolutely! Let's work on it together.", 
                        effect: () => { 
                            this.adjustStat('learning', 20); 
                            this.adjustStat('happiness', 15);
                            this.adjustRelationship(3);
                            const msg = this.language === 'no' ? "Dette er så gøy! Jeg lærer så mye med din hjelp!" : "This is so fun! I'm learning so much with your help!";
                            this.showDialogue(msg); 
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Du bør prøve å gjøre det selv først, men jeg kan hjelpe hvis du trenger det." : "You should try to do it yourself first, but I can help if needed.", 
                        effect: () => { 
                            this.adjustStat('learning', 10); 
                            this.adjustStat('happiness', 5);
                            this.adjustRelationship(1);
                            const msg = this.language === 'no' ? "Ok, jeg skal prøve mitt beste først!" : "Okay, I'll try my best first!";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.showDialogue(event.dialogue);
        this.showMessage(event.message);
        this.showChoices(event.choices);
    }
    
    checkAchievements() {
        const newAchievements = [];
        
        // First Helper - Helped someone for the first time
        if (this.child.helpingOthers >= 1 && !this.achievements.includes('first_helper')) {
            newAchievements.push({ id: 'first_helper', name: 'Første Hjelper', description: 'Du hjalp noen for første gang!', icon: '🦸' });
            this.achievements.push('first_helper');
        }
        
        // Hero - Helped 10 people
        if (this.child.helpingOthers >= 10 && !this.achievements.includes('hero')) {
            newAchievements.push({ id: 'hero', name: 'Helt', description: 'Du har hjulpet 10 personer!', icon: '⭐' });
            this.achievements.push('hero');
        }
        
        // Strong - High resilience
        if (this.child.resilience >= 80 && !this.achievements.includes('strong')) {
            newAchievements.push({ id: 'strong', name: 'Sterk', description: 'Du har høy motstandskraft!', icon: '💪' });
            this.achievements.push('strong');
        }
        
        // Scholar - High study level
        if (this.child.studyLevel >= 70 && !this.achievements.includes('scholar')) {
            newAchievements.push({ id: 'scholar', name: 'Lærd', description: 'Du har studert mye!', icon: '📚' });
            this.achievements.push('scholar');
        }
        
        // Good Choices - More good than bad choices
        if (this.child.goodChoices >= 10 && this.child.goodChoices > this.child.shortTermChoices && !this.achievements.includes('wise')) {
            newAchievements.push({ id: 'wise', name: 'Klok', description: 'Du tar gode valg!', icon: '🧠' });
            this.achievements.push('wise');
        }
        
        // Friend - High social
        if (this.child.social >= 80 && !this.achievements.includes('friend')) {
            newAchievements.push({ id: 'friend', name: 'Vennlig', description: 'Du er en god venn!', icon: '🤝' });
            this.achievements.push('friend');
        }
        
        // Emotion Master - Learned about emotions many times
        if (!this.child.emotionLessonsLearned) this.child.emotionLessonsLearned = 0;
        if (this.child.emotionLessonsLearned >= 5 && !this.achievements.includes('emotion_master')) {
            newAchievements.push({ id: 'emotion_master', name: 'Følelsesmester', description: 'Du har lært mye om følelser!', icon: '❤️' });
            this.achievements.push('emotion_master');
        }
        
        // Mindful - Practiced mindfulness many times
        if (!this.child.mindfulnessPractices) this.child.mindfulnessPractices = 0;
        if (this.child.mindfulnessPractices >= 10 && !this.achievements.includes('mindful')) {
            newAchievements.push({ id: 'mindful', name: 'Oppmerksom', description: 'Du har praktisert mindfulness mye!', icon: '🧘' });
            this.achievements.push('mindful');
        }
        
        // Artist - Created art many times
        if (!this.child.artCreated) this.child.artCreated = 0;
        if (this.child.artCreated >= 10 && !this.achievements.includes('artist')) {
            newAchievements.push({ id: 'artist', name: 'Kunstner', description: 'Du har laget mye kunst!', icon: '🎨' });
            this.achievements.push('artist');
        }
        
        // Quiz Master - Completed many emotion quizzes
        if (!this.child.quizzesCompleted) this.child.quizzesCompleted = 0;
        if (this.child.quizzesCompleted >= 5 && !this.achievements.includes('quiz_master')) {
            newAchievements.push({ id: 'quiz_master', name: 'Quizmester', description: 'Du har fullført mange følelses-quizer!', icon: '❓' });
            this.achievements.push('quiz_master');
        }
        
        // Growing Up - Reached age milestones
        if (this.child.age === 5 && !this.achievements.includes('big_kid')) {
            const name = this.language === 'no' ? 'Stor Gutt/Jente' : 'Big Kid';
            const desc = this.language === 'no' ? 'Du er 5 år gammel!' : 'You are 5 years old!';
            newAchievements.push({ id: 'big_kid', name: name, description: desc, icon: '🎂' });
            this.achievements.push('big_kid');
        }
        
        if (this.child.age === 10 && !this.achievements.includes('double_digits')) {
            const name = this.language === 'no' ? 'Ti år!' : 'Ten Years!';
            const desc = this.language === 'no' ? 'Du er nå 10 år gammel!' : 'You are now 10 years old!';
            newAchievements.push({ id: 'double_digits', name: name, description: desc, icon: '🎉' });
            this.achievements.push('double_digits');
        }
        
        // Chef - Cooked many meals
        if (!this.child.cookedMeals) this.child.cookedMeals = 0;
        if (this.child.cookedMeals >= 5 && !this.achievements.includes('chef')) {
            const name = this.language === 'no' ? 'Kokk' : 'Chef';
            const desc = this.language === 'no' ? 'Du har laget mange måltider!' : 'You have cooked many meals!';
            newAchievements.push({ id: 'chef', name: name, description: desc, icon: '🍳' });
            this.achievements.push('chef');
        }
        
        // Athlete - Completed many exercises
        if (!this.child.exercisesCompleted) this.child.exercisesCompleted = 0;
        if (this.child.exercisesCompleted >= 5 && !this.achievements.includes('athlete')) {
            const name = this.language === 'no' ? 'Utøver' : 'Athlete';
            const desc = this.language === 'no' ? 'Du har trent mye!' : 'You have exercised a lot!';
            newAchievements.push({ id: 'athlete', name: name, description: desc, icon: '🏃' });
            this.achievements.push('athlete');
        }
        
        // Nature Explorer - Explored nature many times
        if (!this.child.natureExplorations) this.child.natureExplorations = 0;
        if (this.child.natureExplorations >= 5 && !this.achievements.includes('nature_explorer')) {
            const name = this.language === 'no' ? 'Naturekspert' : 'Nature Explorer';
            const desc = this.language === 'no' ? 'Du har utforsket naturen mye!' : 'You have explored nature a lot!';
            newAchievements.push({ id: 'nature_explorer', name: name, description: desc, icon: '🌳' });
            this.achievements.push('nature_explorer');
        }
        
        // Student - Studied many subjects
        if (!this.child.subjectsStudied) this.child.subjectsStudied = {};
        const totalSubjects = Object.values(this.child.subjectsStudied).reduce((sum, count) => sum + count, 0);
        if (totalSubjects >= 10 && !this.achievements.includes('student')) {
            const name = this.language === 'no' ? 'Student' : 'Student';
            const desc = this.language === 'no' ? 'Du har studert mange fag!' : 'You have studied many subjects!';
            newAchievements.push({ id: 'student', name: name, description: desc, icon: '🎓' });
            this.achievements.push('student');
        }
        
        // Show new achievements
        newAchievements.forEach(achievement => {
            this.showAchievement(achievement);
        });
    }
    
    showAchievement(achievement) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.5s ease-out;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 10px;">${achievement.icon}</div>
            <div style="font-weight: bold; font-size: 1.2em; margin-bottom: 5px;">${achievement.name}</div>
            <div style="font-size: 0.9em; opacity: 0.9;">${achievement.description}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
        
        // Show in dialogue too
        const unlockMsg = this.language === 'no' ? 'Prestasjon oppnådd: ' : 'Achievement Unlocked: ';
        this.showDialogue(`🎉 ${achievement.name}! ${achievement.description}`);
        this.showMessage(unlockMsg + achievement.name + '!');
    }
    
    showHelp() {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            helpModal.style.display = 'block';
            this.updateHelpContent();
        } else {
            // Fallback to simple message if modal doesn't exist
            const helpMessages = this.language === 'no' ? [
                "💡 Tips: Fyll statsene regelmessig! Hunger går ned hver dag, så sørg for å fôre barnet.",
                "💡 Tips: Prøv ulike aktiviteter! Hver aktivitet gir læringsfakta og lærer barnet noe nytt.",
                "💡 Tips: Balanse er viktig! Mange aktiviteter gir læring, men husk også å la barnet hvile.",
                "💡 Tips: Når du går til neste dag, får du nye handlinger. Planlegg dagen din!",
                "💡 Tips: Hver aktivitet har læringsmomenter - se etter læringsfakta som dukker opp!",
                "💡 Tips: Prestasjoner låses opp når du gjør spesielle ting. Prøv å få alle!",
                "💡 Tips: Barnet vokser opp - nye aktiviteter låses opp når barnet blir eldre.",
                "💡 Tips: Skolefag gir ekstra læring. Prøv alle fagene for å lære mer!",
                "💡 Tips: Matlaging og trening lærer praktiske ferdigheter som måling og avstand.",
                "💡 Tips: Nature-aktiviteter lærer om miljø og insekter. Utforsk ofte!"
            ] : [
                "💡 Tip: Fill stats regularly! Hunger goes down every day, so make sure to feed the child.",
                "💡 Tip: Try different activities! Each activity gives learning facts and teaches the child something new.",
                "💡 Tip: Balance is important! Many activities give learning, but also remember to let the child rest.",
                "💡 Tip: When you go to the next day, you get new actions. Plan your day!",
                "💡 Tip: Each activity has learning moments - look for learning facts that appear!",
                "💡 Tip: Achievements unlock when you do special things. Try to get them all!",
                "💡 Tip: The child grows up - new activities unlock when the child gets older.",
                "💡 Tip: School subjects give extra learning. Try all subjects to learn more!",
                "💡 Tip: Cooking and exercise teach practical skills like measurement and distance.",
                "💡 Tip: Nature activities teach about environment and insects. Explore often!"
            ];
            
            const randomHelp = helpMessages[Math.floor(Math.random() * helpMessages.length)];
            this.showMessage(randomHelp);
        }
    }
    
    closeHelp() {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            helpModal.style.display = 'none';
        }
    }
    
    initMobileUX() {
        // Initialize swipe gestures for modals
        const modals = ['helpModal', 'profileModal', 'universeModal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                // Swipe down to close modal
                new SwipeDetector(modal, {
                    onSwipeDown: () => {
                        if (modalId === 'helpModal') {
                            this.closeHelp();
                        } else if (modalId === 'profileModal') {
                            this.closeProfile();
                        } else if (modalId === 'universeModal') {
                            this.closeUniverse();
                        }
                    },
                    threshold: 100, // Need to swipe at least 100px
                    restraint: 50 // Allow 50px perpendicular movement
                });
            }
        });
        
        // Add swipe gestures to scene area for navigation (optional)
        const sceneArea = document.querySelector('.scene-area');
        if (sceneArea && 'ontouchstart' in window) {
            const locationOrder = ['home', 'school', 'playground', 'friend', 'nature'];
            new SwipeDetector(sceneArea, {
                onSwipeLeft: () => {
                    const currentIndex = locationOrder.indexOf(this.currentLocation);
                    if (currentIndex < locationOrder.length - 1) {
                        this.goToLocation(locationOrder[currentIndex + 1]);
                    }
                },
                onSwipeRight: () => {
                    const currentIndex = locationOrder.indexOf(this.currentLocation);
                    if (currentIndex > 0) {
                        this.goToLocation(locationOrder[currentIndex - 1]);
                    }
                },
                threshold: 80,
                restraint: 80
            });
        }
        
        // Prevent pull-to-refresh on mobile (can interfere with swipe)
        let lastTouchY = 0;
        document.addEventListener('touchstart', (e) => {
            lastTouchY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const touchTarget = e.target;
            
            // Only prevent if swiping on modals or scene area
            if (touchTarget.closest('.modal') || touchTarget.closest('.scene-area')) {
                if (touchY > lastTouchY && window.scrollY === 0) {
                    e.preventDefault();
                }
            }
            lastTouchY = touchY;
        }, { passive: false });
    }
    
    updateHelpContent() {
        const helpContent = document.getElementById('helpContent');
        if (!helpContent) return;
        
        const isNorwegian = this.language === 'no';
        
        const helpData = {
            basics: {
                title: isNorwegian ? 'Grunnleggende' : 'Basics',
                items: [
                    { icon: '🍽️', text: isNorwegian ? 'Fôr barnet regelmessig - hunger synker hver dag' : 'Feed the child regularly - hunger decreases every day' },
                    { icon: '🛁', text: isNorwegian ? 'Bad barnet for hygiene og glede' : 'Bathe the child for hygiene and happiness' },
                    { icon: '😴', text: isNorwegian ? 'La barnet hvile for å få energi tilbake' : 'Let the child rest to regain energy' },
                    { icon: '⏰', text: isNorwegian ? 'Du har 5 handlinger per dag - planlegg nøye' : 'You have 5 actions per day - plan carefully' },
                    { icon: '💰', text: isNorwegian ? 'Jobb for å tjene penger til mat og ingredienser' : 'Work to earn money for food and ingredients' }
                ]
            },
            activities: {
                title: isNorwegian ? 'Aktiviteter' : 'Activities',
                items: [
                    { icon: '🏫', text: isNorwegian ? 'Skole: Les bøker, gjør oppgaver, ta prøver' : 'School: Read books, do assignments, take tests' },
                    { icon: '🎮', text: isNorwegian ? 'Lekegrind: Lek med venner og få sosial trening' : 'Playground: Play with friends and get social training' },
                    { icon: '🍳', text: isNorwegian ? 'Matlaging: Kjøp ingredienser og lag mat sammen' : 'Cooking: Buy ingredients and cook together' },
                    { icon: '🌳', text: isNorwegian ? 'Natur: Utforsk og lær om miljøet' : 'Nature: Explore and learn about the environment' },
                    { icon: '📚', text: isNorwegian ? 'Les bøker for læring og lykke' : 'Read books for learning and happiness' }
                ]
            },
            stats: {
                title: isNorwegian ? 'Statistikker' : 'Statistics',
                items: [
                    { icon: '😊', text: isNorwegian ? 'Happiness: Barnets lykke og velvære' : 'Happiness: Child\'s joy and well-being' },
                    { icon: '⚡', text: isNorwegian ? 'Energy: Nødvendig for aktiviteter' : 'Energy: Required for activities' },
                    { icon: '👥', text: isNorwegian ? 'Social: Sosial utvikling og vennskap' : 'Social: Social development and friendships' },
                    { icon: '📖', text: isNorwegian ? 'Learning: Kunnskap og utvikling' : 'Learning: Knowledge and development' },
                    { icon: '🍽️', text: isNorwegian ? 'Hunger: Må fylles regelmessig' : 'Hunger: Must be filled regularly' }
                ]
            },
            tips: {
                title: isNorwegian ? 'Tips og triks' : 'Tips & Tricks',
                items: [
                    { icon: '💡', text: isNorwegian ? 'Balanser aktiviteter - ikke bare læring, men også glede' : 'Balance activities - not just learning, but also joy' },
                    { icon: '💡', text: isNorwegian ? 'Prestasjoner låses opp når du gjør spesielle ting' : 'Achievements unlock when you do special things' },
                    { icon: '💡', text: isNorwegian ? 'Barnet vokser opp - nye aktiviteter låses opp med alder' : 'Child grows up - new activities unlock with age' },
                    { icon: '💡', text: isNorwegian ? 'Valg har konsekvenser - tenk på lang sikt' : 'Choices have consequences - think long-term' },
                    { icon: '💡', text: isNorwegian ? 'Spillet lagres automatisk hvert 30. sekund' : 'Game saves automatically every 30 seconds' }
                ]
            }
        };
        
        let html = '<div class="help-sections">';
        
        Object.entries(helpData).forEach(([key, section]) => {
            html += `
                <div class="help-section">
                    <h3>${section.title}</h3>
                    <ul class="help-list">
                        ${section.items.map(item => `
                            <li>
                                <span class="help-icon">${item.icon}</span>
                                <span class="help-text">${item.text}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
        
        html += '</div>';
        helpContent.innerHTML = html;
    }
    
    openProfile() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.style.display = 'block';
            
            // Update profile display
            this.updateProfileDisplay();
            
            // Load badges
            this.loadBadges();
            
            // Load shop items
            this.loadShopItems();
        }
    }
    
    closeProfile() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    updateProfileDisplay() {
        // Update avatar in profile
        const profileAvatar = document.getElementById('profileAvatar');
        const currentAvatar = document.querySelector('.child-avatar');
        if (profileAvatar && currentAvatar) {
            if (currentAvatar.querySelector('img')) {
                const img = currentAvatar.querySelector('img').cloneNode(true);
                profileAvatar.innerHTML = '';
                profileAvatar.appendChild(img);
            } else {
                profileAvatar.textContent = currentAvatar.textContent;
            }
        }
        
        // Update money
        const profileMoney = document.getElementById('profileMoney');
        if (profileMoney) {
            profileMoney.textContent = this.child.money || 0;
        }
        
        // Load bio
        const profileBio = document.getElementById('profileBio');
        if (profileBio) {
            profileBio.value = this.child.bio || '';
            profileBio.placeholder = this.t('messages.bioPlaceholder');
        }
        
        // Update profile modal texts
        const profileEditingTitle = document.getElementById('profileEditingTitle');
        if (profileEditingTitle) {
            profileEditingTitle.textContent = this.t('messages.profileEditing');
        }
        
        const currentAvatarText = document.getElementById('currentAvatarText');
        if (currentAvatarText) {
            currentAvatarText.textContent = this.t('messages.currentAvatar');
        }
        
        const chooseAvatarText = document.getElementById('chooseAvatarText');
        if (chooseAvatarText) {
            chooseAvatarText.textContent = this.t('messages.chooseAvatar');
        }
        
        const badgesTabBtn = document.getElementById('badgesTabBtn');
        if (badgesTabBtn) {
            badgesTabBtn.textContent = this.t('messages.badges');
        }
        
        const uploadTabBtn = document.getElementById('uploadTabBtn');
        if (uploadTabBtn) {
            uploadTabBtn.textContent = this.t('messages.upload');
        }
        
        const selectImageBtn = document.getElementById('selectImageBtn');
        if (selectImageBtn) {
            selectImageBtn.textContent = this.t('messages.selectImage');
        }
        
        const uploadImageHint = document.getElementById('uploadImageHint');
        if (uploadImageHint) {
            uploadImageHint.textContent = this.t('messages.uploadImageHint');
        }
        
        const aboutMeTitle = document.getElementById('aboutMeTitle');
        if (aboutMeTitle) {
            aboutMeTitle.textContent = this.t('messages.aboutMe');
        }
        
        const saveBioBtn = document.getElementById('saveBioBtn');
        if (saveBioBtn) {
            saveBioBtn.textContent = this.t('messages.saveBio');
        }
    }
    
    showAvatarTab(tab) {
        // Hide all tabs
        document.querySelectorAll('.avatar-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        if (tab === 'badges') {
            document.getElementById('badgesTab').classList.add('active');
            document.querySelectorAll('.tab-btn')[0].classList.add('active');
        } else {
            document.getElementById('uploadTab').classList.add('active');
            document.querySelectorAll('.tab-btn')[1].classList.add('active');
        }
    }
    
    loadBadges() {
        const badgesGrid = document.getElementById('badgesGrid');
        if (!badgesGrid) return;
        
        // Get earned achievements as badges
        const earnedBadges = this.achievements || [];
        
        // All available badges (from achievements)
        const allBadges = [
            { id: 'first_helper', emoji: '🦸', name: 'Hjelper' },
            { id: 'hero', emoji: '⭐', name: 'Helt' },
            { id: 'strong', emoji: '💪', name: 'Sterk' },
            { id: 'scholar', emoji: '📚', name: 'Lærd' },
            { id: 'wise', emoji: '🧠', name: 'Klok' },
            { id: 'friend', emoji: '🤝', name: 'Vennlig' },
            { id: 'emotion_master', emoji: '❤️', name: 'Følelsesmester' },
            { id: 'mindful', emoji: '🧘', name: 'Oppmerksom' },
            { id: 'artist', emoji: '🎨', name: 'Kunstner' },
            { id: 'quiz_master', emoji: '❓', name: 'Quizmester' },
            { id: 'big_kid', emoji: '🎂', name: 'Stor gutt/jente' },
            { id: 'double_digits', emoji: '🎉', name: 'Ti år' },
            { id: 'chef', emoji: '🍳', name: 'Kokk' },
            { id: 'athlete', emoji: '🏃', name: 'Utøver' },
            { id: 'nature_explorer', emoji: '🌳', name: 'Naturekspert' },
            { id: 'student', emoji: '🎓', name: 'Student' }
        ];
        
        badgesGrid.innerHTML = '';
        
        allBadges.forEach(badge => {
            const badgeDiv = document.createElement('div');
            badgeDiv.className = 'badge-option';
            if (earnedBadges.includes(badge.id)) {
                badgeDiv.classList.add('selected');
                badgeDiv.title = badge.name + ' (Earned!)';
            } else {
                badgeDiv.title = badge.name + ' (Not earned yet)';
                badgeDiv.style.opacity = '0.5';
            }
            badgeDiv.textContent = badge.emoji;
            badgeDiv.onclick = () => {
                if (earnedBadges.includes(badge.id)) {
                    this.selectBadge(badge.emoji);
                } else {
                    const msg = this.language === 'no' 
                        ? "Du må tjene denne badge først!" 
                        : "You must earn this badge first!";
                    this.showMessage(msg);
                }
            };
            badgesGrid.appendChild(badgeDiv);
        });
        
        // Add default emoji options
        const defaultEmojis = ['👶', '🧒', '👧', '👦', '👩', '👨', '🧑', '😊', '😄', '😎', '🤩', '🥳'];
        defaultEmojis.forEach(emoji => {
            const emojiDiv = document.createElement('div');
            emojiDiv.className = 'badge-option';
            emojiDiv.textContent = emoji;
            emojiDiv.title = 'Velg emoji';
            emojiDiv.onclick = () => this.selectBadge(emoji);
            badgesGrid.appendChild(emojiDiv);
        });
    }
    
    selectBadge(badge) {
        // Update avatar
        const avatar = document.querySelector('.child-avatar');
        if (avatar) {
            avatar.innerHTML = badge;
            avatar.style.background = 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)';
        }
        
        // Update profile display
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.textContent = badge;
        }
        
        // Save to child
        this.child.customAvatar = badge;
        this.child.avatarType = 'badge';
        this.saveGame();
        
        this.showMessage("Avatar oppdatert!");
    }
    
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas to resize image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const size = 200; // Avatar size
                    canvas.width = size;
                    canvas.height = size;
                    
                    // Draw image centered
                    ctx.drawImage(img, 0, 0, size, size);
                    
                    // Convert to data URL
                    const dataUrl = canvas.toDataURL('image/png');
                    
                    // Update avatar
                    const avatar = document.querySelector('.child-avatar');
                    if (avatar) {
                        avatar.innerHTML = '';
                        const imgElement = document.createElement('img');
                        imgElement.src = dataUrl;
                        imgElement.style.width = '100%';
                        imgElement.style.height = '100%';
                        imgElement.style.borderRadius = '50%';
                        imgElement.style.objectFit = 'cover';
                        avatar.appendChild(imgElement);
                    }
                    
                    // Update profile display
                    const profileAvatar = document.getElementById('profileAvatar');
                    if (profileAvatar) {
                        profileAvatar.innerHTML = '';
                        const imgElement = document.createElement('img');
                        imgElement.src = dataUrl;
                        imgElement.style.width = '100%';
                        imgElement.style.height = '100%';
                        imgElement.style.borderRadius = '50%';
                        imgElement.style.objectFit = 'cover';
                        profileAvatar.appendChild(imgElement);
                    }
                    
                    // Save to child
                    this.child.customAvatar = dataUrl;
                    this.child.avatarType = 'upload';
                    this.saveGame();
                    
                    this.showMessage("Avatar opplastet!");
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            this.showMessage("Vennligst velg et bilde!");
        }
    }
    
    saveProfile() {
        const bio = document.getElementById('profileBio');
        if (bio) {
            this.child.bio = bio.value;
            this.saveGame();
            const savedMsg = this.language === 'no' 
                ? "✓ Bio lagret!" 
                : "✓ Bio saved!";
            this.showMessage(savedMsg);
        }
    }
    
    loadShopItems() {
        const shopItems = document.getElementById('shopItems');
        if (!shopItems) return;
        
        const items = [
            { id: 'hat', name: 'Lue', emoji: '🧢', price: 50 },
            { id: 'glasses', name: 'Briller', emoji: '👓', price: 75 },
            { id: 'watch', name: 'Klokke', emoji: '⌚', price: 100 },
            { id: 'backpack', name: 'Ryggsekk', emoji: '🎒', price: 150 },
            { id: 'toy', name: 'Leksak', emoji: '🧸', price: 200 },
            { id: 'book', name: 'Spesialbok', emoji: '📖', price: 250 },
            { id: 'camera', name: 'Kamera', emoji: '📷', price: 300 },
            { id: 'game', name: 'Spill', emoji: '🎮', price: 400 }
        ];
        
        shopItems.innerHTML = '';
        
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';
            
            const owned = this.child.ownedItems && this.child.ownedItems.includes(item.id);
            if (owned) {
                itemDiv.classList.add('owned');
            }
            
            itemDiv.innerHTML = `
                <div class="shop-item-icon">${item.emoji}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-price">${item.price} kr</div>
            `;
            
            itemDiv.onclick = () => {
                if (!owned) {
                    this.buyItem(item);
                } else {
                    this.showMessage("Du eier allerede dette!");
                }
            };
            
            shopItems.appendChild(itemDiv);
        });
    }
    
    buyItem(item) {
        if (this.child.money >= item.price) {
            this.child.money -= item.price;
            if (!this.child.ownedItems) {
                this.child.ownedItems = [];
            }
            this.child.ownedItems.push(item.id);
            
            // Update money display
            this.updateDisplay();
            this.updateProfileDisplay();
            this.loadShopItems();
            
            this.showMessage(`Du kjøpte ${item.name} for ${item.price} kr!`);
            this.saveGame();
        } else {
            this.showMessage(`Du har ikke nok penger! Du trenger ${item.price} kr, men har bare ${this.child.money} kr.`);
        }
    }
    
    // Universe system for interactive activities
    openUniverse(universeType) {
        if (!this.canPerformAction()) return;
        
        const modal = document.getElementById('universeModal');
        const title = document.getElementById('universeTitle');
        const content = document.getElementById('universeContent');
        
        if (!modal || !title || !content) return;
        
        modal.style.display = 'block';
        
        // Set title based on universe type
        const titles = {
            school: this.language === 'no' ? '🏫 Skole' : '🏫 School',
            playground: this.language === 'no' ? '🎮 Lekegrind' : '🎮 Playground',
            cooking: this.language === 'no' ? '🍳 Matlaging' : '🍳 Cooking',
            bath: this.language === 'no' ? '🛁 Badetid' : '🛁 Bath Time',
            reading: this.language === 'no' ? '📖 Les sammen' : '📖 Read Together',
            drawing: this.language === 'no' ? '🎨 Tegn og lag' : '🎨 Draw & Create'
        };
        title.textContent = titles[universeType] || 'Univers';
        
        // Open appropriate universe
        if (universeType === 'school') {
            this.openSchoolUniverse(content);
        } else if (universeType === 'playground') {
            this.openPlaygroundUniverse(content);
        } else if (universeType === 'cooking') {
            this.openCookingUniverse(content);
        } else if (universeType === 'bath') {
            this.openBathUniverse(content);
        } else if (universeType === 'reading') {
            this.openReadingUniverse(content);
        } else if (universeType === 'drawing') {
            this.openDrawingUniverse(content);
        }
    }
    
    closeUniverse() {
        const modal = document.getElementById('universeModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    openSchoolUniverse(content) {
        if (this.child.age < 6) {
            const youngMsg = this.language === 'no'
                ? "Jeg er for ung for skole ennå! Prøv igjen når jeg er 6 år."
                : "I'm too young for school yet! Try again when I'm 6 years old.";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${youngMsg}</p>`;
            return;
        }
        
        if (this.child.energy < 20) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt for skole akkurat nå. Jeg trenger mer energi!"
                : "I'm too tired for school right now. I need more energy!";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        const schoolContent = this.language === 'no' ? `
            <div style="padding: 20px;">
                <h3>Velkommen til skolen! 📚</h3>
                <p>Hva vil du gjøre i dag?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                    <button class="universe-btn" onclick="game.openSchoolBook()" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        📖 Les bøker
                    </button>
                    <button class="universe-btn" onclick="game.doSchoolAssignment()" style="padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        ✏️ Gjør oppgaver
                    </button>
                    <button class="universe-btn" onclick="game.takeSchoolTest()" style="padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        📝 Ta prøve
                    </button>
                    <button class="universe-btn" onclick="game.attendSchoolClass()" style="padding: 15px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🎓 Gå på time
                    </button>
                </div>
            </div>
        ` : `
            <div style="padding: 20px;">
                <h3>Welcome to school! 📚</h3>
                <p>What would you like to do today?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                    <button class="universe-btn" onclick="game.openSchoolBook()" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        📖 Read books
                    </button>
                    <button class="universe-btn" onclick="game.doSchoolAssignment()" style="padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        ✏️ Do assignments
                    </button>
                    <button class="universe-btn" onclick="game.takeSchoolTest()" style="padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        📝 Take test
                    </button>
                    <button class="universe-btn" onclick="game.attendSchoolClass()" style="padding: 15px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🎓 Attend class
                    </button>
                </div>
            </div>
        `;
        
        content.innerHTML = schoolContent;
    }
    
    openPlaygroundUniverse(content) {
        if (this.child.energy < 15) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt for å leke akkurat nå. Jeg trenger mer energi!"
                : "I'm too tired to play right now. I need more energy!";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        const playgroundContent = this.language === 'no' ? `
            <div style="padding: 20px;">
                <h3>Velkommen til lekegrinden! 🎮</h3>
                <p>Hva vil du gjøre?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                    <button class="universe-btn" onclick="game.playSwing()" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🎢 Huske
                    </button>
                    <button class="universe-btn" onclick="game.playSlide()" style="padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🛝 Sklie
                    </button>
                    <button class="universe-btn" onclick="game.playTag()" style="padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🏃 Leke tag
                    </button>
                    <button class="universe-btn" onclick="game.playBall()" style="padding: 15px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        ⚽ Spille ball
                    </button>
                </div>
            </div>
        ` : `
            <div style="padding: 20px;">
                <h3>Welcome to the playground! 🎮</h3>
                <p>What would you like to do?</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                    <button class="universe-btn" onclick="game.playSwing()" style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🎢 Swing
                    </button>
                    <button class="universe-btn" onclick="game.playSlide()" style="padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🛝 Slide
                    </button>
                    <button class="universe-btn" onclick="game.playTag()" style="padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        🏃 Play tag
                    </button>
                    <button class="universe-btn" onclick="game.playBall()" style="padding: 15px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1.1em;">
                        ⚽ Play ball
                    </button>
                </div>
            </div>
        `;
        
        content.innerHTML = playgroundContent;
    }
    
    openCookingUniverse(content) {
        if (this.child.age < 3) {
            const youngMsg = this.language === 'no'
                ? "Jeg er for ung til å lage mat... Men jeg kan se på!"
                : "I'm too young to cook... But I can watch!";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${youngMsg}</p>`;
            return;
        }
        
        if (this.child.energy < 15) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt til å lage mat akkurat nå..."
                : "I'm too tired to cook right now...";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        // Start cooking game with interactive interface
        this.startInteractiveCookingGame(content);
    }
    
    // School universe functions
    openSchoolBook() {
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        const books = this.language === 'no' ? [
            {
                title: "Matematikk for begynnere",
                subject: "Matematikk",
                facts: [
                    "1 + 1 = 2. Når vi legger sammen tall, får vi et større tall.",
                    "2 × 3 = 6. Multiplikasjon er raskt addisjon - vi legger samme tall flere ganger.",
                    "10 ÷ 2 = 5. Divisjon er det motsatte av multiplikasjon.",
                    "Et kvadrat har 4 like sider. Alle vinkler er 90 grader.",
                    "En sirkel har ingen hjørner. Alle punkter er like langt fra sentrum."
                ]
            },
            {
                title: "Naturfag - Planter og dyr",
                subject: "Naturfag",
                facts: [
                    "Planter trenger sollys, vann og næring for å vokse. Dette kalles fotosyntese.",
                    "Dyr kan være kjøttetere, planteetere eller altetere. Det avhenger av hva de spiser.",
                    "Vann går i en syklus: det fordamper fra havet, blir til skyer, og faller som regn.",
                    "Trær produserer oksygen som vi trenger for å puste. De er viktige for miljøet!",
                    "Insekter er de mest tallrike dyrene på jorden. Mange er viktige for pollinering."
                ]
            },
            {
                title: "Norsk - Språk og litteratur",
                subject: "Norsk",
                facts: [
                    "Et substantiv er et navneord, som 'bok', 'barn' eller 'skole'.",
                    "Et verb er et gjerningsord, som 'gå', 'lese' eller 'spille'.",
                    "En setning starter alltid med stor bokstav og slutter med punktum, spørsmålstegn eller utropstegn.",
                    "Rim er ord som slutter likt, som 'hus' og 'mus'.",
                    "Fortellinger har ofte en begynnelse, en midtdel og en slutt."
                ]
            },
            {
                title: "Historie - 2000-tallet",
                subject: "Historie",
                facts: [
                    "I 2000 begynte det nye årtusenet. Mange trodde datamaskiner ville stoppe å fungere, men det skjedde ikke!",
                    "Internett ble mer og mer populært i 2000-tallet. Folk begynte å bruke e-post og chat.",
                    "Mobiltelefoner ble vanligere. Mange hadde Nokia-telefoner med spill som Snake.",
                    "Musikk ble digital med MP3-spillere. Folk kunne ha tusenvis av sanger i lommen!",
                    "2000-tallet var en tid med store endringer i teknologi og samfunn."
                ]
            }
        ] : [
            {
                title: "Math for Beginners",
                subject: "Math",
                facts: [
                    "1 + 1 = 2. When we add numbers, we get a larger number.",
                    "2 × 3 = 6. Multiplication is fast addition - we add the same number multiple times.",
                    "10 ÷ 2 = 5. Division is the opposite of multiplication.",
                    "A square has 4 equal sides. All angles are 90 degrees.",
                    "A circle has no corners. All points are the same distance from the center."
                ]
            },
            {
                title: "Science - Plants and Animals",
                subject: "Science",
                facts: [
                    "Plants need sunlight, water, and nutrients to grow. This is called photosynthesis.",
                    "Animals can be carnivores, herbivores, or omnivores. It depends on what they eat.",
                    "Water goes in a cycle: it evaporates from the ocean, becomes clouds, and falls as rain.",
                    "Trees produce oxygen that we need to breathe. They are important for the environment!",
                    "Insects are the most numerous animals on Earth. Many are important for pollination."
                ]
            }
        ];
        
        const selectedBook = books[Math.floor(Math.random() * books.length)];
        const randomFact = selectedBook.facts[Math.floor(Math.random() * selectedBook.facts.length)];
        
        const bookContent = this.language === 'no' ? `
            <div style="padding: 20px;">
                <h3>📖 ${selectedBook.title}</h3>
                <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #667eea;">
                    <h4>Fakta fra boken:</h4>
                    <p style="font-size: 1.1em; line-height: 1.6;">${randomFact}</p>
                </div>
                <button class="universe-btn" onclick="game.openSchoolBook()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    📖 Les mer
                </button>
                <button class="universe-btn" onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ← Tilbake
                </button>
            </div>
        ` : `
            <div style="padding: 20px;">
                <h3>📖 ${selectedBook.title}</h3>
                <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #667eea;">
                    <h4>Fact from the book:</h4>
                    <p style="font-size: 1.1em; line-height: 1.6;">${randomFact}</p>
                </div>
                <button class="universe-btn" onclick="game.openSchoolBook()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    📖 Read more
                </button>
                <button class="universe-btn" onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ← Back
                </button>
            </div>
        `;
        
        content.innerHTML = bookContent;
        
        // Update stats
        this.adjustStat('learning', 15);
        this.adjustStat('energy', -5);
        this.setEmotion('curious', 10);
    }
    
    doSchoolAssignment() {
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        if (this.child.energy < 20) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt for å gjøre lekser akkurat nå..."
                : "I'm too tired to do homework right now...";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        const assignments = this.language === 'no' ? [
            { question: "Hva er 5 + 7?", answer: "12", subject: "Matematikk" },
            { question: "Hva er hovedstaden i Norge?", answer: "Oslo", subject: "Geografi" },
            { question: "Hvor mange dager er det i en uke?", answer: "7", subject: "Generelt" },
            { question: "Hva er 3 × 4?", answer: "12", subject: "Matematikk" },
            { question: "Hvilket dyr sier 'mjau'?", answer: "Katt", subject: "Naturfag" },
            { question: "Hva er 10 - 4?", answer: "6", subject: "Matematikk" },
            { question: "Hvor mange måneder er det i et år?", answer: "12", subject: "Generelt" },
            { question: "Hvilken farge får vi når vi blander rødt og blått?", answer: "Lilla", subject: "Kunst" },
            { question: "Hva er 2 × 5?", answer: "10", subject: "Matematikk" },
            { question: "Hvilket dyr er kjent for å være 'kongens av jungelen'?", answer: "Løve", subject: "Naturfag" },
            { question: "Hva er 8 + 3?", answer: "11", subject: "Matematikk" },
            { question: "Hvor mange fingre har en hånd?", answer: "5", subject: "Generelt" }
        ] : [
            { question: "What is 5 + 7?", answer: "12", subject: "Math" },
            { question: "What is the capital of Norway?", answer: "Oslo", subject: "Geography" },
            { question: "How many days are in a week?", answer: "7", subject: "General" },
            { question: "What is 3 × 4?", answer: "12", subject: "Math" },
            { question: "Which animal says 'meow'?", answer: "Cat", subject: "Science" },
            { question: "What is 10 - 4?", answer: "6", subject: "Math" },
            { question: "How many months are in a year?", answer: "12", subject: "General" },
            { question: "What color do we get when mixing red and blue?", answer: "Purple", subject: "Art" },
            { question: "What is 2 × 5?", answer: "10", subject: "Math" },
            { question: "Which animal is known as 'king of the jungle'?", answer: "Lion", subject: "Science" },
            { question: "What is 8 + 3?", answer: "11", subject: "Math" },
            { question: "How many fingers are on one hand?", answer: "5", subject: "General" }
        ];
        
        const assignment = assignments[Math.floor(Math.random() * assignments.length)];
        
        const assignmentContent = this.language === 'no' ? `
            <div style="padding: 20px;">
                <h3>✏️ Oppgave: ${assignment.subject}</h3>
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ffc107;">
                    <p style="font-size: 1.2em; font-weight: bold; margin-bottom: 15px;">${assignment.question}</p>
                    <input type="text" id="assignmentAnswer" placeholder="Skriv svaret her..." style="width: 100%; padding: 10px; font-size: 1.1em; border: 2px solid #667eea; border-radius: 5px; margin-bottom: 10px;">
                    <button onclick="game.checkAssignmentAnswer('${assignment.answer}')" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em; width: 100%;">
                        Sjekk svar
                    </button>
                </div>
                <button onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ← Tilbake
                </button>
            </div>
        ` : `
            <div style="padding: 20px;">
                <h3>✏️ Assignment: ${assignment.subject}</h3>
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #ffc107;">
                    <p style="font-size: 1.2em; font-weight: bold; margin-bottom: 15px;">${assignment.question}</p>
                    <input type="text" id="assignmentAnswer" placeholder="Type your answer here..." style="width: 100%; padding: 10px; font-size: 1.1em; border: 2px solid #667eea; border-radius: 5px; margin-bottom: 10px;">
                    <button onclick="game.checkAssignmentAnswer('${assignment.answer}')" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em; width: 100%;">
                        Check answer
                    </button>
                </div>
                <button onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ← Back
                </button>
            </div>
        `;
        
        content.innerHTML = assignmentContent;
    }
    
    checkAssignmentAnswer(correctAnswer) {
        const input = document.getElementById('assignmentAnswer');
        if (!input) return;
        
        const userAnswer = input.value.trim().toLowerCase();
        const correct = correctAnswer.toLowerCase();
        
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        if (userAnswer === correct) {
            this.adjustStat('learning', 25);
            this.adjustStat('happiness', 10);
            this.adjustStat('energy', -15);
            this.setEmotion('happy', 20);
            
            const successMsg = this.language === 'no'
                ? "Riktig! Bra jobbet! 🎉"
                : "Correct! Well done! 🎉";
            
            content.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h3 style="color: #28a745;">${successMsg}</h3>
                    <p style="font-size: 1.2em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +25 læring og +10 glede!' : 'You gained +25 learning and +10 happiness!'}</p>
                    <button onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ${this.language === 'no' ? '← Tilbake' : '← Back'}
                    </button>
                </div>
            `;
            
            this.performAction();
            this.advanceTime();
        } else {
            this.adjustStat('learning', 10);
            this.adjustStat('energy', -10);
            
            const wrongMsg = this.language === 'no'
                ? "Ikke helt riktig, men det er greit! Riktig svar er: " + correctAnswer
                : "Not quite right, but that's okay! The correct answer is: " + correctAnswer;
            
            content.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h3 style="color: #ffc107;">${wrongMsg}</h3>
                    <p style="font-size: 1.1em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +10 læring for å prøve!' : 'You gained +10 learning for trying!'}</p>
                    <button onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ${this.language === 'no' ? '← Tilbake' : '← Back'}
                    </button>
                </div>
            `;
        }
    }
    
    takeSchoolTest() {
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        if (this.child.energy < 25) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt for å ta en prøve akkurat nå..."
                : "I'm too tired to take a test right now...";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        const tests = this.language === 'no' ? [
            { q: "Hva er 8 + 9?", options: ["15", "16", "17", "18"], correct: 2 },
            { q: "Hvilken farge får vi når vi blander rødt og blått?", options: ["Grønn", "Lilla", "Gul", "Oransje"], correct: 1 },
            { q: "Hvor mange ben har en katt?", options: ["2", "3", "4", "6"], correct: 2 },
            { q: "Hva er hovedstaden i Norge?", options: ["Bergen", "Trondheim", "Oslo", "Stavanger"], correct: 2 },
            { q: "Hva er 6 × 3?", options: ["15", "16", "18", "20"], correct: 2 },
            { q: "Hvilket dyr lever i havet?", options: ["Hest", "Fisk", "Katt", "Hund"], correct: 1 },
            { q: "Hvor mange timer er det i en dag?", options: ["20", "22", "24", "26"], correct: 2 },
            { q: "Hva er 15 - 7?", options: ["6", "7", "8", "9"], correct: 2 },
            { q: "Hvilken sesong kommer etter vinter?", options: ["Sommer", "Høst", "Vår", "Vinter"], correct: 2 },
            { q: "Hva er 4 × 4?", options: ["14", "15", "16", "17"], correct: 2 }
        ] : [
            { q: "What is 8 + 9?", options: ["15", "16", "17", "18"], correct: 2 },
            { q: "What color do we get when mixing red and blue?", options: ["Green", "Purple", "Yellow", "Orange"], correct: 1 },
            { q: "How many legs does a cat have?", options: ["2", "3", "4", "6"], correct: 2 },
            { q: "What is the capital of Norway?", options: ["Bergen", "Trondheim", "Oslo", "Stavanger"], correct: 2 },
            { q: "What is 6 × 3?", options: ["15", "16", "18", "20"], correct: 2 },
            { q: "Which animal lives in the ocean?", options: ["Horse", "Fish", "Cat", "Dog"], correct: 1 },
            { q: "How many hours are in a day?", options: ["20", "22", "24", "26"], correct: 2 },
            { q: "What is 15 - 7?", options: ["6", "7", "8", "9"], correct: 2 },
            { q: "Which season comes after winter?", options: ["Summer", "Fall", "Spring", "Winter"], correct: 2 },
            { q: "What is 4 × 4?", options: ["14", "15", "16", "17"], correct: 2 }
        ];
        
        const test = tests[Math.floor(Math.random() * tests.length)];
        
        const testContent = this.language === 'no' ? `
            <div style="padding: 20px;">
                <h3>📝 Prøve</h3>
                <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #2196f3;">
                    <p style="font-size: 1.2em; font-weight: bold; margin-bottom: 15px;">${test.q}</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${test.options.map((opt, idx) => `
                            <button onclick="game.checkTestAnswer(${idx}, ${test.correct})" style="padding: 15px; background: white; border: 2px solid #2196f3; border-radius: 5px; cursor: pointer; font-size: 1.1em; text-align: left;">
                                ${String.fromCharCode(65 + idx)}. ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <button onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ← Tilbake
                </button>
            </div>
        ` : `
            <div style="padding: 20px;">
                <h3>📝 Test</h3>
                <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid #2196f3;">
                    <p style="font-size: 1.2em; font-weight: bold; margin-bottom: 15px;">${test.q}</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${test.options.map((opt, idx) => `
                            <button onclick="game.checkTestAnswer(${idx}, ${test.correct})" style="padding: 15px; background: white; border: 2px solid #2196f3; border-radius: 5px; cursor: pointer; font-size: 1.1em; text-align: left;">
                                ${String.fromCharCode(65 + idx)}. ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <button onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ← Back
                </button>
            </div>
        `;
        
        content.innerHTML = testContent;
    }
    
    checkTestAnswer(selected, correct) {
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        if (selected === correct) {
            this.adjustStat('learning', 30);
            this.adjustStat('happiness', 15);
            this.adjustStat('energy', -20);
            this.setEmotion('happy', 25);
            this.child.studyLevel = Math.min(100, this.child.studyLevel + 5);
            
            const successMsg = this.language === 'no'
                ? "Perfekt! Du besto prøven! 🎉"
                : "Perfect! You passed the test! 🎉";
            
            content.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h3 style="color: #28a745;">${successMsg}</h3>
                    <p style="font-size: 1.2em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +30 læring, +15 glede og +5 studie-nivå!' : 'You gained +30 learning, +15 happiness and +5 study level!'}</p>
                    <button onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ${this.language === 'no' ? '← Tilbake' : '← Back'}
                    </button>
                </div>
            `;
            
            this.performAction();
            this.advanceTime();
        } else {
            this.adjustStat('learning', 15);
            this.adjustStat('energy', -15);
            
            const wrongMsg = this.language === 'no'
                ? "Ikke riktig denne gangen, men du lærte noe! Prøv igjen!"
                : "Not correct this time, but you learned something! Try again!";
            
            content.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h3 style="color: #ffc107;">${wrongMsg}</h3>
                    <p style="font-size: 1.1em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +15 læring for å prøve!' : 'You gained +15 learning for trying!'}</p>
                    <button onclick="game.takeSchoolTest()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                        ${this.language === 'no' ? 'Prøv igjen' : 'Try again'}
                    </button>
                    <button onclick="game.openSchoolUniverse(document.getElementById('universeContent'))" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ${this.language === 'no' ? '← Tilbake' : '← Back'}
                    </button>
                </div>
            `;
        }
    }
    
    attendSchoolClass() {
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        if (this.child.energy < 20) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt for å gå på time akkurat nå..."
                : "I'm too tired to attend class right now...";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        this.adjustStat('learning', 25);
        this.adjustStat('social', 15);
        this.adjustStat('energy', -20);
        this.setEmotion('curious', 15);
        
        const classMsg = this.language === 'no'
            ? "Time var interessant! Jeg lærte mye i dag."
            : "Class was interesting! I learned a lot today.";
        
        content.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>🎓 ${classMsg}</h3>
                <p style="font-size: 1.2em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +25 læring og +15 sosial!' : 'You gained +25 learning and +15 social!'}</p>
                <button onclick="game.closeUniverse(); game.performAction(); game.advanceTime();" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ${this.language === 'no' ? 'Lukk' : 'Close'}
                </button>
            </div>
        `;
    }
    
    // Playground universe functions
    playSwing() {
        this.completePlaygroundActivity('swing', this.language === 'no' ? 'Huske' : 'Swing', 15, 10);
    }
    
    playSlide() {
        this.completePlaygroundActivity('slide', this.language === 'no' ? 'Sklie' : 'Slide', 12, 8);
    }
    
    playTag() {
        this.completePlaygroundActivity('tag', this.language === 'no' ? 'Leke tag' : 'Play tag', 20, 15);
    }
    
    playBall() {
        this.completePlaygroundActivity('ball', this.language === 'no' ? 'Spille ball' : 'Play ball', 18, 12);
    }
    
    completePlaygroundActivity(activity, name, energyCost, happinessGain) {
        const content = document.getElementById('universeContent');
        if (!content) return;
        
        if (this.child.energy < energyCost) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er for trøtt for å " + name.toLowerCase() + " akkurat nå..."
                : "I'm too tired to " + name.toLowerCase() + " right now...";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${tiredMsg}</p>`;
            return;
        }
        
        this.adjustStat('happiness', happinessGain);
        this.adjustStat('social', 10);
        this.adjustStat('energy', -energyCost);
        this.setEmotion('happy', 20);
        
        const playMsg = this.language === 'no'
            ? name + " var gøy! Jeg hadde det kjempebra!"
            : name + " was fun! I had a great time!";
        
        content.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>🎮 ${playMsg}</h3>
                <p style="font-size: 1.2em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +' + happinessGain + ' glede og +10 sosial!' : 'You gained +' + happinessGain + ' happiness and +10 social!'}</p>
                <button onclick="game.closeUniverse(); game.performAction(); game.advanceTime();" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ${this.language === 'no' ? 'Lukk' : 'Close'}
                </button>
            </div>
        `;
    }
    
    // Cooking universe functions
    startInteractiveCookingGame(content) {
        const recipes = this.language === 'no' ? [
            {
                name: "Pannekaker",
                ingredients: [
                    { name: "Mel", amount: 2, unit: "dl", emoji: "🌾" },
                    { name: "Melk", amount: 4, unit: "dl", emoji: "🥛" },
                    { name: "Egg", amount: 2, unit: "stk", emoji: "🥚" },
                    { name: "Salt", amount: 0.5, unit: "ts", emoji: "🧂" }
                ],
                cost: 25
            },
            {
                name: "Kaker",
                ingredients: [
                    { name: "Smør", amount: 100, unit: "g", emoji: "🧈" },
                    { name: "Sukker", amount: 1.5, unit: "dl", emoji: "🍬" },
                    { name: "Mel", amount: 3, unit: "dl", emoji: "🌾" },
                    { name: "Egg", amount: 2, unit: "stk", emoji: "🥚" }
                ],
                cost: 30
            },
            {
                name: "Vafler",
                ingredients: [
                    { name: "Mel", amount: 3, unit: "dl", emoji: "🌾" },
                    { name: "Melk", amount: 5, unit: "dl", emoji: "🥛" },
                    { name: "Egg", amount: 3, unit: "stk", emoji: "🥚" },
                    { name: "Smør", amount: 50, unit: "g", emoji: "🧈" }
                ],
                cost: 35
            },
            {
                name: "Gulrotkake",
                ingredients: [
                    { name: "Gulrot", amount: 3, unit: "stk", emoji: "🥕" },
                    { name: "Mel", amount: 2.5, unit: "dl", emoji: "🌾" },
                    { name: "Sukker", amount: 1, unit: "dl", emoji: "🍬" },
                    { name: "Egg", amount: 2, unit: "stk", emoji: "🥚" },
                    { name: "Smør", amount: 75, unit: "g", emoji: "🧈" }
                ],
                cost: 40
            },
            {
                name: "Smoothie",
                ingredients: [
                    { name: "Banan", amount: 2, unit: "stk", emoji: "🍌" },
                    { name: "Jordbær", amount: 10, unit: "stk", emoji: "🍓" },
                    { name: "Melk", amount: 2, unit: "dl", emoji: "🥛" },
                    { name: "Yoghurt", amount: 1, unit: "dl", emoji: "🥄" }
                ],
                cost: 30
            }
        ] : [
            {
                name: "Pancakes",
                ingredients: [
                    { name: "Flour", amount: 2, unit: "dl", emoji: "🌾" },
                    { name: "Milk", amount: 4, unit: "dl", emoji: "🥛" },
                    { name: "Eggs", amount: 2, unit: "pcs", emoji: "🥚" },
                    { name: "Salt", amount: 0.5, unit: "tsp", emoji: "🧂" }
                ],
                cost: 25
            },
            {
                name: "Cakes",
                ingredients: [
                    { name: "Butter", amount: 100, unit: "g", emoji: "🧈" },
                    { name: "Sugar", amount: 1.5, unit: "dl", emoji: "🍬" },
                    { name: "Flour", amount: 3, unit: "dl", emoji: "🌾" },
                    { name: "Eggs", amount: 2, unit: "pcs", emoji: "🥚" }
                ],
                cost: 30
            },
            {
                name: "Waffles",
                ingredients: [
                    { name: "Flour", amount: 3, unit: "dl", emoji: "🌾" },
                    { name: "Milk", amount: 5, unit: "dl", emoji: "🥛" },
                    { name: "Eggs", amount: 3, unit: "pcs", emoji: "🥚" },
                    { name: "Butter", amount: 50, unit: "g", emoji: "🧈" }
                ],
                cost: 35
            },
            {
                name: "Carrot Cake",
                ingredients: [
                    { name: "Carrots", amount: 3, unit: "pcs", emoji: "🥕" },
                    { name: "Flour", amount: 2.5, unit: "dl", emoji: "🌾" },
                    { name: "Sugar", amount: 1, unit: "dl", emoji: "🍬" },
                    { name: "Eggs", amount: 2, unit: "pcs", emoji: "🥚" },
                    { name: "Butter", amount: 75, unit: "g", emoji: "🧈" }
                ],
                cost: 40
            },
            {
                name: "Smoothie",
                ingredients: [
                    { name: "Banana", amount: 2, unit: "pcs", emoji: "🍌" },
                    { name: "Strawberries", amount: 10, unit: "pcs", emoji: "🍓" },
                    { name: "Milk", amount: 2, unit: "dl", emoji: "🥛" },
                    { name: "Yogurt", amount: 1, unit: "dl", emoji: "🥄" }
                ],
                cost: 30
            }
        ];
        
        const recipe = recipes[Math.floor(Math.random() * recipes.length)];
        
        if (this.child.money < recipe.cost) {
            const noMoneyMsg = this.language === 'no'
                ? "Vi har ikke nok penger for ingrediensene... Vi trenger " + recipe.cost + " kroner, men har bare " + this.child.money + " kroner."
                : "We don't have enough money for the ingredients... We need " + recipe.cost + " kroner, but only have " + this.child.money + " kroner.";
            content.innerHTML = `<p style="padding: 20px; text-align: center;">${noMoneyMsg}</p>`;
            return;
        }
        
        // Show recipe and ingredient selection
        let selectedIngredients = [];
        
        const cookingContent = this.language === 'no' ? `
            <div style="padding: 20px;">
                <h3>🍳 ${recipe.name}</h3>
                <p style="margin-bottom: 20px;">Velg ingredienser for å lage ${recipe.name}:</p>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #ffc107;">
                    <h4>Oppskrift:</h4>
                    <ul id="recipeList" style="list-style: none; padding: 0;">
                        ${recipe.ingredients.map(ing => `
                            <li style="padding: 10px; margin: 5px 0; background: white; border-radius: 5px; display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 1.5em;">${ing.emoji}</span>
                                <span>${ing.amount} ${ing.unit} ${ing.name}</span>
                                <button onclick="game.addIngredient('${ing.name}', ${ing.amount}, '${ing.unit}', '${ing.emoji}')" style="margin-left: auto; padding: 5px 15px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                    Legg til
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div id="selectedIngredients" style="background: #d4edda; padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #28a745; min-height: 50px;">
                    <h4>Valgte ingredienser:</h4>
                    <div id="ingredientList" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;"></div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="game.cookRecipe('${recipe.name}', ${recipe.cost})" id="cookBtn" style="padding: 15px 30px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em; flex: 1;" disabled>
                        🍳 Lag mat (${recipe.cost} kr)
                    </button>
                    <button onclick="game.openCookingUniverse(document.getElementById('universeContent'))" style="padding: 15px 30px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ← Tilbake
                    </button>
                </div>
            </div>
        ` : `
            <div style="padding: 20px;">
                <h3>🍳 ${recipe.name}</h3>
                <p style="margin-bottom: 20px;">Select ingredients to make ${recipe.name}:</p>
                
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #ffc107;">
                    <h4>Recipe:</h4>
                    <ul id="recipeList" style="list-style: none; padding: 0;">
                        ${recipe.ingredients.map(ing => `
                            <li style="padding: 10px; margin: 5px 0; background: white; border-radius: 5px; display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 1.5em;">${ing.emoji}</span>
                                <span>${ing.amount} ${ing.unit} ${ing.name}</span>
                                <button onclick="game.addIngredient('${ing.name}', ${ing.amount}, '${ing.unit}', '${ing.emoji}')" style="margin-left: auto; padding: 5px 15px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                    Add
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div id="selectedIngredients" style="background: #d4edda; padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #28a745; min-height: 50px;">
                    <h4>Selected ingredients:</h4>
                    <div id="ingredientList" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;"></div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="game.cookRecipe('${recipe.name}', ${recipe.cost})" id="cookBtn" style="padding: 15px 30px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1em; flex: 1;" disabled>
                        🍳 Cook (${recipe.cost} kr)
                    </button>
                    <button onclick="game.openCookingUniverse(document.getElementById('universeContent'))" style="padding: 15px 30px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ← Back
                    </button>
                </div>
            </div>
        `;
        
        content.innerHTML = cookingContent;
        
        // Store recipe data globally for ingredient tracking
        this.currentRecipe = recipe;
        this.selectedIngredients = [];
    }
    
    addIngredient(name, amount, unit, emoji) {
        if (!this.selectedIngredients) {
            this.selectedIngredients = [];
        }
        
        this.selectedIngredients.push({ name, amount, unit, emoji });
        
        const ingredientList = document.getElementById('ingredientList');
        if (ingredientList) {
            ingredientList.innerHTML = this.selectedIngredients.map((ing, idx) => `
                <div style="background: white; padding: 10px; border-radius: 5px; display: flex; align-items: center; gap: 5px; border: 2px solid #28a745;">
                    <span style="font-size: 1.2em;">${ing.emoji}</span>
                    <span>${ing.amount} ${ing.unit} ${ing.name}</span>
                    <button onclick="game.removeIngredient(${idx})" style="margin-left: 5px; padding: 2px 8px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 0.9em;">
                        ×
                    </button>
                </div>
            `).join('');
        }
        
        // Enable cook button if all ingredients are selected
        const cookBtn = document.getElementById('cookBtn');
        if (cookBtn && this.currentRecipe) {
            if (this.selectedIngredients.length === this.currentRecipe.ingredients.length) {
                cookBtn.disabled = false;
            }
        }
    }
    
    removeIngredient(index) {
        if (this.selectedIngredients && this.selectedIngredients[index]) {
            this.selectedIngredients.splice(index, 1);
            
            const ingredientList = document.getElementById('ingredientList');
            if (ingredientList) {
                ingredientList.innerHTML = this.selectedIngredients.map((ing, idx) => `
                    <div style="background: white; padding: 10px; border-radius: 5px; display: flex; align-items: center; gap: 5px; border: 2px solid #28a745;">
                        <span style="font-size: 1.2em;">${ing.emoji}</span>
                        <span>${ing.amount} ${ing.unit} ${ing.name}</span>
                        <button onclick="game.removeIngredient(${idx})" style="margin-left: 5px; padding: 2px 8px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 0.9em;">
                            ×
                        </button>
                    </div>
                `).join('');
            }
            
            // Disable cook button if not all ingredients selected
            const cookBtn = document.getElementById('cookBtn');
            if (cookBtn) {
                cookBtn.disabled = this.selectedIngredients.length !== this.currentRecipe.ingredients.length;
            }
        }
    }
    
    cookRecipe(recipeName, cost) {
        if (this.child.money < cost) {
            const noMoneyMsg = this.language === 'no'
                ? "Vi har ikke nok penger!"
                : "We don't have enough money!";
            alert(noMoneyMsg);
            return;
        }
        
        if (!this.selectedIngredients || this.selectedIngredients.length !== this.currentRecipe.ingredients.length) {
            const incompleteMsg = this.language === 'no'
                ? "Du må velge alle ingrediensene først!"
                : "You must select all ingredients first!";
            alert(incompleteMsg);
            return;
        }
        
        // Deduct money
        this.child.money -= cost;
        
        // Update stats
        this.adjustStat('happiness', 25);
        this.adjustStat('learning', 20);
        this.adjustStat('energy', -15);
        this.setEmotion('happy', 30);
        this.adjustRelationship(5);
        
        if (!this.child.cookedMeals) this.child.cookedMeals = 0;
        this.child.cookedMeals++;
        this.checkAchievements();
        
        const content = document.getElementById('universeContent');
        if (content) {
            const successMsg = this.language === 'no'
                ? `Fantastisk! Du lagde ${recipeName}! 🎉`
                : `Fantastic! You made ${recipeName}! 🎉`;
            
            content.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h3 style="color: #28a745;">${successMsg}</h3>
                    <p style="font-size: 1.2em; margin: 20px 0;">${this.language === 'no' ? 'Du fikk +25 glede, +20 læring!' : 'You gained +25 happiness, +20 learning!'}</p>
                    <button onclick="game.closeUniverse(); game.performAction(); game.advanceTime();" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ${this.language === 'no' ? 'Lukk' : 'Close'}
                    </button>
                </div>
            `;
        }
        
        this.updateDisplay();
        this.saveGame();
    }
}

// Initialize game
const game = new MyChildGame();
