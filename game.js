class MyChildGame {
    constructor() {
        this.child = {
            name: "Alex",
            happiness: 50,
            energy: 80,
            social: 60,
            learning: 40,
            hunger: 70,
            age: 8
        };
        
        this.day = 1;
        this.year = 2000;
        this.timeOfDay = 0;
        this.timeNames = ["Morning", "Afternoon", "Evening", "Night"];
        this.currentLocation = "home";
        this.pendingEvent = null;
        this.dialogueQueue = [];
        this.actionsToday = 0;
        this.maxActionsPerDay = 6; // Like original - limited actions per day
        this.memory = []; // Track important events and choices
        this.relationship = 50; // Relationship strength (hidden stat)
        
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
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.updateDisplay();
        this.showDialogue("Hi! I'm " + this.child.name + ". I'm so excited to start this new adventure in the 2000s!");
        this.showMessage("Welcome! You are now taking care of " + this.child.name + " in the year 2000. Help them grow up happy and healthy.");
        
        // Show image loading message
        if (this.locations.home.usePlaceholder) {
            this.showMessage("Tip: Add images to the 'images' folder (home.jpg, school.jpg, playground.jpg, friend.jpg) for better visuals!");
        }
        
        // Initialize background music
        this.initMusic();
        
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
        
        // Update avatar based on emotional state
        this.updateAvatar();
        
        // Update scene
        this.updateScene();
        
        // Check for critical states
        this.checkCriticalStates();
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
    
    updateAvatar() {
        const avatar = document.querySelector('.child-avatar');
        let emoji = '🧒'; // default
        
        // Age-based avatar
        if (this.child.age < 5) {
            emoji = '👶';
        } else if (this.child.age < 10) {
            emoji = '🧒';
        } else if (this.child.age < 15) {
            emoji = '👦';
        } else {
            emoji = '🧑';
        }
        
        // Emotional state affects expression (more nuanced)
        if (this.child.hunger < 20) {
            emoji = '😟'; // Hunger is most urgent
        } else if (this.child.happiness < 30) {
            emoji = '😢';
        } else if (this.child.happiness > 80 && this.child.hunger > 50) {
            emoji = '😊';
        } else if (this.child.happiness > 60) {
            emoji = '🙂';
        }
        
        // Relationship affects expression
        if (this.relationship > 80 && this.child.happiness > 50) {
            emoji = '😊';
        }
        
        avatar.textContent = emoji;
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
                    this.updateScene();
                }
            };
            img.src = `images/${imgName}`;
        });
    }
    
    updateScene() {
        const location = this.locations[this.currentLocation];
        const sceneImage = document.getElementById('sceneImage');
        const sceneName = document.getElementById('sceneName');
        
        sceneImage.style.background = `linear-gradient(135deg, ${location.color} 0%, ${location.color}dd 100%)`;
        
        // Use image if available, otherwise use SVG placeholder
        if (location.image && !location.usePlaceholder) {
            const img = document.createElement('img');
            img.src = location.image;
            img.alt = location.name;
            img.onerror = () => {
                // If image fails to load, use placeholder
                this.locations[this.currentLocation].usePlaceholder = true;
                sceneImage.innerHTML = this.getPlaceholderSVG(this.currentLocation);
            };
            img.onload = () => {
                sceneImage.innerHTML = '';
                sceneImage.appendChild(img);
            };
            // Clear and show loading or placeholder
            sceneImage.innerHTML = '';
            sceneImage.appendChild(img);
        } else {
            // Use SVG placeholder (no emoji!)
            sceneImage.innerHTML = this.getPlaceholderSVG(this.currentLocation);
        }
        
        sceneName.textContent = location.name;
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
            this.updateScene();
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
    
    goToLocation(location) {
        this.currentLocation = location;
        this.updateDisplay();
        
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
        
        const messages = [
            "Thank you! This food is so yummy!",
            "I was so hungry! This tastes great!",
            "Mmm, this is delicious! Can I have more?",
            "I love eating with you! Thank you for the meal!"
        ];
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
        
        const messages = [
            "This is so much fun! I love playing with you!",
            "Yay! Playing together is the best!",
            "I'm having the best time! Can we play more?",
            "This is awesome! You're the best!"
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        this.showMessage("Playing together strengthens your bond with your child!");
        this.performAction();
        this.advanceTime();
    }
    
    readToChild() {
        if (!this.canPerformAction()) return;
        
        this.adjustStat('learning', 15);
        this.adjustStat('happiness', 10);
        this.adjustStat('energy', -5);
        this.adjustRelationship(2);
        
        const messages = [
            "I love this story! Can you read another one?",
            "This book is so interesting! I'm learning so much!",
            "Reading together is so nice! I feel calm and happy.",
            "I want to learn to read like you! This is great!"
        ];
        this.showDialogue(messages[Math.floor(Math.random() * messages.length)]);
        this.showMessage("Reading together - great for learning and bonding!");
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
            this.showDialogue(`I'm ${this.child.age} years old now! I'm growing up in the 2000s!`);
            const ageMessages = [
                `Your child turned ${this.child.age} years old! Growing up in the 2000s.`,
                `🎂 Happy ${this.child.age}th birthday! Another year of 2000s childhood!`
            ];
            this.showMessage(ageMessages[Math.floor(Math.random() * ageMessages.length)]);
        }
        
        // Year progression
        if (this.day % 365 === 0) {
            this.year++;
            if (this.year <= 2009) {
                this.showDialogue(`It's ${this.year} now! The 2000s are amazing!`);
                this.showMessage(`New year! Welcome to ${this.year} - still in the 2000s decade!`);
            } else {
                this.showDialogue("I've grown up through the whole 2000s! What a journey!");
                this.showMessage("Your child has grown up through the 2000s! What an amazing journey!");
            }
        }
        
        // Natural stat changes (like original game)
        this.adjustStat('energy', -5);
        this.adjustStat('hunger', -10); // Hunger decreases each day (important!)
        
        // Low hunger affects happiness
        if (this.child.hunger < 30) {
            this.adjustStat('happiness', -5);
        }
        
        // Low happiness can affect other stats
        if (this.child.happiness < 20) {
            this.adjustStat('social', -2);
            this.adjustRelationship(-1);
        }
        
        // High relationship provides passive benefits
        if (this.relationship > 80) {
            this.adjustStat('happiness', 2);
        }
        
        // Check for narrative events
        this.checkForEvents();
        
        this.updateDisplay();
        this.showMessage(`Day ${this.day} begins! Time for new adventures in the 2000s.`);
    }
    
    checkForEvents() {
        // Narrative events - more frequent if relationship is good
        const eventChance = this.relationship > 70 ? 0.6 : 0.4;
        if (Math.random() < eventChance) {
            this.triggerNarrativeEvent();
        }
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
                message: "Your child needs attention.",
                choices: [
                    { text: "Of course! Let's do something fun together.", effect: () => { this.adjustStat('happiness', 20); this.adjustStat('social', 10); this.showDialogue("Thank you! I feel so much better now!"); } },
                    { text: "I understand, but we're busy right now.", effect: () => { this.adjustStat('happiness', -10); this.showDialogue("Oh... okay. I'll wait."); } }
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
}

// Initialize game
const game = new MyChildGame();
