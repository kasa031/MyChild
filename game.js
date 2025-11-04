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
            // Character customization
            gender: this.customization.gender || 'boy',
            emoji: this.customization.emoji || '🧒',
            hairColor: this.customization.hairColor || 'brown',
            eyeColor: this.customization.eyeColor || 'brown',
            style: this.customization.style || 'normal'
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
            friend: { name: "Friend's House", color: "#ffffba", image: "images/friend.jpg", usePlaceholder: false }
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
            this.showDialogue("Hi! I'm back, " + this.child.name + ". Ready to continue our journey!");
            this.showMessage("Welcome back! " + this.child.name + "'s progress has been saved. Let's continue growing stronger together!");
        } else {
            let ageAppropriateDialogue = "";
            if (this.child.age < 1) {
                ageAppropriateDialogue = "Hi... I'm " + this.child.name + ". I'm just a baby in the year 2000. I'll grow up with your help and support!";
            } else if (this.child.age < 5) {
                ageAppropriateDialogue = "Hi! I'm " + this.child.name + ". I'm " + this.child.age + " years old in the 2000s. Everything is new and exciting!";
            } else if (this.child.age < 7) {
                ageAppropriateDialogue = "Hi... I'm " + this.child.name + ". I'm " + this.child.age + " years old. I'm getting ready for school soon!";
            } else {
                ageAppropriateDialogue = "Hi... I'm " + this.child.name + ". Starting school in the 2000s is... well, it's complicated sometimes. But I know I'm good enough just as I am, and so is everyone else.";
            }
            this.showDialogue(ageAppropriateDialogue);
            this.showMessage("Welcome! You are now taking care of " + this.child.name + " in the year 2000. " + this.child.name + " is " + this.child.age + " years old. " + this.child.name + " faces challenges, but remember: " + this.child.name + " is perfect just as " + (this.child.gender === 'girl' ? 'she' : 'he') + " is. With your support and the right choices, " + this.child.name + " can grow stronger, help others, and find success. Every choice matters - both for today and tomorrow.");
        }
        
        // Show image loading message
        if (this.locations.home.usePlaceholder) {
            this.showMessage("Tip: Add images to the 'images' folder (home.jpg, school.jpg, playground.jpg, friend.jpg) for better visuals!");
        }
        
        // Initialize background music
        this.initMusic();
        
        // Start with initial emotional check
        this.updateEmotionalState();
        
        this.checkForEvents();
    }
    
    initMusic() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        if (this.backgroundMusic) {
            // Set volume (0.0 to 1.0)
            this.backgroundMusic.volume = 0.5; // 50% volume
            
            // Try to play music (may require user interaction due to browser policies)
            // Music will start when user interacts with the page
            document.addEventListener('click', () => {
                if (this.musicEnabled && this.backgroundMusic.paused) {
                    this.backgroundMusic.play().catch(e => {
                        console.log('Music autoplay prevented by browser:', e);
                    });
                }
            }, { once: true });
            
            // Also try to play on any user interaction
            document.addEventListener('keydown', () => {
                if (this.musicEnabled && this.backgroundMusic.paused) {
                    this.backgroundMusic.play().catch(e => {
                        console.log('Music autoplay prevented by browser:', e);
                    });
                }
            }, { once: true });
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
                document.getElementById('musicToggle').classList.add('muted');
                document.getElementById('musicToggle').textContent = '🔇';
            } else {
                // Play music
                this.backgroundMusic.play().catch(e => {
                    console.log('Error playing music:', e);
                });
                this.musicEnabled = true;
                document.getElementById('musicToggle').classList.remove('muted');
                document.getElementById('musicToggle').textContent = '🎵';
            }
        }
    }
    
    updateDisplay() {
        // Update stats
        document.getElementById('happinessValue').textContent = this.child.happiness;
        document.getElementById('energyValue').textContent = this.child.energy;
        document.getElementById('socialValue').textContent = this.child.social;
        document.getElementById('learningValue').textContent = this.child.learning;
        document.getElementById('hungerValue').textContent = this.child.hunger;
        
        // Update bars
        document.getElementById('happinessBar').style.width = this.child.happiness + '%';
        document.getElementById('energyBar').style.width = this.child.energy + '%';
        document.getElementById('socialBar').style.width = this.child.social + '%';
        document.getElementById('learningBar').style.width = this.child.learning + '%';
        
        const hungerBar = document.getElementById('hungerBar');
        hungerBar.style.width = this.child.hunger + '%';
        if (this.child.hunger < 30) {
            hungerBar.classList.add('low');
        } else {
            hungerBar.classList.remove('low');
        }
        
        // Update time
        document.getElementById('currentDay').textContent = this.day;
        document.getElementById('currentYear').textContent = this.year;
        document.getElementById('currentTime').textContent = this.timeNames[this.timeOfDay];
        
        // Update child name
        document.getElementById('childName').textContent = this.child.name;
        
        // Update action counter
        this.updateActionDisplay();
        
        // Update progress stats if visible
        this.updateProgressStats();
        
        // Update avatar based on emotional state (async)
        this.updateAvatar().catch(e => console.log('Avatar update error:', e));
        
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
                { text: "Talk to classmates", action: () => this.hangWithFriends() }
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
        
        const schoolDays = [
            "School was fun today! I learned about computers and the internet!",
            "I had a great day at school! My classmates are really nice.",
            "I love school! We're learning so many interesting things about the 2000s!"
        ];
        this.showDialogue(schoolDays[Math.floor(Math.random() * schoolDays.length)]);
        this.showMessage("A productive day at school! Learning and making friends.");
        this.performAction();
        this.advanceTime();
    }
    
    sleep() {
        // Sleep doesn't count as action but restores energy
        if (this.actionsToday >= this.maxActionsPerDay) {
            this.adjustStat('energy', 40);
            this.adjustStat('happiness', 10);
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
        
        const messages = [
            "This is so much fun! I love playing with you!",
            "Yay! Playing together is the best! When we play, I forget about everything else.",
            "I'm having the best time! Can we play more? This makes me feel so much better!",
            "This is awesome! You're the best! Playing helps me forget about school.",
            "I feel so free when we play... Like nothing can hurt me here."
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
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
        this.showMessage("Daydreaming helps Alex find comfort and escape.");
        this.copingActivities.push({day: this.day, activity: 'daydream', helpful: true});
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
        
        const messages = [
            "Thank you for listening... It helps to talk about it.",
            "I feel better when I can tell you what's happening.",
            "Sometimes I'm scared to talk, but you make me feel safe.",
            "I don't know what I'd do without you...",
            "Talking to you makes the bad feelings go away a little."
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        this.showMessage("Talking with caring adults helps Alex feel supported and stronger.");
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
        this.showMessage("Volunteering helps others and makes Alex feel valuable and strong!");
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
    
    watchTikTok() {
        if (!this.canPerformAction()) return;
        
        // Short-term pleasure, but long-term cost
        this.adjustStat('happiness', 8);
        this.adjustStat('energy', -5);
        this.adjustStat('learning', -2);
        this.child.studyLevel = Math.max(0, this.child.studyLevel - 1);
        this.child.shortTermChoices++;
        this.setEmotion('happy', 10);
        this.setEmotion('anxious', 5); // Can create anxiety/FOMO
        
        const messages = [
            "This is fun... But I know I probably should be doing something else.",
            "I'm scrolling... It's entertaining but... I feel a bit empty?",
            "Time flies when I'm watching these videos... Maybe too much?",
            "This is nice for a break, but I know I have goals.",
            "I'm relaxing, but I'm not really building anything..."
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        this.showMessage("Short-term entertainment is fine, but balance is key. " + this.child.name + " knows there are more productive choices.");
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
    
    advanceTime() {
        this.timeOfDay = (this.timeOfDay + 1) % 4;
        this.updateDisplay();
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
                progressMessage = `I'm ${this.child.age} years old now! I've helped so many people... I never thought I could make a difference, but I am.`;
            } else if (this.child.studyLevel > 70) {
                progressMessage = `I'm ${this.child.age} years old now! All my hard studying is paying off. I'm getting smarter every day!`;
            } else if (this.child.resilience > 80) {
                progressMessage = `I'm ${this.child.age} years old now! I'm so much stronger than I was. Things are getting better.`;
            } else if (this.child.goodChoices > this.child.shortTermChoices) {
                progressMessage = `I'm ${this.child.age} years old now! I'm making good choices, building my future.`;
            } else {
                progressMessage = `I'm ${this.child.age} years old now! I'm growing up in the 2000s!`;
            }
            
            this.showDialogue(progressMessage);
            
            const ageMessages = [
                `Your child turned ${this.child.age} years old! Growing up in the 2000s.`,
                `🎂 Happy ${this.child.age}th birthday! Another year of 2000s childhood!`
            ];
            this.showMessage(ageMessages[Math.floor(Math.random() * ageMessages.length)]);
            
            // Career opportunities based on study level and age
            if (this.child.age >= 14 && this.child.studyLevel > 60 && this.child.money === 0) {
                this.showMessage("💼 Alex is old enough and smart enough to start earning money through part-time work!");
            }
            
            // Year progression
            if (this.child.age % 2 === 0 && this.child.age <= 18) {
                this.year++;
                if (this.year <= 2009) {
                    this.showDialogue(`It's ${this.year} now! The 2000s are flying by!`);
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
        this.showMessage(`Day ${this.day} begins! Time for new adventures in the 2000s. Remember: ${this.child.name} is perfect just as ${this.child.gender === 'girl' ? 'she' : 'he'} is, and so is everyone else!`);
    }
    
    checkSuccessMilestones() {
        // Show hope and progress messages
        if (this.child.helpingOthers === 5 && this.child.age >= 12) {
            this.showDialogue("I've helped five people now... I'm becoming someone who makes a difference. This feels amazing!");
            this.showMessage("🎉 Alex is becoming a hero! Helping others gives purpose and strength!");
        }
        
        if (this.child.studyLevel === 50 && this.child.age >= 12) {
            this.showDialogue("I'm really getting good at studying! I can see my future opening up... The kids who mocked me don't know what I'm building.");
            this.showMessage("💪 Alex's hard work is paying off! Success comes from dedication!");
        }
        
        if (this.child.careerProgress >= 50 && this.child.age >= 14) {
            this.showDialogue("I'm starting to see opportunities... All this work is leading somewhere. I'm not who they said I was.");
            this.showMessage("✨ Alex is building a bright future! The story isn't over - it's just beginning!");
        }
        
        if (this.child.goodChoices > this.child.shortTermChoices * 2 && this.child.age >= 12) {
            this.showDialogue("I'm making good choices... Prioritizing my future over short-term fun. I know it's worth it.");
            this.showMessage("🌟 Alex is learning the value of long-term thinking! These choices will shape the future!");
        }
    }
    
    showFinalSuccessMessage() {
        let successStory = "";
        
        if (this.child.helpingOthers > 20) {
            successStory = "I've grown up through the whole 2000s! I've helped over 20 people... I became the person I needed when I was younger. The bullies who said I'd never amount to anything? They were wrong. I'm a hero now, and I'm just getting started.";
        } else if (this.child.studyLevel > 80 && this.child.careerProgress > 70) {
            successStory = "I've grown up through the whole 2000s! All that studying paid off... I'm successful, smart, and making money. The kids who called me a loser? They can see me now - successful, happy, and building my future. Hard work wins.";
        } else if (this.child.resilience > 90) {
            successStory = "I've grown up through the whole 2000s! I'm stronger than I ever imagined. I faced challenges, I grew, and I learned that I'm capable of amazing things. The story isn't written in stone - I wrote my own story.";
        } else if (this.child.goodChoices > this.child.shortTermChoices) {
            successStory = "I've grown up through the 2000s! I made good choices, even when they were hard. I prioritized my future, and now I'm reaping the rewards. Success doesn't come from taking the easy path - it comes from working hard.";
        }
        
        if (successStory) {
            this.showDialogue(successStory);
            this.showMessage("🌟 Alex's story shows that with support, hard work, and good choices, anyone can overcome challenges and find success! The future is never set in stone - it's built by the choices we make today!");
        } else {
            this.showDialogue("I've grown up through the whole 2000s! What a journey!");
            this.showMessage("Your child has grown up through the 2000s! What an amazing journey!");
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
        this.showDialogue(`🎉 ${achievement.name}! ${achievement.description}`);
        this.showMessage(`Achievement Unlocked: ${achievement.name}!`);
    }
}

// Initialize game
const game = new MyChildGame();
