// Translation system for MyChild game
class TranslationManager {
    constructor() {
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
                    work: "Jobb",
                    cook: "Lag mat",
                    daydream: "Drøm",
                    talk: "Snakk",
                    learnEmotions: "Lær følelser",
                    cognitiveTherapy: "Kognitiv terapi",
                    environment: "Miljøvern",
                    economics: "Økonomi",
                    ethics: "Etikk & Filosofi",
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
                    goToNextDay: "Gå til neste dag",
                    deleteConfirm: "Er du sikker på at du vil slette dette spillet? Dette kan ikke angres!",
                    deleteError: "Kunne ikke slette spillet. Prøv igjen.",
                    selectImage: "Velg bilde",
                    uploadImageHint: "Last opp ditt eget bilde som avatar",
                    saveBio: "Lagre bio",
                    bioPlaceholder: "Skriv litt om deg selv...",
                    aboutMe: "Om meg",
                    profileEditing: "Profilredigering",
                    currentAvatar: "Nåværende avatar",
                    chooseAvatar: "Velg avatar:",
                    badges: "Badges",
                    upload: "Last opp bilde"
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
                    work: "Work",
                    cook: "Cook Together",
                    daydream: "Daydream",
                    talk: "Talk",
                    learnEmotions: "Learn Emotions",
                    cognitiveTherapy: "Cognitive Therapy",
                    environment: "Environment",
                    economics: "Economics",
                    ethics: "Ethics & Philosophy",
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
                    goToNextDay: "Go to next day",
                    deleteConfirm: "Are you sure you want to delete this game? This cannot be undone!",
                    deleteError: "Could not delete the game. Please try again.",
                    selectImage: "Select image",
                    uploadImageHint: "Upload your own image as avatar",
                    saveBio: "Save bio",
                    bioPlaceholder: "Write a bit about yourself...",
                    aboutMe: "About me",
                    profileEditing: "Profile Editing",
                    currentAvatar: "Current avatar",
                    chooseAvatar: "Choose avatar:",
                    badges: "Badges",
                    upload: "Upload image"
                }
            }
        };
    }
    
    t(language, key, ...args) {
        // Translation helper - supports nested keys like 'stats.happiness'
        const keys = key.split('.');
        let translation = this.translations[language];
        
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
}

// Create global translation manager instance
window.TranslationManager = TranslationManager;

