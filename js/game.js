// Utilities and polyfills are now in js/utils.js
// TranslationManager is now in js/translations.js

class MyChildGame {
    constructor() {
        // Get username from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.username = urlParams.get('username') || 'default';
        
        // Load customization
        this.loadCustomization();
        
        // Determine world mode (2000s or 2085 dystopia)
        this.worldMode = this.customization?.worldMode || '2000s';
        
        // Load saved game or create new
        const savedGame = this.loadGame();
        
        // Override world mode from saved game if it exists
        if (savedGame && savedGame.worldMode) {
            this.worldMode = savedGame.worldMode;
        }
        
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
            chosenCareer: savedGame && savedGame.child && savedGame.child.chosenCareer ? savedGame.child.chosenCareer : null, // Career choice at age 16+
            careerSalary: savedGame && savedGame.child && savedGame.child.careerSalary ? savedGame.child.careerSalary : 0, // Annual salary from career
            // Track daily routines (like original - must do these)
            lastFed: 0, // Day when child was last fed
            lastBathed: 0, // Day when child was last bathed
            lastPlayed: 0, // Day when child was last played with
            lastRead: 0, // Day when child was last read to
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
            lastSupportiveChoice: savedGame && savedGame.child && savedGame.child.lastSupportiveChoice ? savedGame.child.lastSupportiveChoice : null,
            // Trust level - affected by past choices
            trustLevel: savedGame && savedGame.child && savedGame.child.trustLevel !== undefined ? savedGame.child.trustLevel : 50,
            // Diary system - auto-generated and manual entries
            diary: savedGame && savedGame.child && savedGame.child.diary ? savedGame.child.diary : [],
            // Friends system - Alma Vilje and Celia Rose
            friends: savedGame && savedGame.child && savedGame.child.friends ? savedGame.child.friends : {
                almaVilje: { name: 'Alma Vilje', friendshipLevel: 30, lastInteraction: 0, supportGiven: 0, supportReceived: 0 },
                celiaRose: { name: 'Celia Rose', friendshipLevel: 30, lastInteraction: 0, supportGiven: 0, supportReceived: 0 }
            },
            // Future-specific stats
            hasDriversLicense: savedGame && savedGame.child && savedGame.child.hasDriversLicense ? savedGame.child.hasDriversLicense : false,
            hasMovedOut: savedGame && savedGame.child && savedGame.child.hasMovedOut ? savedGame.child.hasMovedOut : false,
            climateAwareness: savedGame && savedGame.child && savedGame.child.climateAwareness ? savedGame.child.climateAwareness : 0,
            aiLiteracy: savedGame && savedGame.child && savedGame.child.aiLiteracy ? savedGame.child.aiLiteracy : 0,
            resourceManagement: savedGame && savedGame.child && savedGame.child.resourceManagement ? savedGame.child.resourceManagement : 0,
            // Siblings system
            siblings: savedGame && savedGame.child && savedGame.child.siblings ? savedGame.child.siblings : (this.customization?.siblings || 'none'),
            siblingRelationship: savedGame && savedGame.child && savedGame.child.siblingRelationship !== undefined ? savedGame.child.siblingRelationship : 50,
            // Problem choices and consequences tracking
            problemChoices: savedGame && savedGame.child && savedGame.child.problemChoices ? savedGame.child.problemChoices : [],
            lastDinnerChoice: savedGame && savedGame.child && savedGame.child.lastDinnerChoice ? savedGame.child.lastDinnerChoice : null,
            // Pet system (age 5+)
            pet: savedGame && savedGame.child && savedGame.child.pet ? savedGame.child.pet : null,
            // Parent work system (for babies)
            parentWorkCooldown: savedGame && savedGame.child && savedGame.child.parentWorkCooldown !== undefined ? savedGame.child.parentWorkCooldown : 0,
            // Relationship and family system (age 18+)
            partner: savedGame && savedGame.child && savedGame.child.partner ? savedGame.child.partner : null,
            isMarried: savedGame && savedGame.child && savedGame.child.isMarried !== undefined ? savedGame.child.isMarried : false,
            adoptedChildren: savedGame && savedGame.child && savedGame.child.adoptedChildren ? savedGame.child.adoptedChildren : []
        };
        
        this.day = savedGame ? savedGame.day : 1;
        // Set year based on world mode
        this.year = savedGame ? savedGame.year : (this.worldMode === '2085' ? 2085 : 2000);
        this.age = savedGame ? savedGame.age : 0; // Track character age in years (replaces day system)
        this.timeOfDay = savedGame ? savedGame.timeOfDay : 0;
        this.timeNames = ["Morning", "Afternoon", "Evening", "Night"];
        this.currentLocation = savedGame ? savedGame.currentLocation : "home";
        this.pendingEvent = savedGame ? savedGame.pendingEvent : null;
        this.dialogueQueue = savedGame ? savedGame.dialogueQueue : [];
        this.actionsToday = savedGame ? savedGame.actionsToday : 0;
        this.maxActionsPerDay = 4; // Like original - limited actions per day (reduced to 4 to make time management more critical)
        this.consequencesAppliedToday = false; // Track if exhaustion consequences have been applied today
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
        
        // Set locations based on world mode
        if (this.worldMode === '2085') {
            // Dystopian future locations
            this.locations = {
                home: { name: "Home", color: "#ff6b6b", image: "assets/images/pollutioncity.jpg", usePlaceholder: false },
                school: { name: "School", color: "#bae1ff", image: "assets/images/school.jpg", usePlaceholder: false },
                playground: { name: "Playground", color: "#ff8e8e", image: "assets/images/worldcollapse.jpg", usePlaceholder: false },
                friend: { name: "Friend's House", color: "#ffffba", image: "assets/images/friend.jpg", usePlaceholder: false },
                nature: { name: "Nature", color: "#90EE90", image: "assets/images/nature.jpg", usePlaceholder: false }
            };
        } else {
            // 2000s normal world locations
            this.locations = {
                home: { name: "Home", color: "#ffb3ba", image: "assets/images/dreamgreenhome.jpg", usePlaceholder: false },
                school: { name: "School", color: "#bae1ff", image: "assets/images/school.jpg", usePlaceholder: false },
                playground: { name: "Playground", color: "#baffc9", image: "assets/images/playground.jpg", usePlaceholder: false },
                friend: { name: "Friend's House", color: "#ffffba", image: "assets/images/friend.jpg", usePlaceholder: false },
                nature: { name: "Nature", color: "#90EE90", image: "assets/images/nature.jpg", usePlaceholder: false }
            };
        }
        
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
        
        // Update page title based on world mode
        this.updatePageTitle();
        
        // Initialize PWA install prompt
        this.deferredPrompt = null;
        setTimeout(() => {
            this.initializeInstallPrompt();
        }, 1000);
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
                child: {
                    ...this.child,
                    trustLevel: this.child.trustLevel || 50
                },
                day: this.day,
                year: this.year,
                worldMode: this.worldMode, // Save world mode
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
        
        // Initialize menu - show game tab by default
        this.showMenuTab('game');
        
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
                    ? "Hei... Jeg er " + this.child.name + ". Jeg er bare en baby i år 2085. Verden er annerledes nå - oljefondet er tomt, klimaet er i krise, og AI tar over. Men jeg vil vokse opp med din hjelp og støtte, og kanskje vi kan gjøre en forskjell?"
                    : "Hi... I'm " + this.child.name + ". I'm just a baby in the year 2085. The world is different now - the oil fund is empty, the climate is in crisis, and AI is taking over. But I'll grow up with your help and support, and maybe we can make a difference?";
            } else if (this.child.age < 5) {
                ageAppropriateDialogue = this.language === 'no'
                    ? "Hei! Jeg er " + this.child.name + ". Jeg er " + this.child.age + " år gammel i 2085. Verden er annerledes - vi har flyvende biler, men også store utfordringer. Oljefondet er tomt, ressursene er knappe, og eldrebølgen slår til. Men jeg lærer og vokser!"
                    : "Hi! I'm " + this.child.name + ". I'm " + this.child.age + " years old in 2085. The world is different - we have flying cars, but also big challenges. The oil fund is empty, resources are scarce, and the aging population crisis is hitting. But I'm learning and growing!";
            } else if (this.child.age < 7) {
                ageAppropriateDialogue = this.language === 'no'
                    ? "Hei... Jeg er " + this.child.name + ". Jeg er " + this.child.age + " år gammel. Jeg forbereder meg på skolen snart!"
                    : "Hi... I'm " + this.child.name + ". I'm " + this.child.age + " years old. I'm getting ready for school soon!";
            } else {
                // Historical reference - like original game (post-WW2 context)
                ageAppropriateDialogue = this.language === 'no' 
                    ? "Hei... Jeg er " + this.child.name + ". Å begynne på skolen i 2085 er... vel, det er annerledes. Vi lærer om klimaendringer, AI, og hvordan Norge mistet oljefondet. Noen ganger føler jeg at fremtiden er usikker, men jeg vet at vi kan gjøre en forskjell. Historien vår er ikke skrevet i stein - vi kan skape vår egen fremtid, kanskje redde Norge fra dystopien?"
                    : "Hi... I'm " + this.child.name + ". Starting school in 2085 is... well, it's different. We learn about climate change, AI, and how Norway lost the oil fund. Sometimes I feel the future is uncertain, but I know we can make a difference. Our story isn't written in stone - we can create our own future, maybe save Norway from dystopia?";
            }
            this.showDialogue(ageAppropriateDialogue);
            const welcomeMsg = this.language === 'no'
                ? "Velkommen til 2085! Du tar nå vare på " + this.child.name + " i en verden i krise. " + this.child.name + " er " + this.child.age + " år gammel. Norge er i krise - oljefondet er tomt, ressursene er knappe, klimaet er i fritt fall, AI tar over, og eldrebølgen slår til. Men med din støtte og riktige valg kan " + this.child.name + " kanskje redde fremtiden. Hvert valg teller - kan du stoppe dystopien?"
                : "Welcome to 2085! You are now taking care of " + this.child.name + " in a world in crisis. " + this.child.name + " is " + this.child.age + " years old. Norway is in crisis - the oil fund is empty, resources are scarce, the climate is in free fall, AI is taking over, and the aging population crisis is hitting. But with your support and the right choices, " + this.child.name + " might save the future. Every choice matters - can you stop the dystopia?";
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
                welcome: "Welcome to 2085! Take care of your child in a world in crisis. Can you save Norway from dystopia?",
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
                message: "Dette er et omsorgsspill hvor du tar vare på et barn som vokser opp i 2085. Norge er i krise - oljefondet er tomt, ressursene er knappe, klimaet er i fritt fall, AI tar over, og eldrebølgen slår til. Kan du ta riktige valg og redde fremtiden?",
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
    
    updatePageTitle() {
        // Update page title and header based on world mode
        const titleElement = document.querySelector('.header-title-wrapper h1');
        if (titleElement) {
            if (this.worldMode === '2085') {
                titleElement.textContent = 'MyChild - 2085: Dystopia Edition';
            } else {
                titleElement.textContent = 'MyChild - 2000s Edition';
            }
        }
        
        // Update document title
        if (this.worldMode === '2085') {
            document.title = 'MyChild - 2085: Dystopia Edition';
        } else {
            document.title = 'MyChild - 2000s Edition';
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
        
        // Update stat bars with visual feedback for critical stats
        const updateStatBar = (barId, value, statName) => {
            const bar = document.getElementById(barId);
            if (bar) {
                bar.style.transition = 'width 0.5s ease';
                bar.style.width = value + '%';
                
                // Visual feedback for critical stats
                if (value < 15) {
                    // Critical - red
                    bar.style.background = 'linear-gradient(90deg, #f44336, #d32f2f)';
                    bar.style.boxShadow = '0 0 10px rgba(244, 67, 54, 0.6)';
                    bar.style.animation = 'pulse 1.5s ease-in-out infinite';
                } else if (value < 30) {
                    // Warning - orange
                    bar.style.background = 'linear-gradient(90deg, #ff9800, #f57c00)';
                    bar.style.boxShadow = '0 0 8px rgba(255, 152, 0, 0.4)';
                    bar.style.animation = 'none';
                } else if (value < 50) {
                    // Low - yellow
                    bar.style.background = 'linear-gradient(90deg, #ffc107, #ffb300)';
                    bar.style.boxShadow = '0 0 5px rgba(255, 193, 7, 0.3)';
                    bar.style.animation = 'none';
                } else {
                    // Normal - default gradient
                    bar.style.background = '';
                    bar.style.boxShadow = '';
                    bar.style.animation = '';
                }
            }
        };
        
        updateStatBar('happinessBar', this.child.happiness, 'happiness');
        updateStatBar('energyBar', this.child.energy, 'energy');
        updateStatBar('socialBar', this.child.social, 'social');
        updateStatBar('learningBar', this.child.learning, 'learning');
        
        const hungerBar = document.getElementById('hungerBar');
        if (hungerBar) {
            hungerBar.style.transition = 'width 0.5s ease';
            hungerBar.style.width = this.child.hunger + '%';
            if (this.child.hunger < 15) {
                hungerBar.style.background = 'linear-gradient(90deg, #f44336, #d32f2f)';
                hungerBar.style.boxShadow = '0 0 10px rgba(244, 67, 54, 0.6)';
                hungerBar.style.animation = 'pulse 1.5s ease-in-out infinite';
            } else if (this.child.hunger < 30) {
                hungerBar.style.background = 'linear-gradient(90deg, #ff9800, #f57c00)';
                hungerBar.style.boxShadow = '0 0 8px rgba(255, 152, 0, 0.4)';
                hungerBar.style.animation = 'none';
            } else {
                hungerBar.style.background = '';
                hungerBar.style.boxShadow = '';
                hungerBar.style.animation = '';
            }
        }
        
        // Update action display
        this.updateActionDisplay();
        this.updateRoutineDisplay();
        this.updateAgeSpecificButtons();
        
        // Update time
        // Update age display instead of day (2085 uses years)
        const currentAgeElement = document.getElementById('currentAge');
        if (currentAgeElement) {
            currentAgeElement.textContent = this.child.age || 0;
        }
        const currentYearElement = document.getElementById('currentYear');
        if (currentYearElement) {
            currentYearElement.textContent = this.year;
        }
        const currentTimeElement = document.getElementById('currentTime');
        if (currentTimeElement && this.timeNames && this.timeOfDay !== undefined) {
            currentTimeElement.textContent = this.timeNames[this.timeOfDay] || this.timeNames[0] || 'Morning';
        }
        
        // Update child name
        const childNameElement = document.getElementById('childName');
        if (childNameElement) {
            childNameElement.textContent = this.child.name;
        }
        
        // Update future-specific buttons visibility
        const driversLicenseBtn = document.getElementById('driversLicenseBtn');
        if (driversLicenseBtn) {
            if (this.child.age >= 16 && !this.child.hasDriversLicense) {
                driversLicenseBtn.style.display = 'inline-block';
            } else {
                driversLicenseBtn.style.display = 'none';
            }
        }
        
        const moveOutBtn = document.getElementById('moveOutBtn');
        if (moveOutBtn) {
            if (this.child.age >= 18 && !this.child.hasMovedOut) {
                moveOutBtn.style.display = 'inline-block';
            } else {
                moveOutBtn.style.display = 'none';
            }
        }
        
        // Update emotion display (like original - show child's feelings)
        this.updateEmotionDisplay();
        
        // Update color palette based on child's emotional state
        this.updateColorPalette();
        
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
        
        // Check for death
        this.checkForDeath();
        
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
    
    showActivityImage(imagePath, duration = 2000) {
        // Show an activity image overlay in the scene temporarily
        const sceneImage = document.getElementById('sceneImage');
        if (!sceneImage) return;
        
        // Remove any existing activity image
        const existingActivityImg = sceneImage.querySelector('.activity-overlay');
        if (existingActivityImg) {
            existingActivityImg.remove();
        }
        
        // Create overlay image
        const activityImg = document.createElement('img');
        activityImg.src = imagePath;
        activityImg.className = 'activity-overlay';
        activityImg.style.position = 'absolute';
        activityImg.style.top = '50%';
        activityImg.style.left = '50%';
        activityImg.style.transform = 'translate(-50%, -50%)';
        activityImg.style.maxWidth = '60%';
        activityImg.style.maxHeight = '60%';
        activityImg.style.objectFit = 'contain';
        activityImg.style.zIndex = '1000';
        activityImg.style.opacity = '0';
        activityImg.style.transition = 'opacity 0.5s ease-in-out';
        activityImg.style.pointerEvents = 'none';
        activityImg.style.borderRadius = '15px';
        activityImg.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)';
        
        // Ensure sceneImage has relative positioning
        if (getComputedStyle(sceneImage).position === 'static') {
            sceneImage.style.position = 'relative';
        }
        
        sceneImage.appendChild(activityImg);
        
        // Fade in
        setTimeout(() => {
            activityImg.style.opacity = '1';
        }, 10);
        
        // Fade out and remove after duration
        setTimeout(() => {
            activityImg.style.opacity = '0';
            setTimeout(() => {
                if (activityImg.parentNode) {
                    activityImg.remove();
                }
            }, 500);
        }, duration);
        
        // Handle image load errors
        activityImg.onerror = () => {
            activityImg.remove();
        };
    }
    
    updateChildAvatarImage() {
        // Use real photos if available based on age, gender, health, and wealth
        const avatar = document.querySelector('.child-avatar');
        if (!avatar) return;
        
        // Determine image based on age, gender, health, and wealth
        let photoPath = null;
        const age = this.child.age;
        const isGirl = this.child.gender === 'girl';
        const isSick = this.child.energy < 20 || this.child.happiness < 20 || this.child.hunger < 20;
        const isRich = this.child.money > 100000;
        
        // Baby (0-2 years)
        if (age <= 2) {
            // Use sleeping baby if energy is low, otherwise use baby stickers
            if (this.child.energy < 30) {
                photoPath = 'assets/images/sleepingbaby.jpg';
            } else {
                // Alternate between baby stickers
                photoPath = (age % 2 === 0) 
                    ? 'assets/images/stickerbaby1.jpg' 
                    : 'assets/images/stickerbaby2.jpg';
            }
        }
        // Child (3-12 years)
        else if (age >= 3 && age <= 12) {
            if (isSick) {
                photoPath = isGirl 
                    ? 'assets/images/sickwoman.jpg' 
                    : 'assets/images/sickman.jpg';
            } else if (this.child.happiness > 70) {
                // Happy child
                photoPath = isGirl 
                    ? 'assets/images/happygirl.jpg' 
                    : 'assets/images/happyboy.jpg';
            } else if (this.child.happiness < 30) {
                // Sad child
                photoPath = isGirl 
                    ? 'assets/images/sadgirl.jpg' 
                    : 'assets/images/sadboy.jpg';
            } else {
                photoPath = isGirl 
                    ? 'assets/images/girlcloseuppicture.png' 
                    : 'assets/images/boycloseuppicture.png';
            }
        }
        // Teenager (13-17 years)
        else if (age >= 13 && age <= 17) {
            if (isSick) {
                photoPath = isGirl 
                    ? 'assets/images/sickwoman.jpg' 
                    : 'assets/images/sickman.jpg';
            } else {
                // Use bike images for 2000s world, fullbody for 2085
                if (this.worldMode === '2000s' && age >= 13 && age <= 15) {
                    photoPath = isGirl 
                        ? 'assets/images/girlonbike.jpg' 
                        : 'assets/images/boyonbike.jpg';
                } else {
                    photoPath = isGirl 
                        ? 'assets/images/teenagegirlfullbody.jpg' 
                        : 'assets/images/teenageboyfullbody.jpg';
                }
            }
        }
        // Young adult (18-64 years)
        else if (age >= 18 && age < 65) {
            if (isSick) {
                photoPath = isGirl 
                    ? 'assets/images/sickwoman.jpg' 
                    : 'assets/images/sickman.jpg';
            } else if (isGirl && age >= 18 && age <= 30) {
                // Use punk girl for young adult women
                photoPath = 'assets/images/punkgirl.jpg';
            } else {
                // Use closeup pictures for adults
                photoPath = isGirl 
                    ? 'assets/images/girlcloseuppicture.png' 
                    : 'assets/images/boycloseuppicture.png';
            }
        }
        // Elderly (65+ years)
        else if (age >= 65) {
            if (isSick) {
                photoPath = isGirl 
                    ? 'assets/images/sickwoman.jpg' 
                    : 'assets/images/sickman.jpg';
            } else if (isRich) {
                photoPath = isGirl 
                    ? 'assets/images/oldrichlady.jpg' 
                    : 'assets/images/oldrichman.jpg';
            } else {
                photoPath = isGirl 
                    ? 'assets/images/oldwoman.jpg' 
                    : 'assets/images/oldman.jpg';
            }
        }
        
        // Update avatar image if we have a path
        if (photoPath) {
            const existingImg = avatar.querySelector('img');
            
            // Only update if image path changed or no image exists
            if (!existingImg || existingImg.src !== photoPath || !existingImg.src.includes(photoPath.split('/').pop())) {
                const img = document.createElement('img');
                img.src = photoPath;
                img.alt = this.child.name;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                img.style.transition = 'opacity 0.3s';
                
                img.onerror = () => {
                    // If image doesn't exist, keep emoji or existing image
                    img.style.display = 'none';
                    if (!avatar.textContent && avatar.getAttribute('data-emoji')) {
                        avatar.textContent = avatar.getAttribute('data-emoji');
                    }
                };
                
                img.onload = () => {
                    // Fade in photo
                    img.style.opacity = '0';
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                };
                
                // Store emoji as fallback
                const currentEmoji = avatar.textContent || avatar.getAttribute('data-emoji') || (isGirl ? '👧' : '👦');
                avatar.setAttribute('data-emoji', currentEmoji);
                
                // Replace content with image
                    avatar.innerHTML = '';
                    avatar.appendChild(img);
            }
        } else {
            // No image path determined, use emoji
            const emoji = avatar.getAttribute('data-emoji') || (isGirl ? '👧' : '👦');
            if (!avatar.textContent || avatar.querySelector('img')) {
                avatar.innerHTML = '';
                avatar.textContent = emoji;
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
        // Show child's current emotion (like original game) - ENHANCED
        const emotionDisplay = document.getElementById('emotionDisplay');
        const emotionText = document.getElementById('emotionText');
        const childAvatar = document.getElementById('childAvatar');
        
        if (!emotionDisplay || !emotionText) return;
        
        const emotions = this.child.emotionalState;
        const maxEmotion = Object.entries(emotions).reduce((a, b) => emotions[a[0]] > emotions[b[1]] ? a : b);
        
        if (maxEmotion[1] > 20) { // Lowered threshold from 30 to 20 for more visibility
            const emotionNames = {
                happy: this.language === 'no' ? '😊 Glad' : '😊 Happy',
                sad: this.language === 'no' ? '😢 Lei seg' : '😢 Sad',
                angry: this.language === 'no' ? '😠 Sint' : '😠 Angry',
                scared: this.language === 'no' ? '😨 Redd' : '😨 Scared',
                anxious: this.language === 'no' ? '😰 Engstelig' : '😰 Anxious',
                surprised: this.language === 'no' ? '😲 Overrasket' : '😲 Surprised',
                embarrassed: this.language === 'no' ? '😳 Flau' : '😳 Embarrassed',
                curious: this.language === 'no' ? '🤔 Nysgjerrig' : '🤔 Curious',
                tired: this.language === 'no' ? '😴 Trøtt' : '😴 Tired',
                lonely: this.language === 'no' ? '😔 Ensom' : '😔 Lonely'
            };
            
            const emotionName = maxEmotion[0];
            const intensity = maxEmotion[1];
            const intensityText = intensity > 70 ? (this.language === 'no' ? ' (Sterkt)' : ' (Strong)') : 
                                 intensity > 50 ? (this.language === 'no' ? ' (Moderat)' : ' (Moderate)') : '';
            
            emotionText.textContent = (emotionNames[emotionName] || emotionName) + intensityText;
            emotionDisplay.style.display = 'block';
            
            // Enhanced visual feedback based on emotion and intensity
            const intensityMultiplier = Math.min(1.5, 1 + (intensity / 100));
            
            // Color, size, and animation based on emotion
            if (emotionName === 'happy' || emotionName === 'curious' || emotionName === 'surprised') {
                emotionDisplay.style.background = `linear-gradient(135deg, rgba(76, 175, 80, ${0.4 * intensityMultiplier}), rgba(129, 199, 132, ${0.3 * intensityMultiplier}))`;
                emotionDisplay.style.boxShadow = `0 4px 15px rgba(76, 175, 80, ${0.4 * intensityMultiplier})`;
                emotionDisplay.style.animation = 'emotionGlow 2s ease-in-out infinite';
                emotionDisplay.style.border = `2px solid rgba(76, 175, 80, ${0.6 * intensityMultiplier})`;
                if (childAvatar) {
                    childAvatar.setAttribute('data-emotion', 'happy');
                    childAvatar.style.filter = 'brightness(1.1)';
                }
            } else if (emotionName === 'sad' || emotionName === 'anxious' || emotionName === 'lonely') {
                emotionDisplay.style.background = `linear-gradient(135deg, rgba(33, 150, 243, ${0.4 * intensityMultiplier}), rgba(100, 181, 246, ${0.3 * intensityMultiplier}))`;
                emotionDisplay.style.boxShadow = `0 4px 15px rgba(33, 150, 243, ${0.4 * intensityMultiplier})`;
                emotionDisplay.style.animation = 'emotionPulse 2.5s ease-in-out infinite';
                emotionDisplay.style.border = `2px solid rgba(33, 150, 243, ${0.6 * intensityMultiplier})`;
                if (childAvatar) {
                    childAvatar.setAttribute('data-emotion', 'sad');
                    childAvatar.style.filter = 'brightness(0.9) saturate(0.8)';
                }
            } else if (emotionName === 'angry' || emotionName === 'scared') {
                emotionDisplay.style.background = `linear-gradient(135deg, rgba(244, 67, 54, ${0.5 * intensityMultiplier}), rgba(239, 83, 80, ${0.4 * intensityMultiplier}))`;
                emotionDisplay.style.boxShadow = `0 4px 15px rgba(244, 67, 54, ${0.5 * intensityMultiplier})`;
                emotionDisplay.style.animation = 'emotionShake 1s ease-in-out infinite';
                emotionDisplay.style.border = `2px solid rgba(244, 67, 54, ${0.7 * intensityMultiplier})`;
                if (childAvatar) {
                    childAvatar.setAttribute('data-emotion', 'angry');
                    childAvatar.style.filter = 'brightness(1.05) saturate(1.2)';
                }
            } else if (emotionName === 'tired') {
                emotionDisplay.style.background = `linear-gradient(135deg, rgba(158, 158, 158, ${0.4 * intensityMultiplier}), rgba(189, 189, 189, ${0.3 * intensityMultiplier}))`;
                emotionDisplay.style.boxShadow = `0 4px 15px rgba(158, 158, 158, ${0.3 * intensityMultiplier})`;
                emotionDisplay.style.animation = 'emotionFade 3s ease-in-out infinite';
                emotionDisplay.style.border = `2px solid rgba(158, 158, 158, ${0.5 * intensityMultiplier})`;
                if (childAvatar) {
                    childAvatar.setAttribute('data-emotion', 'tired');
                    childAvatar.style.filter = 'brightness(0.85)';
                }
            } else {
                emotionDisplay.style.background = `linear-gradient(135deg, rgba(255, 255, 255, ${0.4 * intensityMultiplier}), rgba(245, 245, 245, ${0.3 * intensityMultiplier}))`;
                emotionDisplay.style.boxShadow = `0 4px 15px rgba(0, 0, 0, ${0.2 * intensityMultiplier})`;
                emotionDisplay.style.border = `2px solid rgba(200, 200, 200, ${0.5 * intensityMultiplier})`;
            }
            
            // Make display more prominent
            emotionDisplay.style.fontSize = `${0.95 + (intensity / 200)}em`; // Scale with intensity
            emotionDisplay.style.fontWeight = intensity > 60 ? 'bold' : 'normal';
            emotionDisplay.style.padding = `${8 + (intensity / 20)}px ${12 + (intensity / 15)}px`;
        } else {
            emotionDisplay.style.display = 'none';
            if (childAvatar) {
                childAvatar.removeAttribute('data-emotion');
                childAvatar.style.filter = '';
            }
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
            img.src = `assets/images/${imgName}`;
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
        const dialogueTextElement = document.getElementById('dialogueText');
        if (dialogueTextElement) {
            dialogueTextElement.textContent = text;
        }
    }
    
    showMessage(text) {
        const statusMessageElement = document.getElementById('statusMessage');
        if (statusMessageElement) {
            statusMessageElement.textContent = text;
        }
    }
    
    updateActionDisplay() {
        const actionInfo = document.getElementById('actionInfo');
        const actionInfoText = document.getElementById('actionInfoText');
        if (actionInfo && actionInfoText) {
            const remaining = this.maxActionsPerDay - this.actionsToday;
            const actionText = this.language === 'no' 
                ? `⚡ Handlinger igjen: ${remaining}/${this.maxActionsPerDay}`
                : `⚡ Actions remaining: ${remaining}/${this.maxActionsPerDay}`;
            actionInfoText.textContent = actionText;
            
            // Update color, size, and animation based on remaining actions
            if (remaining === 0) {
                actionInfo.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                actionInfo.style.boxShadow = '0 6px 12px rgba(244, 67, 54, 0.5)';
                actionInfo.style.animation = 'pulse 1.5s ease-in-out infinite';
                actionInfo.style.fontSize = '1.3em';
                actionInfo.style.padding = '16px 24px';
                actionInfo.style.border = '3px solid #ff5252';
                // Add warning icon
                actionInfoText.textContent = this.language === 'no'
                    ? '⚠️ Alle handlinger brukt opp! Gå til neste dag.'
                    : '⚠️ All actions used! Go to next day.';
            } else if (remaining === 1) {
                actionInfo.style.background = 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)';
                actionInfo.style.boxShadow = '0 5px 10px rgba(255, 87, 34, 0.4)';
                actionInfo.style.animation = 'pulse 2s ease-in-out infinite';
                actionInfo.style.fontSize = '1.25em';
                actionInfo.style.padding = '14px 22px';
                actionInfo.style.border = '2px solid #ff7043';
            } else if (remaining < 3) {
                actionInfo.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                actionInfo.style.boxShadow = '0 4px 8px rgba(255, 152, 0, 0.3)';
                actionInfo.style.animation = 'none';
                actionInfo.style.fontSize = '1.15em';
                actionInfo.style.padding = '12px 20px';
                actionInfo.style.border = '2px solid #ffb74d';
            } else {
                actionInfo.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                actionInfo.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                actionInfo.style.animation = 'none';
                actionInfo.style.fontSize = '1.1em';
                actionInfo.style.padding = '12px 20px';
                actionInfo.style.border = '2px solid rgba(255,255,255,0.3)';
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
        
        // Check for death if all stats reach 0
        this.checkForDeath();
        
        this.updateDisplay();
        return this.child[stat] - oldValue;
    }
    
    checkForDeath() {
        // Don't check if character is already dead
        if (this.child.isDead) {
            return;
        }
        
        // Check if all main stats (happiness, hunger, energy, social, learning) are at 0
        if (this.child.happiness <= 0 && 
            this.child.hunger <= 0 && 
            this.child.energy <= 0 && 
            this.child.social <= 0 && 
            this.child.learning <= 0) {
            
            // Character has died
            this.handleDeath();
        }
    }
    
    handleDeath() {
        // Stop the game
        clearInterval(this.autoSaveInterval);
        
        // Show death message
        const deathMessage = this.language === 'no'
            ? "💀 Karakteren din har dødd. Alle stats (happiness, hunger, energy, social, learning) nådde null. Spillet er over."
            : "💀 Your character has died. All stats (happiness, hunger, energy, social, learning) reached zero. Game over.";
        
        const deathDialogue = this.language === 'no'
            ? "Jeg klarte det ikke... Verden i 2085 var for hard. Jeg er så lei meg..."
            : "I couldn't make it... The world in 2085 was too harsh. I'm so sorry...";
        
        // Show death messages
        this.showDialogue(deathDialogue);
        this.showMessage(deathMessage);
        
        // Disable all game actions
        const gameButtons = document.querySelectorAll('button');
        gameButtons.forEach(btn => {
            if (!btn.id || (btn.id !== 'logoutBtn' && !btn.id.includes('Tab'))) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            }
        });
        
        // Disable next year button
        const nextYearBtn = document.querySelector('.time-btn');
        if (nextYearBtn) {
            nextYearBtn.disabled = true;
            nextYearBtn.style.opacity = '0.5';
            nextYearBtn.style.cursor = 'not-allowed';
        }
        
        // Add death entry to diary
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? '💀 Jeg døde i dag. Alle mine stats nådde null. Verden i 2085 var for hard for meg. Jeg håper noen kan lære av mine feil og redde fremtiden.'
                : '💀 I died today. All my stats reached zero. The world in 2085 was too harsh for me. I hope someone can learn from my mistakes and save the future.',
            false
        );
        
        // Save game state with death flag
        this.child.isDead = true;
        this.saveGame();
        
        // Show restart option after 3 seconds
        setTimeout(() => {
            const restartMsg = this.language === 'no'
                ? "Vil du starte på nytt? Gå tilbake til login-siden og opprett et nytt spill."
                : "Do you want to start over? Go back to the login page and create a new game.";
            this.showMessage(restartMsg);
        }, 3000);
    }
    
    adjustRelationship(amount) {
        this.relationship = Math.max(0, Math.min(100, this.relationship + amount));
    }
    
    canPerformAction() {
        // Don't allow actions if character is dead
        if (this.child.isDead) {
            const deadMsg = this.language === 'no'
                ? "💀 Karakteren din er død. Spillet er over."
                : "💀 Your character is dead. Game over.";
            this.showMessage(deadMsg);
            return false;
        }
        
        if (this.actionsToday >= this.maxActionsPerDay) {
            const tiredMsg = this.language === 'no'
                ? "Jeg er så trøtt... Jeg kan ikke gjøre mer i dag. Jeg trenger hvile."
                : "I'm so tired... I can't do more today. I need to rest.";
            const noActionsMsg = this.language === 'no'
                ? "⚠️ Du har brukt alle handlingene dine for i dag! Gå til neste dag for å fortsette. Barnet blir trøtt og stats kan synke hvis du prøver å gjøre for mye."
                : "⚠️ You've used all your actions for today! Go to the next day to continue. The child gets tired and stats may decrease if you try to do too much.";
            
            // Apply consequences for using all actions
            if (!this.consequencesAppliedToday) {
                this.applyActionExhaustionConsequences();
                this.consequencesAppliedToday = true;
            }
            
            this.showDialogue(tiredMsg);
            this.showMessage(noActionsMsg);
            return false;
        }
        return true;
    }
    
    applyActionExhaustionConsequences() {
        // Child gets tired from too many actions
        this.adjustStat('energy', -5);
        this.adjustStat('happiness', -3);
        
        // Update emotional state
        if (this.child.energy < 30) {
            this.setEmotion('tired');
        }
        
        const exhaustionMsg = this.language === 'no'
            ? "Barnet er utmattet etter en lang dag. Energi og lykke redusert."
            : "The child is exhausted after a long day. Energy and happiness reduced.";
        
        console.log(exhaustionMsg);
    }
    
    performAction() {
        this.actionsToday++;
        this.updateActionDisplay();
    }
    
    updateColorPalette() {
        // Change color palette based on child's emotional state and stats
        const container = document.querySelector('.container');
        if (!container) return;
        
        const emotions = this.child.emotionalState;
        const maxEmotion = Object.entries(emotions).reduce((a, b) => emotions[a[0]] > emotions[b[1]] ? a : b);
        const maxEmotionValue = maxEmotion[1] || 0;
        const maxEmotionName = maxEmotion[0];
        
        // Determine overall mood based on stats and emotions
        const avgHappiness = (this.child.happiness + (100 - Math.max(0, this.child.hunger - 50))) / 2;
        const isCritical = this.child.happiness < 20 || this.child.hunger < 20 || this.child.energy < 20;
        
        // Remove existing color classes
        container.classList.remove('mood-happy', 'mood-sad', 'mood-angry', 'mood-anxious', 'mood-critical');
        
        if (isCritical) {
            container.classList.add('mood-critical');
            container.style.filter = 'brightness(0.9) saturate(0.85)';
        } else if (maxEmotionName === 'happy' && maxEmotionValue > 40) {
            container.classList.add('mood-happy');
            container.style.filter = 'brightness(1.05) saturate(1.1)';
        } else if ((maxEmotionName === 'sad' || maxEmotionName === 'lonely') && maxEmotionValue > 30) {
            container.classList.add('mood-sad');
            container.style.filter = 'brightness(0.95) saturate(0.9)';
        } else if ((maxEmotionName === 'angry' || maxEmotionName === 'scared') && maxEmotionValue > 30) {
            container.classList.add('mood-angry');
            container.style.filter = 'brightness(1.0) saturate(1.15)';
        } else if (maxEmotionName === 'anxious' && maxEmotionValue > 30) {
            container.classList.add('mood-anxious');
            container.style.filter = 'brightness(0.98) saturate(0.95)';
        } else {
            container.style.filter = '';
        }
    }
    
    updateRoutineDisplay() {
        // Visual feedback for missing routines
        const daysSinceFed = this.day - (this.child.lastFed || 0);
        const daysSinceBathed = this.day - (this.child.lastBathed || 0);
        const daysSincePlayed = this.day - (this.child.lastPlayed || 0);
        const daysSinceRead = this.day - (this.child.lastRead || 0);
        
        // Update feed button
        const feedBtn = document.querySelector('.feed-btn');
        if (feedBtn) {
            if (daysSinceFed > 1) {
                feedBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                feedBtn.style.animation = 'pulse 1.5s ease-in-out infinite';
                feedBtn.style.boxShadow = '0 0 15px rgba(244, 67, 54, 0.6)';
                feedBtn.style.border = '3px solid #ff5252';
            } else if (daysSinceFed > 0) {
                feedBtn.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                feedBtn.style.animation = 'none';
                feedBtn.style.boxShadow = '0 0 10px rgba(255, 152, 0, 0.4)';
                feedBtn.style.border = '2px solid #ffb74d';
            } else {
                feedBtn.style.background = '';
                feedBtn.style.animation = '';
                feedBtn.style.boxShadow = '';
                feedBtn.style.border = '';
            }
        }
        
        // Update bathe button
        const routineBtns = document.querySelectorAll('.routine-btn');
        if (routineBtns.length > 1) {
            const batheBtn = routineBtns[1];
            if (batheBtn) {
                if (daysSinceBathed > 2) {
                    batheBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                    batheBtn.style.animation = 'pulse 1.5s ease-in-out infinite';
                    batheBtn.style.boxShadow = '0 0 15px rgba(244, 67, 54, 0.6)';
                    batheBtn.style.border = '3px solid #ff5252';
                } else if (daysSinceBathed > 1) {
                    batheBtn.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                    batheBtn.style.animation = 'none';
                    batheBtn.style.boxShadow = '0 0 10px rgba(255, 152, 0, 0.4)';
                    batheBtn.style.border = '2px solid #ffb74d';
                } else {
                    batheBtn.style.background = '';
                    batheBtn.style.animation = '';
                    batheBtn.style.boxShadow = '';
                    batheBtn.style.border = '';
                }
            }
        }
        
        // Update play button
        if (routineBtns.length > 2) {
            const playBtn = routineBtns[2];
            if (playBtn) {
                if (daysSincePlayed > 3) {
                    playBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                    playBtn.style.animation = 'pulse 1.5s ease-in-out infinite';
                    playBtn.style.boxShadow = '0 0 15px rgba(244, 67, 54, 0.6)';
                    playBtn.style.border = '3px solid #ff5252';
                } else if (daysSincePlayed > 2) {
                    playBtn.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                    playBtn.style.animation = 'none';
                    playBtn.style.boxShadow = '0 0 10px rgba(255, 152, 0, 0.4)';
                    playBtn.style.border = '2px solid #ffb74d';
                } else {
                    playBtn.style.background = '';
                    playBtn.style.animation = '';
                    playBtn.style.boxShadow = '';
                    playBtn.style.border = '';
                }
            }
        }
        
        // Update read button
        if (routineBtns.length > 3) {
            const readBtn = routineBtns[3];
            if (readBtn) {
                if (daysSinceRead > 5) {
                    readBtn.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
                    readBtn.style.animation = 'pulse 2s ease-in-out infinite';
                    readBtn.style.boxShadow = '0 0 10px rgba(255, 152, 0, 0.4)';
                    readBtn.style.border = '2px solid #ffb74d';
                } else if (daysSinceRead > 3) {
                    readBtn.style.background = 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)';
                    readBtn.style.animation = 'none';
                    readBtn.style.boxShadow = '0 0 8px rgba(255, 193, 7, 0.3)';
                    readBtn.style.border = '2px solid #ffd54f';
                } else {
                    readBtn.style.background = '';
                    readBtn.style.animation = '';
                    readBtn.style.boxShadow = '';
                    readBtn.style.border = '';
                }
            }
        }
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
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å henge med venner akkurat nå..."
                : "I'm too tired to hang out with friends right now.");
            return;
        }
        
        // Choose a friend to hang out with
        const friends = ['almaVilje', 'celiaRose'];
        const friendKey = friends[Math.floor(Math.random() * friends.length)];
        const friend = this.child.friends[friendKey];
        
        this.spendTimeWithFriend(friendKey);
    }
    
    spendTimeWithFriend(friendKey) {
        if (!this.canPerformAction()) return;
        
        const friend = this.child.friends[friendKey];
        if (!friend) return;
        
        if (this.child.energy < 15) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å henge med " + friend.name + " akkurat nå..."
                : "I'm too tired to hang out with " + friend.name + " right now...");
            return;
        }
        
        // Increase friendship level
        friend.friendshipLevel = Math.min(100, friend.friendshipLevel + 5);
        friend.lastInteraction = this.day;
        
        // Show communication image (phone or mail)
        const communicationImage = this.child.age >= 10 
            ? 'assets/images/nokiaphone.png' 
            : 'assets/images/mailicon.png';
        this.showActivityImage(communicationImage, 2000);
        
        // Social activities with friend
        const activities = [
            { 
                text: this.language === 'no' 
                    ? "Jeg hang med " + friend.name + " i dag! Vi lekte og snakket sammen. Det var så gøy!"
                    : "I hung out with " + friend.name + " today! We played and talked together. It was so fun!",
                social: 20, happiness: 15, energy: -10
            },
            {
                text: this.language === 'no'
                    ? friend.name + " og jeg lekte utendørs sammen. Vi hadde det så gøy!"
                    : friend.name + " and I played outside together. We had so much fun!",
                social: 18, happiness: 18, energy: -12
            },
            {
                text: this.language === 'no'
                    ? "Jeg snakket med " + friend.name + " om dagene våre. Det er fint å ha noen å snakke med."
                    : "I talked with " + friend.name + " about our days. It's nice to have someone to talk to.",
                social: 22, happiness: 12, energy: -8
            }
        ];
        
        const activity = activities[Math.floor(Math.random() * activities.length)];
        this.showDialogue(activity.text);
        
        this.adjustStat('social', activity.social);
        this.adjustStat('happiness', activity.happiness);
        this.adjustStat('energy', activity.energy);
        this.adjustRelationship(2);
        this.setEmotion('happy', 15);
        
        // Add diary entry
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? 'Jeg tilbrakte tid med ' + friend.name + ' i dag. Det var fint.'
                : 'I spent time with ' + friend.name + ' today. It was nice.',
            true
        );
        
        this.showMessage(this.language === 'no'
            ? "Flott sosial interaksjon! Vennskapet med " + friend.name + " vokser."
            : "Great social interaction! Friendship with " + friend.name + " is growing.");
        this.performAction();
        this.advanceTime();
    }
    
    getFriendSupport(friendKey) {
        const friend = this.child.friends[friendKey];
        if (!friend || friend.friendshipLevel < 40) {
            return null; // Friend not close enough
        }
        
        // Friend provides support during difficult times
        if (this.child.happiness < 40 || this.child.resilience < 50) {
            friend.supportReceived++;
            friend.friendshipLevel = Math.min(100, friend.friendshipLevel + 2);
            
            const supportMessages = [
                this.language === 'no'
                    ? friend.name + " støttet meg i dag når jeg følte meg nedfor. Det hjalp så mye."
                    : friend.name + " supported me today when I was feeling down. It helped so much.",
                this.language === 'no'
                    ? "Jeg snakket med " + friend.name + " om det som plager meg. Det føltes trygt."
                    : "I talked with " + friend.name + " about what's bothering me. It felt safe."
            ];
            
            const message = supportMessages[Math.floor(Math.random() * supportMessages.length)];
            this.showDialogue(message);
            
            this.adjustStat('happiness', 10);
            this.adjustStat('social', 8);
            this.child.resilience = Math.min(100, this.child.resilience + 3);
            this.setEmotion('happy', 10);
            this.setEmotion('sad', -5);
            
            this.addAutoDiaryEntry(
                this.language === 'no'
                    ? friend.name + ' støttet meg i dag. Jeg er takknemlig for vennskapet vårt.'
                    : friend.name + ' supported me today. I am grateful for our friendship.',
                true
            );
            
            return true;
        }
        
        return false;
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
            sleepingImg.src = 'assets/images/sleepingbaby.jpg';
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
                sleepingImg.src = 'assets/images/sleepingbaby.jpg';
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
        
        // Show dinner choice menu
        this.showDinnerChoice();
    }
    
    showDinnerChoice() {
        // Show family image if siblings exist
        if (this.child.siblings !== 'none') {
            this.showActivityImage('assets/images/lafamilia.jpg', 2000);
        }
        
        const dinnerOptions = [
            {
                name: this.language === 'no' ? 'Pizza' : 'Pizza',
                cost: 8,
                hunger: 30,
                happiness: 15,
                energy: 5,
                health: -5, // Less healthy
                message: this.language === 'no' 
                    ? "Pizza er godt, men ikke så sunt. Jeg blir mett, men kanskje ikke så mye energi."
                    : "Pizza is good, but not so healthy. I'm full, but maybe not so much energy."
            },
            {
                name: this.language === 'no' ? 'Fisk med grønnsaker' : 'Fish with vegetables',
                cost: 12,
                hunger: 35,
                happiness: 10,
                energy: 15,
                health: 10, // Healthy
                message: this.language === 'no'
                    ? "Fisk og grønnsaker er sunt! Jeg får mye energi og føler meg bra."
                    : "Fish and vegetables are healthy! I get lots of energy and feel good."
            },
            {
                name: this.language === 'no' ? 'Hamburger og pommes' : 'Hamburger and fries',
                cost: 10,
                hunger: 32,
                happiness: 18,
                energy: 8,
                health: -8, // Less healthy
                message: this.language === 'no'
                    ? "Hamburger er digg, men ikke så sunt. Jeg blir mett og glad, men kanskje litt trøtt senere."
                    : "Hamburger is tasty, but not so healthy. I'm full and happy, but maybe a bit tired later."
            },
            {
                name: this.language === 'no' ? 'Pasta med kjøttsaus' : 'Pasta with meat sauce',
                cost: 9,
                hunger: 33,
                happiness: 12,
                energy: 12,
                health: 3, // Moderately healthy
                message: this.language === 'no'
                    ? "Pasta er godt og mettende. Jeg får nok energi til å fortsette dagen."
                    : "Pasta is good and filling. I get enough energy to continue the day."
            },
            {
                name: this.language === 'no' ? 'Salat med kylling' : 'Salad with chicken',
                cost: 11,
                hunger: 28,
                happiness: 8,
                energy: 18,
                health: 15, // Very healthy
                message: this.language === 'no'
                    ? "Salat er veldig sunt! Jeg får mye energi, men kanskje ikke så mett."
                    : "Salad is very healthy! I get lots of energy, but maybe not so full."
            }
        ];
        
        // Check if we have enough money
        const minCost = Math.min(...dinnerOptions.map(opt => opt.cost));
        if (this.child.money < minCost) {
            const noMoneyMsg = this.language === 'no'
                ? "Vi har ikke nok penger for middag... Vi trenger minst " + minCost + " kroner, men har bare " + this.child.money + " kroner. Kanskje jeg burde jobbe først?"
                : "We don't have enough money for dinner... We need at least " + minCost + " kroner, but only have " + this.child.money + " kroner. Maybe I should work first?";
            this.showDialogue(noMoneyMsg);
            this.showMessage(this.language === 'no' 
                ? "💡 Tips: Jobb for å tjene penger så du kan kjøpe mat! Mat er viktig!"
                : "💡 Tip: Work to earn money so you can buy food! Food is important!");
            return;
        }
        
        // Show dinner choice dialog
        const dinnerMsg = this.language === 'no'
            ? "Hva skal vi spise til middag i dag?"
            : "What should we eat for dinner today?";
        this.showDialogue(dinnerMsg);
        
        // Create choice buttons
        setTimeout(() => {
            const choiceContainer = document.createElement('div');
            choiceContainer.id = 'dinnerChoiceContainer';
            choiceContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #fff0f5 0%, #e0f7ff 100%); padding: 20px; border-radius: 20px; border: 3px solid #ff00ff; z-index: 10000; max-width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 0 30px rgba(255,0,255,0.5);';
            
            const title = document.createElement('h3');
            title.textContent = this.language === 'no' ? '🍽️ Velg middag' : '🍽️ Choose dinner';
            title.style.cssText = 'margin-top: 0; text-align: center;';
            choiceContainer.appendChild(title);
            
            dinnerOptions.forEach((option, index) => {
                const btn = document.createElement('button');
                btn.className = 'btn-primary';
                btn.style.cssText = 'display: block; width: 100%; margin: 10px 0; padding: 15px; text-align: left;';
                btn.innerHTML = `<strong>${option.name}</strong><br>
                    <small>💰 ${option.cost} kr | 🍽️ Hunger: +${option.hunger} | 😊 Happiness: +${option.happiness} | ⚡ Energy: +${option.energy} | ${option.health > 0 ? '✅' : '⚠️'} Health: ${option.health > 0 ? '+' : ''}${option.health}</small>`;
                
                btn.onclick = () => {
                    this.chooseDinner(option);
                    choiceContainer.remove();
                };
                
                // Disable if not enough money
                if (this.child.money < option.cost) {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                }
                
                choiceContainer.appendChild(btn);
            });
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = this.language === 'no' ? 'Avbryt' : 'Cancel';
            cancelBtn.style.cssText = 'display: block; width: 100%; margin-top: 10px; padding: 10px; background: #ccc; border: none; border-radius: 10px; cursor: pointer;';
            cancelBtn.onclick = () => choiceContainer.remove();
            choiceContainer.appendChild(cancelBtn);
            
            document.body.appendChild(choiceContainer);
        }, 500);
    }
    
    chooseDinner(option) {
        if (this.child.money < option.cost) {
            this.showMessage(this.language === 'no' 
                ? "Du har ikke nok penger for dette valget."
                : "You don't have enough money for this choice.");
            return;
        }
        
        // Deduct cost
        this.child.money = Math.max(0, this.child.money - option.cost);
        this.child.lastDinnerChoice = option.name;
        
        // Track that child was fed
        this.child.lastFed = this.day;
        this.child.daysWithoutFood = 0;
        
        // Show activity image for babies
        if (this.child.age <= 2) {
            this.showActivityImage('assets/images/babybottle.png', 2000);
        } else {
            // Show happy/sad images based on choice quality
            if (option.health > 5) {
                const happyImage = this.child.gender === 'girl' 
                    ? 'assets/images/happygirl.jpg' 
                    : 'assets/images/happyboy.jpg';
                this.showActivityImage(happyImage, 2000);
            } else if (option.health < -5) {
                const sadImage = this.child.gender === 'girl' 
                    ? 'assets/images/sadgirl.jpg' 
                    : 'assets/images/sadboy.jpg';
                this.showActivityImage(sadImage, 2000);
            }
        }
        
        // Apply effects
        this.adjustStat('hunger', option.hunger);
        this.adjustStat('happiness', option.happiness);
        this.adjustStat('energy', option.energy);
        
        // Health effects (affects energy and happiness over time)
        if (option.health > 0) {
            this.adjustStat('energy', Math.floor(option.health / 2));
            this.setEmotion('happy', 5);
        } else if (option.health < 0) {
            this.adjustStat('energy', Math.floor(option.health / 2));
            this.setEmotion('sad', 3);
        }
        
        this.adjustRelationship(2);
        this.setEmotion('happy', 10);
        this.setEmotion('anxious', -5);
        
        // Show message
        this.showDialogue(option.message);
        
        // Show cost message
        if (this.child.age >= 5) {
            const costMsg = this.language === 'no'
                ? "Kjøpte " + option.name + " for " + option.cost + " kroner. Gjenstående: " + this.child.money + " kroner."
                : "Bought " + option.name + " for " + option.cost + " kroner. Remaining: " + this.child.money + " kroner.";
            setTimeout(() => this.showMessage(costMsg), 1000);
        }
        
        // Learning about consequences
        if (option.health < 0) {
            setTimeout(() => {
                const lessonMsg = this.language === 'no'
                    ? "💡 Læring: Usunn mat kan gi deg kortvarig glede, men ikke så mye energi. Sunn mat gir deg mer energi på sikt!"
                    : "💡 Learning: Unhealthy food can give you short-term happiness, but not so much energy. Healthy food gives you more energy in the long run!";
                this.showMessage(lessonMsg);
            }, 2000);
        }
        
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Problem situations with choices and consequences
    triggerProblemSituation() {
        // Randomly trigger problem situations (age 5+)
        if (this.child.age < 5 || Math.random() > 0.3) {
            return;
        }
        
        const problems = [
            {
                name: 'siblingConflict',
                condition: () => this.child.siblings !== 'none',
                question: this.language === 'no'
                    ? "Din søsken har tatt leketøyet ditt uten å spørre. Hva gjør du?"
                    : "Your sibling took your toy without asking. What do you do?",
                choices: [
                    {
                        text: this.language === 'no' ? "Snakk rolig med søsken" : "Talk calmly with sibling",
                        good: true,
                        happiness: 5,
                        social: 8,
                        siblingRelationship: 10,
                        message: this.language === 'no'
                            ? "Du snakket rolig med søsken. De forsto og ga leketøyet tilbake. Godt valg!"
                            : "You talked calmly with your sibling. They understood and gave the toy back. Good choice!",
                        image: 'assets/images/happygirl.jpg'
                    },
                    {
                        text: this.language === 'no' ? "Ta leketøyet tilbake med makt" : "Take the toy back by force",
                        good: false,
                        happiness: -5,
                        social: -5,
                        siblingRelationship: -15,
                        message: this.language === 'no'
                            ? "Du tok leketøyet med makt. Søsken ble lei seg og krangelen ble verre. Dette var ikke et godt valg."
                            : "You took the toy by force. Your sibling got sad and the conflict got worse. This was not a good choice.",
                        image: 'assets/images/sadgirl.jpg'
                    },
                    {
                        text: this.language === 'no' ? "Gå til foreldre for hjelp" : "Go to parents for help",
                        good: true,
                        happiness: 3,
                        social: 5,
                        siblingRelationship: 5,
                        message: this.language === 'no'
                            ? "Du ba foreldre om hjelp. De hjalp dere med å løse konflikten. Godt valg!"
                            : "You asked parents for help. They helped you solve the conflict. Good choice!",
                        image: 'assets/images/lafamilia.jpg'
                    }
                ]
            },
            {
                name: 'friendBullying',
                condition: () => this.child.age >= 7,
                question: this.language === 'no'
                    ? "Du ser at en venn blir mobbet på skolen. Hva gjør du?"
                    : "You see a friend being bullied at school. What do you do?",
                choices: [
                    {
                        text: this.language === 'no' ? "Hjelp vennen og si ifra til lærer" : "Help friend and tell teacher",
                        good: true,
                        happiness: 10,
                        social: 15,
                        helpingOthers: 1,
                        message: this.language === 'no'
                            ? "Du hjalp vennen og sa ifra. Dette var modig og riktig! Du lærte at å hjelpe andre er viktig."
                            : "You helped your friend and told the teacher. This was brave and right! You learned that helping others is important.",
                        image: 'assets/images/happyboy.jpg'
                    },
                    {
                        text: this.language === 'no' ? "Gjør ingenting, gå videre" : "Do nothing, walk away",
                        good: false,
                        happiness: -8,
                        social: -10,
                        message: this.language === 'no'
                            ? "Du gjorde ingenting. Vennen ble skuffet og du følte deg dårlig. Dette var ikke et godt valg."
                            : "You did nothing. Your friend was disappointed and you felt bad. This was not a good choice.",
                        image: 'assets/images/sadboy.jpg'
                    },
                    {
                        text: this.language === 'no' ? "Prøv å snakke med mobberne" : "Try to talk to the bullies",
                        good: true,
                        happiness: 5,
                        social: 8,
                        resilience: 5,
                        message: this.language === 'no'
                            ? "Du prøvde å snakke med mobberne. Det var modig, men ikke alltid trygt. Godt forsøk!"
                            : "You tried to talk to the bullies. It was brave, but not always safe. Good attempt!",
                        image: 'assets/images/happyboy.jpg'
                    }
                ]
            },
            {
                name: 'homeworkChoice',
                condition: () => this.child.age >= 7 && this.child.age <= 17,
                question: this.language === 'no'
                    ? "Du har lekser, men vennene dine vil at du skal leke. Hva gjør du?"
                    : "You have homework, but your friends want you to play. What do you do?",
                choices: [
                    {
                        text: this.language === 'no' ? "Gjør lekser først, leke senere" : "Do homework first, play later",
                        good: true,
                        learning: 15,
                        studyLevel: 5,
                        happiness: 5,
                        message: this.language === 'no'
                            ? "Du gjorde lekser først. Du lærte at å prioritere er viktig. Nå kan du leke med god samvittighet!"
                            : "You did homework first. You learned that prioritizing is important. Now you can play with a clear conscience!",
                        image: 'assets/images/happyboy.jpg'
                    },
                    {
                        text: this.language === 'no' ? "Lek først, gjør lekser senere" : "Play first, do homework later",
                        good: false,
                        learning: -5,
                        studyLevel: -3,
                        happiness: 10,
                        energy: -10,
                        message: this.language === 'no'
                            ? "Du lekte først, men ble for trøtt til å gjøre lekser. Du lærte at det er vanskelig å gjøre lekser når man er trøtt."
                            : "You played first, but got too tired to do homework. You learned that it's hard to do homework when you're tired.",
                        image: 'assets/images/sadboy.jpg'
                    },
                    {
                        text: this.language === 'no' ? "Ikke gjør lekser i det hele tatt" : "Don't do homework at all",
                        good: false,
                        learning: -10,
                        studyLevel: -8,
                        happiness: 15,
                        social: 5,
                        message: this.language === 'no'
                            ? "Du valgte å ikke gjøre lekser. Du hadde det gøy, men falt bak på skolen. Dette var ikke et godt valg på sikt."
                            : "You chose not to do homework. You had fun, but fell behind at school. This was not a good choice in the long run.",
                        image: 'assets/images/sadgirl.jpg'
                    }
                ]
            },
            {
                name: 'elderlyHelp',
                condition: () => this.child.age >= 10,
                question: this.language === 'no'
                    ? "Du ser en eldre dame som sliter med å bære handleposer. Hva gjør du?"
                    : "You see an elderly lady struggling to carry shopping bags. What do you do?",
                choices: [
                    {
                        text: this.language === 'no' ? "Hjelp henne med posene" : "Help her with the bags",
                        good: true,
                        happiness: 15,
                        social: 10,
                        helpingOthers: 1,
                        message: this.language === 'no'
                            ? "Du hjalp den eldre damen. Hun var veldig takknemlig! Du lærte at å hjelpe andre gir deg en god følelse."
                            : "You helped the elderly lady. She was very grateful! You learned that helping others gives you a good feeling.",
                        image: 'assets/images/gratefuloldlady.jpg'
                    },
                    {
                        text: this.language === 'no' ? "Gå forbi uten å hjelpe" : "Walk past without helping",
                        good: false,
                        happiness: -5,
                        social: -3,
                        message: this.language === 'no'
                            ? "Du gikk forbi uten å hjelpe. Du følte deg litt dårlig etterpå. Dette var ikke et godt valg."
                            : "You walked past without helping. You felt a bit bad afterwards. This was not a good choice.",
                        image: 'assets/images/sadboy.jpg'
                    }
                ]
            }
        ];
        
        // Filter problems based on conditions
        const availableProblems = problems.filter(p => !p.condition || p.condition());
        
        if (availableProblems.length === 0) return;
        
        const problem = availableProblems[Math.floor(Math.random() * availableProblems.length)];
        
        // Show problem
        this.showDialogue(problem.question);
        
        // Show choice buttons after a delay
        setTimeout(() => {
            const choiceContainer = document.createElement('div');
            choiceContainer.id = 'problemChoiceContainer';
            choiceContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #fff0f5 0%, #e0f7ff 100%); padding: 20px; border-radius: 20px; border: 3px solid #ff00ff; z-index: 10000; max-width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 0 30px rgba(255,0,255,0.5);';
            
            const title = document.createElement('h3');
            title.textContent = this.language === 'no' ? '🤔 Hva vil du gjøre?' : '🤔 What will you do?';
            title.style.cssText = 'margin-top: 0; text-align: center;';
            choiceContainer.appendChild(title);
            
            problem.choices.forEach((choice, index) => {
                const btn = document.createElement('button');
                btn.className = 'btn-primary';
                btn.style.cssText = `display: block; width: 100%; margin: 10px 0; padding: 15px; text-align: left; ${choice.good ? 'border-left: 5px solid #4CAF50;' : 'border-left: 5px solid #f44336;'}`;
                btn.innerHTML = `<strong>${choice.text}</strong>`;
                
                btn.onclick = () => {
                    this.makeProblemChoice(problem, choice);
                    choiceContainer.remove();
                };
                
                choiceContainer.appendChild(btn);
            });
            
            document.body.appendChild(choiceContainer);
        }, 1000);
    }
    
    makeProblemChoice(problem, choice) {
        // Track choice
        if (!this.child.problemChoices) {
            this.child.problemChoices = [];
        }
        this.child.problemChoices.push({
            problem: problem.name,
            choice: choice.text,
            good: choice.good,
            day: this.day
        });
        
        // Apply consequences
        if (choice.happiness !== undefined) this.adjustStat('happiness', choice.happiness);
        if (choice.social !== undefined) this.adjustStat('social', choice.social);
        if (choice.learning !== undefined) this.adjustStat('learning', choice.learning);
        if (choice.studyLevel !== undefined) this.child.studyLevel = Math.max(0, Math.min(100, this.child.studyLevel + choice.studyLevel));
        if (choice.energy !== undefined) this.adjustStat('energy', choice.energy);
        if (choice.siblingRelationship !== undefined) this.child.siblingRelationship = Math.max(0, Math.min(100, this.child.siblingRelationship + choice.siblingRelationship));
        if (choice.helpingOthers !== undefined) this.child.helpingOthers += choice.helpingOthers;
        if (choice.resilience !== undefined) this.child.resilience = Math.max(0, Math.min(100, this.child.resilience + choice.resilience));
        
        // Track good vs bad choices
        if (choice.good) {
            this.child.goodChoices++;
        } else {
            this.child.shortTermChoices++;
        }
        
        // Show image if available
        if (choice.image) {
            this.showActivityImage(choice.image, 2500);
        }
        
        // Show message
        this.showDialogue(choice.message);
        
        // Show learning message about consequences
        setTimeout(() => {
            const lessonMsg = choice.good 
                ? (this.language === 'no'
                    ? "💡 Læring: Gode valg gir deg positive konsekvenser på sikt. Du lærte noe viktig i dag!"
                    : "💡 Learning: Good choices give you positive consequences in the long run. You learned something important today!")
                : (this.language === 'no'
                    ? "💡 Læring: Dårlige valg kan gi deg kortsiktig glede, men negative konsekvenser på sikt. Prøv å tenke på fremtiden neste gang!"
                    : "💡 Learning: Bad choices can give you short-term happiness, but negative consequences in the long run. Try to think about the future next time!");
            this.showMessage(lessonMsg);
        }, 2000);
        
        // Add diary entry
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? 'I dag måtte jeg ta et valg: ' + problem.question + ' Jeg valgte: ' + choice.text + '. ' + (choice.good ? 'Dette var et godt valg!' : 'Dette var kanskje ikke det beste valget.')
                : 'Today I had to make a choice: ' + problem.question + ' I chose: ' + choice.text + '. ' + (choice.good ? 'This was a good choice!' : 'This might not have been the best choice.'),
            choice.good
        );
        
        this.saveGame();
    }
    
    // Age-specific learning activities
    updateAgeSpecificButtons() {
        // Show/hide age-specific learning buttons
        const pottyBtn = document.getElementById('pottyTrainingBtn');
        const spellingBtn = document.getElementById('spellingBtn');
        const bikeBtn = document.getElementById('bikeBtn');
        const swimBtn = document.getElementById('swimBtn');
        
        // Pottetrening (1-2 år)
        if (pottyBtn) {
            if (this.child.age >= 1 && this.child.age <= 2) {
                pottyBtn.style.display = 'inline-block';
            } else {
                pottyBtn.style.display = 'none';
            }
        }
        
        // Stave (2-4 år)
        if (spellingBtn) {
            if (this.child.age >= 2 && this.child.age <= 4) {
                spellingBtn.style.display = 'inline-block';
            } else {
                spellingBtn.style.display = 'none';
            }
        }
        
        // Sykkel (6-7 år)
        if (bikeBtn) {
            if (this.child.age >= 6 && this.child.age <= 7) {
                bikeBtn.style.display = 'inline-block';
            } else {
                bikeBtn.style.display = 'none';
            }
        }
        
        // Svømme (5+ år)
        if (swimBtn) {
            if (this.child.age >= 5) {
                swimBtn.style.display = 'inline-block';
            } else {
                swimBtn.style.display = 'none';
            }
        }
        
        // Karriere-valg (16+ år, ikke allerede valgt)
        const chooseCareerBtn = document.getElementById('chooseCareerBtn');
        if (chooseCareerBtn) {
            if (this.child.age >= 16 && !this.child.chosenCareer) {
                chooseCareerBtn.style.display = 'inline-block';
            } else {
                chooseCareerBtn.style.display = 'none';
            }
        }
    }
    
    // Pottetrening for 1-2 år
    pottyTraining() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 1 || this.child.age > 2) {
            this.showMessage(this.language === 'no' 
                ? "Pottetrening er for barn mellom 1-2 år."
                : "Potty training is for children between 1-2 years old.");
            return;
        }
        
        this.adjustStat('happiness', 8);
        this.adjustStat('learning', 12);
        this.adjustStat('energy', -5);
        this.setEmotion('happy', 10);
        this.setEmotion('curious', 8);
        this.adjustRelationship(2);
        
        const messages = this.language === 'no' ? [
            "Jeg lærer å bruke potten! Det er spennende!",
            "Pottetrening er vanskelig, men jeg prøver!",
            "Jeg blir bedre på å bruke potten hver dag!"
        ] : [
            "I'm learning to use the potty! It's exciting!",
            "Potty training is hard, but I'm trying!",
            "I'm getting better at using the potty every day!"
        ];
        
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Learning fact
        setTimeout(() => {
            const fact = this.language === 'no'
                ? "💡 Læring: Pottetrening lærer barn selvkontroll og tålmodighet. Det er viktig å være støttende og positiv!"
                : "💡 Learning: Potty training teaches children self-control and patience. It's important to be supportive and positive!";
            this.showMessage(fact);
        }, 1000);
        
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Staveøvelser for 2-4 år
    learnSpelling() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 2 || this.child.age > 4) {
            this.showMessage(this.language === 'no' 
                ? "Staveøvelser er for barn mellom 2-4 år."
                : "Spelling exercises are for children between 2-4 years old.");
            return;
        }
        
        if (this.child.energy < 10) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å stave akkurat nå..."
                : "I'm too tired to spell right now...");
            return;
        }
        
        // Simple words for spelling
        const words = this.language === 'no' ? [
            { word: "MAMMA", letters: ["M", "A", "M", "M", "A"] },
            { word: "PAPPA", letters: ["P", "A", "P", "P", "A"] },
            { word: "BIL", letters: ["B", "I", "L"] },
            { word: "HUS", letters: ["H", "U", "S"] },
            { word: "BARN", letters: ["B", "A", "R", "N"] },
            { word: "SOL", letters: ["S", "O", "L"] }
        ] : [
            { word: "MOM", letters: ["M", "O", "M"] },
            { word: "DAD", letters: ["D", "A", "D"] },
            { word: "CAT", letters: ["C", "A", "T"] },
            { word: "DOG", letters: ["D", "O", "G"] },
            { word: "SUN", letters: ["S", "U", "N"] },
            { word: "CAR", letters: ["C", "A", "R"] }
        ];
        
        const selectedWord = words[Math.floor(Math.random() * words.length)];
        
        this.showDialogue(this.language === 'no' 
            ? "La oss stave ordet '" + selectedWord.word + "' sammen! Bokstavene er: " + selectedWord.letters.join(", ")
            : "Let's spell the word '" + selectedWord.word + "' together! The letters are: " + selectedWord.letters.join(", "));
        
        // Interactive spelling game
        setTimeout(() => {
            const spellingContainer = document.createElement('div');
            spellingContainer.id = 'spellingContainer';
            spellingContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #fff0f5 0%, #e0f7ff 100%); padding: 30px; border-radius: 20px; border: 3px solid #ff00ff; z-index: 10000; max-width: 90%; box-shadow: 0 0 30px rgba(255,0,255,0.5);';
            
            const title = document.createElement('h3');
            title.textContent = this.language === 'no' ? '🔤 Stave: ' + selectedWord.word : '🔤 Spell: ' + selectedWord.word;
            title.style.cssText = 'margin-top: 0; text-align: center;';
            spellingContainer.appendChild(title);
            
            const lettersContainer = document.createElement('div');
            lettersContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center; margin: 20px 0; flex-wrap: wrap;';
            
            // Shuffled letters
            const shuffledLetters = [...selectedWord.letters].sort(() => Math.random() - 0.5);
            const selectedLetters = [];
            
            shuffledLetters.forEach((letter, idx) => {
                const letterBtn = document.createElement('button');
                letterBtn.textContent = letter;
                letterBtn.style.cssText = 'padding: 15px 20px; font-size: 1.5em; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; min-width: 50px;';
                letterBtn.onclick = () => {
                    if (selectedLetters.length < selectedWord.letters.length) {
                        selectedLetters.push(letter);
                        letterBtn.disabled = true;
                        letterBtn.style.opacity = '0.5';
                        updateSpellingDisplay();
                    }
                };
                lettersContainer.appendChild(letterBtn);
            });
            
            const wordDisplay = document.createElement('div');
            wordDisplay.id = 'wordDisplay';
            wordDisplay.style.cssText = 'font-size: 2em; text-align: center; margin: 20px 0; min-height: 50px; letter-spacing: 10px;';
            wordDisplay.textContent = '_ '.repeat(selectedWord.letters.length);
            
            const updateSpellingDisplay = () => {
                let display = '';
                for (let i = 0; i < selectedWord.letters.length; i++) {
                    display += (selectedLetters[i] || '_') + ' ';
                }
                wordDisplay.textContent = display.trim();
                
                if (selectedLetters.length === selectedWord.letters.length) {
                    const isCorrect = selectedLetters.every((letter, idx) => letter === selectedWord.letters[idx]);
                    
                    setTimeout(() => {
                        if (isCorrect) {
                            wordDisplay.style.color = '#4CAF50';
                            wordDisplay.textContent = selectedWord.word;
                            this.adjustStat('happiness', 15);
                            this.adjustStat('learning', 20);
                            this.setEmotion('happy', 20);
                            this.showDialogue(this.language === 'no' 
                                ? "Riktig! Jeg kan stave '" + selectedWord.word + "'!"
                                : "Correct! I can spell '" + selectedWord.word + "'!");
                            
                            setTimeout(() => {
                                const fact = this.language === 'no'
                                    ? "💡 Læring: Å stave ord hjelper med å bygge ordforråd og forståelse av språk. Det er første steg mot lesing!"
                                    : "💡 Learning: Spelling words helps build vocabulary and language understanding. It's the first step towards reading!";
                                this.showMessage(fact);
                                spellingContainer.remove();
                                this.performAction();
                                this.advanceTime();
                                this.saveGame();
                            }, 2000);
                        } else {
                            wordDisplay.style.color = '#f44336';
                            this.showDialogue(this.language === 'no' 
                                ? "Hmm, det var ikke riktig. La oss prøve igjen! Riktig rekkefølge er: " + selectedWord.letters.join(", ")
                                : "Hmm, that wasn't right. Let's try again! The correct order is: " + selectedWord.letters.join(", "));
                            selectedLetters.length = 0;
                            updateSpellingDisplay();
                            // Re-enable buttons
                            lettersContainer.querySelectorAll('button').forEach(btn => {
                                btn.disabled = false;
                                btn.style.opacity = '1';
                            });
                        }
                    }, 500);
                }
            };
            
            spellingContainer.appendChild(wordDisplay);
            spellingContainer.appendChild(lettersContainer);
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = this.language === 'no' ? 'Avbryt' : 'Cancel';
            cancelBtn.style.cssText = 'display: block; width: 100%; margin-top: 10px; padding: 10px; background: #ccc; border: none; border-radius: 10px; cursor: pointer;';
            cancelBtn.onclick = () => spellingContainer.remove();
            spellingContainer.appendChild(cancelBtn);
            
            document.body.appendChild(spellingContainer);
        }, 1000);
        
        this.adjustStat('energy', -8);
    }
    
    // Lære å sykle (6-7 år)
    learnBike() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 6 || this.child.age > 7) {
            this.showMessage(this.language === 'no' 
                ? "Sykkeletrening er for barn mellom 6-7 år."
                : "Bike training is for children between 6-7 years old.");
            return;
        }
        
        if (this.child.energy < 15) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å øve på sykkel akkurat nå..."
                : "I'm too tired to practice biking right now...");
            return;
        }
        
        // Show bike image
        const bikeImage = this.child.gender === 'girl' 
            ? 'assets/images/girlonbike.jpg' 
            : 'assets/images/boyonbike.jpg';
        this.showActivityImage(bikeImage, 3000);
        
        // Progress tracking
        if (!this.child.bikeProgress) this.child.bikeProgress = 0;
        this.child.bikeProgress = Math.min(100, this.child.bikeProgress + 15);
        
        const progress = this.child.bikeProgress;
        let message = "";
        
        if (progress < 30) {
            message = this.language === 'no'
                ? "Jeg lærer å balansere på sykkelen. Det er vanskelig, men jeg prøver!"
                : "I'm learning to balance on the bike. It's hard, but I'm trying!";
        } else if (progress < 60) {
            message = this.language === 'no'
                ? "Jeg kan balansere litt nå! Jeg lærer å tråkke og styre samtidig."
                : "I can balance a bit now! I'm learning to pedal and steer at the same time.";
        } else if (progress < 90) {
            message = this.language === 'no'
                ? "Jeg blir bedre! Jeg kan sykle korte strekninger uten hjelp!"
                : "I'm getting better! I can bike short distances without help!";
        } else {
            message = this.language === 'no'
                ? "Jeg kan sykle! Jeg er så stolt! Dette er en stor milepæl!"
                : "I can bike! I'm so proud! This is a big milestone!";
        }
        
        this.showDialogue(message);
        
        this.adjustStat('happiness', 15);
        this.adjustStat('learning', 12);
        this.adjustStat('energy', -15);
        this.adjustStat('social', 5);
        this.setEmotion('happy', 20);
        this.setEmotion('curious', 15);
        this.child.resilience = Math.min(100, this.child.resilience + 3);
        this.adjustRelationship(2);
        
        // Learning fact
        setTimeout(() => {
            const fact = this.language === 'no'
                ? "💡 Læring: Å lære å sykle krever tålmodighet, balanse og mot. Det lærer også selvdisiplin og utholdenhet!"
                : "💡 Learning: Learning to bike requires patience, balance and courage. It also teaches self-discipline and perseverance!";
            this.showMessage(fact);
        }, 2000);
        
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Lære å svømme (5+ år)
    learnSwimming() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 5) {
            this.showMessage(this.language === 'no' 
                ? "Svømmeundervisning er for barn fra 5 år og oppover."
                : "Swimming lessons are for children from 5 years old and up.");
            return;
        }
        
        if (this.child.energy < 20) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å svømme akkurat nå..."
                : "I'm too tired to swim right now...");
            return;
        }
        
        // Progress tracking
        if (!this.child.swimmingProgress) this.child.swimmingProgress = 0;
        this.child.swimmingProgress = Math.min(100, this.child.swimmingProgress + 10);
        
        const progress = this.child.swimmingProgress;
        let message = "";
        
        if (progress < 25) {
            message = this.language === 'no'
                ? "Jeg lærer å flyte i vannet. Det er vanskelig, men jeg prøver!"
                : "I'm learning to float in the water. It's hard, but I'm trying!";
        } else if (progress < 50) {
            message = this.language === 'no'
                ? "Jeg kan flyte nå! Jeg lærer å sparke med beina."
                : "I can float now! I'm learning to kick with my legs.";
        } else if (progress < 75) {
            message = this.language === 'no'
                ? "Jeg kan svømme litt nå! Jeg lærer å koordinere armer og ben."
                : "I can swim a bit now! I'm learning to coordinate arms and legs.";
        } else {
            message = this.language === 'no'
                ? "Jeg kan svømme! Dette er viktig for sikkerhet og er også god trening!"
                : "I can swim! This is important for safety and is also great exercise!";
        }
        
        this.showDialogue(message);
        
        this.adjustStat('happiness', 12);
        this.adjustStat('learning', 15);
        this.adjustStat('energy', -20);
        this.adjustStat('social', 8);
        this.setEmotion('happy', 18);
        this.child.resilience = Math.min(100, this.child.resilience + 2);
        this.adjustRelationship(2);
        
        // Learning fact
        setTimeout(() => {
            const fact = this.language === 'no'
                ? "💡 Læring: Svømming er en livsviktig ferdighet for sikkerhet. Det er også utmerket trening for hele kroppen!"
                : "💡 Learning: Swimming is a vital skill for safety. It's also excellent exercise for the whole body!";
            this.showMessage(fact);
        }, 2000);
        
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Lære å dele
    learnSharing() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt akkurat nå..."
                : "I'm too tired right now...");
            return;
        }
        
        // Show family image if siblings exist
        if (this.child.siblings !== 'none') {
            this.showActivityImage('assets/images/lafamilia.jpg', 2000);
        }
        
        this.adjustStat('happiness', 10);
        this.adjustStat('social', 15);
        this.adjustStat('learning', 8);
        this.adjustStat('energy', -5);
        this.setEmotion('happy', 15);
        this.adjustRelationship(3);
        
        if (this.child.siblings !== 'none') {
            this.child.siblingRelationship = Math.min(100, (this.child.siblingRelationship || 50) + 10);
        }
        
        const messages = this.language === 'no' ? [
            "Jeg lærte å dele leketøyene mine med andre. Det føles bra å være snill!",
            "Når jeg deler, blir andre glade og jeg blir også glad!",
            "Å dele lærer meg at det er viktig å tenke på andre også."
        ] : [
            "I learned to share my toys with others. It feels good to be kind!",
            "When I share, others become happy and I become happy too!",
            "Sharing teaches me that it's important to think about others too."
        ];
        
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Learning fact
        setTimeout(() => {
            const fact = this.language === 'no'
                ? "💡 Læring: Å dele lærer oss empati og sosial intelligens. Det bygger gode relasjoner og gjør verden bedre!"
                : "💡 Learning: Sharing teaches us empathy and social intelligence. It builds good relationships and makes the world better!";
            this.showMessage(fact);
        }, 1000);
        
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Lære å respektere forskjeller
    learnRespect() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt akkurat nå..."
                : "I'm too tired right now...");
            return;
        }
        
        this.adjustStat('happiness', 8);
        this.adjustStat('social', 18);
        this.adjustStat('learning', 12);
        this.adjustStat('energy', -5);
        this.setEmotion('curious', 15);
        this.adjustRelationship(2);
        
        const messages = this.language === 'no' ? [
            "Jeg lærte at alle er forskjellige, og det er greit! Vi skal respektere hverandre.",
            "Det er viktig å forstå at folk har ulike bakgrunner og opplevelser. Det gjør verden interessant!",
            "Å respektere forskjeller lærer meg å være åpen og inkluderende."
        ] : [
            "I learned that everyone is different, and that's okay! We should respect each other.",
            "It's important to understand that people have different backgrounds and experiences. That makes the world interesting!",
            "Respecting differences teaches me to be open and inclusive."
        ];
        
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        
        // Learning fact
        setTimeout(() => {
            const fact = this.language === 'no'
                ? "💡 Læring: Å respektere forskjeller lærer oss toleranse og forståelse. Det er grunnlaget for et inkluderende samfunn!"
                : "💡 Learning: Respecting differences teaches us tolerance and understanding. It's the foundation of an inclusive society!";
            this.showMessage(fact);
        }, 1000);
        
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Lære tålmodighet
    learnPatience() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt akkurat nå..."
                : "I'm too tired right now...");
            return;
        }
        
        // Interactive patience exercise
        this.showDialogue(this.language === 'no' 
            ? "La oss øve på tålmodighet! Jeg skal vente i 5 sekunder uten å gjøre noe..."
            : "Let's practice patience! I'll wait for 5 seconds without doing anything...");
        
        setTimeout(() => {
            const patienceContainer = document.createElement('div');
            patienceContainer.id = 'patienceContainer';
            patienceContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #fff0f5 0%, #e0f7ff 100%); padding: 30px; border-radius: 20px; border: 3px solid #ff00ff; z-index: 10000; text-align: center; box-shadow: 0 0 30px rgba(255,0,255,0.5);';
            
            const title = document.createElement('h3');
            title.textContent = this.language === 'no' ? '⏳ Tålmodighet-øvelse' : '⏳ Patience Exercise';
            title.style.cssText = 'margin-top: 0;';
            patienceContainer.appendChild(title);
            
            const timer = document.createElement('div');
            timer.id = 'patienceTimer';
            timer.style.cssText = 'font-size: 3em; margin: 20px 0;';
            timer.textContent = '5';
            patienceContainer.appendChild(timer);
            
            const instruction = document.createElement('p');
            instruction.textContent = this.language === 'no' 
                ? 'Vent rolig... Ikke klikk på noe!'
                : 'Wait calmly... Don\'t click anything!';
            patienceContainer.appendChild(instruction);
            
            document.body.appendChild(patienceContainer);
            
            let countdown = 5;
            const countdownInterval = setInterval(() => {
                countdown--;
                timer.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    timer.textContent = this.language === 'no' ? '✓ Ferdig!' : '✓ Done!';
                    timer.style.color = '#4CAF50';
                    
                    this.adjustStat('happiness', 12);
                    this.adjustStat('learning', 15);
                    this.adjustStat('energy', -3);
                    this.setEmotion('happy', 15);
                    this.child.resilience = Math.min(100, (this.child.resilience || 50) + 5);
                    this.adjustRelationship(2);
                    
                    this.showDialogue(this.language === 'no' 
                        ? "Jeg klarte det! Jeg ventet tålmodig. Det føles bra å ha selvkontroll!"
                        : "I did it! I waited patiently. It feels good to have self-control!");
                    
                    setTimeout(() => {
                        const fact = this.language === 'no'
                            ? "💡 Læring: Tålmodighet er en viktig ferdighet. Det hjelper oss med å håndtere frustrasjon og gjøre bedre valg!"
                            : "💡 Learning: Patience is an important skill. It helps us handle frustration and make better choices!";
                        this.showMessage(fact);
                        patienceContainer.remove();
                        this.performAction();
                        this.advanceTime();
                        this.saveGame();
                    }, 2000);
                }
            }, 1000);
        }, 1000);
    }
    
    // Lære selvdisiplin
    learnSelfDiscipline() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 5) {
            this.showMessage(this.language === 'no' 
                ? "Selvdisiplin-øvelser er for barn fra 5 år og oppover."
                : "Self-discipline exercises are for children from 5 years old and up.");
            return;
        }
        
        if (this.child.energy < 15) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt akkurat nå..."
                : "I'm too tired right now...");
            return;
        }
        
        // Self-discipline exercise: complete a task step by step
        this.showDialogue(this.language === 'no' 
            ? "La oss øve på selvdisiplin! Jeg skal fullføre en oppgave steg for steg..."
            : "Let's practice self-discipline! I'll complete a task step by step...");
        
        setTimeout(() => {
            const tasks = this.language === 'no' ? [
                { name: "Rydd rommet", steps: ["1. Legg leker i eske", "2. Rydd seng", "3. Organiser bøker"] },
                { name: "Fullfør lekser", steps: ["1. Les oppgaven", "2. Tenk gjennom løsningen", "3. Skriv ned svaret"] },
                { name: "Forbered til dagen", steps: ["1. Velg klær", "2. Pakk skolesekken", "3. Sjekk at alt er klart"] }
            ] : [
                { name: "Clean room", steps: ["1. Put toys in box", "2. Make bed", "3. Organize books"] },
                { name: "Complete homework", steps: ["1. Read the task", "2. Think through solution", "3. Write down answer"] },
                { name: "Prepare for day", steps: ["1. Choose clothes", "2. Pack school bag", "3. Check everything is ready"] }
            ];
            
            const task = tasks[Math.floor(Math.random() * tasks.length)];
            
            const disciplineContainer = document.createElement('div');
            disciplineContainer.id = 'disciplineContainer';
            disciplineContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #fff0f5 0%, #e0f7ff 100%); padding: 30px; border-radius: 20px; border: 3px solid #ff00ff; z-index: 10000; max-width: 90%; box-shadow: 0 0 30px rgba(255,0,255,0.5);';
            
            const title = document.createElement('h3');
            title.textContent = this.language === 'no' ? '🎯 Oppgave: ' + task.name : '🎯 Task: ' + task.name;
            title.style.cssText = 'margin-top: 0; text-align: center;';
            disciplineContainer.appendChild(title);
            
            const stepsList = document.createElement('div');
            stepsList.id = 'stepsList';
            stepsList.style.cssText = 'margin: 20px 0;';
            
            let currentStep = 0;
            
            const updateSteps = () => {
                stepsList.innerHTML = '';
                task.steps.forEach((step, idx) => {
                    const stepDiv = document.createElement('div');
                    stepDiv.style.cssText = `padding: 10px; margin: 5px 0; border-radius: 5px; ${idx <= currentStep ? 'background: #4CAF50; color: white;' : 'background: #f0f0f0;'}`;
                    stepDiv.textContent = step;
                    if (idx <= currentStep) {
                        stepDiv.textContent = '✓ ' + step;
                    }
                    stepsList.appendChild(stepDiv);
                });
            };
            
            const nextStepBtn = document.createElement('button');
            nextStepBtn.textContent = this.language === 'no' ? 'Neste steg' : 'Next step';
            nextStepBtn.className = 'btn-primary';
            nextStepBtn.style.cssText = 'display: block; width: 100%; margin-top: 10px;';
            nextStepBtn.onclick = () => {
                if (currentStep < task.steps.length - 1) {
                    currentStep++;
                    updateSteps();
                    
                    if (currentStep === task.steps.length - 1) {
                        nextStepBtn.textContent = this.language === 'no' ? 'Fullfør!' : 'Complete!';
                    }
                } else {
                    // Task completed
                    this.adjustStat('happiness', 15);
                    this.adjustStat('learning', 18);
                    this.adjustStat('energy', -10);
                    this.setEmotion('happy', 20);
                    this.child.resilience = Math.min(100, (this.child.resilience || 50) + 8);
                    this.adjustRelationship(3);
                    
                    this.showDialogue(this.language === 'no' 
                        ? "Jeg fullførte oppgaven! Selvdisiplin hjelper meg med å oppnå mål!"
                        : "I completed the task! Self-discipline helps me achieve goals!");
                    
                    setTimeout(() => {
                        const fact = this.language === 'no'
                            ? "💡 Læring: Selvdisiplin betyr å gjøre det som må gjøres, selv når det er vanskelig. Det er nøkkelen til suksess!"
                            : "💡 Learning: Self-discipline means doing what needs to be done, even when it's hard. It's the key to success!";
                        this.showMessage(fact);
                        disciplineContainer.remove();
                        this.performAction();
                        this.advanceTime();
                        this.saveGame();
                    }, 2000);
                }
            };
            
            disciplineContainer.appendChild(stepsList);
            disciplineContainer.appendChild(nextStepBtn);
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = this.language === 'no' ? 'Avbryt' : 'Cancel';
            cancelBtn.style.cssText = 'display: block; width: 100%; margin-top: 10px; padding: 10px; background: #ccc; border: none; border-radius: 10px; cursor: pointer;';
            cancelBtn.onclick = () => {
                this.showDialogue(this.language === 'no' 
                    ? "Jeg avbrøt oppgaven. Det er vanskelig å ha selvdisiplin, men jeg kan prøve igjen senere."
                    : "I canceled the task. It's hard to have self-discipline, but I can try again later.");
                disciplineContainer.remove();
            };
            disciplineContainer.appendChild(cancelBtn);
            
            updateSteps();
            document.body.appendChild(disciplineContainer);
        }, 1000);
    }
    
    // Lære planlegging
    learnPlanning() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 6) {
            this.showMessage(this.language === 'no' 
                ? "Planleggingsøvelser er for barn fra 6 år og oppover."
                : "Planning exercises are for children from 6 years old and up.");
            return;
        }
        
        if (this.child.energy < 12) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt akkurat nå..."
                : "I'm too tired right now...");
            return;
        }
        
        // Planning exercise: plan a day or activity
        this.showDialogue(this.language === 'no' 
            ? "La oss lære å planlegge! Jeg skal lage en plan for dagen..."
            : "Let's learn to plan! I'll make a plan for the day...");
        
        setTimeout(() => {
            const planningContainer = document.createElement('div');
            planningContainer.id = 'planningContainer';
            planningContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #fff0f5 0%, #e0f7ff 100%); padding: 30px; border-radius: 20px; border: 3px solid #ff00ff; z-index: 10000; max-width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 0 30px rgba(255,0,255,0.5);';
            
            const title = document.createElement('h3');
            title.textContent = this.language === 'no' ? '📋 Lag en plan' : '📋 Make a plan';
            title.style.cssText = 'margin-top: 0; text-align: center;';
            planningContainer.appendChild(title);
            
            const activities = this.language === 'no' ? [
                "Spise frokost",
                "Gjøre lekser",
                "Leke ute",
                "Spise lunsj",
                "Lese bok",
                "Hjelpe til hjemme",
                "Spise middag",
                "Gå til sengs"
            ] : [
                "Eat breakfast",
                "Do homework",
                "Play outside",
                "Eat lunch",
                "Read book",
                "Help at home",
                "Eat dinner",
                "Go to bed"
            ];
            
            const selectedActivities = [];
            const activitiesList = document.createElement('div');
            activitiesList.id = 'activitiesList';
            activitiesList.style.cssText = 'margin: 20px 0;';
            
            activities.forEach((activity, idx) => {
                const activityDiv = document.createElement('div');
                activityDiv.style.cssText = 'padding: 10px; margin: 5px 0; background: #f0f0f0; border-radius: 5px; cursor: pointer; display: flex; align-items: center;';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'activity' + idx;
                checkbox.style.cssText = 'margin-right: 10px;';
                checkbox.onchange = () => {
                    if (checkbox.checked) {
                        selectedActivities.push(activity);
                    } else {
                        const index = selectedActivities.indexOf(activity);
                        if (index > -1) selectedActivities.splice(index, 1);
                    }
                };
                
                const label = document.createElement('label');
                label.htmlFor = 'activity' + idx;
                label.textContent = activity;
                label.style.cssText = 'cursor: pointer; flex: 1;';
                
                activityDiv.appendChild(checkbox);
                activityDiv.appendChild(label);
                activitiesList.appendChild(activityDiv);
            });
            
            planningContainer.appendChild(activitiesList);
            
            const createPlanBtn = document.createElement('button');
            createPlanBtn.textContent = this.language === 'no' ? 'Lag plan' : 'Create plan';
            createPlanBtn.className = 'btn-primary';
            createPlanBtn.style.cssText = 'display: block; width: 100%; margin-top: 10px;';
            createPlanBtn.onclick = () => {
                if (selectedActivities.length === 0) {
                    this.showMessage(this.language === 'no' 
                        ? "Velg minst én aktivitet!"
                        : "Select at least one activity!");
                    return;
                }
                
                // Show the plan
                let planText = this.language === 'no' ? "Min plan for dagen:\n\n" : "My plan for the day:\n\n";
                selectedActivities.forEach((activity, idx) => {
                    planText += `${idx + 1}. ${activity}\n`;
                });
                
                this.showDialogue(planText);
                
                this.adjustStat('happiness', 12);
                this.adjustStat('learning', 20);
                this.adjustStat('energy', -8);
                this.setEmotion('curious', 15);
                this.setEmotion('happy', 12);
                this.child.resilience = Math.min(100, (this.child.resilience || 50) + 5);
                this.adjustRelationship(2);
                
                setTimeout(() => {
                    const fact = this.language === 'no'
                        ? "💡 Læring: Planlegging hjelper oss med å organisere tiden vår og oppnå mål. Det er en viktig ferdighet for livet!"
                        : "💡 Learning: Planning helps us organize our time and achieve goals. It's an important life skill!";
                    this.showMessage(fact);
                    planningContainer.remove();
                    this.performAction();
                    this.advanceTime();
                    this.saveGame();
                }, 2000);
            };
            
            planningContainer.appendChild(createPlanBtn);
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = this.language === 'no' ? 'Avbryt' : 'Cancel';
            cancelBtn.style.cssText = 'display: block; width: 100%; margin-top: 10px; padding: 10px; background: #ccc; border: none; border-radius: 10px; cursor: pointer;';
            cancelBtn.onclick = () => planningContainer.remove();
            planningContainer.appendChild(cancelBtn);
            
            document.body.appendChild(planningContainer);
        }, 1000);
    }
    
    // Send parent to work (for babies 0-3 years)
    sendParentToWork() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age > 3) {
            this.showMessage(this.language === 'no' 
                ? "Foreldre-jobbsystemet er kun for babyer (0-3 år)."
                : "Parent work system is only for babies (0-3 years old).");
            return;
        }
        
        if (this.child.parentWorkCooldown > 0) {
            this.showMessage(this.language === 'no' 
                ? "Foreldre er allerede på jobb. De kan jobbe igjen om " + this.child.parentWorkCooldown + " år."
                : "Parent is already at work. They can work again in " + this.child.parentWorkCooldown + " years.");
            return;
        }
        
        // Parent goes to work and earns money
        const earnings = 50 + Math.floor(Math.random() * 50); // 50-100 kr
        this.child.money += earnings;
        this.child.parentWorkCooldown = 2; // Can't work again for 2 years
        
        // Slight decrease in happiness/social (less time with parent)
        this.adjustStat('happiness', -3);
        this.adjustStat('social', -2);
        
        this.showDialogue(this.language === 'no' 
            ? "Mamma/Pappa gikk på jobb og tjente " + earnings + " kroner! Men jeg savner dem litt..."
            : "Mom/Dad went to work and earned " + earnings + " kroner! But I miss them a bit...");
        
        this.showMessage(this.language === 'no' 
            ? "💰 Foreldre tjente " + earnings + " kr. Gjenstående: " + this.child.money + " kr. Foreldre kan jobbe igjen om 2 år."
            : "💰 Parent earned " + earnings + " kr. Remaining: " + this.child.money + " kr. Parent can work again in 2 years.");
        
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Choose pet (age 5+)
    choosePet() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 5) {
            this.showMessage(this.language === 'no' 
                ? "Du må være minst 5 år for å ha kjæledyr."
                : "You must be at least 5 years old to have a pet.");
            return;
        }
        
        if (this.child.pet) {
            this.showMessage(this.language === 'no' 
                ? "Du har allerede et kjæledyr!"
                : "You already have a pet!");
            return;
        }
        
        // Check if player has enough money for a pet
        const petCost = 200;
        if (this.child.money < petCost) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg har ikke nok penger for et kjæledyr... Jeg trenger " + petCost + " kroner, men har bare " + this.child.money + " kroner."
                : "I don't have enough money for a pet... I need " + petCost + " kroner, but only have " + this.child.money + " kroner.");
            return;
        }
        
        // Show pet selection with images
        const pets = this.language === 'no' ? [
            { name: "Hund", emoji: "🐕", image: "assets/images/dogs.jpg", cost: 200, happiness: 15, careCost: 10 },
            { name: "Katt", emoji: "🐈", image: "assets/images/acat.jpg", cost: 150, happiness: 12, careCost: 8 },
            { name: "Fugl", emoji: "🐦", image: "assets/images/petfish.jpg", cost: 100, happiness: 10, careCost: 5 },
            { name: "Hamster", emoji: "🐹", image: "assets/images/pethamster.jpg", cost: 80, happiness: 8, careCost: 4 },
            { name: "Kanin", emoji: "🐰", image: "assets/images/rabbit.jpg", cost: 120, happiness: 10, careCost: 6 }
        ] : [
            { name: "Dog", emoji: "🐕", image: "assets/images/dogs.jpg", cost: 200, happiness: 15, careCost: 10 },
            { name: "Cat", emoji: "🐈", image: "assets/images/acat.jpg", cost: 150, happiness: 12, careCost: 8 },
            { name: "Bird", emoji: "🐦", image: "assets/images/petfish.jpg", cost: 100, happiness: 10, careCost: 5 },
            { name: "Hamster", emoji: "🐹", image: "assets/images/pethamster.jpg", cost: 80, happiness: 8, careCost: 4 },
            { name: "Rabbit", emoji: "🐰", image: "assets/images/rabbit.jpg", cost: 120, happiness: 10, careCost: 6 }
        ];
        
        // Add robot pets for 2085 mode
        if (this.worldMode === '2085') {
            pets.push(
                this.language === 'no' 
                    ? { name: "Robot-hund", emoji: "🤖🐕", image: "assets/images/robotdog.jpg", cost: 500, happiness: 20, careCost: 15 }
                    : { name: "Robot Dog", emoji: "🤖🐕", image: "assets/images/robotdog.jpg", cost: 500, happiness: 20, careCost: 15 },
                this.language === 'no'
                    ? { name: "Robot-mus", emoji: "🤖🐭", image: "assets/images/robotmouse.jpg", cost: 300, happiness: 15, careCost: 12 }
                    : { name: "Robot Mouse", emoji: "🤖🐭", image: "assets/images/robotmouse.jpg", cost: 300, happiness: 15, careCost: 12 }
            );
        }
        
        this.showDialogue(this.language === 'no' 
            ? "Hvilket kjæledyr vil jeg ha?"
            : "What pet do I want?");
        
        setTimeout(() => {
            const petContainer = document.createElement('div');
            petContainer.id = 'petContainer';
            petContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #fff0f5 0%, #e0f7ff 100%); padding: 30px; border-radius: 20px; border: 3px solid #ff00ff; z-index: 10000; max-width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 0 30px rgba(255,0,255,0.5);';
            
            const title = document.createElement('h3');
            title.textContent = this.language === 'no' ? '🐾 Velg kjæledyr' : '🐾 Choose pet';
            title.style.cssText = 'margin-top: 0; text-align: center;';
            petContainer.appendChild(title);
            
            pets.forEach((pet) => {
                const petBtn = document.createElement('button');
                petBtn.className = 'btn-primary';
                petBtn.style.cssText = 'display: block; width: 100%; margin: 10px 0; padding: 15px; text-align: left;';
                petBtn.innerHTML = `<div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${pet.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;" onerror="this.style.display='none'">
                    <div>
                        <strong>${pet.emoji} ${pet.name}</strong><br>
                        <small>💰 ${pet.cost} kr | 😊 Happiness: +${pet.happiness} | 💵 Care cost: ${pet.careCost} kr/year</small>
                    </div>
                </div>`;
                
                petBtn.onclick = () => {
                    if (this.child.money < pet.cost) {
                        this.showMessage(this.language === 'no' 
                            ? "Du har ikke nok penger for dette kjæledyret."
                            : "You don't have enough money for this pet.");
                        return;
                    }
                    
                    this.child.money -= pet.cost;
                    this.child.pet = {
                        type: pet.name,
                        emoji: pet.emoji,
                        name: pet.name,
                        image: pet.image,
                        happiness: 70,
                        hunger: 70,
                        health: 80,
                        careCost: pet.careCost,
                        lastFed: this.day,
                        lastPlayed: this.day
                    };
                    
                    // Show pet image
                    this.showActivityImage(pet.image, 3000);
                    
                    this.showDialogue(this.language === 'no' 
                        ? "Jeg fikk en " + pet.name.toLowerCase() + "! " + pet.emoji + " Jeg skal ta godt vare på den!"
                        : "I got a " + pet.name.toLowerCase() + "! " + pet.emoji + " I'll take good care of it!");
                    
                    this.adjustStat('happiness', pet.happiness);
                    this.adjustStat('social', 5);
                    this.setEmotion('happy', 20);
                    
                    petContainer.remove();
                    this.updateDisplay();
                    this.performAction();
                    this.advanceTime();
                    this.saveGame();
                };
                
                if (this.child.money < pet.cost) {
                    petBtn.disabled = true;
                    petBtn.style.opacity = '0.5';
                    petBtn.style.cursor = 'not-allowed';
                }
                
                petContainer.appendChild(petBtn);
            });
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = this.language === 'no' ? 'Avbryt' : 'Cancel';
            cancelBtn.style.cssText = 'display: block; width: 100%; margin-top: 10px; padding: 10px; background: #ccc; border: none; border-radius: 10px; cursor: pointer;';
            cancelBtn.onclick = () => petContainer.remove();
            petContainer.appendChild(cancelBtn);
            
            document.body.appendChild(petContainer);
        }, 500);
    }
    
    // Care for pet
    careForPet() {
        if (!this.canPerformAction()) return;
        
        if (!this.child.pet) {
            this.showMessage(this.language === 'no' 
                ? "Du har ikke noe kjæledyr!"
                : "You don't have a pet!");
            return;
        }
        
        if (this.child.energy < 10) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å ta vare på kjæledyret akkurat nå..."
                : "I'm too tired to care for the pet right now...");
            return;
        }
        
        // Show pet image
        if (this.child.pet.image) {
            this.showActivityImage(this.child.pet.image, 2500);
        }
        
        // Show care options
        const careOptions = this.language === 'no' ? [
            { name: "Mate kjæledyr", cost: this.child.pet.careCost, hunger: 20, happiness: 10 },
            { name: "Leke med kjæledyr", cost: 0, happiness: 15, social: 5 },
            { name: "Gå tur med kjæledyr", cost: 0, happiness: 12, energy: -5, social: 8 }
        ] : [
            { name: "Feed pet", cost: this.child.pet.careCost, hunger: 20, happiness: 10 },
            { name: "Play with pet", cost: 0, happiness: 15, social: 5 },
            { name: "Walk pet", cost: 0, happiness: 12, energy: -5, social: 8 }
        ];
        
        this.showDialogue(this.language === 'no' 
            ? "Hva skal jeg gjøre med " + this.child.pet.name.toLowerCase() + "?"
            : "What should I do with my " + this.child.pet.name.toLowerCase() + "?");
        
        setTimeout(() => {
            const careContainer = document.createElement('div');
            careContainer.id = 'careContainer';
            careContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #fff0f5 0%, #e0f7ff 100%); padding: 30px; border-radius: 20px; border: 3px solid #ff00ff; z-index: 10000; max-width: 90%; box-shadow: 0 0 30px rgba(255,0,255,0.5);';
            
            const title = document.createElement('h3');
            title.textContent = this.language === 'no' ? '🐾 Ta vare på kjæledyr' : '🐾 Care for pet';
            title.style.cssText = 'margin-top: 0; text-align: center;';
            careContainer.appendChild(title);
            
            careOptions.forEach((option) => {
                const optionBtn = document.createElement('button');
                optionBtn.className = 'btn-primary';
                optionBtn.style.cssText = 'display: block; width: 100%; margin: 10px 0; padding: 15px;';
                optionBtn.innerHTML = `<strong>${option.name}</strong>${option.cost > 0 ? ' - ' + option.cost + ' kr' : ''}`;
                
                optionBtn.onclick = () => {
                    if (this.child.money < option.cost) {
                        this.showMessage(this.language === 'no' 
                            ? "Du har ikke nok penger."
                            : "You don't have enough money.");
                        return;
                    }
                    
                    this.child.money -= option.cost;
                    
                    if (option.hunger) {
                        this.child.pet.hunger = Math.min(100, this.child.pet.hunger + option.hunger);
                        this.child.pet.lastFed = this.day;
                    }
                    
                    if (option.happiness) {
                        this.child.pet.happiness = Math.min(100, this.child.pet.happiness + option.happiness);
                        this.adjustStat('happiness', option.happiness);
                    }
                    
                    if (option.social) {
                        this.adjustStat('social', option.social);
                    }
                    
                    if (option.energy) {
                        this.adjustStat('energy', option.energy);
                    }
                    
                    if (option.name.includes('Leke') || option.name.includes('Play')) {
                        this.child.pet.lastPlayed = this.day;
                    }
                    
                    this.showDialogue(this.language === 'no' 
                        ? this.child.pet.emoji + " " + this.child.pet.name + " er glad! Jeg elsker å ta vare på den!"
                        : this.child.pet.emoji + " My " + this.child.pet.name + " is happy! I love taking care of it!");
                    
                    careContainer.remove();
                    this.updateDisplay();
                    this.performAction();
                    this.advanceTime();
                    this.saveGame();
                };
                
                if (this.child.money < option.cost) {
                    optionBtn.disabled = true;
                    optionBtn.style.opacity = '0.5';
                }
                
                careContainer.appendChild(optionBtn);
            });
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = this.language === 'no' ? 'Avbryt' : 'Cancel';
            cancelBtn.style.cssText = 'display: block; width: 100%; margin-top: 10px; padding: 10px; background: #ccc; border: none; border-radius: 10px; cursor: pointer;';
            cancelBtn.onclick = () => careContainer.remove();
            careContainer.appendChild(cancelBtn);
            
            document.body.appendChild(careContainer);
        }, 500);
    }
    
    // Find partner (age 18+)
    findPartner() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 18) {
            this.showMessage(this.language === 'no' 
                ? "Du må være minst 18 år for å finne en partner."
                : "You must be at least 18 years old to find a partner.");
            return;
        }
        
        if (this.child.partner) {
            this.showMessage(this.language === 'no' 
                ? "Du har allerede en partner!"
                : "You already have a partner!");
            return;
        }
        
        // Generate potential partners (all genders and orientations)
        const partnerNames = this.language === 'no' ? [
            "Alex", "Sofie", "Emma", "Noah", "Lucas", "Maya", "Isabella", "Oliver", "Ella", "William",
            "Nora", "Hannah", "Liam", "Amelia", "Benjamin", "Victoria", "Sebastian", "Olivia", "Daniel", "Sofia"
        ] : [
            "Alex", "Sophie", "Emma", "Noah", "Lucas", "Maya", "Isabella", "Oliver", "Ella", "William",
            "Nora", "Hannah", "Liam", "Amelia", "Benjamin", "Victoria", "Sebastian", "Olivia", "Daniel", "Sofia"
        ];
        
        const genders = ['man', 'woman', 'non-binary'];
        const selectedGender = genders[Math.floor(Math.random() * genders.length)];
        const selectedName = partnerNames[Math.floor(Math.random() * partnerNames.length)];
        
        // Cost to find partner (dating, etc.)
        const cost = 100;
        if (this.child.money < cost) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg har ikke nok penger for å gå på date... Jeg trenger " + cost + " kroner."
                : "I don't have enough money to go on a date... I need " + cost + " kroner.");
            return;
        }
        
        this.child.money -= cost;
        
        // Success chance based on social stat
        const successChance = Math.min(90, 30 + this.child.social / 2);
        const success = Math.random() * 100 < successChance;
        
        if (success) {
            this.child.partner = {
                name: selectedName,
                gender: selectedGender,
                relationshipLevel: 50,
                happiness: 70,
                lastCared: this.day
            };
            
            const genderText = this.language === 'no' 
                ? (selectedGender === 'man' ? 'mann' : selectedGender === 'woman' ? 'kvinne' : 'person')
                : (selectedGender === 'man' ? 'man' : selectedGender === 'woman' ? 'woman' : 'person');
            
            this.showDialogue(this.language === 'no' 
                ? "Jeg møtte " + selectedName + "! " + selectedName + " er en " + genderText + " og vi klikket! 💑"
                : "I met " + selectedName + "! " + selectedName + " is a " + genderText + " and we clicked! 💑");
            
            this.adjustStat('happiness', 20);
            this.adjustStat('social', 15);
            this.setEmotion('happy', 25);
        } else {
            this.showDialogue(this.language === 'no' 
                ? "Date gikk ikke så bra denne gangen... Men jeg prøver igjen senere!"
                : "The date didn't go so well this time... But I'll try again later!");
            this.adjustStat('happiness', -5);
        }
        
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Propose marriage
    proposeMarriage() {
        if (!this.canPerformAction()) return;
        
        if (!this.child.partner) {
            this.showMessage(this.language === 'no' 
                ? "Du har ingen partner å gifte deg med!"
                : "You don't have a partner to marry!");
            return;
        }
        
        if (this.child.isMarried) {
            this.showMessage(this.language === 'no' 
                ? "Du er allerede gift!"
                : "You're already married!");
            return;
        }
        
        // Marriage cost
        const cost = 5000;
        if (this.child.money < cost) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg har ikke nok penger for bryllup... Jeg trenger " + cost + " kroner."
                : "I don't have enough money for a wedding... I need " + cost + " kroner.");
            return;
        }
        
        // Success based on relationship level
        const successChance = Math.min(95, 50 + this.child.partner.relationshipLevel / 2);
        const success = Math.random() * 100 < successChance;
        
        if (success) {
            this.child.money -= cost;
            this.child.isMarried = true;
            this.child.partner.relationshipLevel = 100;
            
            // Show wedding image
            this.showActivityImage('assets/images/gettingmarried.jpg', 4000);
            
            this.showDialogue(this.language === 'no' 
                ? "💍 Jeg gifta meg med " + this.child.partner.name + "! Vi er nå et ektepar!"
                : "💍 I married " + this.child.partner.name + "! We are now a married couple!");
            
            this.adjustStat('happiness', 30);
            this.adjustStat('social', 20);
            this.setEmotion('happy', 30);
            
            this.addAutoDiaryEntry(this.language === 'no' 
                ? '💍 I dag gifta jeg meg med ' + this.child.partner.name + '! Dette er en stor dag i livet mitt.'
                : '💍 Today I married ' + this.child.partner.name + '! This is a big day in my life.', true);
        } else {
            this.showDialogue(this.language === 'no' 
                ? this.child.partner.name + " sa nei til frieriet... Men vi kan prøve igjen senere når forholdet er bedre."
                : this.child.partner.name + " said no to the proposal... But we can try again later when the relationship is better.");
            this.adjustStat('happiness', -10);
        }
        
        this.updateDisplay();
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Adopt child
    adoptChild() {
        if (!this.canPerformAction()) return;
        
        if (!this.child.isMarried || !this.child.partner) {
            this.showMessage(this.language === 'no' 
                ? "Du må være gift for å adoptere et barn."
                : "You must be married to adopt a child.");
            return;
        }
        
        // Adoption cost
        const cost = 10000;
        if (this.child.money < cost) {
            this.showDialogue(this.language === 'no' 
                ? "Adopsjon er dyrt... Jeg trenger " + cost + " kroner."
                : "Adoption is expensive... I need " + cost + " kroner.");
            return;
        }
        
        if (!this.child.adoptedChildren) {
            this.child.adoptedChildren = [];
        }
        
        const childNames = this.language === 'no' ? [
            "Emma", "Noah", "Sofie", "Lucas", "Maya", "Oliver", "Isabella", "Liam", "Nora", "Benjamin"
        ] : [
            "Emma", "Noah", "Sophie", "Lucas", "Maya", "Oliver", "Isabella", "Liam", "Nora", "Benjamin"
        ];
        
        const childGenders = ['boy', 'girl'];
        const selectedName = childNames[Math.floor(Math.random() * childNames.length)];
        const selectedGender = childGenders[Math.floor(Math.random() * childGenders.length)];
        
        this.child.money -= cost;
        
        const adoptedChild = {
            name: selectedName,
            gender: selectedGender,
            age: 0,
            happiness: 70,
            hunger: 70,
            energy: 80
        };
        
        if (!this.child.adoptedChildren) {
            this.child.adoptedChildren = [];
        }
        this.child.adoptedChildren.push(adoptedChild);
        
        // Show family image
        this.showActivityImage('assets/images/couplewithbaby.jpg', 4000);
        
        const genderText = this.language === 'no' 
            ? (selectedGender === 'boy' ? 'gutt' : 'jente')
            : (selectedGender === 'boy' ? 'boy' : 'girl');
        
        this.showDialogue(this.language === 'no' 
            ? "👶 Vi adopterte " + selectedName + "! " + selectedName + " er en " + genderText + " og vi skal ta godt vare på " + (selectedGender === 'boy' ? 'ham' : 'henne') + "!"
            : "👶 We adopted " + selectedName + "! " + selectedName + " is a " + genderText + " and we'll take good care of " + (selectedGender === 'boy' ? 'him' : 'her') + "!");
        
        this.adjustStat('happiness', 25);
        this.adjustStat('social', 15);
        this.setEmotion('happy', 30);
        
        this.addAutoDiaryEntry(this.language === 'no' 
            ? '👶 I dag adopterte ' + this.child.partner.name + ' og jeg ' + selectedName + '! Vi er nå en familie.'
            : '👶 Today ' + this.child.partner.name + ' and I adopted ' + selectedName + '! We are now a family.', true);
        
        this.updateDisplay();
        this.performAction();
        this.advanceTime();
        this.saveGame();
    }
    
    // Care for family
    careForFamily() {
        if (!this.canPerformAction()) return;
        
        if (!this.child.partner && (!this.child.adoptedChildren || this.child.adoptedChildren.length === 0)) {
            this.showMessage(this.language === 'no' 
                ? "Du har ingen familie å ta vare på!"
                : "You don't have a family to care for!");
            return;
        }
        
        if (this.child.energy < 15) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å ta vare på familien akkurat nå..."
                : "I'm too tired to care for the family right now...");
            return;
        }
        
        const familyCost = 30;
        if (this.child.money < familyCost) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg har ikke nok penger for å ta vare på familien... Jeg trenger " + familyCost + " kroner."
                : "I don't have enough money to care for the family... I need " + familyCost + " kroner.");
            return;
        }
        
        this.child.money -= familyCost;
        
        // Care for partner
        if (this.child.partner) {
            this.child.partner.happiness = Math.min(100, (this.child.partner.happiness || 70) + 10);
            this.child.partner.relationshipLevel = Math.min(100, (this.child.partner.relationshipLevel || 50) + 5);
            this.child.partner.lastCared = this.day;
        }
        
        // Care for adopted children
        if (this.child.adoptedChildren && this.child.adoptedChildren.length > 0) {
            this.child.adoptedChildren.forEach(child => {
                child.happiness = Math.min(100, child.happiness + 15);
                child.hunger = Math.min(100, child.hunger + 20);
                child.energy = Math.min(100, child.energy + 10);
            });
        }
        
        // Show family dinner image
        this.showActivityImage('assets/images/familydinner.jpg', 3000);
        
        let familyText = "";
        if (this.child.partner) {
            familyText += this.child.partner.name;
        }
        if (this.child.adoptedChildren && this.child.adoptedChildren.length > 0) {
            if (familyText) familyText += " og ";
            familyText += this.child.adoptedChildren.map(c => c.name).join(", ");
        }
        
        this.showDialogue(this.language === 'no' 
            ? "Jeg tok vare på familien min (" + familyText + ")! Alle er glade og fornøyde! 👨‍👩‍👧"
            : "I took care of my family (" + familyText + ")! Everyone is happy and satisfied! 👨‍👩‍👧");
        
        this.adjustStat('happiness', 15);
        this.adjustStat('social', 10);
        this.adjustStat('energy', -15);
        this.setEmotion('happy', 20);
        
        this.performAction();
        this.advanceTime();
        this.saveGame();
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
        
        // Show activity image when playing outside
        if (this.currentLocation === 'playground' || this.currentLocation === 'nature') {
            if (this.worldMode === '2085' && this.child.age >= 13) {
                // Show flying bikes in dystopian future
                this.showActivityImage('assets/images/flyingbikes.jpg', 2500);
            } else {
                this.showActivityImage('assets/images/playoutside.png', 2500);
            }
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
        
        // Track that child was read to
        this.child.lastRead = this.day;
        
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
        
        // Show study image based on gender (age 7+)
        if (this.child.age >= 7) {
            const studyImage = this.child.gender === 'girl' 
                ? 'assets/images/girlstudy.jpg' 
                : 'assets/images/boystudy.jpg';
            this.showActivityImage(studyImage, 3000);
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
        this.addAutoDiaryEntry(
            this.language === 'no' ? 'Jeg hjalp andre i dag. Det føltes godt å gjøre noe for andre.' : 'I helped others today. It felt good to do something for others.',
            true
        );
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
    
    // Future-specific learning functions (2085)
    learnClimate() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 15) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å lære om klima akkurat nå..."
                : "I'm too tired to learn about climate right now...");
            return;
        }
        
        this.child.climateAwareness = Math.min(100, this.child.climateAwareness + 10);
        this.adjustStat('learning', 15);
        this.adjustStat('happiness', -5); // Learning about climate crisis is sobering
        this.adjustStat('energy', -10);
        this.setEmotion('curious', 15);
        this.setEmotion('anxious', 5); // Climate crisis is worrying
        
        const climateFacts = [
            this.language === 'no'
                ? "I dag lærte jeg om klimaendringer. I 2085 er temperaturen steget med 4 grader. Isen smelter, havnivået stiger, og ekstremvær er vanlig. Norge har mistet mye land til havet."
                : "Today I learned about climate change. In 2085, temperatures have risen by 4 degrees. Ice is melting, sea levels are rising, and extreme weather is common. Norway has lost much land to the sea.",
            this.language === 'no'
                ? "Jeg lærte at oljefondet ble brukt opp på å reparere klima-skader. Vi var ikke forberedt. Nå har vi ingenting igjen."
                : "I learned that the oil fund was used up repairing climate damage. We weren't prepared. Now we have nothing left.",
            this.language === 'no'
                ? "Klimaendringene påvirker alt. Matproduksjonen er redusert, ressursene er knappe, og mange steder er ubeboelige. Vi må gjøre noe!"
                : "Climate change affects everything. Food production is reduced, resources are scarce, and many places are uninhabitable. We must do something!"
        ];
        
        const fact = climateFacts[Math.floor(Math.random() * climateFacts.length)];
        this.showDialogue(fact);
        
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? 'I dag lærte jeg om klimaendringene. Det er skummelt, men jeg må forstå hva som skjedde.'
                : 'Today I learned about climate change. It\'s scary, but I need to understand what happened.',
            false
        );
        
        this.showMessage(this.language === 'no'
            ? "🌡️ " + this.child.name + " lærer om klimaendringene. Kunnskap er første steg mot løsninger!"
            : "🌡️ " + this.child.name + " is learning about climate change. Knowledge is the first step toward solutions!");
        this.performAction();
        this.advanceTime();
    }
    
    learnAI() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 15) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å lære om AI akkurat nå..."
                : "I'm too tired to learn about AI right now...");
            return;
        }
        
        this.child.aiLiteracy = Math.min(100, this.child.aiLiteracy + 10);
        this.adjustStat('learning', 15);
        this.adjustStat('happiness', 5);
        this.adjustStat('energy', -10);
        this.setEmotion('curious', 20);
        
        const aiFacts = [
            this.language === 'no'
                ? "I dag lærte jeg om AI. I 2085 har AI tatt over mange jobber. Mange er arbeidsløse. Men AI kan også hjelpe oss med å løse problemer - hvis vi bruker den riktig."
                : "Today I learned about AI. In 2085, AI has taken over many jobs. Many are unemployed. But AI can also help us solve problems - if we use it right.",
            this.language === 'no'
                ? "Jeg lærte at digitaliseringen gikk for raskt. Vi var ikke forberedt. Nå er vi avhengige av AI, men vi forstår den ikke helt."
                : "I learned that digitalization went too fast. We weren't prepared. Now we're dependent on AI, but we don't fully understand it.",
            this.language === 'no'
                ? "AI kan være farlig hvis den ikke kontrolleres. Men den kan også være vår redning - hvis vi lærer å bruke den klokt."
                : "AI can be dangerous if not controlled. But it can also be our salvation - if we learn to use it wisely."
        ];
        
        const fact = aiFacts[Math.floor(Math.random() * aiFacts.length)];
        this.showDialogue(fact);
        
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? 'I dag lærte jeg om AI. Det er både skummelt og spennende. Kanskje jeg kan bruke det til å hjelpe Norge?'
                : 'Today I learned about AI. It\'s both scary and exciting. Maybe I can use it to help Norway?',
            true
        );
        
        this.showMessage(this.language === 'no'
            ? "🤖 " + this.child.name + " lærer om AI. Kunnskap om teknologi kan være nøkkelen til fremtiden!"
            : "🤖 " + this.child.name + " is learning about AI. Knowledge of technology could be the key to the future!");
        this.performAction();
        this.advanceTime();
    }
    
    learnResourceManagement() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 15) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å lære om ressurshåndtering akkurat nå..."
                : "I'm too tired to learn about resource management right now...");
            return;
        }
        
        this.child.resourceManagement = Math.min(100, this.child.resourceManagement + 10);
        this.adjustStat('learning', 15);
        this.adjustStat('happiness', -3); // Learning about resource scarcity is sobering
        this.adjustStat('energy', -10);
        this.setEmotion('curious', 15);
        this.setEmotion('anxious', 5);
        
        const resourceFacts = [
            this.language === 'no'
                ? "I dag lærte jeg om ressurshåndtering. I 2085 er ressursene knappe. Oljefondet er tomt, vi har ingen venner med andre nasjoner, og vi har ikke nok penger til våpen. Norge er sårbart."
                : "Today I learned about resource management. In 2085, resources are scarce. The oil fund is empty, we have no friends among other nations, and we don't have enough money for weapons. Norway is vulnerable.",
            this.language === 'no'
                ? "Jeg lærte at vi var ikke flinke til å bygge allianser. Nå står vi alene. Uten ressurser, uten venner, uten forsvarskapasitet."
                : "I learned that we weren't good at building alliances. Now we stand alone. Without resources, without friends, without defense capacity.",
            this.language === 'no'
                ? "Ressurshåndtering er kritisk. Vi må lære å bruke det vi har klokt. Kanskje jeg kan hjelpe Norge med dette?"
                : "Resource management is critical. We must learn to use what we have wisely. Maybe I can help Norway with this?"
        ];
        
        const fact = resourceFacts[Math.floor(Math.random() * resourceFacts.length)];
        this.showDialogue(fact);
        
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? 'I dag lærte jeg om ressurshåndtering. Norge er i krise, men kanskje vi kan finne løsninger?'
                : 'Today I learned about resource management. Norway is in crisis, but maybe we can find solutions?',
            false
        );
        
        this.showMessage(this.language === 'no'
            ? "⚡ " + this.child.name + " lærer om ressurshåndtering. Klok bruk av ressurser kan redde Norge!"
            : "⚡ " + this.child.name + " is learning about resource management. Wise use of resources could save Norway!");
        this.performAction();
        this.advanceTime();
    }
    
    volunteerForClimate() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 10) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for ung til å være klimafrivillig..."
                : "I'm too young to be a climate volunteer...");
            return;
        }
        
        if (this.child.energy < 20) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å være klimafrivillig akkurat nå..."
                : "I'm too tired to be a climate volunteer right now...");
            return;
        }
        
        this.child.climateAwareness = Math.min(100, this.child.climateAwareness + 5);
        this.adjustStat('happiness', 10);
        this.adjustStat('social', 15);
        this.adjustStat('energy', -15);
        this.setEmotion('happy', 15);
        this.setEmotion('curious', 10);
        
        const volunteerMsg = this.language === 'no'
            ? "Jeg var klimafrivillig i dag! Vi plantet trær og ryddet opp. Det føltes godt å gjøre noe for miljøet. Kanskje vi kan redde noe av naturen?"
            : "I was a climate volunteer today! We planted trees and cleaned up. It felt good to do something for the environment. Maybe we can save some of nature?";
        this.showDialogue(volunteerMsg);
        
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? 'I dag var jeg klimafrivillig. Det føltes godt å gjøre noe. Kanskje små handlinger kan gjøre en forskjell?'
                : 'Today I was a climate volunteer. It felt good to do something. Maybe small actions can make a difference?',
            true
        );
        
        this.showMessage(this.language === 'no'
            ? "🌱 " + this.child.name + " hjelper miljøet! Hver liten handling teller i kampen mot klimaendringene!"
            : "🌱 " + this.child.name + " is helping the environment! Every small action counts in the fight against climate change!");
        this.performAction();
        this.advanceTime();
    }
    
    workOnAIProject() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 12) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for ung til å jobbe med AI-prosjekter..."
                : "I'm too young to work on AI projects...");
            return;
        }
        
        if (this.child.energy < 20) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å jobbe med AI-prosjekter akkurat nå..."
                : "I'm too tired to work on AI projects right now...");
            return;
        }
        
        if (this.child.aiLiteracy < 30) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg trenger å lære mer om AI først. Prøv 'Lær om AI' aktiviteten!"
                : "I need to learn more about AI first. Try the 'Learn about AI' activity!");
            return;
        }
        
        this.child.aiLiteracy = Math.min(100, this.child.aiLiteracy + 5);
        this.adjustStat('learning', 20);
        this.adjustStat('happiness', 12);
        this.adjustStat('energy', -18);
        this.setEmotion('happy', 18);
        this.setEmotion('curious', 15);
        
        const projectMsg = this.language === 'no'
            ? "Jeg jobbet med et AI-prosjekt i dag! Jeg prøver å lage noe som kan hjelpe Norge. Kanskje AI kan være vår redning, ikke vår undergang?"
            : "I worked on an AI project today! I'm trying to create something that can help Norway. Maybe AI can be our salvation, not our doom?";
        this.showDialogue(projectMsg);
        
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? 'I dag jobbet jeg med et AI-prosjekt. Kanskje teknologi kan hjelpe Norge ut av krisen?'
                : 'Today I worked on an AI project. Maybe technology can help Norway out of the crisis?',
            true
        );
        
        this.showMessage(this.language === 'no'
            ? "🤖 " + this.child.name + " jobber med AI! Kanskje teknologi kan redde Norge fra dystopien?"
            : "🤖 " + this.child.name + " is working on AI! Maybe technology can save Norway from dystopia?");
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
        
        // Show CD image for music activity
        this.showActivityImage('assets/images/cd.png', 2500);
        
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
            cdImg.src = 'assets/images/cd.png';
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
            phoneImg.src = 'assets/images/nokiaphone.png';
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
            "Hvetemel": 5, // per dl
            "Melk": 3,     // per dl
            "Egg": 8,      // per stk
            "Smør": 12,    // per 100g
            "Sukker": 4,   // per dl
            "Salt": 2,     // per ts
            "Gulrot": 3,   // per stk
            "Fisk": 15,    // per 100g
            "Torsk": 15,   // per 100g
            "Ost": 8,      // per 100g
            "Bakepulver": 1 // per ts
        };
        
        // Real Norwegian recipes with proper measurements
        const recipes = [
            {
                name: this.language === 'no' ? "Pannekaker" : "Pancakes",
                ingredients: [
                    { name: "Hvetemel", amount: 2.5, unit: "dl", price: ingredientPrices["Mel"] * 2.5 },
                    { name: "Melk", amount: 4, unit: "dl", price: ingredientPrices["Melk"] * 4 },
                    { name: "Egg", amount: 2, unit: "stk", price: ingredientPrices["Egg"] * 2 },
                    { name: "Salt", amount: 0.5, unit: "ts", price: ingredientPrices["Salt"] * 0.5 },
                    { name: "Smør til steking", amount: 20, unit: "g", price: ingredientPrices["Smør"] * 0.2 }
                ],
                steps: this.language === 'no' ? [
                    "1. Bland mel, melk, egg og salt i en bolle",
                    "2. La røren hvile i 30 minutter",
                    "3. Stek pannekaker i smør på middels varme",
                    "4. Vend når den ene siden er gyllen"
                ] : [
                    "1. Mix flour, milk, eggs and salt in a bowl",
                    "2. Let the batter rest for 30 minutes",
                    "3. Fry pancakes in butter on medium heat",
                    "4. Flip when one side is golden"
                ],
                conversion: {
                    question: this.language === 'no' ? "Hvor mange ml er 2.5 dl mel?" : "How many ml is 2.5 dl flour?",
                    answer: "250",
                    explanation: this.language === 'no' ? "1 dl = 100 ml, så 2.5 dl = 250 ml" : "1 dl = 100 ml, so 2.5 dl = 250 ml"
                }
            },
            {
                name: this.language === 'no' ? "Gulrotkake" : "Carrot Cake",
                ingredients: [
                    { name: "Gulrot", amount: 3, unit: "stk", price: ingredientPrices["Gulrot"] * 3 },
                    { name: "Hvetemel", amount: 3, unit: "dl", price: ingredientPrices["Mel"] * 3 },
                    { name: "Sukker", amount: 2, unit: "dl", price: ingredientPrices["Sukker"] * 2 },
                    { name: "Egg", amount: 3, unit: "stk", price: ingredientPrices["Egg"] * 3 },
                    { name: "Smør", amount: 100, unit: "g", price: ingredientPrices["Smør"] },
                    { name: "Bakepulver", amount: 2, unit: "ts", price: ingredientPrices["Bakepulver"] * 2 }
                ],
                steps: this.language === 'no' ? [
                    "1. Riv gulrotene",
                    "2. Pisk smør og sukker til luftig",
                    "3. Tilsett egg, ett om gangen",
                    "4. Bland inn mel, bakepulver og gulrot",
                    "5. Stek i 175°C i 45-50 minutter"
                ] : [
                    "1. Grate the carrots",
                    "2. Cream butter and sugar until fluffy",
                    "3. Add eggs, one at a time",
                    "4. Mix in flour, baking powder and carrots",
                    "5. Bake at 175°C for 45-50 minutes"
                ],
                conversion: {
                    question: this.language === 'no' ? "Hvor mange dl er 500 ml melk?" : "How many dl is 500 ml milk?",
                    answer: "5",
                    explanation: this.language === 'no' ? "1 dl = 100 ml, så 500 ml = 5 dl" : "1 dl = 100 ml, so 500 ml = 5 dl"
                }
            },
            {
                name: this.language === 'no' ? "Vafler" : "Waffles",
                ingredients: [
                    { name: "Hvetemel", amount: 3, unit: "dl", price: ingredientPrices["Mel"] * 3 },
                    { name: "Melk", amount: 5, unit: "dl", price: ingredientPrices["Melk"] * 5 },
                    { name: "Egg", amount: 3, unit: "stk", price: ingredientPrices["Egg"] * 3 },
                    { name: "Smeltet smør", amount: 75, unit: "g", price: ingredientPrices["Smør"] * 0.75 },
                    { name: "Sukker", amount: 1, unit: "dl", price: ingredientPrices["Sukker"] },
                    { name: "Bakepulver", amount: 1, unit: "ts", price: ingredientPrices["Bakepulver"] }
                ],
                steps: this.language === 'no' ? [
                    "1. Bland alle ingredienser i en bolle",
                    "2. La røren hvile i 30 minutter",
                    "3. Varm opp vaffeljernet",
                    "4. Hell røre i vaffeljernet og stek til gyllen"
                ] : [
                    "1. Mix all ingredients in a bowl",
                    "2. Let the batter rest for 30 minutes",
                    "3. Heat up the waffle iron",
                    "4. Pour batter in waffle iron and cook until golden"
                ],
                conversion: {
                    question: this.language === 'no' ? "Hvor mange ml er 3 dl mel?" : "How many ml is 3 dl flour?",
                    answer: "300",
                    explanation: this.language === 'no' ? "1 dl = 100 ml, så 3 dl = 300 ml" : "1 dl = 100 ml, so 3 dl = 300 ml"
                }
            },
            {
                name: this.language === 'no' ? "Fiskegrateng" : "Fish Gratin",
                ingredients: [
                    { name: "Torsk", amount: 400, unit: "g", price: ingredientPrices["Fisk"] * 4 },
                    { name: "Melk", amount: 5, unit: "dl", price: ingredientPrices["Melk"] * 5 },
                    { name: "Hvetemel", amount: 3, unit: "ss", price: ingredientPrices["Mel"] * 0.3 },
                    { name: "Smør", amount: 50, unit: "g", price: ingredientPrices["Smør"] * 0.5 },
                    { name: "Ost", amount: 100, unit: "g", price: ingredientPrices["Ost"] },
                    { name: "Salt og pepper", amount: 1, unit: "ts", price: ingredientPrices["Salt"] }
                ],
                steps: this.language === 'no' ? [
                    "1. Kok fisk i melk i 10 minutter",
                    "2. Lag hvit saus med smør, mel og melk",
                    "3. Legg fisk i ildfast form",
                    "4. Hell over saus og dryss med ost",
                    "5. Gratiner i 200°C i 20 minutter"
                ] : [
                    "1. Cook fish in milk for 10 minutes",
                    "2. Make white sauce with butter, flour and milk",
                    "3. Place fish in ovenproof dish",
                    "4. Pour sauce over and sprinkle with cheese",
                    "5. Gratinate at 200°C for 20 minutes"
                ],
                conversion: {
                    question: this.language === 'no' ? "Hvor mange gram er 400 g fisk?" : "How many grams is 400 g fish?",
                    answer: "400",
                    explanation: this.language === 'no' ? "400 g er allerede i gram!" : "400 g is already in grams!"
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
        
        // Show ingredient list with prices and steps
        const ingredientLabel = this.language === 'no' ? "Ingredienser for " : "Ingredients for ";
        let ingredientList = ingredientLabel + recipe.name + " (Totalt: " + totalCost.toFixed(1) + " kr):\n";
        recipe.ingredients.forEach((ing, idx) => {
            ingredientList += `${idx + 1}. ${ing.amount} ${ing.unit} ${ing.name} - ${ing.price.toFixed(1)} kr\n`;
        });
        
        // Show steps if available
        let stepsList = "";
        if (recipe.steps) {
            stepsList = this.language === 'no' ? "\n\nFremgangsmåte:\n" : "\n\nSteps:\n";
            recipe.steps.forEach((step) => {
                stepsList += `${step}\n`;
            });
        }
        
        const cookDialogue = this.language === 'no'
            ? "La oss lage " + recipe.name + " sammen! " + ingredientList + stepsList + "\nSkal vi kjøpe ingrediensene? (Vi har " + this.child.money + " kr)"
            : "Let's make " + recipe.name + " together! " + ingredientList + stepsList + "\nShould we buy the ingredients? (We have " + this.child.money + " kr)";
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
        
        // Different jobs based on age, study level, and chosen career
        let jobType, earnings, energyCost;
        
        // If career is chosen, use career salary (annual salary / 365 days ≈ daily earnings)
        if (this.child.chosenCareer && this.child.careerSalary > 0) {
            jobType = this.child.chosenCareer;
            earnings = Math.floor(this.child.careerSalary / 365) + Math.floor(Math.random() * 50); // Daily earnings from career
            energyCost = 20;
        } else if (this.child.age >= 14 && this.child.age < 16) {
            // Part-time jobs for younger teens (reduced earnings to make money more critical)
            jobType = this.language === 'no' ? "Deltidsjobb (avisbud)" : "Part-time job (paper delivery)";
            earnings = 12 + Math.floor(this.child.studyLevel / 12);
            energyCost = 25;
        } else if (this.child.age >= 16 && this.child.studyLevel < 50) {
            // Basic jobs
            jobType = this.language === 'no' ? "Deltidsjobb (butikk)" : "Part-time job (store)";
            earnings = 20 + Math.floor(this.child.studyLevel / 6);
            energyCost = 30;
        } else if (this.child.age >= 16 && this.child.studyLevel >= 50) {
            // Better jobs for those who studied
            jobType = this.language === 'no' ? "Deltidsjobb (kontor)" : "Part-time job (office)";
            earnings = 35 + Math.floor(this.child.studyLevel / 4);
            energyCost = 25;
        } else {
            // Adult jobs
            jobType = this.language === 'no' ? "Fulltidsjobb" : "Full-time job";
            earnings = 50 + Math.floor(this.child.careerProgress / 3);
            energyCost = 35;
        }
        
        // Earn money (like original game)
        this.child.money += earnings;
        this.adjustStat('energy', -energyCost);
        this.adjustStat('happiness', -8); // Work is tiring and takes time away from child
        this.adjustStat('social', -3); // Less time with friends when working
        this.child.careerProgress = Math.min(100, this.child.careerProgress + 2);
        
        // Show trade-off message to make choice clearer
        const workMsg = this.language === 'no'
            ? "Jeg jobbet som " + jobType + " og tjente " + earnings + " kroner! Jeg er litt trøtt, men det var verdt det. Jeg savner å tilbringe tid med deg, men vi trenger penger..."
            : "I worked as " + jobType + " and earned " + earnings + " kroner! I'm a bit tired, but it was worth it. I miss spending time with you, but we need money...";
        this.showDialogue(workMsg);
        
        // Remind about the trade-off
        const tradeoffMsg = this.language === 'no'
            ? "💡 Husk: Jobb gir penger, men tar tid bort fra å tilbringe tid med barnet. Balanse er viktig!"
            : "💡 Remember: Work gives money, but takes time away from spending time with the child. Balance is important!";
        setTimeout(() => this.showMessage(tradeoffMsg), 1500);
        
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
        // Don't advance if character is dead
        if (this.child.isDead) {
            return;
        }
        
        // In 2085, we use years instead of days
        this.year++;
            this.child.age++;
        this.timeOfDay = 0;
        this.actionsToday = 0; // Reset actions for new year
        this.consequencesAppliedToday = false; // Reset consequences flag
        
        // Age progression (now happens every year)
        if (this.child.age > 0) {
            
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
                    ? `Jeg er ${this.child.age} år gammel nå! Året er ${this.year}. Norge er i krise, men jeg lærer og vokser. Kanskje jeg kan gjøre en forskjell?`
                    : `I'm ${this.child.age} years old now! The year is ${this.year}. Norway is in crisis, but I'm learning and growing. Maybe I can make a difference?`;
            }
            
            this.showDialogue(progressMessage);
            
            // Age messages based on world mode
            const ageMessages = this.language === 'no' ? (
                this.worldMode === '2085' ? [
                    `Barnet ditt ble ${this.child.age} år gammelt! Året er ${this.year}.`,
                    `🎂 Gratulerer med ${this.child.age} år! Nok et år i 2085-dystopien.`
                ] : [
                    `Barnet ditt ble ${this.child.age} år gammelt! Året er ${this.year}.`,
                    `🎂 Gratulerer med ${this.child.age} år! Nok et år i 2000-tallet.`
                ]
            ) : (
                this.worldMode === '2085' ? [
                    `Your child turned ${this.child.age} years old! The year is ${this.year}.`,
                    `🎂 Happy ${this.child.age}th birthday! Another year in the 2085 dystopia.`
                ] : [
                    `Your child turned ${this.child.age} years old! The year is ${this.year}.`,
                    `🎂 Happy ${this.child.age}th birthday! Another year in the 2000s.`
                ]
            );
            this.showMessage(ageMessages[Math.floor(Math.random() * ageMessages.length)]);
            
            // Career opportunities based on study level and age
            if (this.child.age >= 14 && this.child.studyLevel > 60 && this.child.money === 0) {
                const careerMsg = this.language === 'no'
                    ? "💼 " + this.child.name + " er gammel nok og smart nok til å begynne å tjene penger gjennom deltidsarbeid!"
                    : "💼 " + this.child.name + " is old enough and smart enough to start earning money through part-time work!";
                this.showMessage(careerMsg);
            }
            
            // Year progression message - different for each world
            if (this.worldMode === '2085') {
                const yearMsg = this.language === 'no'
                    ? `Det er ${this.year} nå! Norge er i krise - oljefondet er tomt, ressursene er knappe. Kan vi redde fremtiden?`
                    : `It's ${this.year} now! Norway is in crisis - the oil fund is empty, resources are scarce. Can we save the future?`;
                this.showDialogue(yearMsg);
            } else {
                const yearMsg = this.language === 'no'
                    ? `Det er ${this.year} nå! En normal dag i 2000-tallet. Alt er som det skal være.`
                    : `It's ${this.year} now! A normal day in the 2000s. Everything is as it should be.`;
                this.showDialogue(yearMsg);
            }
            
            // Driver's license at age 16+
            if (this.child.age >= 16 && !this.child.hasDriversLicense) {
                this.getDriversLicense();
            }
            
            // Move out at age 18 (only prompt, don't force)
            if (this.child.age >= 18 && !this.child.hasMovedOut) {
                const moveOutPrompt = this.language === 'no'
                    ? "Du er nå 18 år gammel! Vil du flytte hjemmefra? Det koster 50,000 kroner, men gir deg mer uavhengighet. Du kan også vente til du har mer penger."
                    : "You are now 18 years old! Do you want to move out? It costs 50,000 kroner, but gives you more independence. You can also wait until you have more money.";
                this.showMessage(moveOutPrompt);
            }
            
            // Special milestone at age 18 - show success story
            if (this.child.age === 18) {
                this.showFinalSuccessMessage();
            }
        }
        
        // Check for success milestones
        this.checkSuccessMilestones();
        
        // World-specific consequences
        if (this.worldMode === '2085') {
            // Dystopian consequences - ongoing effects
            this.applyDystopianConsequences();
        } else {
            // 2000s normal world events
            this.apply2000sEvents();
        }
        
        // Trigger problem situations (age 5+)
        this.triggerProblemSituation();
        
        // Decrease parent work cooldown
        if (this.child.parentWorkCooldown > 0) {
            this.child.parentWorkCooldown--;
        }
        
        // Pet needs care (decrease stats over time)
        if (this.child.pet) {
            const daysSinceFed = this.day - (this.child.pet.lastFed || 0);
            const daysSincePlayed = this.day - (this.child.pet.lastPlayed || 0);
            
            if (daysSinceFed > 1) {
                this.child.pet.hunger = Math.max(0, this.child.pet.hunger - 10);
                this.child.pet.health = Math.max(0, this.child.pet.health - 5);
            }
            
            if (daysSincePlayed > 2) {
                this.child.pet.happiness = Math.max(0, this.child.pet.happiness - 8);
            }
            
            // Pet care cost (yearly)
            if (this.day % 365 === 0 && this.child.pet) {
                const careCost = this.child.pet.careCost;
                if (this.child.money >= careCost) {
                    this.child.money -= careCost;
                } else {
                    this.showMessage(this.language === 'no' 
                        ? "⚠️ Du har ikke nok penger for kjæledyr-omsorg. Kjæledyret lider."
                        : "⚠️ You don't have enough money for pet care. The pet is suffering.");
                    this.child.pet.health = Math.max(0, this.child.pet.health - 10);
                }
            }
        }
        
        // Family needs care
        if (this.child.partner) {
            const daysSinceCare = this.day - (this.child.partner.lastCared || 0);
            if (daysSinceCare > 30) {
                this.child.partner.happiness = Math.max(0, (this.child.partner.happiness || 70) - 5);
                this.child.partner.relationshipLevel = Math.max(0, (this.child.partner.relationshipLevel || 50) - 3);
            }
        }
        
        if (this.child.adoptedChildren && this.child.adoptedChildren.length > 0) {
            this.child.adoptedChildren.forEach(child => {
                child.age++;
                child.hunger = Math.max(0, child.hunger - 10);
                child.energy = Math.max(0, child.energy - 8);
                if (child.hunger < 20 || child.energy < 20) {
                    child.happiness = Math.max(0, child.happiness - 10);
                }
            });
        }
        
        // Natural stat changes (like original game - more challenging) - INCREASED
        this.adjustStat('energy', -10); // Increased from -8 - harder to maintain
        this.adjustStat('hunger', -15); // Increased from -12 - hunger decreases faster (more important!)
        
        // Stats naturally decrease more when already low (snowball effect)
        if (this.child.happiness < 50) {
            this.adjustStat('happiness', -2); // Additional decrease if already low
        }
        if (this.child.social < 50) {
            this.adjustStat('social', -1); // Additional decrease if already low
        }
        if (this.child.learning < 50) {
            this.adjustStat('learning', -1); // Additional decrease if already low
        }
        
        // Track daily routines - STRONGER consequences for skipping (like original)
        const daysSinceFed = this.day - (this.child.lastFed || 0);
        const daysSinceBathed = this.day - (this.child.lastBathed || 0);
        const daysSincePlayed = this.day - (this.child.lastPlayed || 0);
        const daysSinceRead = this.day - (this.child.lastRead || 0);
        
        // Critical: Must feed child regularly (like original) - STRONGER CONSEQUENCES
        if (daysSinceFed > 0) {
            this.child.daysWithoutFood = (this.child.daysWithoutFood || 0) + 1;
            // Even missing one day has consequences
            this.adjustStat('hunger', -20); // Increased from -15
            this.adjustStat('happiness', -12); // Increased from -10
            this.setEmotion('anxious', 15); // Increased from 10
            
            if (daysSinceFed > 1) {
                const hungryMsg = this.language === 'no'
                    ? this.child.name + " har ikke spist på " + daysSinceFed + " dager! Dette er kritisk!"
                    : this.child.name + " hasn't eaten in " + daysSinceFed + " days! This is critical!";
                this.showMessage("⚠️ " + hungryMsg);
                this.adjustStat('energy', -15); // Increased from -10
                this.adjustStat('happiness', -20); // Increased from -15
                this.setEmotion('sad', 20);
                
                // Very critical after 2 days
                if (daysSinceFed > 2) {
                    this.adjustStat('energy', -20);
                    this.adjustStat('happiness', -25);
                    this.setEmotion('scared', 15);
                    const criticalMsg = this.language === 'no'
                        ? "🚨 KRITISK: " + this.child.name + " sulter! Dette er farlig!"
                        : "🚨 CRITICAL: " + this.child.name + " is starving! This is dangerous!";
                    this.showMessage(criticalMsg);
                    this.showDialogue(this.language === 'no' 
                        ? "Jeg er så sulten... Jeg trenger mat. Snart."
                        : "I'm so hungry... I need food. Soon.");
                }
            }
        } else {
            this.child.daysWithoutFood = 0;
        }
        
        // Must bathe child regularly (like original) - STRONGER CONSEQUENCES
        if (daysSinceBathed > 1) {
            this.child.daysWithoutBath = (this.child.daysWithoutBath || 0) + 1;
            this.adjustStat('happiness', -8); // Increased from -5
            this.adjustStat('social', -5); // Increased from -3 - Poor hygiene affects social interactions
            this.setEmotion('embarrassed', 10);
            
            if (daysSinceBathed > 2) {
                const dirtyMsg = this.language === 'no'
                    ? this.child.name + " trenger et bad. Dette påvirker " + (this.child.gender === 'girl' ? 'henne' : 'ham') + " negativt."
                    : this.child.name + " needs a bath. This is affecting " + (this.child.gender === 'girl' ? 'her' : 'him') + " negatively.";
                this.showMessage("⚠️ " + dirtyMsg);
                this.adjustStat('social', -8); // Even worse social impact
                this.adjustStat('happiness', -12);
                
                if (daysSinceBathed > 3) {
                    this.adjustStat('social', -12);
                    this.adjustStat('happiness', -15);
                    this.setEmotion('embarrassed', 20);
                    const criticalMsg = this.language === 'no'
                        ? "🚨 " + this.child.name + " trenger desperat et bad! Dette påvirker alle sosiale interaksjoner."
                        : "🚨 " + this.child.name + " desperately needs a bath! This affects all social interactions.";
                    this.showMessage(criticalMsg);
                }
            }
        } else {
            this.child.daysWithoutBath = 0;
        }
        
        // Must play with child regularly (like original) - STRONGER CONSEQUENCES
        if (daysSincePlayed > 2) {
            this.adjustStat('happiness', -12); // Increased from -8
            this.adjustRelationship(-4); // Increased from -2
            this.setEmotion('sad', 15); // Increased from 10
            this.setEmotion('lonely', 10);
            
        if (daysSincePlayed > 3) {
            const lonelyMsg = this.language === 'no'
                ? this.child.name + " føler seg ensom... Vi har ikke lekt sammen på lenge."
                : this.child.name + " feels lonely... We haven't played together in a while.";
            this.showMessage("💔 " + lonelyMsg);
                this.adjustStat('happiness', -15);
                this.adjustRelationship(-6);
                this.setEmotion('lonely', 20);
                
                if (daysSincePlayed > 4) {
                    this.adjustStat('social', -8);
                    this.adjustRelationship(-8);
                    const criticalMsg = this.language === 'no'
                        ? "🚨 " + this.child.name + " føler seg forlatt. Vi må leke sammen!"
                        : "🚨 " + this.child.name + " feels abandoned. We need to play together!";
                    this.showMessage(criticalMsg);
                    this.showDialogue(this.language === 'no'
                        ? "Jeg savner deg... Kan vi leke sammen? Jeg føler meg så alene."
                        : "I miss you... Can we play together? I feel so alone.");
                }
            }
        }
        
        // Must read to child regularly - NEW CONSEQUENCE
        if (daysSinceRead > 3) {
            this.adjustStat('learning', -5);
            this.adjustStat('happiness', -5);
            this.adjustRelationship(-2);
            if (daysSinceRead > 5) {
                const readMsg = this.language === 'no'
                    ? this.child.name + " savner å lese sammen. Dette påvirker læringen."
                    : this.child.name + " misses reading together. This affects learning.";
                this.showMessage("📚 " + readMsg);
                this.adjustStat('learning', -10);
            this.adjustStat('happiness', -8);
            }
        }
        
        // Low hunger affects happiness more severely (like original) - STRONGER
        if (this.child.hunger < 30) {
            this.adjustStat('happiness', -12); // Increased from -8
            this.adjustStat('energy', -5); // New: hunger affects energy
            this.setEmotion('anxious', 12); // Increased from 8
            if (this.child.hunger < 20) {
                this.adjustStat('happiness', -15);
                this.adjustStat('energy', -8);
                this.setEmotion('scared', 10);
                const criticalMsg = this.language === 'no'
                    ? this.child.name + " er veldig sulten! Dette påvirker " + (this.child.gender === 'girl' ? 'henne' : 'ham') + " mye."
                    : this.child.name + " is very hungry! This is affecting " + (this.child.gender === 'girl' ? 'her' : 'him') + " a lot.";
                this.showMessage("⚠️ " + criticalMsg);
            }
            if (this.child.hunger < 15) {
                // Critical hunger - child is suffering
                this.adjustStat('happiness', -20);
                this.adjustStat('energy', -12);
                this.adjustStat('social', -5); // Hunger affects social interactions
                this.setEmotion('scared', 20);
                const criticalMsg = this.language === 'no'
                    ? "🚨 KRITISK: " + this.child.name + " sulter! Dette er farlig!"
                    : "🚨 CRITICAL: " + this.child.name + " is starving! This is dangerous!";
                this.showMessage(criticalMsg);
                this.showDialogue(this.language === 'no'
                    ? "Jeg er så sulten... Jeg kan ikke tenke klart. Jeg trenger mat."
                    : "I'm so hungry... I can't think clearly. I need food.");
            }
        }
        
        // Low happiness can affect other stats more (like original) - STRONGER
        if (this.child.happiness < 30) {
            this.adjustStat('social', -4); // Increased from -3
            this.adjustStat('learning', -3); // Increased from -2
            this.adjustRelationship(-3); // Increased from -2
            this.setEmotion('sad', 18); // Increased from 15
        if (this.child.happiness < 20) {
                this.adjustStat('social', -6);
                this.adjustStat('learning', -5);
                this.adjustStat('energy', -5); // Low happiness drains energy
                this.adjustRelationship(-5);
                this.setEmotion('sad', 25);
                this.setEmotion('lonely', 15);
                const criticalMsg = this.language === 'no'
                    ? "💔 " + this.child.name + " er veldig ulykkelig. Dette påvirker alt."
                    : "💔 " + this.child.name + " is very unhappy. This affects everything.";
                this.showMessage(criticalMsg);
            }
            if (this.child.happiness < 10) {
                // Critical unhappiness
                this.adjustStat('social', -10);
                this.adjustStat('learning', -8);
                this.adjustStat('energy', -10);
                this.adjustRelationship(-8);
                this.setEmotion('sad', 30);
                this.setEmotion('lonely', 20);
                const criticalMsg = this.language === 'no'
                    ? "🚨 KRITISK: " + this.child.name + " er i dyp nød. Dette er alvorlig!"
                    : "🚨 CRITICAL: " + this.child.name + " is in deep distress. This is serious!";
                this.showMessage(criticalMsg);
                this.showDialogue(this.language === 'no'
                    ? "Jeg føler meg så dårlig... Alt er vanskelig. Jeg trenger hjelp."
                    : "I feel so bad... Everything is hard. I need help.");
            }
        }
        
        // Low energy affects everything - NEW
        if (this.child.energy < 30) {
            this.adjustStat('happiness', -5);
            this.adjustStat('learning', -3);
            this.setEmotion('tired', 15);
            if (this.child.energy < 15) {
                this.adjustStat('happiness', -10);
                this.adjustStat('learning', -6);
                this.adjustStat('social', -5);
                this.setEmotion('tired', 25);
                const criticalMsg = this.language === 'no'
                    ? "😴 " + this.child.name + " er utmattet. Hvile er nødvendig."
                    : "😴 " + this.child.name + " is exhausted. Rest is necessary.";
                this.showMessage(criticalMsg);
            }
        }
        
        // Low social affects happiness and learning - NEW
        if (this.child.social < 30) {
            this.adjustStat('happiness', -4);
            this.setEmotion('lonely', 12);
            if (this.child.social < 15) {
                this.adjustStat('happiness', -8);
                this.adjustStat('learning', -4);
                this.setEmotion('lonely', 20);
            this.setEmotion('sad', 15);
                const criticalMsg = this.language === 'no'
                    ? "👥 " + this.child.name + " føler seg isolert. Sosial kontakt er viktig."
                    : "👥 " + this.child.name + " feels isolated. Social contact is important.";
                this.showMessage(criticalMsg);
            }
        }
        
        // Low learning affects future opportunities - NEW
        if (this.child.learning < 30) {
            this.adjustStat('happiness', -3);
            if (this.child.learning < 15) {
                this.adjustStat('happiness', -6);
                this.adjustStat('social', -3);
                const criticalMsg = this.language === 'no'
                    ? "📚 " + this.child.name + " faller bak i læring. Dette påvirker fremtiden."
                    : "📚 " + this.child.name + " is falling behind in learning. This affects the future.";
                this.showMessage(criticalMsg);
            }
        }
        
        // Bullying incidents have lasting effects (like original) - STRENGTHENED
        if (this.bullyingIncidents > 0 && this.child.age >= 7) {
            // Recent bullying affects child more - EXTENDED DURATION
            const daysSinceLastBullying = this.day - (this.memory.filter(m => m.event && m.event.includes("Bullying")).pop()?.day || 0);
            if (daysSinceLastBullying < 5) { // Extended from 3 to 5 days
                this.adjustStat('happiness', -4); // Increased from -3
                this.setEmotion('anxious', 6); // Increased from 5
                if (daysSinceLastBullying < 2) {
                    // Very recent bullying has stronger effect
                    this.adjustStat('social', -2);
                    this.adjustStat('energy', -3);
                }
            }
        }
        
        // Choice consequences that last multiple days - NEW
        this.applyLastingChoiceEffects();
        
        // High relationship provides passive benefits
        if (this.relationship > 80) {
            this.adjustStat('happiness', 2);
            this.setEmotion('happy', 5);
        }
        
        // Friends provide support during difficult times
        if (Math.random() < 0.3 && (this.child.happiness < 40 || this.child.resilience < 50)) {
            const friends = ['almaVilje', 'celiaRose'];
            const friendKey = friends[Math.floor(Math.random() * friends.length)];
            this.getFriendSupport(friendKey);
        }
        
        // Dystopian events - random crises in 2085
        if (Math.random() < 0.2) {
            this.triggerDystopianEvent();
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
    }
    
    applyLastingChoiceEffects() {
        // Apply consequences from choices that last multiple days
        const recentChoices = this.memory.filter(m => 
            m.lastingEffect && (this.day - m.day) <= 7 // Choices affect for up to 7 days
        );
        
        for (const choice of recentChoices) {
            const daysSince = this.day - choice.day;
            
            // Supportive choices have positive lasting effects
            if (choice.positive && choice.choiceType === "supportive_listening") {
                if (daysSince < 3) {
                    // Strong positive effect for first 3 days
                    this.adjustStat('happiness', 2);
                    this.adjustRelationship(1);
                } else if (daysSince < 7) {
                    // Weaker positive effect for days 4-7
                    this.adjustStat('happiness', 1);
                }
            }
            
            // Dismissive choices have negative lasting effects
            if (!choice.positive && choice.choiceType === "dismissive") {
                if (daysSince < 5) {
                    // Negative effect lasts longer
                    this.adjustStat('happiness', -2);
                    this.adjustRelationship(-1);
                    this.setEmotion('sad', 3);
                }
            }
            
            // Seeking help choices reduce future bullying impact
            if (choice.choiceType === "seeking_help" && this.bullyingIncidents > 0) {
                // Child feels more confident after seeking help
                this.child.resilience = Math.min(100, this.child.resilience + 0.5);
            }
            
            // United front choices strengthen relationship
            if (choice.choiceType === "united_front") {
                if (daysSince < 4) {
                    this.adjustRelationship(2);
                    this.adjustStat('happiness', 1);
                }
            }
            
            // Affirmation choices boost resilience
            if (choice.choiceType === "affirmation") {
                if (daysSince < 6) {
                    this.child.resilience = Math.min(100, this.child.resilience + 0.5);
                    this.adjustStat('happiness', 1);
                }
            }
        }
        
        // Check for patterns in choices that affect future events
        const supportiveChoices = this.memory.filter(m => 
            m.positive && m.choiceType && (this.day - m.day) <= 30
        ).length;
        
        const dismissiveChoices = this.memory.filter(m => 
            !m.positive && m.choiceType && (this.day - m.day) <= 30
        ).length;
        
        // Pattern: If child has many supportive choices, they trust more
        if (supportiveChoices > dismissiveChoices * 2) {
            this.child.trustLevel = Math.min(100, (this.child.trustLevel || 50) + 0.2);
        } else if (dismissiveChoices > supportiveChoices * 2) {
            this.child.trustLevel = Math.max(0, (this.child.trustLevel || 50) - 0.2);
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
        
        // Career choice at age 16
        if (this.child.age === 16 && !this.child.chosenCareer) {
            this.chooseCareer();
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
        
        // Career progress milestones
        if (this.child.chosenCareer) {
            if (this.child.careerProgress >= 75 && this.child.careerProgress < 76) {
                const milestoneMsg = this.language === 'no'
                    ? "Jeg gjør det så bra i " + this.child.chosenCareer + "! Jeg føler meg så stolt. Dette er fremtiden min."
                    : "I'm doing so well in " + this.child.chosenCareer + "! I feel so proud. This is my future.";
                this.showDialogue(milestoneMsg);
                this.addAutoDiaryEntry(
                    this.language === 'no'
                        ? 'Jeg når milepæler i ' + this.child.chosenCareer + '. Jeg er stolt av fremgangen min.'
                        : 'I\'m reaching milestones in ' + this.child.chosenCareer + '. I\'m proud of my progress.',
                    true
                );
            }
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
            // Much higher chance at school (like original) - FURTHER INCREASED
            bullyingChance = this.child.resilience < 50 ? 0.85 : 0.65; // Increased from 0.75/0.55
        } else if (this.currentLocation === 'playground') {
            // Can also happen at playground - FURTHER INCREASED
            bullyingChance = this.child.resilience < 50 ? 0.65 : 0.45; // Increased from 0.55/0.35
        } else {
            // Lower chance elsewhere, but still possible - FURTHER INCREASED
            bullyingChance = this.child.resilience < 30 ? 0.4 : 0.2; // Increased from 0.3/0.15
        }
        
        // More frequent if child is older (school age) - FURTHER INCREASED MULTIPLIER
        if (this.child.age >= 7) {
            bullyingChance *= 2.0; // Increased from 1.8
        }
        if (this.child.age >= 10) {
            bullyingChance *= 1.3; // Even more frequent for older children
        }
        
        // More frequent if child has been bullied recently (trauma effect) - STRONGER
        const recentBullying = this.memory.filter(m => 
            m.event && m.event.includes("Bullying") && (this.day - m.day) < 5
        ).length;
        if (recentBullying > 0) {
            bullyingChance *= (1 + recentBullying * 0.25); // Increased from 0.2 to 0.25 (25% increase per recent incident)
        }
        
        // If child has low resilience, bullying is even more likely
        if (this.child.resilience < 30) {
            bullyingChance *= 1.4; // 40% more likely if resilience is very low
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
        
        // Check past choices to influence current event - CHOICES AFFECT FUTURE EVENTS
        const hasSupportiveHistory = this.memory.some(m => 
            m.choiceType === "supportive_listening" && (this.day - m.day) <= 30
        );
        const hasDismissiveHistory = this.memory.some(m => 
            m.choiceType === "dismissive" && (this.day - m.day) <= 30
        );
        const hasSeekingHelpHistory = this.memory.some(m => 
            m.choiceType === "seeking_help" && (this.day - m.day) <= 30
        );
        
        // If child has supportive history, they're more likely to open up
        // If child has dismissive history, they're less likely to trust
        const trustLevel = this.child.trustLevel || 50;
        
        const events = this.language === 'no' ? [
            {
                dialogue: "Noen barn på skolen... de sa slemme ting i dag. De sa at jeg var annerledes, at jeg ikke hørte hjemme. Det gjorde vondt. Men jeg vet at jeg er god nok akkurat som jeg er. Alle barn fortjener kjærlighet og respekt, uansett hvor de kommer fra eller hvem de er.",
                message: this.child.name + " opplevde mobbing på skolen. " + (this.language === 'no' ? "Historien viser oss at alle barn fortjener kjærlighet, uansett bakgrunn." : "History shows us that all children deserve love, regardless of background."),
                choices: [
                    { 
                        text: "Jeg er så lei meg. Fortell meg hva som skjedde. Du er trygg her.", 
                        effect: () => {
                            // Past choices affect current outcome - MORE PERMANENT
                            const pastSupport = this.memory.filter(m => 
                                m.choiceType === "supportive_listening" && (this.day - m.day) <= 30
                            ).length;
                            
                            // More supportive choices = better outcome
                            const supportBonus = Math.min(5, pastSupport * 0.5); 
                            this.setEmotion('sad', 20);
                            this.setEmotion('anxious', 15);
                            this.adjustStat('happiness', -15 + supportBonus); // Past choices help
                            this.adjustStat('social', -8 + supportBonus * 0.5); // Past choices help
                            this.adjustRelationship(10 + supportBonus); // Stronger relationship boost
                            this.child.resilience = Math.min(100, this.child.resilience + 6 + supportBonus); // More resilience
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
                            // Past dismissive choices make this worse - CHOICES HAVE CONSEQUENCES
                            const pastDismissive = this.memory.filter(m => 
                                m.choiceType === "dismissive" && (this.day - m.day) <= 30
                            ).length;
                            
                            const dismissivePenalty = Math.min(5, pastDismissive * 0.5);
                            
                            this.setEmotion('sad', 15);
                            this.setEmotion('angry', 10);
                            this.adjustStat('happiness', -12 - dismissivePenalty); // Worse if repeated
                            this.adjustStat('social', -6 - dismissivePenalty * 0.5); // Worse if repeated
                            this.adjustRelationship(1 - dismissivePenalty); // Less relationship boost
                            this.child.resilience = Math.min(100, this.child.resilience + 1 - dismissivePenalty); // Less resilience
                            // Memory of this choice
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - told to be strong",
                                positive: false,
                                choiceType: "dismissive",
                                lastingEffect: true
                            });
                            this.child.bullyingCopingMethod = "suppression";
                            
                            // If child has low trust, they're less likely to open up
                            if (this.child.trustLevel < 40) {
                                this.showDialogue("Jeg prøver... Men jeg føler at jeg ikke kan snakke med deg om dette. Jeg holder det inne."); 
                            } else {
                                this.showDialogue("Jeg skal prøve å være sterk... men det er vanskelig noen ganger. Jeg føler at jeg må holde det inne."); 
                            }
                        } 
                    },
                    { 
                        text: "Kanskje vi burde snakke med læreren om dette.", 
                        effect: () => {
                            // If child has sought help before, they're more confident
                            const pastHelpSeeking = this.memory.filter(m => 
                                m.choiceType === "seeking_help" && (this.day - m.day) <= 30
                            ).length;
                            
                            const helpBonus = Math.min(3, pastHelpSeeking * 0.3);
                            
                            this.setEmotion('anxious', 15 - helpBonus); // Less anxiety if done before
                            this.setEmotion('scared', 10 - helpBonus);
                            this.adjustStat('happiness', -8 + helpBonus); // Better if done before
                            this.adjustStat('social', -5 + helpBonus * 0.5); // Better if done before
                            this.adjustRelationship(3 + helpBonus); // Better relationship
                            this.child.resilience = Math.min(100, this.child.resilience + 4 + helpBonus); // Good resilience boost
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
                            
                            if (pastHelpSeeking > 0) {
                                this.showDialogue("Jeg har gjort dette før... Jeg vet at det hjelper. La oss gjøre det igjen."); 
                            } else {
                                this.showDialogue("Jeg er redd... hva hvis de blir sinte? Men... kanskje det er det riktige å gjøre. Jeg vil prøve."); 
                            }
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
                            this.adjustStat('happiness', -20); // More severe
                            this.adjustStat('energy', -15); // More severe
                            this.adjustStat('social', -10); // Additional impact
                            this.adjustRelationship(8); // Better relationship boost
                            this.child.resilience = Math.min(100, this.child.resilience + 6); // More resilience
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
                            this.addAutoDiaryEntry(
                                this.language === 'no' ? 'I dag sto jeg opp for meg selv mot bøllene. Det fungerte! Jeg føler meg sterkere.' : 'Today I stood up for myself against the bullies. It worked! I feel stronger.',
                                true
                            );
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
            },
            {
                dialogue: this.language === 'no' ? "De tok tingene mine i dag... Jeg føler meg så hjelpeløs. Hvorfor gjør de dette?" : "They took my things today... I feel so helpless. Why do they do this?",
                message: this.language === 'no' ? "Mobbing: Tyveri og maktmisbruk." : "Bullying: Theft and power abuse.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Dette er ikke greit. Vi må gjøre noe. La oss snakke med læreren sammen." : "This is not okay. We need to do something. Let's talk to the teacher together.", 
                        effect: () => { 
                            this.setEmotion('angry', 20);
                            this.setEmotion('sad', 15);
                            this.setEmotion('scared', 10);
                            this.adjustStat('happiness', -18);
                            this.adjustStat('social', -10);
                            this.adjustRelationship(9);
                            this.child.resilience = Math.min(100, this.child.resilience + 7);
                            this.child.teacherInvolved = true;
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - theft, got help together",
                                positive: true,
                                choiceType: "united_front",
                                lastingEffect: true
                            });
                            const msg = this.language === 'no' ? "Takk... Jeg er redd, men jeg føler meg tryggere når du er med meg. La oss gjøre dette sammen." : "Thank you... I'm scared, but I feel safer when you're with me. Let's do this together.";
                            this.showDialogue(msg); 
                            this.saveGame();
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Vi kan ignorere dem. De vil gå lei etter hvert." : "We can ignore them. They'll get bored eventually.", 
                        effect: () => { 
                            this.setEmotion('sad', 25);
                            this.setEmotion('angry', 15);
                            this.adjustStat('happiness', -15);
                            this.adjustStat('social', -8);
                            this.adjustRelationship(2);
                            this.child.resilience = Math.min(100, this.child.resilience + 2);
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - theft, ignored",
                                positive: false,
                                choiceType: "passive",
                                lastingEffect: true
                            });
                            const msg = this.language === 'no' ? "Jeg håper du har rett... Men jeg er redd det bare blir verre. Jeg føler meg så hjelpeløs." : "I hope you're right... But I'm afraid it will just get worse. I feel so helpless.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "De sa at jeg ikke hører hjemme her... At jeg er annerledes. Jeg prøver å ikke bry meg, men det gjør så vondt." : "They said I don't belong here... That I'm different. I try not to care, but it hurts so much.",
                message: this.language === 'no' ? "Mobbing: Eksklusjon og identitetsangrep." : "Bullying: Exclusion and identity attacks.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Du hører hjemme akkurat hvor du er. Du er perfekt akkurat som du er. La oss finne steder hvor du føler deg velkommen." : "You belong exactly where you are. You're perfect just as you are. Let's find places where you feel welcome.", 
                        effect: () => { 
                            this.setEmotion('sad', 20);
                            this.setEmotion('anxious', -10);
                            this.setEmotion('happy', 10);
                            this.adjustStat('happiness', -12);
                            this.adjustStat('social', -8);
                            this.adjustRelationship(10);
                            this.child.resilience = Math.min(100, this.child.resilience + 8);
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - identity attack, affirmed belonging",
                                positive: true,
                                choiceType: "affirmation",
                                lastingEffect: true
                            });
                            const msg = this.language === 'no' ? "Takk... Det hjelper å høre det. Jeg vil prøve å huske at jeg hører hjemme, selv når de sier noe annet." : "Thank you... It helps to hear that. I'll try to remember that I belong, even when they say otherwise.";
                            this.showDialogue(msg); 
                            this.saveGame();
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Ikke hør på dem. De vet ikke hva de snakker om." : "Don't listen to them. They don't know what they're talking about.", 
                        effect: () => { 
                            this.setEmotion('sad', 18);
                            this.setEmotion('angry', 12);
                            this.adjustStat('happiness', -10);
                            this.adjustStat('social', -6);
                            this.adjustRelationship(3);
                            this.child.resilience = Math.min(100, this.child.resilience + 3);
                            const msg = this.language === 'no' ? "Jeg prøver... Men det er vanskelig når de sier det hele tiden." : "I'm trying... But it's hard when they say it all the time.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "De laget en gruppe uten meg i dag... Alle andre var med, bare ikke jeg. Jeg føler meg så utenfor." : "They made a group without me today... Everyone else was included, just not me. I feel so left out.",
                message: this.language === 'no' ? "Mobbing: Sosial eksklusjon og gruppepress." : "Bullying: Social exclusion and group pressure.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Jeg forstår hvor vondt det gjør. La oss finne andre som verdsetter deg for den du er." : "I understand how much that hurts. Let's find others who value you for who you are.", 
                        effect: () => { 
                            this.setEmotion('sad', 22);
                            this.setEmotion('lonely', 20);
                            this.setEmotion('anxious', 15);
                            this.adjustStat('happiness', -18);
                            this.adjustStat('social', -12);
                            this.adjustRelationship(8);
                            this.child.resilience = Math.min(100, this.child.resilience + 5);
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - exclusion, found support",
                                positive: true,
                                choiceType: "supportive_listening",
                                lastingEffect: true
                            });
                            const msg = this.language === 'no' ? "Takk... Jeg håper jeg kan finne venner som ser meg for den jeg er. Det er så vanskelig å være alene." : "Thank you... I hope I can find friends who see me for who I am. It's so hard to be alone.";
                            this.showDialogue(msg); 
                            this.saveGame();
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Kanskje du kan prøve å være mer som dem, så de vil ha deg med?" : "Maybe you can try to be more like them, so they'll want you?", 
                        effect: () => { 
                            this.setEmotion('sad', 25);
                            this.setEmotion('lonely', 22);
                            this.setEmotion('anxious', 20);
                            this.adjustStat('happiness', -20);
                            this.adjustStat('social', -15);
                            this.adjustRelationship(-5); // Negative impact - wrong approach
                            this.child.resilience = Math.min(100, this.child.resilience - 2); // Actually reduces resilience
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - exclusion, told to change self",
                                positive: false,
                                choiceType: "dismissive",
                                lastingEffect: true
                            });
                            const msg = this.language === 'no' ? "Jeg prøver... Men jeg føler at jeg må skjule den jeg er. Det gjør meg så trist. Jeg vil bare være meg selv." : "I'm trying... But I feel like I have to hide who I am. It makes me so sad. I just want to be myself.";
                            this.showDialogue(msg); 
                        } 
                    }
                ]
            },
            {
                dialogue: this.language === 'no' ? "De sendte en slem melding til meg på internett i dag... Jeg visste ikke hva jeg skulle gjøre. Det føltes så skummelt." : "They sent me a mean message online today... I didn't know what to do. It felt so scary.",
                message: this.language === 'no' ? "Mobbing: Digital mobbing og cyberbullying." : "Bullying: Digital bullying and cyberbullying.",
                choices: [
                    { 
                        text: this.language === 'no' ? "Dette er ikke greit. La oss dokumentere dette og snakke med en voksen sammen. Du er ikke alene." : "This is not okay. Let's document this and talk to an adult together. You're not alone.", 
                        effect: () => { 
                            this.setEmotion('scared', 25);
                            this.setEmotion('anxious', 20);
                            this.setEmotion('sad', 15);
                            this.adjustStat('happiness', -20);
                            this.adjustStat('social', -12);
                            this.adjustStat('energy', -10);
                            this.adjustRelationship(10);
                            this.child.resilience = Math.min(100, this.child.resilience + 7);
                            this.child.teacherInvolved = true;
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - cyberbullying, got help",
                                positive: true,
                                choiceType: "seeking_help",
                                lastingEffect: true
                            });
                            const msg = this.language === 'no' ? "Takk... Jeg er redd, men jeg føler meg tryggere når du er med meg. La oss gjøre noe sammen." : "Thank you... I'm scared, but I feel safer when you're with me. Let's do something together.";
                            this.showDialogue(msg); 
                            this.saveGame();
                        } 
                    },
                    { 
                        text: this.language === 'no' ? "Prøv å ignorere det. Det vil gå over." : "Try to ignore it. It will pass.", 
                        effect: () => { 
                            this.setEmotion('scared', 20);
                            this.setEmotion('anxious', 18);
                            this.setEmotion('sad', 15);
                            this.adjustStat('happiness', -15);
                            this.adjustStat('social', -10);
                            this.adjustRelationship(2);
                            this.child.resilience = Math.min(100, this.child.resilience + 1);
                            this.memory.push({
                                day: this.day,
                                event: "Bullying - cyberbullying, ignored",
                                positive: false,
                                choiceType: "passive",
                                lastingEffect: true
                            });
                            const msg = this.language === 'no' ? "Jeg prøver... Men det er så vanskelig å ignorere når det er der hele tiden. Jeg føler meg så hjelpeløs." : "I'm trying... But it's so hard to ignore when it's there all the time. I feel so helpless.";
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
    
    // Menu Tab Functions
    showMenuTab(tabName) {
        // Hide all tab contents
        const allTabs = document.querySelectorAll('.menu-tab-content');
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.display = 'none';
        });
        
        // Remove active class from all menu tabs
        const allMenuTabs = document.querySelectorAll('.menu-tab');
        allMenuTabs.forEach(tab => tab.classList.remove('active'));
        
        // Show/hide game area
        const gameArea = document.querySelector('.game-area');
        
        if (tabName === 'game') {
            // Show game area
            if (gameArea) {
                gameArea.classList.remove('hidden');
            }
            // Activate game tab
            const gameTab = document.getElementById('gameTab');
            if (gameTab) gameTab.classList.add('active');
        } else {
            // Hide game area
            if (gameArea) {
                gameArea.classList.add('hidden');
            }
            
            // Show selected tab content
            let tabContent = null;
            let menuTab = null;
            
            if (tabName === 'about') {
                tabContent = document.getElementById('aboutGameTab');
                menuTab = document.getElementById('aboutTab');
            } else if (tabName === 'project') {
                tabContent = document.getElementById('aboutProjectTab');
                menuTab = document.getElementById('projectTab');
            } else if (tabName === 'profile') {
                tabContent = document.getElementById('profileMenuTab');
                menuTab = document.getElementById('profileTab');
                this.updateProfileTab();
            } else if (tabName === 'diary') {
                tabContent = document.getElementById('diaryTab');
                menuTab = document.getElementById('diaryTab');
                this.updateDiaryTab();
            }
            
            if (tabContent) {
                tabContent.style.display = 'block';
                tabContent.classList.add('active');
            }
            
            if (menuTab) {
                menuTab.classList.add('active');
            }
        }
    }
    
    updateProfileTab() {
        // Update profile tab with current user info
        const profileTabAvatar = document.getElementById('profileTabAvatar');
        const profileTabName = document.getElementById('profileTabName');
        const profileTabUsername = document.getElementById('profileTabUsername');
        const profileDaysPlayed = document.getElementById('profileDaysPlayed');
        const profileChildAge = document.getElementById('profileChildAge');
        const profileYear = document.getElementById('profileYear');
        
        if (profileTabAvatar && this.child) {
            profileTabAvatar.textContent = this.child.emoji || '👶';
        }
        
        if (profileTabName && this.child) {
            profileTabName.textContent = this.child.name || 'Barn';
        }
        
        if (profileTabUsername) {
            profileTabUsername.textContent = this.username || 'Bruker';
        }
        
        if (profileDaysPlayed && this.child) {
            profileDaysPlayed.textContent = this.child.days || 0;
        }
        
        if (profileChildAge && this.child) {
            profileChildAge.textContent = this.child.age || 0;
        }
        
        if (profileYear && this.child) {
            profileYear.textContent = this.child.year || 2000;
        }
    }
    
    // Diary Functions
    updateDiaryTab() {
        const diaryEntriesList = document.getElementById('diaryEntriesList');
        if (!diaryEntriesList || !this.child.diary) return;
        
        // Sort entries by day (newest first)
        const sortedEntries = [...this.child.diary].sort((a, b) => (b.day || 0) - (a.day || 0));
        
        if (sortedEntries.length === 0) {
            diaryEntriesList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">' + 
                (this.language === 'no' ? 'Ingen dagbok-innlegg ennå. Skriv noe eller vent på at viktige hendelser genererer innlegg automatisk.' : 
                 'No diary entries yet. Write something or wait for important events to generate entries automatically.') + 
                '</p>';
            return;
        }
        
        diaryEntriesList.innerHTML = sortedEntries.map(entry => {
            const dateStr = this.language === 'no' 
                ? `Dag ${entry.day || '?'}, År ${entry.year || this.year || 2000}`
                : `Day ${entry.day || '?'}, Year ${entry.year || this.year || 2000}`;
            const typeIcon = entry.autoGenerated ? '✨' : '✍️';
            const typeLabel = entry.autoGenerated 
                ? (this.language === 'no' ? 'Auto-generert' : 'Auto-generated')
                : (this.language === 'no' ? 'Manuelt' : 'Manual');
            
            return `
                <div class="diary-entry" style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.3); border-radius: 10px; border-left: 4px solid ${entry.positive ? '#4CAF50' : '#f44336'};">
                    <div class="diary-entry-header" style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9em; color: #666;">
                        <span><strong>${dateStr}</strong></span>
                        <span>${typeIcon} ${typeLabel}</span>
                    </div>
                    <div class="diary-entry-content" style="font-size: 1em; line-height: 1.6;">
                        ${entry.text || entry.content || ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    addManualDiaryEntry() {
        const diaryEntryText = document.getElementById('diaryEntryText');
        if (!diaryEntryText || !diaryEntryText.value.trim()) {
            this.showMessage(this.language === 'no' 
                ? 'Skriv noe i dagbok først!'
                : 'Write something in the diary first!');
            return;
        }
        
        if (!this.child.diary) {
            this.child.diary = [];
        }
        
        this.child.diary.push({
            day: this.day,
            year: this.year,
            text: diaryEntryText.value.trim(),
            autoGenerated: false,
            positive: true
        });
        
        diaryEntryText.value = '';
        this.updateDiaryTab();
        this.saveGame();
        
        this.showMessage(this.language === 'no' 
            ? 'Dagbok-innlegg lagret!'
            : 'Diary entry saved!');
    }
    
    addAutoDiaryEntry(eventText, positive = true, emotion = null) {
        if (!this.child.diary) {
            this.child.diary = [];
        }
        
        // Generate age-appropriate diary text
        let diaryText = '';
        if (this.child.age < 5) {
            diaryText = this.language === 'no'
                ? `I dag skjedde det noe: ${eventText}. Jeg husker det.`
                : `Today something happened: ${eventText}. I remember it.`;
        } else if (this.child.age < 10) {
            diaryText = this.language === 'no'
                ? `I dag: ${eventText}. Det var ${positive ? 'fint' : 'vanskelig'}.`
                : `Today: ${eventText}. It was ${positive ? 'nice' : 'difficult'}.`;
        } else {
            diaryText = this.language === 'no'
                ? `${eventText} ${positive ? 'Det føltes bra.' : 'Det var vanskelig, men jeg lærer av det.'}`
                : `${eventText} ${positive ? 'It felt good.' : 'It was difficult, but I am learning from it.'}`;
        }
        
        this.child.diary.push({
            day: this.day,
            year: this.year,
            text: diaryText,
            autoGenerated: true,
            positive: positive,
            emotion: emotion
        });
        
        // Keep only last 50 entries to prevent memory issues
        if (this.child.diary.length > 50) {
            this.child.diary = this.child.diary.slice(-50);
        }
        
        this.saveGame();
    }
    
    chooseCareer() {
        if (!this.canPerformAction()) return;
        
        if (this.child.age < 16) {
            this.showMessage(this.language === 'no' 
                ? "Du må være minst 16 år for å velge karriere."
                : "You must be at least 16 years old to choose a career.");
            return;
        }
        
        if (this.child.chosenCareer) {
            this.showMessage(this.language === 'no' 
                ? "Du har allerede valgt karriere: " + this.child.chosenCareer
                : "You have already chosen a career: " + this.child.chosenCareer);
            return;
        }
        
        const careers = [
            { name: this.language === 'no' ? 'Lærer' : 'Teacher', emoji: '👨‍🏫', description: this.language === 'no' ? 'Hjelpe andre å lære og vokse' : 'Help others learn and grow', studyReq: 60, salary: 40000, happiness: 15, social: 20 },
            { name: this.language === 'no' ? 'Ingeniør' : 'Engineer', emoji: '🔧', description: this.language === 'no' ? 'Bygge og løse problemer' : 'Build and solve problems', studyReq: 70, salary: 60000, happiness: 10, learning: 15 },
            { name: this.language === 'no' ? 'Lege' : 'Doctor', emoji: '👨‍⚕️', description: this.language === 'no' ? 'Hjelpe andre å bli friske' : 'Help others get healthy', studyReq: 80, salary: 80000, happiness: 20, social: 15 },
            { name: this.language === 'no' ? 'Kunstner' : 'Artist', emoji: '🎨', description: this.language === 'no' ? 'Skape og uttrykke meg' : 'Create and express myself', studyReq: 40, salary: 30000, happiness: 25, learning: 10 },
            { name: this.language === 'no' ? 'Forfatter' : 'Writer', emoji: '✍️', description: this.language === 'no' ? 'Fortelle historier og dele ideer' : 'Tell stories and share ideas', studyReq: 50, salary: 35000, happiness: 20, learning: 15 },
            { name: this.language === 'no' ? 'Sykepleier' : 'Nurse', emoji: '👩‍⚕️', description: this.language === 'no' ? 'Ta vare på andre' : 'Take care of others', studyReq: 55, salary: 45000, happiness: 18, social: 18 },
            { name: this.language === 'no' ? 'IT-utvikler' : 'IT Developer', emoji: '💻', description: this.language === 'no' ? 'Lage programvare og løsninger' : 'Create software and solutions', studyReq: 65, salary: 70000, happiness: 12, learning: 20 },
            { name: this.language === 'no' ? 'Psykolog' : 'Psychologist', emoji: '🧠', description: this.language === 'no' ? 'Hjelpe andre med mentalt velvære' : 'Help others with mental wellbeing', studyReq: 75, salary: 55000, happiness: 15, social: 25 }
        ];
        
        // Filter careers based on study level
        const availableCareers = careers.filter(c => this.child.studyLevel >= c.studyReq);
        
        if (availableCareers.length === 0) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg har ikke studert nok ennå... Jeg trenger minst 40 i studie-nivå for å velge en karriere. La meg studere mer først!"
                : "I haven't studied enough yet... I need at least 40 in study level to choose a career. Let me study more first!");
            return;
        }
        
        this.showDialogue(this.language === 'no' 
            ? "Hvilken karriere vil jeg velge? Dette er et viktig valg for fremtiden min!"
            : "What career should I choose? This is an important choice for my future!");
        
        setTimeout(() => {
            const careerContainer = document.createElement('div');
            careerContainer.id = 'careerContainer';
            careerContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #fff0f5 0%, #e0f7ff 100%); padding: 30px; border-radius: 20px; border: 3px solid #ff00ff; z-index: 10000; max-width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 0 30px rgba(255,0,255,0.5);';
            
            const title = document.createElement('h3');
            title.textContent = this.language === 'no' ? '💼 Velg karriere' : '💼 Choose career';
            title.style.cssText = 'margin-top: 0; text-align: center;';
            careerContainer.appendChild(title);
            
            const info = document.createElement('p');
            info.textContent = this.language === 'no' 
                ? 'Ditt studie-nivå: ' + this.child.studyLevel + '/100'
                : 'Your study level: ' + this.child.studyLevel + '/100';
            info.style.cssText = 'text-align: center; margin-bottom: 20px; font-weight: bold;';
            careerContainer.appendChild(info);
            
            availableCareers.forEach((career) => {
                const careerBtn = document.createElement('button');
                careerBtn.className = 'btn-primary';
                careerBtn.style.cssText = 'display: block; width: 100%; margin: 10px 0; padding: 15px; text-align: left;';
                
                const locked = this.child.studyLevel < career.studyReq;
                const lockIcon = locked ? '🔒 ' : '';
                
                careerBtn.innerHTML = `<strong>${lockIcon}${career.emoji} ${career.name}</strong><br>
                    <small>${career.description}</small><br>
                    <small>📚 Studie-krav: ${career.studyReq} | 💰 Lønn: ${career.salary.toLocaleString()} kr/år | 😊 Happiness: +${career.happiness} | ${career.social ? '👥 Social: +' + career.social : '📖 Learning: +' + career.learning}</small>`;
                
                if (locked) {
                    careerBtn.disabled = true;
                    careerBtn.style.opacity = '0.5';
                    careerBtn.style.cursor = 'not-allowed';
                } else {
                    careerBtn.onclick = () => {
                        this.child.chosenCareer = career.name;
                        this.child.careerSalary = career.salary;
                        
                        const careerMsg = this.language === 'no'
                            ? "Jeg har valgt å bli " + career.emoji + " " + career.name + "! " + career.description + ". Dette er fremtiden min, og jeg er klar!"
                            : "I've chosen to become a " + career.emoji + " " + career.name + "! " + career.description + ". This is my future, and I'm ready!";
                        
                        this.showDialogue(careerMsg);
                        
                        this.adjustStat('happiness', career.happiness);
                        if (career.social !== undefined && career.social !== null) {
                            this.adjustStat('social', career.social);
                        }
                        if (career.learning !== undefined && career.learning !== null) {
                            this.adjustStat('learning', career.learning);
                        }
                        this.setEmotion('happy', 30);
                        this.child.careerProgress = Math.min(100, this.child.careerProgress + 15);
                        
                        this.showMessage(this.language === 'no'
                            ? "🎯 " + this.child.name + " har valgt karriere! Fremtiden er i deres hender! Årlig lønn: " + career.salary.toLocaleString() + " kr."
                            : "🎯 " + this.child.name + " has chosen a career! The future is in their hands! Annual salary: " + career.salary.toLocaleString() + " kr.");
                        
                        this.addAutoDiaryEntry(
                            this.language === 'no'
                                ? '💼 I dag valgte jeg min karriere: ' + career.name + '. Jeg er spent på fremtiden! Dette viser at jeg kan vokse fra mobbeoffer til suksess.'
                                : '💼 Today I chose my career: ' + career.name + '. I\'m excited about the future! This shows I can grow from a bullying victim to success.',
                            true
                        );
                        
                        careerContainer.remove();
                        this.updateDisplay();
                        this.performAction();
                        this.advanceTime();
                        this.saveGame();
                    };
                }
                
                careerContainer.appendChild(careerBtn);
            });
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = this.language === 'no' ? 'Avbryt' : 'Cancel';
            cancelBtn.style.cssText = 'display: block; width: 100%; margin-top: 10px; padding: 10px; background: #ccc; border: none; border-radius: 10px; cursor: pointer;';
            cancelBtn.onclick = () => careerContainer.remove();
            careerContainer.appendChild(cancelBtn);
            
            document.body.appendChild(careerContainer);
        }, 500);
    }
    
    // Minigames from 2000s
    playNumberGame() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å spille akkurat nå..."
                : "I'm too tired to play right now...");
            return;
        }
        
        // Simple number game - guess the number
        const targetNumber = Math.floor(Math.random() * 20) + 1;
        const guess = prompt(this.language === 'no' 
            ? "Jeg tenker på et tall mellom 1 og 20. Hva tror du det er?"
            : "I'm thinking of a number between 1 and 20. What do you think it is?");
        
        if (guess && !isNaN(guess)) {
            const userGuess = parseInt(guess);
            if (userGuess === targetNumber) {
                this.showDialogue(this.language === 'no' 
                    ? "Riktig! Det var " + targetNumber + "! Jeg er så flink!"
                    : "Correct! It was " + targetNumber + "! I'm so good!");
                this.adjustStat('happiness', 15);
                this.adjustStat('learning', 10);
                this.adjustStat('energy', -5);
                this.setEmotion('happy', 20);
                this.setEmotion('surprised', 10);
            } else {
                const diff = Math.abs(userGuess - targetNumber);
                const hint = diff <= 3 ? (this.language === 'no' ? "Nærme!" : "Close!") : (this.language === 'no' ? "Ikke helt riktig." : "Not quite right.");
                this.showDialogue(this.language === 'no' 
                    ? hint + " Det var " + targetNumber + ". Men det var gøy å spille!"
                    : hint + " It was " + targetNumber + ". But it was fun to play!");
                this.adjustStat('happiness', 8);
                this.adjustStat('learning', 5);
                this.adjustStat('energy', -5);
                this.setEmotion('curious', 10);
            }
        } else {
            this.showDialogue(this.language === 'no' 
                ? "Det var gøy å spille uansett!"
                : "It was fun to play anyway!");
            this.adjustStat('happiness', 5);
            this.adjustStat('energy', -3);
        }
        
        this.showMessage(this.language === 'no'
            ? "🎮 Minispill hjelper " + this.child.name + " med å lære og ha det gøy!"
            : "🎮 Minigames help " + this.child.name + " learn and have fun!");
        this.performAction();
        this.advanceTime();
    }
    
    playMemoryGame() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å spille akkurat nå..."
                : "I'm too tired to play right now...");
            return;
        }
        
        // Simple memory game - remember a sequence
        const colors = ['🔴', '🟢', '🔵', '🟡'];
        const sequence = [];
        for (let i = 0; i < 3; i++) {
            sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        }
        
        const sequenceStr = sequence.join(' ');
        alert(this.language === 'no' 
            ? "Husk denne sekvensen: " + sequenceStr
            : "Remember this sequence: " + sequenceStr);
        
        setTimeout(() => {
            const userSequence = prompt(this.language === 'no' 
                ? "Hva var sekvensen? (Skriv fargene med mellomrom, f.eks: 🔴 🟢 🔵)"
                : "What was the sequence? (Write the colors with spaces, e.g: 🔴 🟢 🔵)");
            
            if (userSequence && userSequence.trim() === sequenceStr) {
                this.showDialogue(this.language === 'no' 
                    ? "Riktig! Jeg husket hele sekvensen! Jeg har god hukommelse!"
                    : "Correct! I remembered the whole sequence! I have good memory!");
                this.adjustStat('happiness', 15);
                this.adjustStat('learning', 12);
                this.adjustStat('energy', -6);
                this.setEmotion('happy', 18);
                this.setEmotion('surprised', 8);
            } else {
                this.showDialogue(this.language === 'no' 
                    ? "Hmm, det var ikke helt riktig. Men jeg prøvde! Sekvensen var: " + sequenceStr
                    : "Hmm, that wasn't quite right. But I tried! The sequence was: " + sequenceStr);
                this.adjustStat('happiness', 8);
                this.adjustStat('learning', 6);
                this.adjustStat('energy', -6);
                this.setEmotion('curious', 10);
            }
            
            this.showMessage(this.language === 'no'
                ? "🧠 Hukommelsesspill hjelper " + this.child.name + " med å trene hjernen!"
                : "🧠 Memory games help " + this.child.name + " train the brain!");
            this.performAction();
            this.advanceTime();
        }, 2000);
    }
    
    playGuessGame() {
        if (!this.canPerformAction()) return;
        
        if (this.child.energy < 10) {
            this.showDialogue(this.language === 'no' 
                ? "Jeg er for trøtt til å spille akkurat nå..."
                : "I'm too tired to play right now...");
            return;
        }
        
        // Simple guessing game - guess the animal
        const animals = [
            { name: this.language === 'no' ? 'katt' : 'cat', emoji: '🐱', hint: this.language === 'no' ? 'Den sier mjau' : 'It says meow' },
            { name: this.language === 'no' ? 'hund' : 'dog', emoji: '🐶', hint: this.language === 'no' ? 'Den sier voff' : 'It says woof' },
            { name: this.language === 'no' ? 'fugl' : 'bird', emoji: '🐦', hint: this.language === 'no' ? 'Den kan fly' : 'It can fly' },
            { name: this.language === 'no' ? 'fisk' : 'fish', emoji: '🐟', hint: this.language === 'no' ? 'Den lever i vann' : 'It lives in water' }
        ];
        
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const guess = prompt(this.language === 'no' 
            ? "Jeg tenker på et dyr. Hint: " + animal.hint + ". Hva tror du det er?"
            : "I'm thinking of an animal. Hint: " + animal.hint + ". What do you think it is?");
        
        if (guess && guess.toLowerCase().includes(animal.name.toLowerCase())) {
            this.showDialogue(this.language === 'no' 
                ? "Riktig! Det var " + animal.emoji + " " + animal.name + "! Jeg er så flink!"
                : "Correct! It was " + animal.emoji + " " + animal.name + "! I'm so good!");
            this.adjustStat('happiness', 15);
            this.adjustStat('learning', 10);
            this.adjustStat('energy', -5);
            this.setEmotion('happy', 20);
            this.setEmotion('surprised', 10);
        } else {
            this.showDialogue(this.language === 'no' 
                ? "Ikke helt riktig, men det var gøy! Det var " + animal.emoji + " " + animal.name + "!"
                : "Not quite right, but it was fun! It was " + animal.emoji + " " + animal.name + "!");
            this.adjustStat('happiness', 8);
            this.adjustStat('learning', 5);
            this.adjustStat('energy', -5);
            this.setEmotion('curious', 10);
        }
        
        this.showMessage(this.language === 'no'
            ? "🎯 Gjetespill hjelper " + this.child.name + " med å tenke og lære!"
            : "🎯 Guessing games help " + this.child.name + " think and learn!");
        this.performAction();
        this.advanceTime();
    }
    
    // Future-specific functions
    getDriversLicense() {
        if (this.child.age < 16) return;
        
        // Check if player has enough money for license (in 2085, licenses are expensive)
        const licenseCost = 5000; // Expensive in dystopian future
        if (this.child.money < licenseCost) {
            const noMoneyMsg = this.language === 'no'
                ? "Jeg vil gjerne ta lappen, men det koster " + licenseCost + " kroner. I 2085 er alt dyrt på grunn av ressursmangel. Jeg må spare mer penger først."
                : "I'd like to get my driver's license, but it costs " + licenseCost + " kroner. In 2085, everything is expensive due to resource scarcity. I need to save more money first.";
            this.showDialogue(noMoneyMsg);
            return;
        }
        
        // Take the test
        const passed = Math.random() > 0.3; // 70% chance to pass
        
        if (passed) {
            this.child.money -= licenseCost;
            this.child.hasDriversLicense = true;
            
            const successMsg = this.language === 'no'
                ? "🎉 Jeg besto lappen! Nå kan jeg kjøre flyvende biler! Det er så kult! Men det var dyrt - " + licenseCost + " kroner. I 2085 er alt så dyrt på grunn av ressursmangel."
                : "🎉 I passed my driver's test! Now I can drive flying cars! It's so cool! But it was expensive - " + licenseCost + " kroner. In 2085, everything is so expensive due to resource scarcity.";
            this.showDialogue(successMsg);
            
            this.adjustStat('happiness', 20);
            this.adjustStat('social', 10);
            this.setEmotion('happy', 25);
            this.setEmotion('surprised', 15);
            
            this.addAutoDiaryEntry(
                this.language === 'no'
                    ? 'I dag tok jeg lappen! Nå kan jeg kjøre flyvende biler. Det var dyrt, men verdt det.'
                    : 'Today I got my driver\'s license! Now I can drive flying cars. It was expensive, but worth it.',
                true
            );
        } else {
            // Failed test - lose some money but can retry
            this.child.money -= Math.floor(licenseCost / 2);
            
            const failMsg = this.language === 'no'
                ? "Jeg strøk på lappen... Det var vanskelig. Jeg måtte betale " + Math.floor(licenseCost / 2) + " kroner for prøven. Jeg kan prøve igjen neste år."
                : "I failed my driver's test... It was difficult. I had to pay " + Math.floor(licenseCost / 2) + " kroner for the test. I can try again next year.";
            this.showDialogue(failMsg);
            
            this.adjustStat('happiness', -10);
            this.setEmotion('sad', 15);
            this.setEmotion('embarrassed', 10);
        }
        
        this.saveGame();
    }
    
    moveOut() {
        if (this.child.age < 18) return;
        
        // Check if player has enough money to move out (in 2085, housing is very expensive)
        const moveOutCost = 50000; // Very expensive in dystopian future
        if (this.child.money < moveOutCost) {
            const noMoneyMsg = this.language === 'no'
                ? "Jeg vil gjerne flytte hjemmefra, men det koster " + moveOutCost + " kroner for depositum og første måneds husleie. I 2085 er boliger ekstremt dyre på grunn av ressursmangel og klimaendringer. Jeg må spare mer penger først."
                : "I'd like to move out, but it costs " + moveOutCost + " kroner for deposit and first month's rent. In 2085, housing is extremely expensive due to resource scarcity and climate change. I need to save more money first.";
            this.showDialogue(noMoneyMsg);
            return;
        }
        
        // Move out
        this.child.money -= moveOutCost;
        this.child.hasMovedOut = true;
        
        const successMsg = this.language === 'no'
            ? "🏠 Jeg flyttet hjemmefra! Det er spennende, men også litt skummelt. I 2085 er verden annerledes - ressursene er knappe, klimaet er i krise, og eldrebølgen slår til. Men jeg er klar for å bygge min egen fremtid!"
            : "🏠 I moved out! It's exciting, but also a bit scary. In 2085, the world is different - resources are scarce, the climate is in crisis, and the aging population crisis is hitting. But I'm ready to build my own future!";
        this.showDialogue(successMsg);
        
        this.adjustStat('happiness', 15);
        this.adjustStat('social', 5);
        this.setEmotion('happy', 20);
        this.setEmotion('anxious', 10);
        
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? 'I dag flyttet jeg hjemmefra! Det er spennende, men verden i 2085 er utfordrende. Jeg håper jeg kan gjøre en forskjell.'
                : 'Today I moved out! It\'s exciting, but the world in 2085 is challenging. I hope I can make a difference.',
            true
        );
        
        this.saveGame();
    }
    
    // Dystopian events in 2085
    triggerDystopianEvent() {
        const events = [
            {
                name: 'oilFundCrisis',
                probability: 0.3,
                message: this.language === 'no'
                    ? "⚠️ Nyhet: Oljefondet er helt tomt! Norge har ingen penger igjen. Regjeringen varsler om kutt i alle offentlige tjenester."
                    : "⚠️ News: The oil fund is completely empty! Norway has no money left. The government warns of cuts in all public services.",
                effect: () => {
                    this.adjustStat('happiness', -10);
                    if (this.child.money > 0) {
                        this.adjustStat('money', -Math.floor(this.child.money * 0.1)); // Lose 10% of money due to economic crisis
                    }
                    this.setEmotion('anxious', 20);
                    this.setEmotion('sad', 15);
                }
            },
            {
                name: 'climateDisaster',
                probability: 0.25,
                message: this.language === 'no'
                    ? "🌡️ Ekstremvær: En kraftig storm har ødelagt infrastruktur. Matprisene stiger. Ressursene blir enda knappere."
                    : "🌡️ Extreme weather: A powerful storm has destroyed infrastructure. Food prices are rising. Resources are becoming even scarcer.",
                effect: () => {
                    this.adjustStat('happiness', -8);
                    this.adjustStat('hunger', -10); // Food becomes more expensive/scarce
                    this.child.climateAwareness = Math.min(100, (this.child.climateAwareness || 0) + 5);
                    this.setEmotion('scared', 15);
                }
            },
            {
                name: 'aiTakeover',
                probability: 0.2,
                message: this.language === 'no'
                    ? "🤖 AI-nyhet: Flere jobber er erstattet av AI. Arbeidsløsheten stiger. Mange unge sliter med å finne arbeid."
                    : "🤖 AI News: More jobs have been replaced by AI. Unemployment is rising. Many young people struggle to find work.",
                effect: () => {
                    // Show scary robot image
                    this.showActivityImage('assets/images/scaryrobot.jpg', 3000);
                    this.adjustStat('happiness', -5);
                    this.adjustStat('social', -5);
                    this.child.aiLiteracy = Math.min(100, (this.child.aiLiteracy || 0) + 3);
                    this.setEmotion('anxious', 10);
                }
            },
            {
                name: 'agingCrisis',
                probability: 0.15,
                message: this.language === 'no'
                    ? "👴 Eldrebølgen: Den aldrende befolkningen krever mer ressurser. Unge må betale høyere skatter for å støtte eldre. Systemet er under press."
                    : "👴 Aging Crisis: The aging population demands more resources. Young people must pay higher taxes to support the elderly. The system is under pressure.",
                effect: () => {
                    this.adjustStat('happiness', -6);
                    if (this.child.money > 0) {
                        this.adjustStat('money', -Math.floor(this.child.money * 0.05)); // Higher taxes
                    }
                    this.setEmotion('angry', 10);
                }
            },
            {
                name: 'resourceShortage',
                probability: 0.2,
                message: this.language === 'no'
                    ? "⚡ Ressursmangel: Norge har ikke nok ressurser. Vi har ingen venner med andre nasjoner, så vi får ingen hjelp. Alt blir dyrere."
                    : "⚡ Resource Shortage: Norway doesn't have enough resources. We have no friends among other nations, so we get no help. Everything becomes more expensive.",
                effect: () => {
                    this.adjustStat('happiness', -7);
                    this.child.resourceManagement = Math.min(100, (this.child.resourceManagement || 0) + 3);
                    this.setEmotion('anxious', 12);
                }
            },
            {
                name: 'hope',
                probability: 0.1,
                message: this.language === 'no'
                    ? "✨ Håp: Noen unge mennesker samler seg for å gjøre en forskjell. Kanskje vi kan redde Norge? Kanskje du kan være en del av løsningen?"
                    : "✨ Hope: Some young people are coming together to make a difference. Maybe we can save Norway? Maybe you can be part of the solution?",
                effect: () => {
                    this.adjustStat('happiness', 10);
                    this.adjustStat('social', 8);
                    this.setEmotion('happy', 15);
                    this.setEmotion('curious', 10);
                }
            }
        ];
        
        // Select random event based on probability
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        this.showDialogue(randomEvent.message);
        randomEvent.effect();
        
        this.addAutoDiaryEntry(
            this.language === 'no'
                ? 'I dag skjedde det noe: ' + randomEvent.message.replace(/⚠️|🌡️|🤖|👴|⚡|✨/g, '').trim() + ' Verden i 2085 er utfordrende.'
                : 'Today something happened: ' + randomEvent.message.replace(/⚠️|🌡️|🤖|👴|⚡|✨/g, '').trim() + ' The world in 2085 is challenging.',
            randomEvent.name === 'hope'
        );
        
        this.saveGame();
    }
    
    // Apply 2000s normal world events
    apply2000sEvents() {
        // Normal, positive events in 2000s world
        if (Math.random() < 0.15) {
            const events = [
                {
                    name: 'friendVisit',
                    message: this.language === 'no'
                        ? "😊 En venn kom på besøk! Vi hadde det så gøy sammen."
                        : "😊 A friend came to visit! We had so much fun together.",
                    effect: () => {
                        this.adjustStat('happiness', 8);
                        this.adjustStat('social', 10);
                        this.setEmotion('happy', 12);
                    }
                },
                {
                    name: 'goodGrade',
                    message: this.language === 'no'
                        ? "📚 Jeg fikk en god karakter på skolen i dag! Det føles bra."
                        : "📚 I got a good grade at school today! It feels good.",
                    effect: () => {
                        this.adjustStat('happiness', 10);
                        this.adjustStat('learning', 5);
                        this.setEmotion('happy', 15);
                    }
                },
                {
                    name: 'niceWeather',
                    message: this.language === 'no'
                        ? "☀️ Det er fint vær i dag! Perfekt for å være ute."
                        : "☀️ It's nice weather today! Perfect for being outside.",
                    effect: () => {
                        this.adjustStat('happiness', 5);
                        this.adjustStat('energy', 3);
                        this.setEmotion('happy', 8);
                    }
                },
                {
                    name: 'familyTime',
                    message: this.language === 'no'
                        ? "👨‍👩‍👧 Vi tilbrakte tid sammen som familie. Det var koselig."
                        : "👨‍👩‍👧 We spent time together as a family. It was nice.",
                    effect: () => {
                        this.adjustStat('happiness', 12);
                        this.adjustStat('social', 8);
                        this.adjustRelationship(3);
                        this.setEmotion('happy', 15);
                    }
                },
                {
                    name: 'newSkill',
                    message: this.language === 'no'
                        ? "🎯 Jeg lærte noe nytt i dag! Det føles bra å utvikle seg."
                        : "🎯 I learned something new today! It feels good to grow.",
                    effect: () => {
                        this.adjustStat('learning', 8);
                        this.adjustStat('happiness', 6);
                        this.setEmotion('curious', 10);
                    }
                }
            ];
            
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            this.showDialogue(randomEvent.message);
            randomEvent.effect();
            
            this.addAutoDiaryEntry(
                this.language === 'no'
                    ? 'I dag skjedde det noe fint: ' + randomEvent.message.replace(/😊|📚|☀️|👨‍👩‍👧|🎯/g, '').trim() + ' Verden i 2000-tallet er hyggelig.'
                    : 'Today something nice happened: ' + randomEvent.message.replace(/😊|📚|☀️|👨‍👩‍👧|🎯/g, '').trim() + ' The world in the 2000s is nice.',
                true
            );
        }
    }
    
    // Apply ongoing dystopian consequences
    applyDystopianConsequences() {
        // Climate change effects - ongoing
        if ((this.child.climateAwareness || 0) < 30) {
            // Low awareness means vulnerability to climate effects
            if (Math.random() < 0.1) {
                this.adjustStat('happiness', -2);
                this.adjustStat('hunger', -3);
            }
        }
        
        // Resource scarcity effects - ongoing
        if ((this.child.resourceManagement || 0) < 30) {
            // Poor resource management means higher costs
            if (Math.random() < 0.15 && this.child.money > 0) {
                this.adjustStat('money', -Math.floor(this.child.money * 0.02)); // Lose 2% of money due to poor resource management
            }
        }
        
        // AI effects - ongoing
        if ((this.child.aiLiteracy || 0) < 30 && this.child.age >= 16) {
            // Low AI literacy means job insecurity
            if (Math.random() < 0.1) {
                this.adjustStat('happiness', -3);
                this.setEmotion('anxious', 5);
            }
        }
        
        // Aging population crisis effects - ongoing
        if (this.child.age >= 18) {
            // Higher taxes for young people
            if (Math.random() < 0.2 && this.child.money > 0) {
                this.adjustStat('money', -Math.floor(this.child.money * 0.03)); // 3% tax for aging population
            }
        }
    }
    
    logout() {
        // Confirm logout
        if (confirm(this.language === 'no' 
            ? 'Er du sikker på at du vil logge ut? Spillet ditt er lagret automatisk.'
            : 'Are you sure you want to log out? Your game is saved automatically.')) {
            // Save game before logout
            this.saveGame();
            // Redirect to login
            window.location.href = 'login.html';
        }
    }
    
    // PWA Installation Functions
    initializeInstallPrompt() {
        // Listen for beforeinstallprompt event (Chrome, Edge, Brave on desktop/mobile)
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Show install button
            const installBtn = document.getElementById('installAppBtn');
            if (installBtn) {
                installBtn.style.display = 'flex';
            }
            this.updateInstallStatus('ready');
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            const installBtn = document.getElementById('installAppBtn');
            if (installBtn) {
                installBtn.style.display = 'none';
            }
            this.updateInstallStatus('installed');
            
            // Show success message
            const message = this.language === 'no'
                ? 'Appen er installert! Du kan nå åpne den fra skrivebordet eller hjemmeskjermen.'
                : 'App installed! You can now open it from your desktop or home screen.';
            this.showMessage(message);
        });
        
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.updateInstallStatus('installed');
        } else {
            // Check platform and show appropriate instructions
            this.checkInstallCapability();
        }
    }
    
    async checkInstallCapability() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        const isAndroid = /android/i.test(userAgent);
        const isWindows = /windows/i.test(userAgent);
        const isMac = /macintosh|mac os x/i.test(userAgent);
        const isChrome = /chrome/i.test(userAgent) && !/edg/i.test(userAgent);
        let isBrave = false;
        try {
            if (navigator.brave) {
                isBrave = await navigator.brave.isBrave();
            }
        } catch (e) {
            // Brave detection failed, assume not Brave
        }
        const isEdge = /edg/i.test(userAgent);
        const isFirefox = /firefox/i.test(userAgent);
        
        let instructions = [];
        
        if (isIOS) {
            // iOS Safari
            instructions.push({
                platform: 'iOS (Safari)',
                steps: [
                    '1. Trykk på del-knappen (📤) nederst i Safari',
                    '2. Scroll ned og velg "Legg til på hjemmeskjerm"',
                    '3. Trykk "Legg til" for å bekrefte',
                    '4. Appen vil nå vises på hjemmeskjermen din!'
                ]
            });
        } else if (isAndroid) {
            // Android Chrome/Brave
            instructions.push({
                platform: 'Android (Chrome/Brave)',
                steps: [
                    '1. Trykk på menyknappen (⋮ eller ⋯) i nettleseren',
                    '2. Velg "Legg til på hjemmeskjerm" eller "Installer app"',
                    '3. Bekreft installasjonen',
                    '4. Appen vil nå vises på hjemmeskjermen din!'
                ]
            });
        } else if (isWindows) {
            // Windows Chrome/Brave/Edge
            instructions.push({
                platform: 'Windows (Chrome/Brave/Edge)',
                steps: [
                    '1. Se etter installasjonsikonet (➕) i adresselinjen',
                    '2. Eller trykk på "Installer app" knappen over',
                    '3. Bekreft installasjonen i popup-vinduet',
                    '4. Appen vil nå vises på skrivebordet og i start-menyen!'
                ]
            });
        } else if (isMac) {
            // macOS Chrome/Brave/Edge
            instructions.push({
                platform: 'macOS (Chrome/Brave/Edge)',
                steps: [
                    '1. Se etter installasjonsikonet (➕) i adresselinjen',
                    '2. Eller trykk på "Installer app" knappen over',
                    '3. Bekreft installasjonen i popup-vinduet',
                    '4. Appen vil nå vises i Launchpad og Applications-mappen!'
                ]
            });
        } else {
            // Generic instructions
            instructions.push({
                platform: 'Generelt',
                steps: [
                    '1. Se etter installasjonsikonet (➕) i adresselinjen',
                    '2. Eller trykk på "Installer app" knappen over',
                    '3. Følg instruksjonene i nettleseren din'
                ]
            });
        }
        
        this.showInstallInstructions(instructions);
    }
    
    showInstallInstructions(instructions) {
        const installSteps = document.getElementById('installSteps');
        const installInstructions = document.getElementById('installInstructions');
        
        if (!installSteps || !installInstructions) return;
        
        let html = '';
        instructions.forEach(instruction => {
            html += `<div class="install-platform">`;
            html += `<h5>${instruction.platform}</h5>`;
            html += `<ol class="install-steps-list">`;
            instruction.steps.forEach(step => {
                html += `<li>${step}</li>`;
            });
            html += `</ol>`;
            html += `</div>`;
        });
        
        installSteps.innerHTML = html;
        installInstructions.style.display = 'block';
    }
    
    updateInstallStatus(status) {
        const installStatus = document.getElementById('installStatus');
        if (!installStatus) return;
        
        const messages = {
            ready: this.language === 'no' 
                ? '✅ Appen kan installeres! Trykk på "Installer app" knappen over.'
                : '✅ App can be installed! Click the "Install app" button above.',
            installed: this.language === 'no'
                ? '✅ Appen er allerede installert!'
                : '✅ App is already installed!',
            checking: this.language === 'no'
                ? 'Sjekker installasjonsmuligheter...'
                : 'Checking installation capabilities...',
            notSupported: this.language === 'no'
                ? '⚠️ Direkte installasjon er ikke støttet i denne nettleseren. Se instruksjoner nedenfor.'
                : '⚠️ Direct installation is not supported in this browser. See instructions below.'
        };
        
        installStatus.textContent = messages[status] || messages.checking;
    }
    
    async installApp() {
        if (this.deferredPrompt) {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                const message = this.language === 'no'
                    ? 'Takk for at du installerte appen!'
                    : 'Thank you for installing the app!';
                this.showMessage(message);
            } else {
                const message = this.language === 'no'
                    ? 'Installasjon avbrutt. Du kan installere senere ved å bruke knappen eller nettleserens meny.'
                    : 'Installation cancelled. You can install later using the button or browser menu.';
                this.showMessage(message);
            }
            
            // Clear the deferredPrompt
            this.deferredPrompt = null;
            
            // Hide install button
            const installBtn = document.getElementById('installAppBtn');
            if (installBtn) {
                installBtn.style.display = 'none';
            }
        } else {
            // Fallback: Show instructions
            this.checkInstallCapability();
            const installInstructions = document.getElementById('installInstructions');
            if (installInstructions) {
                installInstructions.style.display = 'block';
            }
        }
    }
}

// Initialize game
const game = new MyChildGame();
