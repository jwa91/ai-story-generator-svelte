export const generateTensionLevelPrompt = (childTensionLevel: number): string => {
	if (childTensionLevel <= 3) {
		return `
            Houd het verhaal licht en vrolijk: focus op positieve avonturen, snelle oplossingen, humor, en vriendschap. Eindig geruststellend. Geschikt voor kinderen.
        `;
	} else if (childTensionLevel <= 6) {
		return `
            Creëer een gematigd spannend verhaal: introduceer kleine uitdagingen, gebruik milde cliffhangers, en wissel spanning af met luchtige scènes. Houd de toon optimistisch.Geschikt voor kinderen.
        `;
	} else if (childTensionLevel <= 8) {
		return `
            Maak het behoorlijk spannend: laat problemen of mysteries oplossen, gebruik sterkere cliffhangers en laat personages moeilijke keuzes maken. Bouw geleidelijk de spanning op. Houdt het wel geschikt voor kinderen.
        `;
	} else {
		return `
            Maak het zo spannend mogelijk, maar kindvriendelijk: intense scènes, sterke cliffhangers, en gevaar met een positieve afloop. Bouw op naar een climax.
        `;
	}
};

export const generateAgePrompt = (childAge: number): string => {
	if (childAge <= 6) {
		return `
            Voor een ${childAge}-jarige: gebruik eenvoudige woorden, korte zinnen, herhaling, en kleurrijke beschrijvingen met geluiden. Focus op concrete onderwerpen.
        `;
	} else if (childAge <= 8) {
		return `
            Voor een ${childAge}-jarige: gebruik eenvoudige woorden, middellange zinnen en introduceer soms nieuwe woorden met uitleg. Focus op avonturen met duidelijke oorzaak-gevolg relaties en humor.
        `;
	} else {
		return `
            Voor een ${childAge}-jarige: gebruik gevarieerde woordenschat, introduceer nieuwe concepten en meerdere verhaallijnen. Behandel passende thema's en gebruik humor en ironie.
        `;
	}
};
