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
            money: 0, // Money earned through work
            careerProgress: 0, // Career development (0-100)
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
            ownedItems: savedGame && savedGame.child && savedGame.child.ownedItems ? savedGame.child.ownedItems : []
        };
        
        this.day = savedGame ? savedGame.day : 1;
        this.year = savedGame ? savedGame.year : 2000;
        this.timeOfDay = savedGame ? savedGame.timeOfDay : 0;
        this.timeNames = ["Morning", "Afternoon", "Evening", "Night"];
        this.currentLocation = savedGame ? savedGame.currentLocation : "home";
        this.pendingEvent = savedGame ? savedGame.pendingEvent : null;
        this.dialogueQueue = savedGame ? savedGame.dialogueQueue : [];
        this.actionsToday = savedGame ? savedGame.actionsToday : 0;
        this.maxActionsPerDay = 6; // Like original - limited actions per day
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
        
        // Initialize translations
        this.initTranslations();
        
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
            this.showSaveIndicator();
            console.log('Game saved successfully');
            return true;
        } catch (e) {
            console.error('Error saving game:', e);
            if (e.name === 'QuotaExceededError') {
                this.showMessage('⚠️ Lagringsfull - vennligst slett noen gamle spill');
            }
            return false;
        }
    }
    
    showSaveIndicator() {
        // Show save indicator briefly
        const saveIndicator = document.getElementById('saveIndicator');
        if (saveIndicator) {
            saveIndicator.textContent = '💾 Lagret';
            saveIndicator.style.opacity = '1';
            setTimeout(() => {
                saveIndicator.style.opacity = '0.5';
            }, 2000);
        }
    }
    
    deleteGame() {
        if (confirm('Er du sikker på at du vil slette dette spillet? Dette kan ikke angres!')) {
            try {
                localStorage.removeItem(`mychild_game_${this.username}`);
                localStorage.removeItem(`mychild_customization_${this.username}`);
                window.location.href = 'login.html';
            } catch (e) {
                console.error('Error deleting game:', e);
                alert('Kunne ikke slette spillet. Prøv igjen.');
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
                ageAppropriateDialogue = this.language === 'no' 
                    ? "Hei... Jeg er " + this.child.name + ". Å begynne på skolen i 2000-tallet er... vel, det kan være komplisert noen ganger. Men jeg vet at jeg er god nok akkurat som jeg er, og det er alle andre også."
                    : "Hi... I'm " + this.child.name + ". Starting school in the 2000s is... well, it's complicated sometimes. But I know I'm good enough just as I am, and so is everyone else.";
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
    
    initTranslations() {
        this.translations = {
            no: {
                timeNames: ["Morgen", "Ettermiddag", "Kveld", "Natt"],
                stats: {
                    happiness: "Lykke",
                    energy: "Energi",
                    social: "Sosial",
                    learning: "Læring",
                    hunger: "Sult"
                },
                activities: {
                    feed: "Fôr",
                    bathe: "Bad",
                    play: "Lek",
                    read: "Les",
                    mindfulness: "Mindfulness",
                    draw: "Tegn/Lag",
                    cook: "Lag mat",
                    daydream: "Drøm",
                    talk: "Snakk",
                    learnEmotions: "Lær følelser",
                    study: "Studer",
                    volunteer: "Frivillig",
                    help: "Hjelp andre",
                    exercise: "Trening",
                    quiz: "Følelses-quiz",
                    music: "Hør musikk",
                    call: "Ring venn",
                    playground: "Lekegrind",
                    nature: "Natur",
                    school: "Skole",
                    home: "Hjem",
                    friend: "Venns hus"
                },
                messages: {
                    welcome: "Velkommen! Ta vare på barnet ditt i 2000-tallet.",
                    saved: "Lagret",
                    actionsRemaining: "Handlinger igjen",
                    goToNextDay: "Gå til neste dag"
                }
            },
            en: {
                timeNames: ["Morning", "Afternoon", "Evening", "Night"],
                stats: {
                    happiness: "Happiness",
                    energy: "Energy",
                    social: "Social",
                    learning: "Learning",
                    hunger: "Hunger"
                },
                activities: {
                    feed: "Feed",
                    bathe: "Bathe",
                    play: "Play",
                    read: "Read",
                    mindfulness: "Mindfulness",
                    draw: "Draw/Create",
                    cook: "Cook Together",
                    daydream: "Daydream",
                    talk: "Talk",
                    learnEmotions: "Learn Emotions",
                    study: "Study Hard",
                    volunteer: "Volunteer",
                    help: "Help Others",
                    exercise: "Exercise",
                    quiz: "Emotion Quiz",
                    music: "Listen Music",
                    call: "Call Friend",
                    playground: "Playground",
                    nature: "Nature",
                    school: "School",
                    home: "Home",
                    friend: "Friend's House"
                },
                messages: {
                    welcome: "Welcome! Take care of your child in the 2000s.",
                    saved: "Saved",
                    actionsRemaining: "Actions remaining",
                    goToNextDay: "Go to next day"
                }
            }
        };
    }
    
    t(key, ...args) {
        // Translation helper - supports nested keys like 'stats.happiness'
        const keys = key.split('.');
        let translation = this.translations[this.language];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to Norwegian if translation not found
                translation = this.translations.no;
                for (const k2 of keys) {
                    if (translation && translation[k2]) {
                        translation = translation[k2];
                    } else {
                        return key; // Return key if not found
                    }
                }
                break;
            }
        }
        
        // If translation is a function, call it with args
        if (typeof translation === 'function') {
            return translation(...args);
        }
        
        // If translation is a string, format it
        if (typeof translation === 'string' && args.length > 0) {
            return translation.replace(/{(\d+)}/g, (match, index) => {
                return args[index] || match;
            });
        }
        
        return translation;
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
        
        // Update specific UI elements
        const yearLabel = document.querySelector('.year-display');
        if (yearLabel) {
            yearLabel.innerHTML = (this.language === 'no' ? 'År: ' : 'Year: ') + '<span id="currentYear">' + this.year + '</span>';
        }
    }
    
    getTranslation(key) {
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
        // Update Alex's current emotion based on emotional states
        const emotions = this.child.emotionalState;
        const maxEmotion = Object.entries(emotions).reduce((a, b) => emotions[a[0]] > emotions[b[1]] ? a : b);
        
        if (maxEmotion[1] > 30) {
            this.child.currentEmotion = maxEmotion[0];
        } else if (this.child.happiness < 30) {
            this.child.currentEmotion = 'sad';
        } else if (this.child.happiness > 70) {
            this.child.currentEmotion = 'happy';
        } else {
            this.child.currentEmotion = 'neutral';
        }
        
        // Emotional states naturally fade over time
        Object.keys(emotions).forEach(emotion => {
            if (emotions[emotion] > 0) {
                emotions[emotion] = Math.max(0, emotions[emotion] - 2);
            }
        });
    }
    
    setEmotion(emotion, intensity = 30) {
        if (this.child.emotionalState.hasOwnProperty(emotion)) {
            this.child.emotionalState[emotion] = Math.min(100, Math.max(0, 
                this.child.emotionalState[emotion] + intensity));
            this.updateEmotionalState();
            this.updateDisplay();
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
    }
    
    async updateScene() {
        const location = this.locations[this.currentLocation];
        const sceneImage = document.getElementById('sceneImage');
        const sceneName = document.getElementById('sceneName');
        
        sceneImage.style.background = `linear-gradient(135deg, ${location.color} 0%, ${location.color}dd 100%)`;
        
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
            img.src = location.image;
            img.alt = location.name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.onerror = () => {
                // If image fails to load, use placeholder
                this.locations[this.currentLocation].usePlaceholder = true;
                sceneImageElement.innerHTML = this.getPlaceholderSVG(this.currentLocation);
            };
            img.onload = () => {
                sceneImageElement.innerHTML = '';
                sceneImageElement.appendChild(img);
            };
            sceneImageElement.innerHTML = '';
            sceneImageElement.appendChild(img);
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
        if (actionInfo) {
            const remaining = this.maxActionsPerDay - this.actionsToday;
            actionInfo.textContent = `Actions: ${remaining}/${this.maxActionsPerDay}`;
            actionInfo.style.color = remaining < 2 ? '#f44336' : remaining < 3 ? '#ff9800' : '#28a745';
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
            this.showDialogue("I'm tired... Can we rest? It's been a long day.");
            this.showMessage("You've used all your actions for today. Go to the next day to continue.");
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
        
        this.adjustStat('happiness', 8);
        this.adjustStat('energy', -5);
        this.adjustRelationship(1);
        
        const messages = [
            "Bath time! I love playing in the water!",
            "This is so relaxing! I feel clean and fresh now.",
            "Bathing is fun! Can we do this again tomorrow?",
            "I feel so much better after a bath!"
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Occasionally add learning fact about hygiene and self-care
        if (Math.random() < 0.15) {
            const hygieneFacts = [
                "💡 Læringsfakta: Å ta vare på kroppen vår er viktig! Det hjelper oss å føle oss godt, både fysisk og mentalt.",
                "💡 Læringsfakta: Å ta bad eller dusj kan være avslappende. Varmt vann hjelper kroppen å slappe av, noe som også hjelper hjernen.",
                "💡 Læringsfakta: Selvpleie er en måte å vise respekt for oss selv. Vi fortjener å ta vare på oss selv!"
            ];
            setTimeout(() => this.showMessage(hygieneFacts[Math.floor(Math.random() * hygieneFacts.length)]), 1000);
        }
        
        this.showMessage("Bathing together - important daily care routine!");
        this.performAction();
        this.advanceTime();
    }
    
    playWithChild() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue("I'm too tired to play right now...");
            return;
        }
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
        
        this.adjustStat('learning', 15);
        this.adjustStat('happiness', 10);
        this.adjustStat('energy', -5);
        this.adjustRelationship(2);
        this.setEmotion('happy', 15);
        this.setEmotion('anxious', -10); // Reading helps calm anxiety
        
        let messages = [];
        if (this.child.age < 1) {
            messages = [
                "*looks at pictures with wide eyes*",
                "*listens quietly*",
                "*coos at the colorful pages*"
            ];
        } else if (this.child.age < 3) {
            messages = [
                "Pretty pictures!",
                "I like this book!",
                "More story please!"
            ];
        } else {
            messages = [
                "I love this story! Can you read another one?",
                "This book is so interesting! I'm learning so much!",
                "Reading together is so nice... It makes me forget about school.",
                "I want to learn to read like you! This is great!",
                "When we read, I can escape to other worlds... It helps."
            ];
        }
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Occasionally add learning fact about reading
        if (Math.random() < 0.2) {
            const readingFacts = [
                "💡 Læringsfakta: Når vi leser, aktiveres mange deler av hjernen vår samtidig! Det er som en treningsøkt for hjernen.",
                "💡 Læringsfakta: Å lese sammen med noen bygger bånd og hjelper med språkutvikling. Det er spesielt viktig for små barn!",
                "💡 Læringsfakta: Bøker kan hjelpe oss å forstå andre mennesker og situasjoner bedre. Det bygger empati!"
            ];
            setTimeout(() => this.showMessage(readingFacts[Math.floor(Math.random() * readingFacts.length)]), 1000);
        }
        
        this.showMessage("Reading together - great for learning and bonding!");
        this.performAction();
        this.advanceTime();
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
    
    drawOrCreate() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 8) {
            this.showDialogue("I'm too tired to be creative right now...");
            return;
        }
        
        this.adjustStat('happiness', 18);
        this.adjustStat('learning', 12);
        this.adjustStat('energy', -6);
        this.setEmotion('happy', 20);
        this.setEmotion('curious', 15);
        this.setEmotion('anxious', -12);
        this.setEmotion('sad', -10);
        this.child.resilience = Math.min(100, this.child.resilience + 3);
        this.adjustRelationship(2);
        
        let messages = [];
        if (this.child.age < 3) {
            messages = [
                "I'm drawing!",
                "Pretty colors!",
                "I like making art!"
            ];
        } else if (this.child.age < 7) {
            messages = [
                "I'm creating something new! This is fun!",
                "I love drawing and making things!",
                "Being creative makes me feel happy!",
                "I made something cool! Look!"
            ];
        } else {
            messages = [
                "Creating something with my hands... It helps me express how I feel.",
                "When I draw or create, I can show emotions I can't always put into words.",
                "Art is like a safe space where I can be me, without judgment.",
                "I love making things! It makes me feel proud and happy.",
                "Creating something new makes me feel like I can do anything!"
            ];
        }
        
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Occasionally add learning fact about creativity
        if (Math.random() < 0.3) {
            const creativityFacts = [
                "💡 Læringsfakta: Når vi er kreative, aktiveres hjernens høyre side. Dette hjelper oss å tenke på nye måter!",
                "💡 Læringsfakta: Kunst og kreativitet kan være en måte å uttrykke følelser på når ord ikke er nok.",
                "💡 Læringsfakta: Å være kreativ bygger selvtillit! Når vi lager noe, føler vi stolthet og glede."
            ];
            setTimeout(() => this.showMessage(creativityFacts[Math.floor(Math.random() * creativityFacts.length)]), 1000);
        }
        
        this.showMessage("Creating art helps " + this.child.name + " express " + (this.child.gender === 'girl' ? 'herself' : 'himself') + " and feel proud!");
        if (!this.child.artCreated) this.child.artCreated = 0;
        this.child.artCreated++;
        this.checkAchievements();
        this.performAction();
        this.advanceTime();
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
            this.showDialogue("I'm too young to cook... But I can watch!");
            return;
        }
        
        if (this.child.energy < 15) {
            this.showDialogue("I'm too tired to cook right now...");
            return;
        }
        
        // Start cooking minigame
        this.startCookingGame();
    }
    
    startCookingGame() {
        const recipes = [
            {
                name: "Pannekaker",
                ingredients: [
                    { name: "Mel", amount: 2, unit: "dl" },
                    { name: "Melk", amount: 4, unit: "dl" },
                    { name: "Egg", amount: 2, unit: "stk" },
                    { name: "Salt", amount: 0.5, unit: "ts" }
                ],
                conversion: {
                    question: "Hvor mange ml er 2 dl melk?",
                    answer: "200",
                    explanation: "1 dl = 100 ml, så 2 dl = 200 ml"
                }
            },
            {
                name: "Kaker",
                ingredients: [
                    { name: "Smør", amount: 100, unit: "g" },
                    { name: "Sukker", amount: 1.5, unit: "dl" },
                    { name: "Mel", amount: 3, unit: "dl" },
                    { name: "Egg", amount: 2, unit: "stk" }
                ],
                conversion: {
                    question: "Hvor mange dl er 500 ml?",
                    answer: "5",
                    explanation: "1 dl = 100 ml, så 500 ml = 5 dl"
                }
            },
            {
                name: "Vafler",
                ingredients: [
                    { name: "Mel", amount: 3, unit: "dl" },
                    { name: "Melk", amount: 5, unit: "dl" },
                    { name: "Egg", amount: 3, unit: "stk" },
                    { name: "Smør", amount: 50, unit: "g" }
                ],
                conversion: {
                    question: "Hvor mange ml er 3 dl?",
                    answer: "300",
                    explanation: "1 dl = 100 ml, så 3 dl = 300 ml"
                }
            }
        ];
        
        const recipe = recipes[Math.floor(Math.random() * recipes.length)];
        
        // Show ingredient list
        const ingredientLabel = this.language === 'no' ? "Ingredienser for " : "Ingredients for ";
        let ingredientList = ingredientLabel + recipe.name + ":\n";
        recipe.ingredients.forEach((ing, idx) => {
            ingredientList += `${idx + 1}. ${ing.amount} ${ing.unit} ${ing.name}\n`;
        });
        
        const cookDialogue = this.language === 'no'
            ? "La oss lage " + recipe.name + " sammen! " + ingredientList
            : "Let's make " + recipe.name + " together! " + ingredientList;
        this.showDialogue(cookDialogue);
        
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
        
        // Natural stat changes (like original game)
        this.adjustStat('energy', -5);
        this.adjustStat('hunger', -10); // Hunger decreases each day (important!)
        
        // Low hunger affects happiness
        if (this.child.hunger < 30) {
            this.adjustStat('happiness', -5);
            this.setEmotion('anxious', 5);
        }
        
        // Low happiness can affect other stats
        if (this.child.happiness < 20) {
            this.adjustStat('social', -2);
            this.adjustRelationship(-1);
            this.setEmotion('sad', 10);
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
            ? `Dag ${this.day} begynner! Tid for nye eventyr i 2000-tallet. Husk: ${this.child.name} er perfekt akkurat som ${this.child.gender === 'girl' ? 'hun' : 'han'} er, og det er alle andre også!`
            : `Day ${this.day} begins! Time for new adventures in the 2000s. Remember: ${this.child.name} is perfect just as ${this.child.gender === 'girl' ? 'she' : 'he'} is, and so is everyone else!`;
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
        // Bullying incidents happen at school (more likely if resilience is low)
        if (this.currentLocation === 'school' && Math.random() < 0.3) {
            const bullyingChance = this.child.resilience < 50 ? 0.4 : 0.2;
            if (Math.random() < bullyingChance) {
                this.triggerBullyingEvent();
                return;
            }
        }
        
        // Narrative events - more frequent if relationship is good
        const eventChance = this.relationship > 70 ? 0.6 : 0.4;
        if (Math.random() < eventChance) {
            this.triggerNarrativeEvent();
        }
    }
    
    triggerBullyingEvent() {
        this.bullyingIncidents++;
        const events = [
            {
                dialogue: "Some kids at school... they said mean things today. It hurt. But I know I'm good enough just as I am.",
                message: this.child.name + " experienced bullying at school, but remembers that " + (this.child.gender === 'girl' ? 'she' : 'he') + " is perfect just as " + (this.child.gender === 'girl' ? 'she' : 'he') + " is.",
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
                dialogue: "They pushed me today... I didn't know what to do.",
                message: "Physical bullying incident.",
                choices: [
                    { 
                        text: "Are you okay? We need to tell someone about this.", 
                        effect: () => { 
                            this.setEmotion('scared', 25);
                            this.setEmotion('sad', 20);
                            this.adjustStat('happiness', -15);
                            this.adjustStat('energy', -10);
                            this.adjustRelationship(6);
                            this.child.resilience = Math.min(100, this.child.resilience + 5);
                            this.memory.push({day: this.day, event: "Physical bullying - got help", positive: true});
                            this.showDialogue("I'm okay... Thank you for caring. I'm scared but I know you'll help me."); 
                        } 
                    },
                    { 
                        text: "You're brave. Stand up for yourself next time.", 
                        effect: () => { 
                            this.setEmotion('angry', 20);
                            this.setEmotion('scared', 15);
                            this.adjustStat('happiness', -10);
                            this.child.resilience = Math.min(100, this.child.resilience + 2);
                            this.showDialogue("I'll try... I want to be brave. But it's scary."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "Everyone laughed at me in class today... I wanted to disappear.",
                message: "Embarrassment and social bullying.",
                choices: [
                    { 
                        text: "I'm here for you. Those feelings are valid. Let's talk about it.", 
                        effect: () => { 
                            this.setEmotion('embarrassed', 30);
                            this.setEmotion('sad', 20);
                            this.adjustStat('happiness', -12);
                            this.adjustStat('social', -8);
                            this.adjustRelationship(4);
                            this.child.resilience = Math.min(100, this.child.resilience + 3);
                            this.copingActivities.push({day: this.day, activity: 'talk', helpful: true});
                            this.showDialogue("I feel so embarrassed... But talking to you helps. I don't feel so alone."); 
                        } 
                    },
                    { 
                        text: "Don't worry about what others think. You're special.", 
                        effect: () => { 
                            this.setEmotion('embarrassed', 20);
                            this.setEmotion('happy', 10);
                            this.adjustStat('happiness', -5);
                            this.child.resilience = Math.min(100, this.child.resilience + 2);
                            this.showDialogue("Thank you... I know you see me for who I am."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "I came back stronger today. I told them to stop, and they actually did.",
                message: "Alex stood up for themselves!",
                choices: [
                    { 
                        text: "I'm so proud of you! That took courage! You're perfect just as you are!", 
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
                            this.showDialogue("I did it! I can't believe it worked! I feel so much stronger now! You're right - I am good enough just as I am!"); 
                            this.saveGame();
                        } 
                    },
                    { 
                        text: "That's my brave child! You're learning to handle this.", 
                        effect: () => { 
                            this.setEmotion('happy', 20);
                            this.setEmotion('surprised', 10);
                            this.adjustStat('happiness', 15);
                            this.adjustStat('social', 8);
                            this.child.resilience = Math.min(100, this.child.resilience + 8);
                            this.showDialogue("I'm learning... I'm getting stronger. Thank you for believing in me."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "I pretended I didn't care, but I'm really hurt inside...",
                message: "Alex is hiding their feelings.",
                choices: [
                    { 
                        text: "It's okay to feel hurt. Your feelings matter. Let's talk.", 
                        effect: () => { 
                            this.setEmotion('sad', 25);
                            this.setEmotion('anxious', -15);
                            this.adjustStat('happiness', -8);
                            this.adjustRelationship(6);
                            this.child.resilience = Math.min(100, this.child.resilience + 4);
                            this.copingActivities.push({day: this.day, activity: 'talk', helpful: true});
                            this.showDialogue("Thank you... It's hard to show how I really feel. But with you, I can."); 
                        } 
                    },
                    { 
                        text: "You're strong. But you don't have to hide your feelings with me.", 
                        effect: () => { 
                            this.setEmotion('sad', 15);
                            this.adjustStat('happiness', -5);
                            this.adjustRelationship(4);
                            this.child.resilience = Math.min(100, this.child.resilience + 3);
                            this.showDialogue("I know... I'm just scared of being vulnerable. But I trust you."); 
                        } 
                    }
                ]
            }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.showNarrativeEvent(event);
    }
    
    triggerNarrativeEvent() {
        const events = [
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
                dialogue: "I want to learn how to use the computer! Can you teach me?",
                message: "Interest in 2000s technology!",
                choices: [
                    { text: "Absolutely! Let's explore the computer together.", effect: () => { this.adjustStat('learning', 20); this.adjustStat('happiness', 15); this.showDialogue("This is so cool! I love learning about computers!"); } },
                    { text: "Maybe later, we're busy right now.", effect: () => { this.adjustStat('learning', 3); this.showDialogue("I'll wait then..."); } }
                ]
            },
            {
                dialogue: "I made a new friend at school today! They're really nice!",
                message: "Positive social interaction!",
                choices: [
                    { text: "That's wonderful! Tell me about them.", effect: () => { this.adjustStat('social', 15); this.adjustStat('happiness', 10); this.showDialogue("They like the same games as me! We're going to play together!"); } },
                    { text: "That's nice. Make sure to be friendly.", effect: () => { this.adjustStat('social', 8); this.showDialogue("I will! They're really cool."); } }
                ]
            },
            {
                dialogue: "Can we go to the mall? Everyone at school goes there!",
                message: "2000s social activity request!",
                choices: [
                    { text: "Sure! Let's go this weekend.", effect: () => { this.adjustStat('social', 12); this.adjustStat('happiness', 15); this.showDialogue("Awesome! I can't wait! The mall is so cool in the 2000s!"); } },
                    { text: "Maybe another time, we have other plans.", effect: () => { this.adjustStat('happiness', -5); this.showDialogue("Oh... okay. Maybe next time?"); } }
                ]
            },
            {
                dialogue: "I'm feeling a bit lonely today... Can we spend more time together?",
                message: "Alex needs attention and comfort.",
                choices: [
                    { 
                        text: "Of course! Let's do something fun together.", 
                        effect: () => { 
                            this.adjustStat('happiness', 20); 
                            this.adjustStat('social', 10); 
                            this.setEmotion('happy', 20);
                            this.setEmotion('sad', -15);
                            this.setEmotion('anxious', -10);
                            this.adjustRelationship(4);
                            this.showDialogue("Thank you! I feel so much better now! Being with you makes everything okay."); 
                        } 
                    },
                    { 
                        text: "I understand, but we're busy right now.", 
                        effect: () => { 
                            this.adjustStat('happiness', -10); 
                            this.setEmotion('sad', 15);
                            this.showDialogue("Oh... okay. I'll wait."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "I found a quiet spot in the library today. It was peaceful there...",
                message: "Alex found a safe space.",
                choices: [
                    { 
                        text: "That sounds wonderful! Finding places that make you feel safe is important.", 
                        effect: () => { 
                            this.adjustStat('happiness', 15); 
                            this.setEmotion('happy', 15);
                            this.setEmotion('anxious', -15);
                            this.child.resilience = Math.min(100, this.child.resilience + 3);
                            this.memory.push({day: this.day, event: "Found safe space", positive: true});
                            this.showDialogue("It was... I felt like I could breathe there. Maybe I can go back?"); 
                        } 
                    },
                    { 
                        text: "That's nice. Libraries are peaceful places.", 
                        effect: () => { 
                            this.adjustStat('happiness', 8); 
                            this.setEmotion('happy', 10);
                            this.showDialogue("Yes... It was nice to be somewhere quiet."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "Someone at school was nice to me today... It surprised me.",
                message: "Positive social interaction!",
                choices: [
                    { 
                        text: "That's wonderful! Tell me about it.", 
                        effect: () => { 
                            this.adjustStat('happiness', 20); 
                            this.adjustStat('social', 15); 
                            this.setEmotion('happy', 25);
                            this.setEmotion('surprised', 15);
                            this.setEmotion('sad', -10);
                            this.child.resilience = Math.min(100, this.child.resilience + 5);
                            this.memory.push({day: this.day, event: "Someone was kind", positive: true});
                            this.showDialogue("They just... talked to me normally. Like I mattered. It felt so good!"); 
                        } 
                    },
                    { 
                        text: "That's nice. People can surprise you.", 
                        effect: () => { 
                            this.adjustStat('happiness', 12); 
                            this.adjustStat('social', 8); 
                            this.setEmotion('happy', 15);
                            this.showDialogue("Yes... Maybe not everyone is mean?"); 
                        } 
                    }
                ]
            },
            {
                dialogue: "I wrote in my journal today... It helped me process my feelings.",
                message: "Alex is finding healthy ways to cope.",
                choices: [
                    { 
                        text: "That's a great way to express yourself! Writing can be very healing.", 
                        effect: () => { 
                            this.adjustStat('happiness', 15); 
                            this.setEmotion('happy', 15);
                            this.setEmotion('anxious', -15);
                            this.setEmotion('sad', -10);
                            this.child.resilience = Math.min(100, this.child.resilience + 4);
                            this.copingActivities.push({day: this.day, activity: 'journal', helpful: true});
                            this.showDialogue("It really does help... Getting my thoughts on paper makes them less scary."); 
                        } 
                    },
                    { 
                        text: "That's good. Keep expressing yourself.", 
                        effect: () => { 
                            this.adjustStat('happiness', 10); 
                            this.setEmotion('happy', 10);
                            this.child.resilience = Math.min(100, this.child.resilience + 2);
                            this.showDialogue("I will... It's becoming a habit that helps me."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "I'm starting to feel... stronger? Like I'm learning to handle things better.",
                message: "Alex is growing in resilience!",
                choices: [
                    { 
                        text: "I'm so proud of you! You're becoming so strong and brave. You were always perfect - you're just discovering it now!", 
                        effect: () => { 
                            this.adjustStat('happiness', 25); 
                            this.setEmotion('happy', 30);
                            this.setEmotion('surprised', 10);
                            this.setEmotion('anxious', -20);
                            this.adjustRelationship(8);
                            this.child.resilience = Math.min(100, this.child.resilience + 10);
                            this.memory.push({day: this.day, event: "Growing stronger", positive: true});
                            this.showDialogue("Thank you... I couldn't do this without you. I'm learning that I'm stronger than I thought! And I'm realizing that I'm good enough just as I am - all children are!"); 
                            this.saveGame();
                        } 
                    },
                    { 
                        text: "You've always been strong. You're just discovering it now.", 
                        effect: () => { 
                            this.adjustStat('happiness', 20); 
                            this.setEmotion('happy', 20);
                            this.setEmotion('surprised', 15);
                            this.child.resilience = Math.min(100, this.child.resilience + 8);
                            this.showDialogue("You think so? I'm starting to believe it too..."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "I saw someone else being bullied today... I stopped it. I couldn't let it happen.",
                message: "Alex is becoming a hero!",
                choices: [
                    { 
                        text: "That's incredibly brave! You're making a real difference.", 
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
                            this.showDialogue("I did it! I stood up for them... I know what it feels like. I had to help. I'm becoming the person I needed when I was younger!"); 
                        } 
                    },
                    { 
                        text: "You're amazing. That took real courage.", 
                        effect: () => { 
                            this.adjustStat('happiness', 25); 
                            this.adjustStat('social', 15);
                            this.setEmotion('happy', 30);
                            this.child.helpingOthers++;
                            this.child.goodChoices++;
                            this.child.resilience = Math.min(100, this.child.resilience + 8);
                            this.showDialogue("Thank you... I'm learning that I can be strong. I can help others now."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "I got accepted into a good program! All my studying is paying off!",
                message: "Success through hard work!",
                choices: [
                    { 
                        text: "I'm so proud! You worked so hard for this!", 
                        effect: () => { 
                            this.adjustStat('happiness', 30); 
                            this.adjustStat('learning', 20);
                            this.setEmotion('happy', 40);
                            this.setEmotion('surprised', 25);
                            this.child.careerProgress = Math.min(100, this.child.careerProgress + 15);
                            this.child.money += 50; // Scholarship or opportunity
                            this.memory.push({day: this.day, event: "Got accepted - success!", positive: true});
                            this.showDialogue("I can't believe it! All those hours studying... They said I couldn't do it, but I did! The future is mine!"); 
                        } 
                    },
                    { 
                        text: "You earned this! Your dedication is inspiring.", 
                        effect: () => { 
                            this.adjustStat('happiness', 25); 
                            this.adjustStat('learning', 15);
                            this.setEmotion('happy', 35);
                            this.child.careerProgress = Math.min(100, this.child.careerProgress + 10);
                            this.showDialogue("I worked so hard... And it's paying off. I'm not who they said I was."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "The kids who used to bully me... They're different now. Some even apologized. Things changed.",
                message: "The story isn't set in stone - things can change!",
                choices: [
                    { 
                        text: "People can change, and you've shown incredible growth. You're inspiring.", 
                        effect: () => { 
                            this.adjustStat('happiness', 25); 
                            this.setEmotion('happy', 30);
                            this.setEmotion('surprised', 15);
                            this.child.resilience = Math.min(100, this.child.resilience + 10);
                            this.memory.push({day: this.day, event: "Things changed - hope", positive: true});
                            this.showDialogue("You're right... Things aren't set in stone. I changed, they changed... The future is what we make it. I have so much hope now."); 
                        } 
                    },
                    { 
                        text: "You've come so far. Your story is proof that hard times don't last forever.", 
                        effect: () => { 
                            this.adjustStat('happiness', 20); 
                            this.setEmotion('happy', 25);
                            this.child.resilience = Math.min(100, this.child.resilience + 8);
                            this.showDialogue("Thank you... I'm learning that nothing is permanent. I can create my own future."); 
                        } 
                    }
                ]
            },
            {
                dialogue: "I got a good grade on my test! Look!",
                message: "Academic achievement!",
                choices: [
                    { text: "That's amazing! I'm so proud of you!", effect: () => { this.adjustStat('happiness', 20); this.adjustStat('learning', 10); this.showDialogue("Thank you! I studied really hard! I'm so happy!"); } },
                    { text: "Good job! Keep up the good work.", effect: () => { this.adjustStat('happiness', 10); this.adjustStat('learning', 5); this.showDialogue("I will! I want to do even better next time!"); } }
                ]
            },
            {
                dialogue: "I don't want to go to school today... Can I stay home?",
                message: "School reluctance.",
                choices: [
                    { text: "School is important. Let's talk about why you don't want to go.", effect: () => { this.adjustStat('learning', 5); this.adjustStat('happiness', 5); this.showDialogue("Okay... I'll go. But I'm still not sure about it."); } },
                    { text: "If you're not feeling well, you can stay home today.", effect: () => { this.adjustStat('learning', -10); this.adjustStat('happiness', 10); this.showDialogue("Thank you! I'll rest and feel better tomorrow."); } }
                ]
            },
            {
                dialogue: "Can I have a pet? All my friends have pets!",
                message: "Pet request!",
                choices: [
                    { text: "That sounds like a great idea! Let's get a pet.", effect: () => { this.adjustStat('happiness', 25); this.adjustStat('social', 10); this.showDialogue("Yay! I'll take such good care of it! This is amazing!"); } },
                    { text: "That's a big responsibility. Let's think about it.", effect: () => { this.adjustStat('happiness', -5); this.showDialogue("I understand... but I really want one someday."); } }
                ]
            },
            {
                dialogue: "I want to learn to ride a bike! Can you teach me?",
                message: "New skill learning opportunity!",
                choices: [
                    { text: "Absolutely! Let's go practice together.", effect: () => { this.adjustStat('learning', 15); this.adjustStat('happiness', 20); this.adjustStat('energy', -10); this.showDialogue("This is so fun! I'm getting better! Thank you for teaching me!"); } },
                    { text: "Maybe when you're a bit older.", effect: () => { this.adjustStat('happiness', -5); this.showDialogue("Okay... but I really want to learn soon."); } }
                ]
            },
            {
                dialogue: "I'm worried about my presentation at school tomorrow...",
                message: "Your child is anxious.",
                choices: [
                    { text: "Let's practice together! You'll do great!", effect: () => { this.adjustStat('happiness', 15); this.adjustStat('learning', 10); this.showDialogue("Thank you! I feel so much more confident now!"); } },
                    { text: "You'll be fine. Just do your best.", effect: () => { this.adjustStat('happiness', 5); this.showDialogue("I'll try... but I'm still nervous."); } }
                ]
            },
            {
                dialogue: "I want to try a new hobby! Can I join a club at school?",
                message: "Interest in new activities!",
                choices: [
                    { text: "That's a great idea! Which club interests you?", effect: () => { 
                        this.adjustStat('social', 15); 
                        this.adjustStat('happiness', 15); 
                        this.adjustRelationship(2);
                        this.memory.push({day: this.day, event: "Joined club", positive: true});
                        this.showDialogue("I want to join the art club! I love drawing!"); 
                    } },
                    { text: "Let's focus on school first, then we can talk about clubs.", effect: () => { 
                        this.adjustStat('social', 5); 
                        this.adjustRelationship(-1);
                        this.showDialogue("Okay... but I really want to join something."); 
                    } }
                ]
            },
            {
                dialogue: "I lost my favorite toy today... I'm really sad about it.",
                message: "Your child is upset about losing something important.",
                choices: [
                    { text: "Let's look for it together! Don't worry, we'll find it.", effect: () => { 
                        this.adjustStat('happiness', 10); 
                        this.adjustRelationship(3);
                        this.showDialogue("Thank you! I feel so much better knowing you'll help me!"); 
                    } },
                    { text: "I understand it's upsetting, but we can get a new one.", effect: () => { 
                        this.adjustStat('happiness', -5); 
                        this.adjustRelationship(-2);
                        this.showDialogue("But that one was special..."); 
                    } }
                ]
            },
            {
                dialogue: "I want to learn a musical instrument! Can I take lessons?",
                message: "Interest in music!",
                choices: [
                    { text: "That's wonderful! Let's find you a teacher.", effect: () => { 
                        this.adjustStat('learning', 15); 
                        this.adjustStat('happiness', 20); 
                        this.adjustStat('social', 10);
                        this.adjustRelationship(3);
                        this.memory.push({day: this.day, event: "Music lessons", positive: true});
                        this.showDialogue("Really? This is amazing! I'll practice every day!"); 
                    } },
                    { text: "That's expensive. Maybe we can think about it later.", effect: () => { 
                        this.adjustStat('happiness', -10); 
                        this.adjustRelationship(-2);
                        this.showDialogue("Oh... okay. I really wanted to learn though."); 
                    } }
                ]
            },
            {
                dialogue: "Some kids at school were mean to me today...",
                message: "Difficult social situation (but handled positively).",
                choices: [
                    { text: "Tell me what happened. I'm here for you.", effect: () => { 
                        this.adjustStat('happiness', 15); 
                        this.adjustStat('social', 10);
                        this.adjustRelationship(5);
                        this.memory.push({day: this.day, event: "Supported child", positive: true});
                        this.showDialogue("Thank you for listening. I feel better talking to you about it."); 
                    } },
                    { text: "Just ignore them. Focus on your friends.", effect: () => { 
                        this.adjustStat('happiness', 5); 
                        this.adjustRelationship(1);
                        this.showDialogue("I'll try... but it's hard sometimes."); 
                    } }
                ]
            },
            {
                dialogue: "I want to help with chores around the house! Can I help?",
                message: "Your child wants to be helpful!",
                choices: [
                    { text: "Of course! That's very thoughtful of you.", effect: () => { 
                        this.adjustStat('happiness', 15); 
                        this.adjustStat('learning', 5);
                        this.adjustRelationship(4);
                        this.memory.push({day: this.day, event: "Helped with chores", positive: true});
                        this.showDialogue("Yay! I want to be helpful! What can I do?"); 
                    } },
                    { text: "That's nice, but you don't have to.", effect: () => { 
                        this.adjustStat('happiness', 5); 
                        this.adjustRelationship(1);
                        this.showDialogue("But I want to help..."); 
                    } }
                ]
            },
            {
                dialogue: "I'm excited about a school project! Can you help me with it?",
                message: "Academic enthusiasm!",
                choices: [
                    { text: "Absolutely! Let's work on it together.", effect: () => { 
                        this.adjustStat('learning', 20); 
                        this.adjustStat('happiness', 15);
                        this.adjustRelationship(3);
                        this.showDialogue("This is so fun! I'm learning so much with your help!"); 
                    } },
                    { text: "You should try to do it yourself first, but I can help if needed.", effect: () => { 
                        this.adjustStat('learning', 10); 
                        this.adjustStat('happiness', 5);
                        this.adjustRelationship(1);
                        this.showDialogue("Okay, I'll try my best first!"); 
                    } }
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
                    this.showMessage("Du må tjene denne badge først!");
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
            this.showMessage("Bio lagret!");
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
}

// Initialize game
const game = new MyChildGame();
